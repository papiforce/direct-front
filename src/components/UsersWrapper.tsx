import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import Theme from "../utils/Theme";
import { User } from "../types";
import conversationService from "../api/ConversationService";

import Text from "./Text";

type UsersWrapperProps = {
  isLogged?: boolean;
  users?: User[];
};

const Container = styled.div`
  ${({ theme: { colors } }) => `
    background-color: ${colors.primary80};
  `}

  display: flex;
  flex-direction: column;
  border-radius: 16px;
  padding: 16px 8px;
  width: 100%;
  max-width: 200px;
`;

const Line = styled.hr`
  ${({ theme: { colors } }) => `
    border-color: ${colors.grey};
  `}

  margin: 12px 0;
`;

const UsersWrapper = ({ isLogged, users }: UsersWrapperProps) => {
  const navigate = useNavigate();

  const handleUserClick = async (userId: number) => {
    try {
      const { conversation } = await conversationService.createConversation(
        userId
      );

      if (conversation) {
        return navigate(`/conversation/${conversation.id}`);
      }
    } catch (error) {
      console.error("Erreur lors de la création de la conversation:", error);
    }
  };

  if (!isLogged) {
    return (
      <Container>
        <Text
          fontSize="font14"
          textAlign="center"
          style={{
            borderRadius: 8,
            margin: "auto",
          }}
        >
          Connectez-vous pour voir les utilisateurs
        </Text>
      </Container>
    );
  }

  return (
    <Container>
      <Text
        as="h2"
        fontFamily="Space Grotesk"
        fontWeight={600}
        textAlign="center"
      >
        Utilisateurs
      </Text>

      <Line />

      {users &&
        users.map((user, index: number) => (
          <Text
            key={`${user.username}-${index}`}
            fontSize="font14"
            textAlign="center"
            style={{
              padding: "8px 12px",
              backgroundColor: Theme.colors.primary40,
              borderRadius: 8,
              cursor: "pointer",
            }}
            onClick={() => handleUserClick(user.id)}
          >
            {user.username}
          </Text>
        ))}
    </Container>
  );
};

export default UsersWrapper;
