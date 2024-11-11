import { useEffect, useRef, useState } from "react";
import { ChatStates } from "../../../state/chat/ChatStates";
import { useCurrentChat } from "../../../ui/chat/useCurrentChat";

interface AttentionState {
    hasGreeted: boolean;
    lastLookAwayTime: number | null;
    canGreetAgain: boolean;
  }
  
const useScreenAttention = (isLookingAtScreen: boolean) => {
  const { chat } = useCurrentChat();
  const attentionStateRef = useRef<AttentionState>({
    hasGreeted: false,
    lastLookAwayTime: null,
    canGreetAgain: true
  });
  
  const MINIMUM_LOOK_AWAY_TIME = 5000; // 5 seconds
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const speakToUser = () => {
    ChatStates.addChatMessage({ chat, text: "Hi" });
    console.log("Hello! How can I help you today?");
  };

  useEffect(() => {
    const attentionState = attentionStateRef.current;

    if (isLookingAtScreen) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      const canGreet =
        attentionState.lastLookAwayTime
          ? Date.now() - attentionState.lastLookAwayTime > MINIMUM_LOOK_AWAY_TIME
          : true;

      if (!attentionState.hasGreeted && attentionState.canGreetAgain && canGreet) {
        speakToUser();
        attentionState.hasGreeted = true;
        attentionState.canGreetAgain = false;
      }
    } else {
      attentionState.lastLookAwayTime = Date.now();

      timeoutRef.current = setTimeout(() => {
        attentionState.hasGreeted = false;
        attentionState.lastLookAwayTime = null;
        attentionState.canGreetAgain = true;
      }, MINIMUM_LOOK_AWAY_TIME);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLookingAtScreen]);

  return attentionStateRef.current;
};

export default useScreenAttention;
