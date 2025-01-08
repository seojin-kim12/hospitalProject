import { Container, BodyWrapper, Body } from '../styles/Global';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import TextareaAutosize from 'react-textarea-autosize';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import React, { useState } from 'react';
import styled from "styled-components";
import back from "../assets/chat/back.svg";
import speech from "../assets/chat/speech.svg";
import btn from "../assets/chat/sendbox.svg";

function Chat() {
    const navigate = useNavigate();

    const backBtn = () => {
        navigate("/");
    };

    // stt 기능 구현을 위해 정의
    const { 
      transcript, // stt 녹음한 내용을 담는 변수
      listening, // stt 녹음
      browserSupportsSpeechRecognition 
    } = useSpeechRecognition();

    // input 상태 관리
    const [inputValue, setInputValue] = useState("");
  
    if (!browserSupportsSpeechRecognition) {
      return <span>Browser doesn't support speech recognition.</span>;
    }
  
    // 녹음 시작
    const startListening = () => {
      SpeechRecognition.startListening({ continuous: true, language: "ko" });
    };
  
    // 녹음 종료 후 텍스트 반영
    const stopListening = () => {
      SpeechRecognition.stopListening();
      setInputValue(transcript); // 녹음된 내용을 input 값에 설정
    };

    const handleSpeechClick = () => {
        if (listening) {
          stopListening();
        } else {
          startListening();
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Container>
                <BodyWrapper>
                    <Header>
                        <img className="back" src={back} style={{ cursor: "pointer" }} alt="back" onClick={backBtn} />
                    </Header>
                    <Body>
                    <AIChatBox>
                    안녕하세요!
                    챗봇에게 궁금한 점을 물어보세요.
                    </AIChatBox>
                    <UserChatBox>
                    절단 사고가 났을 때 어떻게 해야 하나요?
                    </UserChatBox>
                    <div style={{ position: "absolute", marginBottom: "100px" }}> 
                        <StyledTextareaAutosize
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={listening ? "녹음 중..." : "질문을 입력하세요."}
                        />
                        <div style={{ position: "absolute", right: "1rem", top: "-0.65rem" }}>
                            <img
                            className="speech"
                            src={speech}
                            alt="speech"
                            onClick={handleSpeechClick} // 녹음 시작 & 중지 토글
                            style={{ position: 'absolute', cursor: "pointer", left: "1.8rem", top: "48.5rem" }}
                            />
                            <img className="btn"
                            src={btn}
                            alt='btn'
                            style={{ position:'absolute', cursor: "pointer", left: "19.7rem", top: "48rem" }}/>
                        </div>
                    </div>
                    </Body>
                </BodyWrapper>
            </Container>
        </motion.div>
    );
};

const Header = styled.header`
    .back {
        position: absolute;
        margin-top: 1.3rem;
        margin-left: -10.8rem;
    }
    margin-bottom: 5rem;
`;

const AIChatBox = styled.div`
    position: relative;
    width: 20rem;
    height: auto;
    background-color: #fff6f6;
    border: 1px solid #FF4F4D;
    border-radius: 0 20px 20px 20px;
    align-items: left;
    color: #FF4F4D;
    padding: 10px;
    text-align: left;
`;

const UserChatBox = styled.div`
    position: relative;
    width: 20rem;
    height: auto;
    background-color: white;
    border: 1px solid #FF4F4D;
    border-radius: 20px 0px 20px 20px;
    margin-top: 1.1rem;
    align-items: left;
    color: #FF4F4D;
    padding: 10px;
`;

const StyledTextareaAutosize = styled(TextareaAutosize)`
  position: absolute;
  top: 47rem;
  left: -0.1rem;
  width: 16.6rem;
  background-color: white;
  border: 1px solid #FF4F4D;
  border-radius: 20px 20px 20px 20px;
  padding : 0.6rem 2.5rem 0.6rem 2.5rem;
  font-size: 18px;
  resize: none;
  outline: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export default Chat;