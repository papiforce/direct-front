import axios, { AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

import { User, AuthResponse } from "../types";
import api from "./api";

const API_URL: string =
  process.env.REACT_APP_API_URL || "http://localhost:8000";

class AuthService {
  /**
   * Méthode d'inscription
   * @param username Nom d'utilisateur
   * @param password Mot de passe
   * @returns Promesse avec le résultat de l'inscription
   */
  async register(username: string, password: string): Promise<AuthResponse> {
    try {
      const response: AxiosResponse = await axios.post(
        `${API_URL}/api/register`,
        {
          username,
          password,
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: "Une erreur est survenue lors de l'inscription",
      };
    }
  }

  /**
   * Méthode de connexion
   * @param username Nom d'utilisateur
   * @param password Mot de passe
   * @returns Promesse avec le résultat de la connexion
   */
  async login(username: string, password: string) {
    try {
      const response = await api.post("/api/login_check", {
        username,
        password,
      });
      const { token } = response.data;

      Cookies.set("direct-token", token);

      return true;
    } catch (error) {
      console.error("Erreur de connexion:", error);
      return false;
    }
  }

  /**
   * Méthode de déconnexion
   */
  logout(): void {
    Cookies.remove("direct-token");
  }

  /**
   * Récupérer l'utilisateur courant
   * @returns L'utilisateur connecté ou null
   */
  async getCurrentUser(): Promise<User | null> {
    if (!this.isAuthenticated()) {
      return null;
    }

    try {
      const response = await api.get("/api/user/me");

      return response.data;
    } catch (error) {
      console.error("Erreur lors du décodage du token:", error);
      return null;
    }
  }

  /**
   * Vérifier si l'utilisateur est connecté
   * @returns true si connecté, false sinon
   */
  isAuthenticated(): boolean {
    const token = Cookies.get("direct-token");
    if (!token) return false;

    try {
      const decodedToken = jwtDecode<any>(token);
      const currentTime = Date.now() / 1000;

      return decodedToken.exp > currentTime;
    } catch (error) {
      return false;
    }
  }
}

const authService = new AuthService();
export default authService;
