import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled,{ keyframes } from 'styled-components';

// Import your assets here
import girlImage from './assets/Ai.png';
import sendIcon from './assets/Send.png';
import micIcon from './assets/Microphone.png';
import waveImage from './assets/wave.png';
import qrCodeImage from './assets/QR Code.png';
import intelliageImage from './assets/intelligage.png';
import { hideLoadingScreen } from '../../ui/hideLoadingScreen';
import { useIsTtsSpeaking } from '../../tts/useIsTtsSpeaking';
import { getTtsState } from '../../tts/TtsState';
import { ChatTextEntry } from '../../ui/chat/entry/ChatTextEntry';
import { useCurrentChat } from '../../ui/chat/useCurrentChat';
import { getCustomAsrState, useCustomAsrState } from '../../asr-custom/updateCustomAsrState';
import { ChatStates } from '../../state/chat/ChatStates';
import { AppEvents } from '../../event/AppEvents';
import { AppTextAreaRef } from '../../ui/common/AppTextArea';
import { startHearing } from '../../asr-webkit/startHearing';
import { stopHearing } from '../../asr-webkit/stopHearing';
import { AsrCustoms } from '../../asr-custom/AsrCustoms';
import { listChatMessages } from '../../chat/listChatMessages';
import { AiFunctions, AppObjects, Chats } from 'ai-worker-common';
import { first, isDefined } from '@mjtdev/engine';
import { speak } from '../../tts/speak';
import { Ttss } from '../../tts/Ttss';
import { useAppState } from '../../state/app/AppState';
import { interruptTts } from '../../tts/custom/interruptTts';
import useTranscription from './hooks/transcription';
import { DataObjectStates, useChildDataObjects } from '../../state/data-object/DataObjectStates';
import { CharacterAvatar } from '../../ui/character/CharacterAvatar';
import { speakLineBrowser, speakLinesBrowser } from '../../tts/speakLineBrowser';
import { useUserState } from '../../state/user/UserState';
import { useAvailableVoices } from '../../ui/useAvailableVoices';
import useFaceDetection from './hooks/faceDetection';
import useScreenAttention from './hooks/screenAttention';
import { ChatContainer } from '../../ui/chat/ChatContainer';
import { AppModes } from '../../state/location/AppModes';
import { useIsMobile } from '../../ui/common/useIsMobile';
import "./styles/chat.css"
import { ChatMessagesDisplay } from '../../ui/chat/ChatMessagesDisplay';
import { ActionButton } from './components/ActionButton';
import { getAsrState } from '../../asr-webkit/AsrState';
import { isHearing } from '../../asr-webkit/isHearing';
// width: 100%;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  `
const IntelligageScreen: React.FC = memo(() => {
  const { chat, messages } = useCurrentChat();
  const { ttsEnabled } = useAppState();
  // const {  parseResult } = useTranscription();
  const [userMessage,setUserMessage] = useState('')
  const [asrState, setAsrState] = useState(false);
  const characters = DataObjectStates.useDataObjectsById<"app-character">(
    [chat?.aiCharacterId, chat?.userCharacterId].filter(isDefined)

  )
  // const []=useState(false)
  const isInputHasValue = userMessage.trim()!==''

  const handleSendUserMessage=()=>{
   
    try {
      if(userMessage.trim()==='')return
      // ChatStates.addChatMessage({ chat, text:userMessage});
      setUserMessage('')
      return
    } catch (error) {
      console.log(error)
      setUserMessage('')
      return
    }

  }
 const {asrActive} =getAsrState()

  const toggleAsrState = () => {
    if (asrState) {
      // stopHearing();
      AsrCustoms.stopVadAsr();

    setAsrState(false);

    } else {
      // startHearing();
      AsrCustoms.startCustomAsr();
      setAsrState(true);
    }
  };
  
  const aiChar = chat?.aiCharacterId?characters.find(x=>x.id===chat.aiCharacterId):undefined
  const character=chat?.userCharacterId
      ? characters.find(x=>x.id===chat.userCharacterId)
      : undefined;
      const avatar = character ? (
        <CharacterAvatar
          hoverActions={["Chat With {char}"]}
          showHoverButtons={false}
          imageStyle={{
            objectFit: 'cover',
            width: "100%",
            height: "100%"
           }}
          character={aiChar}
          showName={false}
          show3dAvatar={true}
          showContextMenu={false}
          enableDocumentDrop={false}
        />
      ) : undefined;
  
      // const lookingAtScreen=useMemo(()=>isLookingAtScreen,[isLookingAtScreen])
    
      // useEffect(() => {
      //   if (attentionState.hasGreeted === false) {
      //     ChatStates.addChatMessage({ chat, text: "Hi" });
      //   }
      // }, [attentionState.hasGreeted]);
      
  
  if (!ttsEnabled) {
    Ttss.enableTts();
  }
  
  // speak({
  //   text:"Hey there!",
    
  // })
  console.log('asrActive', isHearing())
  const isMobile = useIsMobile();
  const { speaking } = useCustomAsrState();

  const isPapMode = AppModes.useAppModesAndParams().modes.includes("pap");
  const enableControls = isMobile || isPapMode ? false : true;
  const activeTheme = first(
    DataObjectStates.useChildDataObjects(
      chat?.id,
      "access-point-theme",
      "active"
    )
  );
  // AsrCustoms.startCustomAsr();


  const orderedMessages = listChatMessages({
    messageId: chat?.currentMessageId,
    messages,
  }).filter((n) => n.role !== "system");

  const speakerMessage = speaking
    ? AppObjects.create("chat-message", {
        characterId: chat?.userCharacterId,
        content: {
          type: "text",
          parts: [],
        },
      })
    : AppObjects.create("chat-message", { characterId: chat?.aiCharacterId });

  const realAndImaginedMessages = [...orderedMessages, speakerMessage].filter(
    isDefined
  );
  /**
   * 

   */
  return (
    chat&&
    <div className="container">
      <header className="header">
        <img 
          src={intelliageImage} 
          alt="Intelligage" 
          className="logo"
        />
      </header>

      <div className="chat-container">
      <ChatMessagesDisplay
    characters={Object.fromEntries(
      characters.map((character) => [character.id, character] as const)
    )}
    chatId={chat.id}
    messages={realAndImaginedMessages}
    enableControls={enableControls}

  />
      </div>
      <div className="input-area">
        <InputWrapper>
          <input type="text" placeholder="Ask AI" className="input" value={userMessage} onChange={(e)=>{setUserMessage(e.target.value)}} />
          <div className='input'></div>
          {
            isInputHasValue?
            <ActionButton onClick={handleSendUserMessage} label='Send' icon={sendIcon}/>:
            <ActionButton onClick={toggleAsrState} label='Mic' icon={micIcon}/>
            
          }
        </InputWrapper>
      </div>
    </div>

  );
});

export default IntelligageScreen;
