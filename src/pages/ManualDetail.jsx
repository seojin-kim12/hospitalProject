import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import { Container, BodyWrapper, Body } from '../styles/Global';
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { BoxType } from '../components/Box/BoxType.js';
import SpeechButton from '../components/Button/SpeechButton';
import logo_icon from "../assets/bottom_bar/logo_icon.svg";
import manual_icon from "../assets/bottom_bar/manual_icon.svg";
import map_icon from "../assets/bottom_bar/map_icon.svg";
import chat_icon from "../assets/bottom_bar/chat.svg";
import my_icon from "../assets/bottom_bar/my_icon.svg";
import back from "../assets/back.svg";
import bar from "../assets/bottom_bar/bar.svg";
import axios from 'axios';

function ManualDetail() {
  const [manualContent, setManualContent] = useState({ emergencyName: '', manualDetail: '' });
  const navigate = useNavigate();
  const { emergencyName } = useParams();

  const goMy = () => navigate("/Mypage");
  const goManual = () => navigate("/Manual");
  const goMap = () => navigate("/MapPage");
  const goChat = () => navigate("/Chat");

  useEffect(() => {
    const fetchManualData = async () => {
      const accessToken = localStorage.getItem('accessToken');

      try {
        const response = await axios.get(
          `http://52.79.245.244/api/v1/manual/explanation?EmergencyName=심장마비&emergencyName=${encodeURIComponent(emergencyName)}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        setManualContent({
          emergencyName: response.data.emergencyName,
          manualDetail: response.data.manualDetail,
        });
      } catch (error) {
        console.error('API 요청 실패:', error);
      }
    };

    if (emergencyName) {
      fetchManualData();
    }
  }, [emergencyName]);

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
              onClick={() => navigate(-1)} 
            />
            <AccountWrapper>
              <ManualName>{manualContent.emergencyName}</ManualName>
              <SpeechButton 
                width={28} 
                height={28} 
                mode="tts" 
                textToSpeak={manualContent.manualDetail} 
               />
            </AccountWrapper>
          </Header>
          <Body>
            <InfoWrapper>
              {manualContent.manualDetail}
            </InfoWrapper>
          </Body>
          <Footer>
            <Base>
              <img src={bar} width="100%" alt="footer_bar" />
            </Base>
            <StyledIcon src={map_icon} alt="map_icon" style={{ marginLeft: "-10rem" }} onClick={goMap} />
            <StyledIcon src={manual_icon} alt="manual_icon" style={{ marginLeft: "-6rem" }} onClick={goManual} />
            <StyledLogoIcon src={logo_icon} alt="logo_icon" />
            <StyledIcon src={chat_icon} alt="chat_icon" style={{ marginLeft: "3.7rem" }} onClick={goChat} />
            <StyledIcon src={my_icon} alt="my_icon" style={{ marginLeft: "8rem", marginTop: "-3.5rem" }} onClick={goMy} />
          </Footer>
        </BodyWrapper>
      </Container>
    </motion.div>
  );
}

// 스타일링
const Header = styled.header`
  .back {
    position: absolute;
    margin-top: 1.3rem;
    margin-left: -10.8rem;
  }
  margin-bottom: 5rem;
`;

const AccountWrapper = styled.div`
  margin-top: 3rem;
  margin-left: 1rem;
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
`;

const ManualName = styled.h1`
  font-size: 1.75rem;
  color: #E60400;
`;

const InfoWrapper = styled(BoxType._10radiux_Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: left;
  width: 333px; 
  height: auto;
  margin-top: 7rem;
  margin-bottom: 6rem;
  font-size: 1rem;
  gap: 3rem;
  background-color: #FFFFFF;
  color: #000000;
  white-space: pre-line;
  line-height: 1.6;
  border: 1px solid #FF4F4D;
  border-radius: 10px;
  box-sizing: border-box;

  &:hover {
    color: #000000;
    background-color: #FFFFFF;
    border-color: #FF4F4D;
  }
`;

const Footer = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  border: none;
  margin: 0;
`;

const Base = styled.div``;

const StyledLogoIcon = styled.img`
  position: absolute;
  width: 4rem;
  margin-left: -1.9rem;
  margin-top: -4.35rem;
`;

const StyledIcon = styled.img`
  position: absolute;
  margin-top: -3.7rem;
`;

export default ManualDetail;