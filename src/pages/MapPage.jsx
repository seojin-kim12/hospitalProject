import { Container, BodyWrapper, Body } from '../styles/Global';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import logo from "../assets/logo.svg";
import bar from "../assets/bottom_bar/bar.svg";
import logo_icon from "../assets/bottom_bar/logo_icon.svg";
import manual_icon from "../assets/bottom_bar/manual_icon.svg";
import map_icon from "../assets/bottom_bar/map_icon.svg";
import chat_icon from "../assets/bottom_bar/chat.svg";
import my_icon from "../assets/bottom_bar/my_icon.svg";
import axios from 'axios';

// 카카오 맵 구현 관련 import
import markerImage from "../assets/map/marker.svg";
import hospitalMarker from "../assets/map/hp_mark.svg";
import { Map, MapMarker } from "react-kakao-maps-sdk";

// 모달 관련 import
import HospitalModal from "../components/Map/HospitalModal";

function MapPage() {

        // get method
        const [datas, setDatas] = useState([]); 
        useEffect(() => {
            const fetchData = async () => {
              try {
                // 로그인에서 저장된 토큰 가져오기
                // const token = localStorage.getItem("token");
                const y=localStorage.getItem("lat");
                const x=localStorage.getItem("lng");
                const token = localStorage.getItem("accessToken");

                const response = await axios.get("http://52.79.245.244/api/v1/map/hospital", {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                    params: {
                      x: x,
                      y: y,
                      categoryName: categoryName,
                    },
                  });
        
                console.log(y);
                console.log(x);
                console.log(categoryName);
                console.log(response.data.hospitals);
                setDatas(response.data.hospitals);
                // console.log(token);
              } catch (error) {
                if (error.response) {
                  // 서버가 응답한 상태 코드가 2xx 범위를 벗어난 경우
                  console.error(
                    "Server responded with a non-2xx status",
                    error.response.status,
                    error.response.data
                  );
                } else if (error.request) {
                  // 요청은 보냈지만 응답을 받지 못한 경우
                  console.error(
                    "No response received from the server. Check your network connection.",
                    error.request
                  );
                } else {
                  // 요청을 보내기 전에 발생한 오류
                  console.error("Error before sending the request", error.message);
                }
          
                // 서버가 응답하지 않았거나 네트워크 오류 발생 시 추가 정보 출력
                console.error("Full Error Object:", error);
              }
            };
          
            fetchData();
          }, []);

    const navigate = useNavigate();
    const [state, setState] = useState({
        center: {
            lat: 37.524877465547, 
            lng: 127.10788678005,
        },
        address: "", 
        errMsg: null,
        isLoading: true,
    });

    const [showMarkerInfo, setShowMarkerInfo] = useState(false); 
        const toggleMarkerInfo = () => {
        setShowMarkerInfo((prev) => !prev);  
    };

    // Geocoder를 통해 위도, 경도를 주소로 변경하기
    const getAddress = (lat, lng) => {
        const geocoder = new window.kakao.maps.services.Geocoder();
    
        geocoder.coord2Address(lng, lat, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const addressName = result[0]?.road_address?.address_name || result[0]?.address?.address_name;
                setState((prev) => ({
                    ...prev,
                    address: addressName || "주소 정보를 가져올 수 없어요.",
                }));
            } else {
                setState((prev) => ({
                    ...prev,
                    address: "주소 정보를 가져올 수 없어요.",
                }));
            }
        });
    };
    

    // 현재 위치를 위도, 경도로 받아온 후, getAddress 함수를 호출하여 위도, 경도를 주소로 변환함
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;

                    localStorage.setItem("lat", latitude);
                    localStorage.setItem("lng", longitude);

                    setState((prev) => ({
                        ...prev,
                        center: {
                            lat: latitude,
                            lng: longitude,
                        },
                        isLoading: false,
                    }));
                    // 위도, 경도를 주소 변환하는 함수 호출
                    getAddress(latitude, longitude); 
                },
                (err) => {
                    setState((prev) => ({
                        ...prev,
                        errMsg: err.message,
                        isLoading: false,
                    }));
                }
            );
        } else {
            setState((prev) => ({
                ...prev,
                errMsg: "현재 위치를 알 수 없어요..",
                isLoading: false,
            }));
        }
    }, []);

    // 모달 창 구현
    const [openModal, setOpenModal] = useState(null); // 모달에 표시할 병원의 인덱스를 저장
    const [selectedHospital, setSelectedHospital] = useState(null); // 선택된 병원의 정보 저장

    // 마커 클릭 시 해당 병원의 정보와 모달 열기
    const toggleModal = (index) => {
        setSelectedHospital(datas[index]); // 클릭한 병원의 데이터를 저장
        setOpenModal(index); // 모달 열기
      };

    // 모달 닫기
    const closeModal = () => {
        setOpenModal(null);
        setSelectedHospital(null); // 모달 닫을 때 정보 초기화
    };

    const goMy = () => navigate("/Mypage");
    const goManual = () => navigate("/Manual");
    const goMap = () => navigate("/MapPage");
    const goChat = () => navigate("/Chat");

    // selectBox 생성
    const selectList = [
        {name: "내과"},
        {name: "외과"},
        {name: "정형외과"},
        {name: "산부인과"},
        {name: "피부과"},
        {name: "이비인후과"},
        {name: "치과"},
        {name: "신경외과"},
        {name: "소아과"},
        {name: "안과"},
        {name: "비뇨기과"},
        {name: "정신건강의학과"},
        {name: "가정의학과"},
        {name: "수의학과"},
    ];

    const categoryName = localStorage.getItem("categoryName") || "진료과 선택";

    const [selected, setSelected] = useState(categoryName);

    const handleSelect = (e) => {
        const selectedValue = e.target.value;
        setSelected(selectedValue);
        localStorage.setItem("categoryName", selectedValue);
        window.location.reload();
      };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Container>
                <BodyWrapper>
                    <Header>
                        <img className="logo" src={logo} alt="logo" />
                    </Header>
                    <Body>
                        <StyledMapContainer>
                            <Map
                                center={state.center}
                                style={{ width: '100%', height: '100%' }}
                                level={3}
                            >
                                {/* 현재 위치 마커 */}
                                {!state.isLoading && (
                                    <MapMarker
                                        position={state.center}
                                        image={{
                                            src: markerImage, 
                                            size: { width: 30, height: 30 },
                                            options: { offset: { x: 20, y: 40 } },
                                        }}
                                        onClick={toggleMarkerInfo}  
                                    >
                                        {showMarkerInfo && (
                                            <div style={{ padding: "5px", color: "#000", whiteSpace: "nowrap", textAlign: "left"  }}>
                                                {state.errMsg || state.address}
                                            </div>
                                        )}
                                    </MapMarker>
                                )}

                                {/* 병원 위치 마커 */}
                                {datas.map((hospital, index) => (
                                    <MapMarker
                                        key={index}
                                        position={{ lat: hospital.y, lng: hospital.x }}
                                        image={{
                                            src: hospitalMarker,
                                            size: { width: 30, height: 30 },
                                            options: { offset: { x: 15, y: 30 } },
                                        }}
                                        onClick={() => toggleModal(index)} // 마커 클릭 시 모달 열기
                                    >
                                        <div style={{ padding: "5px", color: "#000", whiteSpace: "nowrap", textAlign: "left" }}>
                                            {hospital.placeName}
                                        </div>
                                    </MapMarker>
                                ))}
                            </Map>

                            {openModal !== null && selectedHospital && (
                                <HospitalModal 
                                    isOpen={openModal !== null} 
                                    hospital={selectedHospital} 
                                    onClose={closeModal} 
                                />
                            )}

                        </StyledMapContainer>


                        <SelectBox>
                            <select className="department" onChange={handleSelect} value={selected}>
                                <option value="진료과 선택">진료과 선택</option>
                                {selectList.map((item) => (
                                    <option value={item.name} key={item.name}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </SelectBox>

                        {/* 본인의 현재 위치 박스 */}
                        <MyAddress>
                            <p className='title'>현위치</p>
                            <p className='content'>{state.address}</p>
                        </MyAddress>

                        <HospitalBoxes>
                        {datas.map((hospital, index) => (
                            <HospitalBox
                            key={index}
                            onClick={() => toggleModal(index)} // 인덱스 전달
                            style={{ cursor: "pointer" }}
                            >
                            <p className="hospital_name">{hospital.placeName}</p>
                            <p className="hospital_address">{hospital.roadAddressName}</p>
                            </HospitalBox>
                        ))}
                        </HospitalBoxes>

                        {openModal !== null && selectedHospital && (
                            <HospitalModal 
                                isOpen={openModal !== null} 
                                hospital={selectedHospital} 
                                onClose={closeModal} 
                            />
                        )}
                    </Body>
                </BodyWrapper>
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

const StyledMapContainer = styled.div`
    width: 22rem;
    height: 17rem;
    margin-top: 5.5rem;
    border-radius: 8px; 
    overflow: hidden; 
`;

const SelectBox = styled.div`
    margin-top: 1rem;

    .department {
        height: 1.8rem;
        width: 9rem;
        border: 1px solid #FF4F4D;
        background-color: white;
        border-radius: 10px;   
        padding-left : 5px;
        margin-left: 11.5rem;
        outline: none;
    }

`;

const MyAddress = styled.div`
    position: relative;
    margin: auto;
    top: 1rem;
    width: 21rem;
    height: 4.5rem;
    border: 1px solid #FF4F4D;
    background-color: #fff6f6;
    border-radius: 10px;

    .title {
        margin-left: -16rem;
        margin-top: 0.7rem;
        color: #FF4F4D;
        font-weight: bold;
    }
    .content {
        text-align: left;
        margin-top: -0.4rem;
        margin-left: 1.2rem;
        font-size: 16px;
    }
`;

const HospitalBoxes = styled.div`
    margin-top: 2rem;
    margin-bottom: 5.5rem;
    margin-left: 0.44rem;
`;

const HospitalBox = styled.div`
  margin-bottom: 1.1rem;
  position: relative;
  width: 21rem;
  height: 4.5rem;
  border: 1px solid #FF4F4D;
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

  .hospital_name {
    text-align: left;
    margin-left: 1rem;
    margin-top: 0.8rem;
    color: #FF4F4D;
    font-weight: bold;
    font-size: 17.5px;
  }

  .hospital_address {
    text-align: left;
    font-size: 15px;
    margin-top: -0.7rem;
    margin-left: 1rem;
  }
`;

export default MapPage;