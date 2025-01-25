import { Container, BodyWrapper, Body } from '../styles/Global';
import { motion } from "framer-motion";
import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import { BoxType } from '../components/Box/BoxType';  
import Input from "../components/Input/Input";
import logo from "../assets/logo.svg";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [kakaoCode, setKakaoCode] = useState(null);  

  // 카카오 리디렉션 시 코드 추출 및 저장
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    if (code) {
      setKakaoCode(code);
      console.log("카카오 인증 코드:", code);
      handleKakaoLogin(code);
    }
  }, [location]);

  // 회원가입 페이지 이동
  const goToSignup = () => {
    navigate('/signup');
  };

  // 일반 로그인 요청
  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post('http://52.79.245.244/auth/signin', {
        email,
        password
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      localStorage.setItem('email', email);
      localStorage.setItem('password', password);
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);

      navigate('/MapPage');
    } catch (error) {
      setErrorMessage('로그인 실패. 아이디 또는 비밀번호를 확인해주세요.');
      console.error('로그인 오류:', error);
    }
  };

  // 카카오 로그인 요청
  const kakaoSignup = async () => {
    try {
      const response = await axios.get('http://52.79.245.244/auth/kakao/page');
      if (response.status === 200) {
        window.location.href = response.data;
      } else {
      }
    } catch (error) {
    }
  };

  // 카카오 로그인 처리 함수
  const handleKakaoLogin = async (code) => {
    try {
      const response = await axios.post(
        `http://52.79.245.244/auth/kakao/callback?code=${code}`,
        {},
        {
          headers: {
            'accept': '*/*',
          },
        }
      );

      if (response.status === 200 && response.data.access) {
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);

        console.log("카카오 로그인 성공!", response.data);
        navigate('/MapPage');
      } else {
        console.error("카카오 로그인 실패");
        setErrorMessage('카카오 로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('카카오 로그인 오류:', error);
      setErrorMessage('카카오 로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <LoginContainer>
        <BodyWrapper>
          <Header>
            <img className="logo" src={logo} alt="logo" />
            <TextWrapper>
              <GreetingMessage>안녕하세요.</GreetingMessage>
              <InfoMessage>응급상황 대처 가이드 서비스,<br />삐용삐용입니다.</InfoMessage>
            </TextWrapper>
          </Header>
          <Body>
            <InputWrapper>
              <Input 
                id="login-email"
                width="310px"
                height="41px"
                placeholder="아이디"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input 
                id="login-password"
                width="310px"
                height="41px"
                placeholder="비밀번호"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputWrapper>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            <Signup onClick={goToSignup}>회원가입</Signup>
            <ButtonWrapper>
              <LoginButton onClick={handleLogin}>로그인</LoginButton>
            </ButtonWrapper>
            <KakaoButton onClick={kakaoSignup}>
              카카오 로그인
            </KakaoButton>
          </Body>
        </BodyWrapper>
      </LoginContainer>
    </motion.div>
  );
};

const LoginContainer = styled(Container)`
  background: linear-gradient(179.98deg, #FFFFFF 20.02%, rgba(255, 243, 243, 0.671667) 73.6%, rgba(253, 226, 225, 0.51) 99.98%) !important; 
`;

const Header = styled.header`
  margin-top: 3rem;
  .logo {
    position: absolute;
    margin-top: 4rem;
    margin-left: -10.8rem;
    transform: scale(1.3);
    transform-origin: top left;
  }
`;

const TextWrapper = styled.div`
  margin-top: 8rem;
  margin-left: 1rem;
  position: absolute;
  text-align: left;
`;

const GreetingMessage = styled.h1`
  font-size: 1.25rem;
`;

const InfoMessage = styled.h2`
  font-size: 1rem;
  font-weight: lighter;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 19rem;
  gap: 1rem;  
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.875rem;
  margin-top: 1rem;
`;

const Signup = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
  font-size: 0.875rem;
  cursor: pointer; 

  &:hover {
    color: #0000004D; 
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;  
`;

const LoginButton = styled(BoxType._10radiux_Box)`  
  background-color: #FF4F4DCC;
  border: 1px solid #FF4F4DCC;
  font-size: 1rem;
  width: 310px;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #FF4F4D80;
  }
`;

const KakaoButton = styled(BoxType._10radiux_Box)`  
  margin-top: 1rem;
  background-color: #F9E000;
  border: 1px solid #F9E000;
  font-size: 1rem;
  width: 310px;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3B1C1C;
  cursor: pointer;

  &:hover {
    background-color: #F9E00080;
  }
`;

export default Login;