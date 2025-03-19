import styled from "styled-components";
import { HTMLAttributes } from "react";

interface TemplateProps {
  $width?: number;
  $height?: number;
  $borderRadius?: string;
}

const Template = styled.img<TemplateProps>`
  ${({ $width, $height, $borderRadius }) => `
    max-height: ${$height ? `${$height}px` : "100%"};
    max-width: ${$width ? `${$width}px` : "100%"};
    border-radius: ${$borderRadius || 0};
  `}

  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

interface ImageProps extends HTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: "eager" | "lazy" | undefined;
  borderRadius?: string;
}

const Image = ({
  src,
  alt,
  width,
  height,
  loading = "eager",
  borderRadius,
  ...props
}: ImageProps) => {
  return (
    <Template
      src={src}
      alt={alt}
      $width={width}
      $height={height}
      $borderRadius={borderRadius}
      loading={loading}
      {...props}
    />
  );
};

export default Image;
