import React, { useState } from 'react';
import { ReactComponent as MagnifyingGlassIcon } from '../../assets/search/magnifying_glass.svg';
import styled from 'styled-components';
import { BoxType } from '../Box/BoxType.js';
import SpeechButton from '../Button/SpeechButton';
import axios from 'axios';

const SearchBarContainer = styled(BoxType._4radiux_Box)`
  background-color: #FF4F4D1A;
  border: 1px solid #FF4F4D1A;
  box-sizing: border-box;

  &:hover {
    background-color: #FF4F4D1A;
    border-color: #FF4F4D;
  }
`;

const InputField = styled.input`
  border: none;
  background-color: transparent;
  flex-grow: 1;
  padding: 5px;
  font-size: 14px;
  outline: none;
  height: ${(props) => props.height || '30px'};
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: default;
  height: ${(props) => props.height || '30px'};
`;

function SearchBar({ width, height, onSearchResults }) {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);  // 음성 인식 상태 관리

  // 검색 API 호출 함수
  const fetchSearchResults = async () => {
    if (!searchText.trim()) {
      alert('검색어를 입력하세요.');
      return;
    }

    setLoading(true);
    const accessToken = localStorage.getItem('accessToken');

    console.log('요청한 텍스트:', searchText);  // 검색 요청 텍스트 로그 출력

    try {
      const response = await axios.get(`http://52.79.245.244/api/v1/manual/search`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          keyword: searchText,  // 'keyword'로만 검색어 전송
        },
      });

      console.log('검색 결과:', response.data);
      onSearchResults(response.data);  // 부모 컴포넌트로 결과 전달
    } catch (error) {
      console.error('검색 실패:', error.response?.data || error.message);
      alert('검색 결과를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 음성 인식 완료 시 호출
  const handleSpeechRecognized = (text) => {
    setSearchText(text);
  };

  // 음성 인식 시작 및 종료 시 상태 변경
  const handleListeningStateChange = (listening) => {
    setIsListening(listening); // 음성 인식 시작/종료 상태 변경
  };

  // Enter 키 눌렀을 때 검색 실행
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchSearchResults();
    }
  };

  return (
    <SearchBarContainer width={width} height={height}>
      <IconWrapper height={height}>
        <MagnifyingGlassIcon width={15} height={15} />
      </IconWrapper>
      <InputField
        id="search"
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={handleKeyDown}
        height={height}
        disabled={loading}
      />
      <IconWrapper height={height}>
        <SpeechButton 
          mode="stt" 
          onRecognized={handleSpeechRecognized} 
          width={15} 
          height={15} 
          onListeningChange={handleListeningStateChange} 
          isListening={isListening}  
        />
      </IconWrapper>
    </SearchBarContainer>
  );
}

export default SearchBar;
