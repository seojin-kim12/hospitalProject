import React, { useState, useEffect, useCallback } from 'react';
import styled from "styled-components";
import { Container, BodyWrapper, Body } from '../styles/Global';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import bar from "../assets/bottom_bar/bar.svg";
import logo_icon from "../assets/bottom_bar/logo_icon.svg";
import manual_icon from "../assets/bottom_bar/manual_icon.svg";
import map_icon from "../assets/bottom_bar/map_icon.svg";
import chat_icon from "../assets/bottom_bar/chat.svg";
import my_icon from "../assets/bottom_bar/my_icon.svg";
import SearchBar from '../components/SearchBar/SearchBar';
import ManualBox from '../components/Box/ManualBox';
import axios from 'axios';

function Manual() {
  const [activeTab, setActiveTab] = useState('all');
  const [manualContent, setManualContent] = useState([]);
  const navigate = useNavigate();

  const goMy = () => navigate("/Mypage");
  const goManual = () => navigate("/Manual");
  const goMap = () => navigate("/MapPage"); 
  const goChat = () => navigate("/Chat");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSearchResults = (data) => {
    // 데이터를 추가하는 방식으로 상태를 업데이트
    const normalizedData = normalizeManualContent(data);
    setManualContent(normalizedData);  // 검색 결과를 상태에 저장
  };

  const normalizeManualContent = (data) => {
    return data.map(item => ({
      emergencyImage: item.emergencyImage, 
      emergencyName: item.emergencyName,
      summary: item.manualSummaries || item.emergencyResponseSummary,  // 공통된 변수명 사용
    }));
  };

  const fetchManualData = useCallback(async () => {
    const accessToken = localStorage.getItem('accessToken');
    const categoryMapping = {
      'all': '1. 기본',
      'general': '1. 기본',
      'situational': '2. 상황별',
      'medical': '3. 의학적',
      'traumatic': '5. 외상성'
    };
    
    const categoryValue = categoryMapping[activeTab];

    console.log("API 요청 시작");
    console.log(`요청 URL: http://52.79.245.244/api/v1/manual/getCategory`);
    console.log(`요청 헤더: Authorization: Bearer ${accessToken}`);
    console.log(`요청 파라미터:`, { Category: categoryValue, category: categoryValue });

    try {
      const response = await axios.get(
        `http://52.79.245.244/api/v1/manual/getCategory`, 
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            Category: categoryValue,
            category: categoryValue
          },
          paramsSerializer: params => {
            return Object.keys(params)
              .map(key => `${key}=${encodeURIComponent(params[key])}`)
              .join('&');
          }
        }
      );
      console.log("API 응답 성공", response.data);
      const normalizedData = normalizeManualContent(response.data); // 응답 받은 데이터를 통합된 구조로 변환
      setManualContent(normalizedData);  
    } catch (error) {
      console.error('API 요청 실패:', error.response?.data || error.message);
    } finally {
      console.log("API 요청 종료");
    }
  }, [activeTab]);

  useEffect(() => {
    fetchManualData();
  }, [fetchManualData]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Container>
        <BodyWrapper>
          <Header>
            <img className="logo" src={logo} alt="logo" />
          </Header>
          <Body>
            <SearchArea>
              <SearchBar onSearchResults={handleSearchResults} />
            </SearchArea>
            <TabContainer>
              <Tab $active={activeTab === 'all'} onClick={() => handleTabClick('all')}>전체</Tab>
              <Tab $active={activeTab === 'general'} onClick={() => handleTabClick('general')}>기본</Tab>
              <Tab $active={activeTab === 'situational'} onClick={() => handleTabClick('situational')}>상황별</Tab>
              <Tab $active={activeTab === 'medical'} onClick={() => handleTabClick('medical')}>의학적</Tab>
              <Tab $active={activeTab === 'traumatic'} onClick={() => handleTabClick('traumatic')}>외상성</Tab>
            </TabContainer>
            <Content>
              {manualContent.length > 0 ? (
                <CardWrapper>
                  {manualContent.map((item, index) => (
                    <ManualBox key={index} thumbnail={item.emergencyImage} title={item.emergencyName} summary={item.summary} emergencyName={item.emergencyName}/>
                  ))}
                </CardWrapper>
              ) : (
                <div>로딩 중...</div>
              )}
            </Content>
          </Body>
        </BodyWrapper>
      </Container>
    </motion.div>
  );
}

// 스타일링
const Header = styled.header`
  position: relative;
  .logo {
    position: absolute;
    margin-top: 1.3rem;
    margin-left: -10.8rem;
  }
`;

const SearchArea = styled.div`
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 2px solid #FF4F4D;
  margin-bottom: 20px;
  justify-content: space-between;
`;

const Tab = styled.div`
  padding-top: 20px;
  padding-bottom: 10px;
  cursor: pointer;
  font-weight: ${(props) => (props.$active ? 'bold' : 'normal')};
  color: ${(props) => (props.$active ? '#FF4F4D' : '#000000')};
  transition: all 0.3s;
  text-align: center; 
  flex-grow: 1; 
`;

const Content = styled.div`
  margin: 20px 0px;
  font-size: 16px;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;  
`;

export default Manual;