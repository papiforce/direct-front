import { AxiosResponse } from "axios";

import api from "./api";

class ConversationService {
  /**
   * Créer une conversation avec un utilisateur
   * @param userId ID de l'utilisateur
   * @returns Promesse avec le résultat de la création de la conversation
   */
  async createConversation(userId: number): Promise<any> {
    try {
      const response: AxiosResponse = await api.post(
        `/api/conversation/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de la conversation:", error);
      return null;
    }
  }
}

const conversationService = new ConversationService();
export default conversationService;
