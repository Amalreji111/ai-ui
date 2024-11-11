import { isDefined } from "@mjtdev/engine";
import type { AppCharacter, Chat, ChatMessage } from "ai-worker-common";
import { AppObjects } from "ai-worker-common";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { memo } from "react";
import { useCustomAsrState } from "../../asr-custom/updateCustomAsrState";
import { listChatMessages } from "../../chat/listChatMessages";
import { ChatMessagesDisplay } from "./ChatMessagesDisplay";
import { stringifyEq } from "./stringifyEq";
import { interruptTts } from "../../tts/custom/interruptTts";

export const ChatDisplay = memo(
  ({
    style = {},
    chat,
    characters,
    enableControls,
    messages,
  }: {
    messages: readonly ChatMessage[];
    chat: Chat;
    style?: CSSProperties;
    characters: Record<string, AppCharacter>;
    enableControls?: boolean;
  }) => {
    const { speaking } = useCustomAsrState();

    const orderedMessages = listChatMessages({
      messageId: chat?.currentMessageId,
      messages,
    }).filter((n) => n.role !== "system");

    const speakerMessage = speaking
      ? AppObjects.create("chat-message", {
          characterId: chat.userCharacterId,
          content: {
            type: "text",
            parts: [],
          },
        })
      : AppObjects.create("chat-message", { characterId: chat.aiCharacterId });

    const realAndImaginedMessages = [...orderedMessages, speakerMessage].filter(
      isDefined
    );

    return (
      <motion.div
        onPointerDown={() => {
          interruptTts("user clicked ChatBox");
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
        style={{
          display: "flex",
          flexGrow: "1",
          flexDirection: "column",
          overflow: "auto",
          ...style,
        }}
        key={`chat-display-motion-${chat.id}`}
      >
          <ChatMessagesDisplay
            characters={characters}
            chatId={chat.id}
            messages={realAndImaginedMessages}
            enableControls={enableControls}
          />
      </motion.div>
    );
  },
  stringifyEq
);
