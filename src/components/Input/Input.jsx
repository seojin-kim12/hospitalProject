import React from 'react';
import styled from 'styled-components';

const InputField = styled.input`
  border: none;  
  border-bottom: 1px solid ${(props) => props.borderColor || '#0000004D'};  
  background-color: transparent;
  width: ${(props) => props.width || '333px'};
  height: ${(props) => props.height || '93px'};
  font-size: 1rem;
  outline: none;
  color: ${(props) => props.textColor || '#000000'}; 

  &::placeholder {
    color: ${(props) => props.placeholderColor || '#0000004D'};
  }

  &:focus {
    border-bottom-color: ${(props) => props.focusColor || '#FF4F4D'}; 
  }
`;

const Input = ({
  id,
  placeholder,
  width,
  height,
  textColor,
  placeholderColor,
  $borderColor,
  focusColor,
  value,
  onChange,
  type = 'text',
}) => {
  return (
    <InputField 
      id={id} 
      width={width} 
      height={height} 
      textColor={textColor}  
      placeholderColor={placeholderColor} 
      borderColor={$borderColor} 
      focusColor={focusColor} 
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      type={type}
    />
  );
};

export default Input;
