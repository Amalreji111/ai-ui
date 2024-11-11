import { useState, useEffect } from "react";
import { listChatMessages } from "../../../chat/listChatMessages";
import { AiFunctions, AppObjects, Chats } from "ai-worker-common";
import { useCustomAsrState } from "../../../asr-custom/updateCustomAsrState";
import { useCurrentChat } from "../../../ui/chat/useCurrentChat";

const useTranscription = () => {
  const { chat, messages } = useCurrentChat();

  const { speaking: asrSpeaking } = useCustomAsrState(); // Assuming this hook manages ASR state
  const [transcription, setTranscription] = useState("");

  // Filter chat messages and build realAndImaginedMessages array
  let realAndImaginedMessages: any[] = [];
  if (chat) {
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

    realAndImaginedMessages = [...orderedMessages, speakerMessage].filter(Boolean);
  }

  // Extract the latest assistant message as a transcript
  const transcript = listChatMessages({
    messageId: chat?.currentMessageId,
    messages,
  })
    .filter((n) => n.role === "assistant")
    ?.at(-1);

  let parseResult = null;
  if (transcript) {
    parseResult = AiFunctions.parseAiFunctionText(
      Chats.chatMessageToText(transcript),
      { aiFunctionPrefix: ".?" }
    );
  }

  return {
    transcription,
    setTranscription,
    realAndImaginedMessages,
    parseResult,
  };
};

export default useTranscription;
