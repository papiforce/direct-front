import { ReactNode, useEffect, useState, memo } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import Theme from "../utils/Theme";
import authService from "../api/AuthService";
import userService from "../api/UserService";
import { User } from "../types";

import Navbar from "./Navbar";
import useWindowSize from "../utils/useWindowSize";
import NotForMobile from "./NotForMobile";
import UsersWrapper from "./UsersWrapper";

type LayoutType = {
  children: ReactNode;
};

const Container = styled.div`
  ${({ theme: { screens } }) => `
    max-width: ${screens.desktop}px;
  `}

  width: 100vw;
  min-height: 100dvh;
  margin: 0 auto;
  display: flex;
`;

const ContentWrapper = styled.main`
  ${({ theme: { colors } }) => `
    background-color: ${colors.primary60};
  `}

  display: flex;
  gap: 12px;
  width: 100%;
  height: 100dvh;
  padding: 8px;
`;

const MemoizedUsersWrapper = memo(UsersWrapper);

const Layout = ({ children }: LayoutType) => {
  const { width } = useWindowSize();
  const isMobile = width < Theme.screens.tablet;
  const navigate = useNavigate();

  const isLogged = authService.isAuthenticated();
  const whiteList = ["/"];
  const authenticatedBlackList = ["/auth"];

  const [users, setUsers] = useState<User[] | []>([]);

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  useEffect(() => {
    if (!isLogged && !whiteList.includes(window.location.pathname)) {
      navigate("/auth", { replace: true });
    }

    if (isLogged && authenticatedBlackList.includes(window.location.pathname)) {
      navigate("/", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, isLogged]);

  useEffect(() => {
    if (isLogged) {
      const fetchUsers = async () => {
        try {
          const fetchedUsers = await userService.getAllUsers();

          return setUsers(fetchedUsers);
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des utilisateurs:",
            error
          );
        }
      };
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isMobile) {
    return <NotForMobile />;
  }

  return (
    <Container>
      <Navbar isLogged={isLogged} onLogout={handleLogout} />
      <ContentWrapper>
        <MemoizedUsersWrapper isLogged={isLogged} users={users} />
        {children}
      </ContentWrapper>
    </Container>
  );
};

export default Layout;
