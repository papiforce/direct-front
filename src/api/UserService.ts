import { AxiosResponse } from "axios";
import { User } from "../types";
import api from "./api";

class UserService {
  private usersCache: {
    data: User[] | null;
    timestamp: number;
    expiryTime: number;
  };

  constructor() {
    this.usersCache = {
      data: null,
      timestamp: 0,
      expiryTime: 60 * 1000,
    };
  }

  /**
   * Récupérer tous les utilisateurs avec mise en cache
   * @param {boolean} forceRefresh - Force le rafraîchissement du cache
   * @returns {Promise<User[]>} Promesse avec la liste des utilisateurs
   */
  async getAllUsers(forceRefresh: boolean = false): Promise<User[]> {
    const currentTime = Date.now();
    const cacheIsValid =
      this.usersCache.data !== null &&
      !forceRefresh &&
      currentTime - this.usersCache.timestamp < this.usersCache.expiryTime;

    if (cacheIsValid) {
      return this.usersCache.data as User[];
    }

    try {
      const response: AxiosResponse = await api.get("/api/users");

      this.usersCache = {
        data: response.data,
        timestamp: currentTime,
        expiryTime: this.usersCache.expiryTime,
      };

      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);

      return this.usersCache.data || [];
    }
  }

  /**
   * Vider le cache des utilisateurs
   */
  clearUsersCache(): void {
    this.usersCache.data = null;
    this.usersCache.timestamp = 0;
  }

  /**
   * Configurer la durée d'expiration du cache
   * @param {number} timeInMilliseconds - Durée en millisecondes
   */
  setCacheExpiryTime(timeInMilliseconds: number): void {
    this.usersCache.expiryTime = timeInMilliseconds;
  }
}

const userService = new UserService();
export default userService;
