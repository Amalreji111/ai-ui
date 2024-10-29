import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const useFaceDetection = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [faceDetected, setFaceDetected] = useState<boolean>(false);
  const [isLookingAtScreen, setIsLookingAtScreen] = useState<boolean>(false);
  const [faceAttributes, setFaceAttributes] = useState<any>(null);

  // Constants for gaze detection
  const ROTATION_THRESHOLD = 15;
  const NORMAL_VECTOR = { x: 0, y: 0, z: 1 };

  const calculateFaceRotation = (landmarks: any) => {
    const leftEye = landmarks.getLeftEye()[0];
    const rightEye = landmarks.getRightEye()[0];
    const nose = landmarks.getNose()[0];
    
    const eyeVector = {
      x: rightEye.x - leftEye.x,
      y: rightEye.y - leftEye.y,
      z: 0
    };
    
    const noseVector = {
      x: nose.x - leftEye.x,
      y: nose.y - leftEye.y,
      z: 0
    };
    
    const normalVector = {
      x: eyeVector.y * noseVector.z - eyeVector.z * noseVector.y,
      y: eyeVector.z * noseVector.x - eyeVector.x * noseVector.z,
      z: eyeVector.x * noseVector.y - eyeVector.y * noseVector.x
    };
    
    const dotProduct = normalVector.x * NORMAL_VECTOR.x + 
                      normalVector.y * NORMAL_VECTOR.y + 
                      normalVector.z * NORMAL_VECTOR.z;
    
    const magnitudeA = Math.sqrt(normalVector.x ** 2 + normalVector.y ** 2 + normalVector.z ** 2);
    const magnitudeB = Math.sqrt(NORMAL_VECTOR.x ** 2 + NORMAL_VECTOR.y ** 2 + NORMAL_VECTOR.z ** 2);
    
    const angle = Math.acos(dotProduct / (magnitudeA * magnitudeB)) * (180 / Math.PI);
    
    return angle;
  };

  const checkEyeDirection = (landmarks: any) => {
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();
    
    const leftEAR = getEyeAspectRatio(leftEye);
    const rightEAR = getEyeAspectRatio(rightEye);
    
    return leftEAR > 0.2 && rightEAR > 0.2;
  };

  const getEyeAspectRatio = (eye: any) => {
    const v1 = Math.sqrt(
      Math.pow(eye[1].x - eye[5].x, 2) + Math.pow(eye[1].y - eye[5].y, 2)
    );
    const v2 = Math.sqrt(
      Math.pow(eye[2].x - eye[4].x, 2) + Math.pow(eye[2].y - eye[4].y, 2)
    );
    
    const h = Math.sqrt(
      Math.pow(eye[0].x - eye[3].x, 2) + Math.pow(eye[0].y - eye[3].y, 2)
    );
    
    return (v1 + v2) / (2.0 * h);
  };

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/ai-ui/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/ai-ui/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/ai-ui/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('/ai-ui/models'),
        ]);
        setIsLoading(false);
        startVideo();
      } catch (err) {
        setError(err);
      }
    };

    const startVideo = () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ 
          video: {
            width: 640,  // Set specific dimensions
            height: 480
          } 
        })
          .then((stream) => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.play(); // Explicitly call play()
              videoRef.current.onloadeddata = () => {
                processVideo();
              };
            }
          })
          .catch((err) => {
            setError(err);
          });
      } else {
        setError(new Error("getUserMedia not supported on this browser"));
      }
    };

    const processVideo = () => {
      const video = videoRef.current;

      if (video) {
        // Create an offscreen canvas for processing
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const intervalId = setInterval(async () => {
          try {
            const detections = await faceapi
              .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
              .withFaceLandmarks()
              .withFaceExpressions();

            if (detections.length > 0) {
              const detection = detections[0];
              setFaceDetected(true);
              setFaceAttributes(detection);

              const faceRotation = calculateFaceRotation(detection.landmarks);
              const eyesOpen = checkEyeDirection(detection.landmarks);
              
              setIsLookingAtScreen(
                faceRotation < ROTATION_THRESHOLD && eyesOpen
              );
            } else {
              setFaceDetected(false);
              setIsLookingAtScreen(false);
            }
          } catch (err) {
            console.error('Face detection error:', err);
          }
        }, 100);

        return () => clearInterval(intervalId);
      }
    };

    loadModels();

    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        if (stream) {
          const tracks = (stream as MediaStream).getTracks();
          tracks.forEach((track) => track.stop());
          videoRef.current.srcObject = null;
        }
      }
    };
  }, []);

  return {
    videoRef,
    isLoading,
    error,
    faceDetected,
    isLookingAtScreen,
    faceAttributes,
  };
};

export default useFaceDetection;