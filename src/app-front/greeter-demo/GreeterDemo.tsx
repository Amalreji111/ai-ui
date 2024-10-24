import React, { useEffect, useRef, useState } from 'react';
import styled,{ keyframes } from 'styled-components';

// Import your assets here
import girlImage from './assets/Ai.png';
import waveImage from './assets/wave.png';
import qrCodeImage from './assets/QR Code.png';
import intelliageImage from './assets/intelligage.png';
import { hideLoadingScreen } from '../../ui/hideLoadingScreen';
import { useIsTtsSpeaking } from '../../tts/useIsTtsSpeaking';
import { getTtsState } from '../../tts/TtsState';
import { ChatTextEntry } from '../../ui/chat/entry/ChatTextEntry';
import { useCurrentChat } from '../../ui/chat/useCurrentChat';
import { useCustomAsrState } from '../../asr-custom/updateCustomAsrState';
import { ChatStates } from '../../state/chat/ChatStates';
import { AppEvents } from '../../event/AppEvents';
import { AppTextAreaRef } from '../../ui/common/AppTextArea';
import { startHearing } from '../../asr-webkit/startHearing';
import { stopHearing } from '../../asr-webkit/stopHearing';
import { AsrCustoms } from '../../asr-custom/AsrCustoms';
import { listChatMessages } from '../../chat/listChatMessages';
import { AppObjects } from 'ai-worker-common';
import { isDefined } from '@mjtdev/engine';
import { speak } from '../../tts/speak';
import { Ttss } from '../../tts/Ttss';
import { useAppState } from '../../state/app/AppState';
import { interruptTts } from '../../tts/custom/interruptTts';
// width: 100%;
const Container = styled.div`
  height: 100%;
  background: linear-gradient(180deg, #5046E5 0%, #3832A0 50%, #000000 100%); /* Gradient flows from top to bottom, dark at footer */
  overflow: hidden;
  margin:40px;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
`;

const Frame = styled.div`
  position: relative;
  width: 100vw;
  height: 100%;
  background:black;

`;

const WaveAnimation = styled.div`
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 35%;
  opacity: 0.8;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* Moves content closer to the footer */
  flex: 1;
  background: linear-gradient(180deg, rgba(0,0,0,0.01) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,1) 100%);
`;

const ImageContainer = styled.div`
  position: relative; /* Changed from absolute */
  width: 100%;
  height: auto;
  margin-bottom: 2%; /* Spacing between image and footer */
  
  @media (max-width: 768px) {
    max-width: 320px;
  }
`;

const AssistantImage = styled.img`
  object-fit: cover;
  position: relative;
  width: 100%;
  height: auto;
`;

const Footer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  height: 150px;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  background: #000;

  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 20px;
  }
  margin-bottom: 50px;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;

  img {
    height: 66px;
    width: auto;

    @media (max-width: 768px) {
      height: 28px;
    }
  }
`;

const QRContainer = styled.div`
  display: flex;
  align-items: center;
  position:absolute;
  right: 0;
  align-self: end;
  background:#FFFFFF1A;
  gap: 12px;
`;
const Overlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%; /* overlay cover 50% of the container height */
  background: linear-gradient(to top, rgba(11, 11, 11, 01), rgba(0, 0, 0, 0));
  border-radius: inherit;
  overflow: hidden;
`;

const QRCode = styled.img`
  width: 72px;
  height: 72px;

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }
`;

const QRText = styled.p`
  color: white;
  font-size: 20px;
  line-height: 1.4;
  margin: 0;
  white-space: nowrap;
`;

const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

const TypeOverlayContainer = styled.div`
  background: black;
  color: white;
  padding: 12px 32px;
  min-height: 100px;
  max-height: 200px; 
  max-width: 800px;
  font-size: 38px;
  letter-spacing: 0.2px;
  margin-top: 16px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  position: absolute;
  bottom: 5%;
  left: 55%;
  transform: translate(-50%, -50%);
  overflow-y: auto;
  scrollbar-width: none; // Firefox
  -ms-overflow-style: none; // IE and Edge
  
  // Hide scrollbar for Chrome/Safari
  &::-webkit-scrollbar {
    display: none;
  }

  // Ensure text wraps properly
  white-space: pre-wrap;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 10px 24px;
    max-height: 150px;
  }
`;
const Cursor = styled.span`
  animation: ${blink} 1s infinite;
`;

const TypingOverlay = ({ text, typingSpeed = 50 }: { text: string; typingSpeed?: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset when new text comes in
    setDisplayedText('');
    setCurrentIndex(0); 
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, typingSpeed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, typingSpeed]);
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [displayedText]);
  return (
    <TypeOverlayContainer ref={containerRef}>
      {displayedText}
      <Cursor>|</Cursor>
    </TypeOverlayContainer>
  );
};

const IntelligageScreen: React.FC = () => {
  const { audioContext: ttsAudioContext ,currentSource} = getTtsState();
  const ttsSpeaking = useIsTtsSpeaking();
  const { chat, messages } = useCurrentChat();
  const { ttsEnabled } = useAppState();

  const {
    speaking: asrSpeaking,
    enabled: asrEnabled,
  } = useCustomAsrState(); // Assuming this hook manages ASR state and controls

  const [transcription, setTranscription] = useState("");
  console.log(asrSpeaking,"AsrSpeaking..")
  // console.log(messages,"messages..")
  // console.log(chat,"Chat...")
  let realAndImaginedMessages:any[]=[]
  if(chat){
    const orderedMessages = listChatMessages({
      messageId: chat?.currentMessageId,
      messages,
    }).filter((n) => n.role !== "system");
  
    const speakerMessage = asrSpeaking
      ? AppObjects.create("chat-message", {
          characterId: chat?.userCharacterId,
          content: {
            type: "text",
            parts: [],
          },
        })
      : AppObjects.create("chat-message", { characterId: chat.aiCharacterId });
      console.log("Speaker,....",speakerMessage)
  
     realAndImaginedMessages = [...orderedMessages, speakerMessage].filter(
      isDefined
    );
  
  }

  console.log("Real Chats",realAndImaginedMessages)
  

  // Listen for ASR events and handle transcription
  AppEvents.useEventListener(
    "asrUtterance",
    (evt) => {
      console.log("asrUtterance");
      if (!chat) {
        console.log("NO CHAT");
        return;
      }
      ChatStates.addChatMessage({ chat, text: evt.detail });
       setTranscription("");
    },
    [chat]
  );
  AppEvents.useEventListener(
    "asrMumble",
    (evt) => {
      console.log("asrMumble");
       setTranscription(evt.detail);
    },
    [chat]
  );


  useEffect(() => {
    hideLoadingScreen();
    
  }, []);

  useEffect(() => {
    if (ttsSpeaking) {
     console.log("ttsSpeaking", ttsSpeaking)
    }
  }, [ttsSpeaking]);
  if(!ttsEnabled){
    Ttss.enableTts();

  }


    
  AsrCustoms.startCustomAsr()

  return (
    <Frame>

    <Container>
      <WaveAnimation>
        <img src={waveImage} alt="Wave Animation" />
      </WaveAnimation>

      <Content style={{position: "relative"}}>
        <ImageContainer>
          <AssistantImage src={girlImage} alt="AI Assistant" />
        <Overlay></Overlay>
        </ImageContainer>

        {/* <TypingOverlay text="The issue you're facing with TypeScript not recognizing the image module (Ai.png) is likely related to missing type declarations for importing non-code assets like images. TypeScript doesn't know how to handle imports of non-code files" /> */}
        <TypingOverlay text={transcription} />
        
      </Content>

      <Footer>
        <LogoContainer>
          <img src={intelliageImage} alt="Intelligage" />

        </LogoContainer>

        <QRContainer>
          <QRCode src={qrCodeImage} alt="QR Code" />
          <QRText>
            Scan to continue on<br />your phone
          </QRText>
        </QRContainer>
      </Footer>
      {/* {
        chat? <ChatTextEntry chat={chat} />: null
      } */}

    </Container>
    </Frame>

  );
};

export default IntelligageScreen;
