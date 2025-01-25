import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { ReactComponent as SpeechIcon } from '../../assets/speech/speech_mark.svg';

const SpeechButton = ({ onRecognized, width = 24, height = 24, mode = "stt", textToSpeak }) => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [isSpeaking, setIsSpeaking] = useState(false);

  // STT (음성 인식)
  const toggleListening = useCallback(() => {
    if (listening) {
      SpeechRecognition.stopListening();
      onRecognized(transcript);
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ language: 'ko-KR', continuous: true });
    }
  }, [listening, transcript, resetTranscript, onRecognized]);

  // TTS (음성 출력)
  const toggleSpeaking = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      if (textToSpeak) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'ko-KR';
        utterance.rate = 1.0;
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  const handleButtonClick = () => {
    if (mode === "stt") {
      toggleListening();
    } else if (mode === "tts") {
      toggleSpeaking();
    }
  };

  return (
    <Button onClick={handleButtonClick} $active={listening || isSpeaking}>
      <SpeechIcon width={width} height={height} />
    </Button>
  );
};

// 스타일링
const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    fill: ${(props) => (props.$active ? '#FF4F4D' : '#E60400')};
    transition: fill 0.3s ease;
  }

  &:hover {
    opacity: 0.8;
  }
`;

export default SpeechButton;
