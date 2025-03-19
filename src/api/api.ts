import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import Cookies from "js-cookie";

import authService from "./AuthService";

interface ApiConfig extends AxiosRequestConfig {
  requireAuth?: boolean;
}

const API_URL: string =
  process.env.REACT_APP_API_URL || "http://localhost:8000";

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = Cookies.get("direct-token");

    if (token && config.headers) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error: AxiosError): Promise<AxiosError> => {
    if (error.response && error.response.status === 401) {
      authService.logout();

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

/**
 * Fonction utilitaire pour les requêtes GET
 * @param url URL de la requête
 * @param config Configuration supplémentaire
 */
export const get = async <T>(url: string, config?: ApiConfig): Promise<T> => {
  const response = await api.get<T>(url, config);
  return response.data;
};

/**
 * Fonction utilitaire pour les requêtes POST
 * @param url URL de la requête
 * @param data Données à envoyer
 * @param config Configuration supplémentaire
 */
export const post = async <T>(
  url: string,
  data?: any,
  headers: { [key: string]: string } = {},
  config?: ApiConfig
): Promise<T> => {
  const response = await api.post<T>(url, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...headers,
    },
    ...config,
  });
  return response.data;
};

/**
 * Fonction utilitaire pour les requêtes PUT
 * @param url URL de la requête
 * @param data Données à envoyer
 * @param config Configuration supplémentaire
 */
export const put = async <T>(
  url: string,
  data?: any,
  config?: ApiConfig
): Promise<T> => {
  const response = await api.put<T>(url, data, config);
  return response.data;
};

/**
 * Fonction utilitaire pour les requêtes PATCH
 * @param url URL de la requête
 * @param data Données à envoyer
 * @param config Configuration supplémentaire
 */
export const patch = async <T>(
  url: string,
  data?: any,
  config?: ApiConfig
): Promise<T> => {
  const response = await api.patch<T>(url, data, config);
  return response.data;
};

/**
 * Fonction utilitaire pour les requêtes DELETE
 * @param url URL de la requête
 * @param config Configuration supplémentaire
 */
export const del = async <T>(url: string, config?: ApiConfig): Promise<T> => {
  const response = await api.delete<T>(url, config);
  return response.data;
};

export default api;
