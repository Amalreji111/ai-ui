import { createState } from "@mjtdev/engine";

export const [useTtsState, updateTtsState, getTtsState] = createState({
  voices: [] as SpeechSynthesisVoice[],
  currentUtterance: undefined as SpeechSynthesisUtterance | undefined,
  currentSource: undefined as AudioBufferSourceNode | undefined,
  currentText: undefined as string | undefined,
  lastText: undefined as string | undefined,
  audioContext: undefined as undefined | AudioContext,
  analyserNode: undefined as undefined | AnalyserNode,
});
