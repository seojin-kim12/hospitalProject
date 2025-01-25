import React, { useState, useCallback, useRef, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { RiSendPlaneFill } from "react-icons/ri";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";

// 컴포넌트
import InputText from "../components/Chat/InputText";
import Message from "../components/Chat/Message";

// 스타일
import { Container, BodyWrapper, Body } from "../styles/Global";
import back from "../assets/chat/back.svg";

// 수정된 CallGPT
import { CallGPT } from "../components/Chat/gpt";

// const dummyData = [
//   {
//     role: 'assistant',
//     content: '안녕하세요, 응급 상황 대처 도우미 뿅뿅입니다😊 궁금한 점이 있다면 무엇이든 물어보세요!',
//     timestamp: '오후 11:20',
//     isLoading: false,
//   },
//   {
//     role: 'user',
//     content: '벌에 쏘였을 때 대처 방법을 알려줘',
//     timestamp: '오후 11:21',
//   },
//   {
//     role: 'assistant',
//     content:
//       '[벌에 쏘였을 때의 대처 방법]\n\n1. 먼저, 쏘인 부위에 벌의 침이 남아있다면, 카드나 대체 물질로 부드럽게 긁어내세요. 손톱으로 집어내면 독이 퍼질 수 있습니다.\n2. 쏘인 부위를 차갑게 하기 위해 얼음찜질을 하세요. 이는 통증과 부종을 완화합니다.\n3. 알레르기 반응이 나타난다면 즉시 119에 신고하세요.',
//     timestamp: '오후 11:21',
//     isLoading: false,
//   },
//   {
//     role: 'user',
//     content: '왼쪽 팔이 골절 되었을 때 대처법을 알려 줘',
//     timestamp: '오후 11:22',
//   },
//   {
//     role: 'assistant',
//     content:
//       '[왼쪽 팔 골절 시 대처법]\n\n1. 움직이지 않도록 팔을 고정하세요.\n2. 차가운 물질로 부종을 완화시키세요.\n3. 즉시 의료기관을 방문하세요.\n4. 팔에 마비, 변색이 나타나면 즉시 119를 호출하세요.',
//     timestamp: '오후 11:22',
//     isLoading: false,
//   },
//   {
//     role: 'user',
//     content: '오늘 저녁 메뉴 추천해 줘',
//     timestamp: '오후 11:22',
//   },
//   {
//     role: 'assistant',
//     content:
//       '[비응급 상황]\n\n죄송합니다. 제가 제공할 수 있는 정보는 응급 상황에 대한 조치 방법에 한정되어 있습니다. 메뉴 추천 등 일상적인 상담은 제공할 수 없습니다.',
//     timestamp: '오후 11:22',
//     isLoading: false,
//   },
//   {
//     role: 'user',
//     content: '오늘 저녁 메뉴 추천해 줘',
//     timestamp: '오후 11:22',
//   },
//   {
//     role: 'assistant',
//     content:
//       '[왼쪽 팔 골절 시 대처법]\n\n1. 움직이지 않도록 팔을 고정하세요.\n2. 차가운 물질로 부종을 완화시키세요.\n3. 즉시 의료기관을 방문하세요.\n4. 팔에 마비, 변색이 나타나면 즉시 119를 호출하세요.',
//     timestamp: '오후 11:22',
//     isLoading: false,
//   },
// ];

// // 테스트를 위한 코드 예제
// dummyData.forEach((message) => {
//   console.log("더미 데이터 테스트용 >>>>>>>>>>>>>>>>>> ");
//   console.log('Role:', message.role);
//   console.log('Content:', message.content);
//   console.log('Timestamp:', message.timestamp);
//   console.log('----');
// });

const Chat = () => {
  const navigate = useNavigate();
  const backBtn = () => navigate("/MapPage");

  // 음성 인식
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const toggleListening = useCallback(() => {
    if (listening) {
      SpeechRecognition.stopListening();
      setInput(transcript);
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ language: "ko-KR", continuous: true });
    }
  }, [listening, transcript, resetTranscript]);

  // 상태
  const [input, setInput] = useState("");
  // const [messages, setMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isInputting, setInputting] = useState(false);

  // 스크롤
  const messageEndRef = useRef(null);
  const scrollBottom = useCallback(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // 스크롤 유지
  useEffect(() => {
    scrollBottom();
  }, [messages, scrollBottom]);

  // 초기 안내 메시지
  const greetedRef = useRef(false);
  useEffect(() => {
    if (!greetedRef.current && messages.length === 0) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "안녕하세요, 응급 상황 대처 도우미 뿅뿅입니다😊 궁금한 점이 있다면 무엇이든 물어보세요!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      greetedRef.current = true;
    }
  }, [messages]);

  // 입력 처리
  const handleInputChange = useCallback((value) => {
    setInput(value);
    setInputting(true);
    setTimeout(() => setInputting(false), 500);
  }, []);

  // 전송
  const handleSendMessage = useCallback(async () => {
    if (!input.trim()) {
      alert("메시지를 입력하세요!");
      return;
    }
  
    const userMessage = {
      role: "user",
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  
    const prevLength = messages.length;
    console.log("사용자 메시지 인덱스:", prevLength); // 사용자 메시지 인덱스 확인
  
    setMessages((prev) => {
      const updatedMessages = [
        ...prev,
        userMessage,
        {
          role: "assistant",
          content: "",
          isLoading: true,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ];
  
      // 현재 메시지 배열을 출력
      console.log("업데이트된 메시지 배열:", updatedMessages);
      return updatedMessages;
    });
  
    setInput("");
    setLoading(true);
    scrollBottom();
  
    try {
      const response = await CallGPT({ prompt: userMessage.content });
      const loadingIndex = prevLength + 1;
      console.log("로딩 메시지 인덱스:", loadingIndex); // 로딩 메시지 인덱스 확인
  
      setMessages((prev) => {
        const updatedMessages = prev.map((msg, idx) =>
          idx === loadingIndex
            ? {
                ...msg,
                content: `[${response.title}]\n\n${response.emergency_detail}`,
                isLoading: false,
              }
            : msg
        );
  
        // 현재 메시지 배열을 출력
        console.log("GPT 응답 후 업데이트된 메시지 배열:", updatedMessages);
        return updatedMessages;
      });
    } catch (error) {
      console.error("AI 응답 에러:", error);
      const loadingIndex = prevLength + 1;
  
      setMessages((prev) => {
        const updatedMessages = prev.map((msg, idx) =>
          idx === loadingIndex
            ? {
                ...msg,
                content: "죄송합니다. 응답을 가져오는 데 문제가 발생했습니다.",
                isLoading: false,
              }
            : msg
        );
  
        // 에러 발생 후 메시지 배열 출력
        console.log("에러 발생 후 업데이트된 메시지 배열:", updatedMessages);
        return updatedMessages;
      });
    } finally {
      setLoading(false);
    }
  }, [input, messages, scrollBottom]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Container>
        <BodyWrapper>
          <Header>
            <img
              className="back"
              src={back}
              style={{ cursor: "pointer" }}
              alt="back"
              onClick={backBtn}
            />
          </Header>
          <Body>
            <HomepageMessage>
              {messages.map((message, idx) => (
                <Message
                  key={idx}
                  $role={message.role}
                  content={message.content}
                  isLoading={message.isLoading || false}
                  isInputting={isInputting}
                  timestamp={message.timestamp}
                />
              ))}
              <div ref={messageEndRef} />
            </HomepageMessage>

            <HomepageInput>
              <MessageInput>
                <button className="speech" onClick={toggleListening}>
                  {listening ? (
                    <HiSpeakerXMark style={{ color: "#FF4F4D" }} size={25} />
                  ) : (
                    <HiSpeakerWave style={{ color: "#FF4F4D" }} size={25} />
                  )}
                </button>
                <InputText
                  placeholder={listening ? "녹음 중..." : "메시지를 입력하세요"}
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <button className="send" onClick={handleSendMessage} disabled={isLoading}>
                  <RiSendPlaneFill style={{ color: "white" }} size={16} />
                </button>
              </MessageInput>
            </HomepageInput>
          </Body>
        </BodyWrapper>
      </Container>
    </motion.div>
  );
};

export default Chat;

const Header = styled.header`
  .back {
    position: absolute;
    margin-top: 1.3rem;
    margin-left: -10.8rem;
  }
  margin-bottom: 5rem;
`;

const HomepageMessage = styled.div`
  margin: auto;
  padding: 0 1em;
  height: 840px;
  margin-bottom: 20px;
  overflow-y: scroll;
  overflow-x: hidden;
  text-align: left;

  &::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }
`;

const HomepageInput = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 6em 2em 2em 2em;
  width: 100%;
  background: linear-gradient(0deg, #fff 25%, transparent);
  box-sizing: border-box;
`;

const MessageInput = styled.div`
  position: relative;
  margin: auto;
  max-width: 390px;

  .speech {
    position: absolute;
    left: 5px;
    bottom: 10px;
    padding: 0 12px;
    height: 30px;
    width: 30px;
    background-color: transparent;
    border: none;
    border-radius: 15px;
    cursor: pointer;
  }

  input:focus {
    outline: none;
  }

  .send {
    position: absolute;
    right: 11px;
    bottom: 9px;
    width: 35px;
    height: 35px;
    background: #ff7775;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 0px 5px 0px rgba(69,66,66,0.75);
  }
`;
