import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import Theme from "../utils/Theme";
import { useUser } from "../context/UserContext";

import Avatar from "./Avatar";
import Text from "./Text";

type ImageProps = {
  $isActive: boolean;
  [key: string]: any;
};

type NavbarProps = {
  isLogged?: boolean;
  onLogout?: () => void;
};

const Container = styled.nav`
  height: 100dvh;
  width: max-content;
  padding: 32px 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Image = styled.img<ImageProps>`
  ${({ theme: { colors }, $isActive }) => `
    background-color: ${$isActive ? colors.secondary : colors.primary40};
    border-radius: ${$isActive ? "16px" : "100%"};

    &:hover {
      border-radius: 16px;
      background-color: ${colors.secondary} !important;
    }
  `}

  cursor: pointer;
  padding: 8px;
  transition: all 0.2s ease-in-out;
`;

const FakeAvatar = styled(Text)`
  ${({ theme: { colors } }) => `
    background-color: ${colors.primary40};
  `}

  cursor: default;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  width: 48px;
  height: 48px;
  padding: 8px;
`;

const Navbar = ({ isLogged, onLogout }: NavbarProps) => {
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const isAuthPage = location.pathname === "/auth";

  return (
    <Container>
      <Image
        src={`${process.env.PUBLIC_URL}/assets/icons/logo.svg`}
        alt=""
        width={48}
        height={48}
        $isActive={isHomePage}
        style={{
          background:
            isHomePage || isLogged
              ? Theme.colors.secondary
              : Theme.colors.primary40,
        }}
        onClick={() => navigate("/")}
      />

      {user && user.username && (
        <FakeAvatar
          fontFamily="Space Grotesk"
          fontSize="font20"
          fontWeight={600}
          style={{}}
        >
          {user.username[0]}
        </FakeAvatar>
      )}

      {isLogged ? (
        <Avatar
          icon="logout"
          isActive={location.pathname === "/auth"}
          style={{ marginTop: "auto", cursor: "pointer" }}
          onClick={onLogout}
        />
      ) : (
        <a href="/auth" style={{ marginTop: "auto" }}>
          <Avatar isActive={isAuthPage} />
        </a>
      )}
    </Container>
  );
};

export default Navbar;
