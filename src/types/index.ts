type Screens = {
  smallMobile: number;
  mobile: number;
  tablet: number;
  smallDesktop: number;
  desktop: number;
  maxDesktop: number;
};

type FontSize = {
  font12: string;
  font14: string;
  font16: string;
  font18: string;
  font20: string;
  font24: string;
  from24to20: string;
  from34to24: string;
};

type Colors = {
  primary: string;
  primary80: string;
  primary60: string;
  primary40: string;
  secondary: string;
  white: string;
  black: string;
  grey: string;
  green: string;
  orange: string;
  red: string;
};

export type ThemeType = {
  screens: Screens;
  fontSize: FontSize;
  colors: Colors;
};

export type User = {
  id: number;
  token: string;
  username?: string;
  roles?: string[];
  [key: string]: any;
};

export type AuthResponse = {
  success: boolean;
  data?: any;
  error?: string;
};
