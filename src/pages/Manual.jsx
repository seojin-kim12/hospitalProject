import { Container, BodyWrapper, Body } from '../styles/Global';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React from 'react';
import styled from "styled-components";
import logo from "../assets/logo.svg";
import bar from "../assets/bottom_bar/bar.svg";
import logo_icon from "../assets/bottom_bar/logo_icon.svg";
import manual_icon from "../assets/bottom_bar/manual_icon.svg";
import map_icon from "../assets/bottom_bar/map_icon.svg";
import chat_icon from "../assets/bottom_bar/chat.svg";
import my_icon from "../assets/bottom_bar/my_icon.svg";

function Manual() {
    const navigate = useNavigate();

    const goMy = () => {
      navigate("/Mypage");
    };

    const goManual = () => {
        navigate("/Manual");
      };

    const goMap = () => {
        navigate("/");
    };  

    const goChat = () => {
        navigate("/Chat");
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Container>
                <BodyWrapper>
                    <Header>
                        <img className="logo" src={logo} alt="logo" />
                    </Header>
                    <Body>
                    </Body>
                </BodyWrapper>
                <Footer>
                    <Base>
                        <img
                            src={bar}
                            width="100%"
                            alt="footer_bar"
                        />
                    </Base>
                        <StyledIcon src={map_icon} alt="map_icon" style={{marginLeft: "-10rem"}} onClick={goMap}/>
                        <StyledIcon src={manual_icon} alt="manual_icon" style={{marginLeft: "-6rem"}} onClick={goManual}/>
                        <StyledLogoIcon src={logo_icon} alt="logo_icon" /> 
                        <StyledIcon src={chat_icon} alt="chat_icon" style={{marginLeft: "3.7rem"}} onClick={goChat}/>
                        <StyledIcon src={my_icon} alt="my_icon" style={{marginLeft: "8rem", marginTop: "-3.5rem"}} onClick={goMy}/>
                </Footer>
            </Container>
        </motion.div>
    );
};

const Header = styled.header`
    .logo {
        position: absolute;
        margin-top: 1.3rem;
        margin-left: -10.8rem;
    }
`;

const Footer = styled.div`
  position: absolute;
  left: 0rem;
  bottom: 0;
  border: none;
  margin: 0;
`;

const Base = styled.div``;

// logo icon만 변경하고 싶어서 styled-component 설정해줌
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


export default Manual;