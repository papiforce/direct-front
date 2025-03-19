import { CSSProperties, useState } from "react";
import styled from "styled-components";

import { useUser } from "../context/UserContext";
import Theme from "../utils/Theme";

import Text from "./Text";
import Image from "./Image";

type MessageProps = {
  id: number;
  username: string;
  message: string;
  date: string;
  image?: string;
  isLiked: boolean;
  onToggleLike: (id: number) => void;
  style?: CSSProperties;
};

const Container = styled.div`
  ${({ theme: { colors } }) => `
    &:hover {
      background-color: ${colors.primary80};
    }
  `}

  position: relative;
  padding: 8px 16px;
  border-radius: 4px;
`;

const Wrapper = styled.div`
  display: flex;
  gap: 12px;
`;

const FakeAvatar = styled(Text)`
  ${({ theme: { colors } }) => `
    background-color: ${colors.primary40};
  `}

  min-height: 40px;
  min-width: 40px;
  max-width: 40px;
  max-height: 40px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Heart = styled.img`
  cursor: pointer;
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
`;

const MessageImage = styled(Image)`
  border-radius: 8px;
  margin: 12px auto 4px;
`;

const LikedHeartWrapper = styled.div`
  ${({ theme: { colors } }) => `
    background-color: ${colors.primary};
  `}

  margin: 4px 0 0 52px;
  width: max-content;
  height: 24px;
  padding: 4px 8px;
  border-radius: 4px;
`;

const Message = ({
  id,
  username,
  message,
  date,
  image,
  isLiked,
  style,
  onToggleLike,
}: MessageProps) => {
  const { user } = useUser();

  const [isHovered, setIsHovered] = useState<boolean>(false);

  const isUserMessage = user?.username === username;

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today.getTime() - 86400000);

    const optionsHeure = {
      hour: "2-digit",
      minute: "2-digit",
    };

    const optionsDate = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };

    if (date.toDateString() === today.toDateString()) {
      return `Aujourd'hui à ${date.toLocaleTimeString(
        "fr-FR",
        optionsHeure as any
      )}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Hier à ${date.toLocaleTimeString("fr-FR", optionsHeure as any)}`;
    } else {
      return `${date.toLocaleDateString(
        "fr-FR",
        optionsDate as any
      )} à ${date.toLocaleTimeString("fr-FR", optionsHeure as any)}`;
    }
  };

  return (
    <Container
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Wrapper>
        <FakeAvatar fontFamily="Space Grotesk" fontSize="font24">
          {username[0]}
        </FakeAvatar>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <Text
            fontFamily="Space Grotesk"
            fontSize="font14"
            style={{ display: "flex", alignItems: "end", gap: 8 }}
          >
            {username}
            <Text as="span" fontSize="font12" fontWeight={600} color="green">
              {formatDate(date)}
            </Text>
          </Text>

          {image && (
            <MessageImage
              src={`${process.env.REACT_APP_API_URL}/images/${image}`}
              alt=""
              width={300}
              height={180}
            />
          )}

          <Text
            fontSize={image ? "font14" : "font16"}
            fontWeight={image ? 600 : 500}
            color="white"
            style={{
              borderLeft: image
                ? `4px solid ${Theme.colors.secondary}`
                : "none",
              paddingLeft: image ? 8 : 0,
            }}
          >
            {message}
          </Text>
        </div>

        {isHovered && !isUserMessage && !isLiked && (
          <Heart
            src={`${process.env.PUBLIC_URL}/assets/icons/heart.svg`}
            alt=""
            onClick={() => onToggleLike(id)}
          />
        )}
      </Wrapper>

      {isLiked && (
        <LikedHeartWrapper
          onClick={() => {
            if (isUserMessage) return;

            onToggleLike(id);
          }}
          style={{ cursor: isUserMessage ? "default" : "pointer" }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/assets/icons/red-heart.svg`}
            alt=""
            width={16}
            height={16}
          />
        </LikedHeartWrapper>
      )}
    </Container>
  );
};

export default Message;
