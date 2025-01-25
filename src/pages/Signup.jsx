import { Container, BodyWrapper, Body } from '../styles/Global';
import { motion } from "framer-motion";
import React, { useState } from 'react';
import styled from "styled-components";
import axios from 'axios';
import { BoxType } from '../components/Box/BoxType';  
import Input from "../components/Input/Input";
import logo from "../assets/logo.svg";
import { useNavigate } from 'react-router-dom';

function Signup() {
    const navigate = useNavigate();  

    const [signupData, setSignupData] = useState({
        email: '',
        password: '',
        username: '',
        phoneNumber: '',
        gender: 'male',
        parentPhoneNumber: '',
        address: '',
        residentNo: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
        phoneNumber: '',
        parentPhoneNumber: '',
        residentNo: ''
    });

    // 정규식 패턴 정의
    const patterns = {
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        phone: /^010-\d{4}-\d{4}$/,
        residentNo: /^\d{6}-\d{7}$/
    };

    const validateField = (field, value) => {
        switch (field) {
            case 'email':
                setErrors((prev) => ({
                    ...prev,
                    email: patterns.email.test(value) ? '' : '유효한 이메일을 입력해주세요.',
                }));
                break;
            case 'password':
                setErrors((prev) => ({
                    ...prev,
                    password: patterns.password.test(value) ? '' : '비밀번호는 8자 이상, 영문+숫자 조합이어야 합니다.',
                }));
                break;
            case 'phoneNumber':
                setErrors((prev) => ({
                    ...prev,
                    phoneNumber: patterns.phone.test(value) ? '' : '010-0000-0000 형식으로 입력해주세요.',
                }));
                break;
            case 'parentPhoneNumber':
                setErrors((prev) => ({
                    ...prev,
                    parentPhoneNumber: patterns.phone.test(value) ? '' : '010-0000-0000 형식으로 입력해주세요.',
                }));
                break;
            case 'residentNo':
                setErrors((prev) => ({
                    ...prev,
                    residentNo: patterns.residentNo.test(value) ? '' : '000000-0000000 형식으로 입력해주세요.',
                }));
                break;
            default:
                break;
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setSignupData({ ...signupData, [id]: value });

        // 실시간 유효성 검사
        validateField(id, value);
    };

    const handleSignup = async () => {
        const newErrors = {
            email: patterns.email.test(signupData.email) ? '' : '유효한 이메일을 입력해주세요.',
            password: patterns.password.test(signupData.password) ? '' : '비밀번호는 8자 이상, 영문+숫자 조합이어야 합니다.',
            phoneNumber: patterns.phone.test(signupData.phoneNumber) ? '' : '010-0000-0000 형식으로 입력해주세요.',
            parentPhoneNumber: patterns.phone.test(signupData.parentPhoneNumber) ? '' : '010-0000-0000 형식으로 입력해주세요.',
            residentNo: patterns.residentNo.test(signupData.residentNo) ? '' : '000000-0000000 형식으로 입력해주세요.',
        };
    
        setErrors(newErrors);
    
        if (Object.values(newErrors).some((error) => error !== '')) {
            alert('입력값을 확인해주세요.');
            return;
        }
    
        try {
            const response = await axios.post('http://52.79.245.244/auth/signup', signupData, {
                headers: { 'Content-Type': 'application/json' }
            });
    
            console.log('회원가입 성공:', response.data);
            alert('회원가입이 완료되었습니다.');
            navigate('/');
        } catch (error) {
            console.error('회원가입 실패:', error.response?.data || error.message);
            alert('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
    };
    
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SignUpContainer>
                <BodyWrapper>
                    <Header>
                        <img className="logo" src={logo} alt="logo" />
                        <TextWrapper>
                            <PageName>회원가입</PageName>
                        </TextWrapper>
                    </Header>
                    <Body>
                        <InputWrapper>
                            <InputName>아이디</InputName>
                            <Input 
                                id="email"
                                width="310px"
                                height="41px"
                                placeholder="이메일을 아이디로 입력해주세요."
                                value={signupData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <ErrorMsg>{errors.email}</ErrorMsg>}
                            
                            <InputName>비밀번호</InputName>
                            <Input 
                                id="password"
                                width="310px"
                                height="41px"
                                placeholder="영문+숫자 8자 이상으로 설정해주세요."
                                type="password"
                                value={signupData.password}
                                onChange={handleChange}
                            />
                            {errors.password && <ErrorMsg>{errors.password}</ErrorMsg>}

                            <InputName>전화번호</InputName>
                            <Input 
                                id="phoneNumber"
                                width="310px"
                                height="41px"
                                placeholder="010-0000-0000"
                                value={signupData.phoneNumber}
                                onChange={handleChange}
                            />
                            {errors.phoneNumber && <ErrorMsg>{errors.phoneNumber}</ErrorMsg>}

                            <InputName>보호자 전화번호</InputName>
                            <Input 
                                id="parentPhoneNumber"
                                width="310px"
                                height="41px"
                                placeholder="010-0000-0000"
                                value={signupData.parentPhoneNumber}
                                onChange={handleChange}
                            />
                            {errors.parentPhoneNumber && <ErrorMsg>{errors.parentPhoneNumber}</ErrorMsg>}
                            
                            <InputName>주소</InputName>
                            <Input 
                                id="address"
                                width="310px"
                                height="41px"
                                placeholder="거주지를 한글로 입력해주세요."
                                value={signupData.address}
                                onChange={handleChange}
                            />

                            <InputName>주민등록번호</InputName>
                            <Input 
                                id="residentNo"
                                width="310px"
                                height="41px"
                                placeholder="000000-0000000"
                                value={signupData.residentNo}
                                onChange={handleChange}
                            />
                            {errors.residentNo && <ErrorMsg>{errors.residentNo}</ErrorMsg>}

                            <InputName>닉네임</InputName>
                            <Input 
                                id="username"
                                width="310px"
                                height="41px"
                                placeholder="닉네임을 한글로 입력해주세요."
                                value={signupData.username}
                                onChange={handleChange}
                            />
                        </InputWrapper>
                        <ButtonWrapper>
                            <SignupButton onClick={handleSignup}>회원가입</SignupButton>
                        </ButtonWrapper>
                        <Login onClick={() => navigate('/')}>로그인</Login>
                    </Body>
                </BodyWrapper>
            </SignUpContainer>
        </motion.div>
    );
};

const SignUpContainer = styled(Container)`
    background: linear-gradient(179.98deg, #FFFFFF 20.02%, rgba(255, 243, 243, 0.671667) 73.6%, rgba(253, 226, 225, 0.51) 99.98%) !important; 
`;

const Header = styled.header`
  position: relative;
  .logo {
    position: absolute;
    margin-top: 1.3rem;
    margin-left: -10.8rem;
  }
`;

const TextWrapper = styled.div`
    margin-top: 5rem;
    margin-left: 1rem;
    position: absolute;
    text-align: left;
`;

const PageName = styled.h1`
    font-size: 1.25rem;
`;

const InputWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;  
    margin-top: 8rem;
    width: 100%;  
`;

const InputName = styled.p`
    text-align: left;  
    margin-left: 2rem;
    margin-top: 2rem;
    margin-bottom: 0.25rem;
    font-size: 1rem;
    width: 100%;
`;

const ButtonWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    gap: 1rem;  
`;

const SignupButton = styled(BoxType._10radiux_Box)`  
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
`;

const Login = styled.p`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 2rem 0;
    font-size: 0.875rem;
    cursor: pointer; 

    &:hover {
        color: #0000004D; 
    }
`;

const ErrorMsg = styled.p`
    color: red;
    font-size: 0.875rem;
    text-align: center;
`;

export default Signup;