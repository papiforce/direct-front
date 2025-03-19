import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import messageService from "../api/MessageService";
import mercureService from "../api/MercureService";

import Layout from "../components/Layout";
import Chat from "../components/Chat";

const ConversationPage = () => {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState<any>([]);
  const [typeOfChanges, setTypeOfChanges] = useState<"NEW" | "UPDATE">("NEW");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleSendMessage = async (content: string, image?: string) => {
    try {
      if (conversationId) {
        if (image) {
          const { data } = await messageService.sendImage(
            conversationId,
            image,
            content
          );

          if (!data) return;
        } else {
          const { data } = await messageService.sendMessage(
            conversationId,
            content
          );

          if (!data) return;
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
  };

  const handleToggleLike = async (id: number) => {
    try {
      if (conversationId) {
        const { data } = await messageService.toggleLike(
          conversationId as unknown as number,
          id
        );

        if (!data) return;
      }
    } catch (error) {
      console.error("Erreur lors du changement d'état du like:", error);
    }
  };

  useEffect(() => {
    if (conversationId) {
      const fetchMessages = async () => {
        const { messages } = await messageService.getAllMessages(
          conversationId
        );

        setMessages(messages);
      };

      fetchMessages();
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    mercureService.connect(
      `${process.env.REACT_APP_API_URL}/conversations/${conversationId}`
    );

    const unsubscribe = mercureService.addMessageListener((data) => {
      const existingIndex = messages.findIndex(
        (msg: any) => msg.id === data.id
      );

      if (existingIndex === -1) {
        setTypeOfChanges("NEW");

        const updatedData = [...messages, data];
        const cleanData = Array.from(new Set(updatedData));

        return setMessages(cleanData);
      }

      const updatedMessages = [...messages];
      Object.assign(updatedMessages[existingIndex], data);

      setTypeOfChanges("UPDATE");

      return setMessages(updatedMessages);
    });

    return () => {
      unsubscribe();
      mercureService.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  return (
    <Layout>
      <Chat
        typeOfChanges={typeOfChanges}
        isLoading={isLoading}
        messages={messages}
        onSendMessage={handleSendMessage}
        onToggleLike={handleToggleLike}
      />
    </Layout>
  );
};

export default ConversationPage;
