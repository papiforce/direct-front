import { ThemeType } from "../types";

const Theme: ThemeType = {
  screens: {
    smallMobile: 375,
    mobile: 480,
    tablet: 768,
    smallDesktop: 1024,
    desktop: 1280,
    maxDesktop: 1440,
  },
  fontSize: {
    font12: "12px",
    font14: "14px",
    font16: "16px",
    font18: "18px",
    font20: "20px",
    font24: "24px",
    from24to20: "clamp(1.25rem, 1vw + 0.9rem, 1.5rem)",
    from34to24: "clamp(1.5rem, 2vw + 0.7rem, 1.875rem)",
  },
  colors: {
    primary: "#1e2124",
    primary80: "#282b30",
    primary60: "#36393e",
    primary40: "#424549",
    secondary: "#0047AB",
    white: "#FFFFFF",
    black: "#000000",
    grey: "#6b7280",
    green: "#1DB954",
    orange: "#FF7F00",
    red: "#880808",
  },
};

export default Theme;
