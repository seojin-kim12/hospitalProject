import styled from "styled-components";

export const BoxType = {
  _4radiux_Box: styled.div`
    display: flex;
    align-items: center;
    background-color: ${(props) => props.backgroundColor || 'transparent'};
    border: 1px solid ${(props) => props.borderColor || '#FF4F4D'};
    border-radius: 4px;
    padding: 5px 15px;
    width: ${(props) => props.width || '337px'};
    height: ${(props) => props.height || '37px'};
    font-size: 1.25rem;
    
    &:hover {
      background-color: ${(props) => props.hoverBackgroundColor || '#FF4F4D80'};
      border-color: ${(props) => props.hoverBorderColor || '#FF4F4D80'};
    }
  `,

  _10radiux_Box: styled.div`
    display: flex;
    align-items: center;
    background-color: ${(props) => props.backgroundColor || 'transparent'};
    border: 1px solid ${(props) => props.borderColor || '#FF4F4D'};
    border-radius: 10px;
    padding: 5px 15px;
    width: ${(props) => props.width || '333px'};
    height: ${(props) => props.height || '93px'};
    font-weight: bold;
  `
};