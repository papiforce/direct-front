import { useRef, useEffect, CSSProperties } from "react";
import styled from "styled-components";

type TextAreaProps = {
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: any) => void;
  style?: CSSProperties;
  [key: string]: any;
};

const Template = styled.textarea`
  ${({ theme: { colors } }) => `
    background-color: ${colors.primary40};
    color: ${colors.white};
  `}

  width: 100%;
  min-height: 44px;
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

const TextArea = ({
  name,
  placeholder,
  value,
  onChange,
  style,
  ...props
}: TextAreaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <Template
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={(e: any) => {
        if (onChange) {
          onChange(e);
        }
      }}
      style={style}
      ref={textareaRef}
      {...props}
    />
  );
};

export default TextArea;
