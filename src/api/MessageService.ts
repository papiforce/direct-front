import { AxiosResponse } from "axios";

// import { Message } from "../types";
import api, { post } from "./api";

class MessageService {
  /**
   * Récupérer tous les messages d'une conversation
   * @param conversationId ID de la conversation
   * @returns Promesse avec la liste des messages
   */
  async getAllMessages(conversationId: string): Promise<any> {
    try {
      const response: AxiosResponse = await api.get(
        `/api/conversations/${conversationId}/messages`
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des messages:", error);
      return [];
    }
  }

  /**
   * Envoyer un message dans une conversation
   * @param conversationId ID de la conversation
   * @param content Contenu du message
   * @returns Promesse avec le message envoyé
   */
  async sendMessage(conversationId: string, content: string): Promise<any> {
    try {
      const response: AxiosResponse = await api.post("/api/message", {
        conversationId,
        content,
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      return null;
    }
  }

  /**
   * Envoyer une image dans un message
   * @param conversationId ID de la conversation
   * @param image Fichier image à envoyer
   * @returns Promesse avec le message envoyé
   */
  async sendImage(
    conversationId: string,
    image: string,
    content?: string
  ): Promise<any> {
    try {
      const response: AxiosResponse = await api.post("/api/message/image", {
        conversationId,
        image,
        content,
      });

      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'image:", error);
      return null;
    }
  }

  /**
   * Basculer l'état "like" d'un message
   * @param messageId ID du message à liker/unliker
   * @returns Promesse avec les données de la réponse incluant l'état mis à jour
   */
  async toggleLike(conversationId: number, messageId: number): Promise<any> {
    try {
      const response: AxiosResponse = await api.put(
        `/api/message/${conversationId}/${messageId}/toggle-like`
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors du basculement du like:", error);
      throw error;
    }
  }
}

const messageService = new MessageService();
export default messageService;
