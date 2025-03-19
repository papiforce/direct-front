import { CSSProperties, memo, ReactNode } from "react";
import styled from "styled-components";

import Theme from "../utils/Theme";

type TemplateProps = {
  $fontFamily: string;
  $fontSize: keyof typeof Theme.fontSize;
  $fontWeight: number;
  $color: keyof typeof Theme.colors;
  $textAlign: string;
  $isEllipsis: boolean;
  $lineHeight?: string;
  $lineClamp: number;
  theme?: typeof Theme;
};

type TextProps = {
  fontFamily?: string;
  fontSize?: keyof typeof Theme.fontSize;
  fontWeight?: number;
  color?: keyof typeof Theme.colors;
  textAlign?: "left" | "center" | "right" | "justify";
  isEllipsis?: boolean;
  lineHeight?: string;
  style?: CSSProperties;
  children?: ReactNode;
  lineClamp?: number;
  withLines?: boolean;
  [key: string]: any;
};

const Template = styled.div<TemplateProps>`
  ${({
    theme: { fontSize, colors },
    $fontFamily,
    $fontSize,
    $fontWeight,
    $color,
    $textAlign,
    $isEllipsis,
    $lineHeight,
    $lineClamp,
  }) => `
			font-family: ${$fontFamily}, sans-serif;
			font-size: ${fontSize[$fontSize]};
			font-weight: ${$fontWeight};
			color: ${colors[$color]};
			text-align: ${$textAlign};
			line-height: ${
        $lineHeight ? $lineHeight : `calc(${fontSize[$fontSize]} + 8px)`
      };
			white-space: ${$isEllipsis ? "nowrap" : "normal"};
			overflow: ${$isEllipsis ? "hidden" : "unset"};
			text-overflow: ${$isEllipsis ? "ellipsis" : "unset"};
      -webkit-line-clamp: ${$lineClamp};
		`}
`;

const Text = ({
  fontFamily = "Montserrat",
  fontSize = "font16",
  fontWeight = 500,
  color = "white",
  textAlign = "left",
  isEllipsis = false,
  lineHeight,
  style,
  children,
  lineClamp = 1,
  withLines = false,
  as = "p",
  ...props
}: TextProps) => {
  return (
    <Template
      $fontFamily={fontFamily}
      $fontSize={fontSize}
      $fontWeight={fontWeight}
      $color={color}
      $textAlign={textAlign}
      $isEllipsis={isEllipsis}
      $lineHeight={lineHeight}
      $lineClamp={lineClamp}
      as={as}
      style={style}
      {...props}
    >
      {children}
    </Template>
  );
};

export default memo(Text);
