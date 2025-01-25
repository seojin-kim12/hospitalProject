import React, { useState } from 'react';
import { ReactComponent as EditIcon } from '../../assets/input/edit.svg'; 
import styled from 'styled-components';
import { BoxType } from '../Box/BoxType'; 

const InputBoxContainer = styled.div`
  display: flex;
  flex-direction: column;  
  align-items: flex-start;  
  height: ${(props) => props.height || 'auto'};
`;

const InputName = styled.p`
  text-align: left;  
  margin-left: 0.5rem;
  margin-top: 0.5rem;  
  margin-bottom: 0.25rem;
  font-size: 1rem;
  width: 100%;
`;

const InputContainer = styled(BoxType._10radiux_Box)`
  background-color: #FF4F4D1A;
  border: 1px solid #FF4F4D;

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
  cursor: ${(props) => (props.readOnly ? 'not-allowed' : 'auto')};
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  height: ${(props) => props.height || '30px'};
`;

function InputBox({
  id,
  width,
  height,
  label,
  value = '',             
}) {
  const [isEditable, setIsEditable] = useState(false);

  const handleIconClick = () => {
    setIsEditable((prevState) => !prevState);
  };

  return (
    <InputBoxContainer height={height}>
      <InputName>{label}</InputName>
      <InputContainer width={width} height={height}>
        <InputField 
          id={id}
          type="text"
          placeholder=""
          height={height}
          readOnly={!isEditable}
          value={value}         
        />
        <IconWrapper onClick={handleIconClick} height={height}>
          <EditIcon style={{ width: 15, height: 15 }} />
        </IconWrapper>
      </InputContainer>
    </InputBoxContainer>
  );
}

export default InputBox;
