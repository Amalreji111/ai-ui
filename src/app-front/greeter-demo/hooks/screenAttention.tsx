import { useEffect, useRef, useState } from "react";
import { ChatStates } from "../../../state/chat/ChatStates";
import { useCurrentChat } from "../../../ui/chat/useCurrentChat";

interface AttentionState {
    hasGreeted: boolean;
    lastLookAwayTime: number | null;
    canGreetAgain: boolean;
  }
  
  const useScreenAttention = (isLookingAtScreen: boolean) => {
    const [attentionState, setAttentionState] = useState<AttentionState>({
      hasGreeted: false,
      lastLookAwayTime: null,
      canGreetAgain: true
    });
    const { chat, messages } = useCurrentChat();
  
    const MINIMUM_LOOK_AWAY_TIME = 5000; // 5 seconds
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
    const speakToUser = () => {
      // Your TTS function here
      ChatStates.addChatMessage({ chat, text: "Hi" });

      console.log("Hello! How can I help you today?");
    };
  
    useEffect(() => {
      if (isLookingAtScreen) {
        // Clear any pending timeout when user looks back
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
  
        // Check if enough time has passed since last look away
        const canGreet = attentionState.lastLookAwayTime 
          ? Date.now() - attentionState.lastLookAwayTime > MINIMUM_LOOK_AWAY_TIME 
          : true;
  
        // Only greet if we haven't greeted and can greet again
        if (!attentionState.hasGreeted && attentionState.canGreetAgain && canGreet) {
          speakToUser();
          setAttentionState(prev => ({
            ...prev,
            hasGreeted: true,
            canGreetAgain: false
          }));
        }
      } else {
        // User looked away
        setAttentionState(prev => ({
          ...prev,
          lastLookAwayTime: Date.now()
        }));
  
        // Start timeout to allow greeting again
        timeoutRef.current = setTimeout(() => {
          setAttentionState(prev => ({
            hasGreeted: false,
            lastLookAwayTime: null,
            canGreetAgain: true
          }));
        }, MINIMUM_LOOK_AWAY_TIME);
      }
  
      // Cleanup
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, [isLookingAtScreen]);
  
    return attentionState;
  };
 
export default useScreenAttention;
