import { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import Message from "./Message";
import TextArea from "./TextArea";
import Text from "./Text";
import Image from "./Image";

type ChatProps = {
  typeOfChanges: "NEW" | "UPDATE";
  isLoading: boolean;
  messages: any[];
  onSendMessage: (content: string, image?: string) => void;
  onToggleLike: (id: number) => void;
};

type InputsContainerProps = {
  $hasImage: boolean;
};

const Container = styled.div`
  width: 100%;
  max-width: 700px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 12px;
  margin: 0 auto;
`;

const MessagesWrapper = styled.div`
  ${({ theme: { colors } }) => `
    &::-webkit-scrollbar-thumb {
    background: ${colors.primary80};
    border-radius: 8px;
  }

    &::-webkit-scrollbar-thumb:hover {
      background: ${colors.primary};
    }

    &::-webkit-scrollbar-track {
      background: ${colors.primary40};
      border-radius: 8px;
    }
  `}

  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin: 24px auto 0;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
`;

const InputsContainer = styled.div<InputsContainerProps>`
  ${({ theme: { colors }, $hasImage }) => `
    background-color: ${$hasImage ? colors.primary : "transparent"};
  `}

  padding: 8px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InputsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TrashIcon = styled.img`
  ${({ theme: { colors } }) => `
    background-color: ${colors.primary60};
  `}

  position: absolute;
  cursor: pointer;
  top: 4px;
  right: 4px;
  width: 30px;
  height: 30px;
  padding: 8px;
  border-radius: 8px;
`;

const Chat = ({
  typeOfChanges,
  isLoading,
  messages,
  onSendMessage,
  onToggleLike,
}: ChatProps) => {
  const [text, setText] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const messagesWrapperRef = useRef<HTMLDivElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = () => {
        setImage(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    const savedText = text;

    setText("");

    if (image) {
      onSendMessage(savedText, image);

      if (inputFileRef && inputFileRef.current) {
        inputFileRef.current.value = "";
      }

      return setImage(null);
    }

    if (text === "") return;

    return onSendMessage(savedText);
  };

  const scrollToBottom = () => {
    if (messagesWrapperRef.current) {
      setTimeout(() => {
        if (messagesWrapperRef.current) {
          messagesWrapperRef.current.scrollTop =
            messagesWrapperRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  useEffect(() => {
    if (typeOfChanges === "NEW") {
      scrollToBottom();
    }
  }, [typeOfChanges, messages.length]);

  return (
    <Container>
      <MessagesWrapper ref={messagesWrapperRef}>
        {isLoading ? (
          <Text
            fontFamily="SpaceGrotesk"
            fontSize="font14"
            fontWeight={600}
            textAlign="center"
            color="orange"
            style={{ margin: "0 auto 56px" }}
          >
            Chargement de la conversation...
          </Text>
        ) : (
          messages.map((message: any, index: number) => {
            const isToday = (dateString: string) => {
              const messageDate = new Date(dateString);
              const today = new Date();
              return (
                messageDate.getDate() === today.getDate() &&
                messageDate.getMonth() === today.getMonth() &&
                messageDate.getFullYear() === today.getFullYear()
              );
            };

            const isFirstMessageOfToday = () => {
              if (isToday(message.createdAt.date)) {
                if (index === 0) return true;

                const previousMessage = messages[index - 1];
                return !isToday(previousMessage.createdAt.date);
              }
              return false;
            };

            if (isFirstMessageOfToday()) {
              return (
                <div
                  key={`${message.author.username}-${message.content}-${index}`}
                >
                  <Text
                    fontFamily="SpaceGrotesk"
                    fontSize="font14"
                    fontWeight={600}
                    textAlign="center"
                    color="orange"
                    style={{ marginBottom: 16 }}
                  >
                    Aujourd'hui
                  </Text>

                  <Message
                    id={message.id}
                    username={message.author.username}
                    message={message.content}
                    date={message.createdAt.date}
                    image={message.image}
                    isLiked={message.isLiked}
                    onToggleLike={onToggleLike}
                    style={{
                      marginBottom: index === messages.length - 1 ? 0 : 16,
                    }}
                  />
                </div>
              );
            }

            return (
              <Message
                key={`${message.author.username}-${message.content}-${index}`}
                id={message.id}
                username={message.author.username}
                message={message.content}
                date={message.createdAt.date}
                image={message.image}
                isLiked={message.isLiked}
                onToggleLike={onToggleLike}
                style={{ marginBottom: index === messages.length - 1 ? 0 : 16 }}
              />
            );
          })
        )}
      </MessagesWrapper>

      <InputsContainer $hasImage={image !== null}>
        {image && (
          <div style={{ position: "relative", width: "max-content" }}>
            <Image
              src={image}
              alt="générique"
              width={220}
              height={120}
              style={{ minWidth: 220, borderRadius: 8 }}
            />

            <TrashIcon
              src={`${process.env.PUBLIC_URL}/assets/icons/trash.svg`}
              alt=""
              onClick={() => {
                setImage(null);

                if (inputFileRef && inputFileRef.current) {
                  inputFileRef.current.value = "";
                }
              }}
            />
          </div>
        )}

        <InputsWrapper>
          <img
            src={`${process.env.PUBLIC_URL}/assets/icons/plus.svg`}
            alt=""
            height={28}
            width={28}
            style={{ cursor: "pointer" }}
            onClick={() => {
              if (inputFileRef && inputFileRef.current) {
                inputFileRef.current.click();
              }
            }}
          />

          <input
            ref={inputFileRef}
            type="file"
            accept=".png, .jpg, .jpeg, .gif"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <TextArea
            placeholder="Écrivez votre message ici.."
            value={text}
            onChange={(event) => setText(event.target.value)}
          />

          <img
            src={`${process.env.PUBLIC_URL}/assets/icons/send.svg`}
            alt=""
            height={28}
            width={28}
            style={{ cursor: "pointer" }}
            onClick={handleSendMessage}
          />
        </InputsWrapper>
      </InputsContainer>
    </Container>
  );
};
export default Chat;
