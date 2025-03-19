import { CSSProperties } from "react";
import styled from "styled-components";

type ImageProps = {
  $isActive: boolean;
  [key: string]: any;
};

type AvatarProps = {
  icon?: string;
  isActive: boolean;
  style?: CSSProperties;
  [key: string]: any;
};

const Image = styled.img<ImageProps>`
  ${({ theme: { colors }, $isActive }) => `
    background-color: ${$isActive ? colors.primary60 : colors.primary40};
    border-radius: ${$isActive ? "100%" : "16px"};

    &:hover {
      border-radius: 100%;
      background-color: ${colors.primary60} !important;
    }
  `}

  transition: all .2s;
  height: 48px;
  width: 48px;
  padding: 8px;
`;

const Avatar = ({ icon = "user", isActive, style, ...props }: AvatarProps) => {
  return (
    <Image
      src={`${process.env.PUBLIC_URL}/assets/icons/${icon}.svg`}
      alt=""
      style={style}
      $isActive={isActive}
      {...props}
    />
  );
};

export default Avatar;
