import { CSSProperties } from "react";
import styled from "styled-components";

import Text from "./Text";

type InputProps = {
  name?: string;
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (event: any) => void;
  style?: CSSProperties;
  [key: string]: any;
};

const Container = styled.div``;

const Template = styled.input`
  ${({ theme: { colors } }) => `
    background-color: ${colors.primary40};
    color: ${colors.white};
  `}

  width: 100%;
  height: 44px;
  max-height: 160px;
  padding: 12px 16px;
  outline: none;
  border: 0;
  border-radius: 8px;
  font-family: Montserrat, sans-serif;
  font-weight: 500;
  font-size: 14px;
  resize: none;
`;

const Input = ({
  name,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  style,
  ...props
}: InputProps) => {
  return (
    <Container style={style}>
      {label && (
        <Text fontSize="font12" fontWeight={600}>
          {label}
        </Text>
      )}
      <Template
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={value}
        onChange={(e: any) => {
          if (onChange) {
            onChange(e);
          }
        }}
        {...props}
      />
    </Container>
  );
};

export default Input;
