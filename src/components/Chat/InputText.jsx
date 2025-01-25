import React from "react";
import styled from "styled-components";
import BoxComponent from "./BoxComponent";

const InputComponent = styled(BoxComponent)`
  padding: 10px 16px;
  width: 100%;
  height: 52px;
  font-size: 1em;
  line-height: 1;
  border: 2px solid #FF4F4D;
  color: #FF4F4D;
  border-radius: 20px;
  box-sizing: border-box;
  padding-left: 45px;
  padding-right: 55px;
`;

const InputText = ({ placeholder, onChange, value, ...props }) => {
  return (
    <InputComponent
      as="input"
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
};

export default InputText;