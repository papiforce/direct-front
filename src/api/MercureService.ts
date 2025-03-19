import api from "./api";

class MercureService {
  private mercurePublicUrl: string;
  private mercureJwt: string | null = null;
  public eventSource?: EventSource;

  constructor() {
    this.mercurePublicUrl =
      process.env.NEXT_PUBLIC_MERCURE_URL ||
      "http://localhost:3001/.well-known/mercure";
  }

  /**
   * Récupérer le token JWT depuis l'API Symfony
   */
  private async fetchJwtToken(): Promise<string | null> {
    try {
      const { data } = await api.get("/api/mercure/token");

      if (data && data.mercureToken) {
        this.mercureJwt = data.mercureToken;
        return this.mercureJwt;
      }

      throw new Error("Token non trouvé dans la réponse");
    } catch (error) {
      console.error("Erreur lors de la récupération du token Mercure:", error);
      throw error;
    }
  }

  /**
   * Se connecter au hub Mercure avec un (ou plusieurs) topic(s) spécifique(s)
   * @param topics Un topic ou un tableau de topics auxquels s'abonner
   */
  async connect(topics?: string | string[]) {
    try {
      this.disconnect();

      await this.fetchJwtToken();

      const url = new URL(this.mercurePublicUrl);
      url.searchParams.append("authorization", `${this.mercureJwt}`);

      if (topics) {
        const topicsArray = Array.isArray(topics) ? topics : [topics];

        topicsArray.forEach((topic) => {
          url.searchParams.append("topic", topic);
        });
      }

      this.eventSource = new EventSource(url.toString(), {
        withCredentials: true,
      });

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          this.dispatchMercureEvent(data);
        } catch (error) {
          console.error("Erreur lors du parsing des données:", error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error("Erreur de connexion au serveur Mercure:", error);
      };

      this.eventSource.onopen = () => {
        if (!topics) {
          console.log(
            "Aucun topic spécifique, écoute de tous les messages autorisés"
          );
        }
      };
    } catch (error) {
      console.error("Erreur lors de la connexion au serveur Mercure:", error);
    }
  }

  /**
   * Fermer la connexion au hub Mercure
   */
  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = undefined;
    }
  }

  /**
   * Déclencher un événement personnalisé avec les données reçues
   * @param data Les données de l'événement
   */
  private dispatchMercureEvent(data: any): void {
    const customEvent = new CustomEvent("mercure-message", {
      detail: data,
      bubbles: true,
    });

    window.dispatchEvent(customEvent);
  }

  /**
   * S'abonner avec un callback personnalisé
   * @param callback La fonction à appeler pour chaque message
   * @returns Fonction pour se désabonner
   */
  addMessageListener(callback: (data: any) => void): () => void {
    const handler = (event: CustomEvent) => callback(event.detail);

    window.addEventListener("mercure-message", handler as EventListener);

    return () => {
      window.removeEventListener("mercure-message", handler as EventListener);
    };
  }

  /**
   * Rafraîchir le token JWT
   * @returns true si le rafraîchissement réussit, false sinon
   */
  async refreshToken(): Promise<boolean> {
    try {
      await this.fetchJwtToken();
      console.log("Token JWT rafraîchi avec succès");
      return true;
    } catch (error) {
      console.error("Échec du rafraîchissement du token JWT:", error);
      return false;
    }
  }

  /**
   * Vérifier si la connexion est active
   */
  isConnected(): boolean {
    return (
      this.eventSource !== undefined &&
      this.eventSource.readyState === EventSource.OPEN
    );
  }

  /**
   * Obtenir l'état actuel de la connexion
   */
  getConnectionState(): string {
    if (!this.eventSource) return "DISCONNECTED";

    switch (this.eventSource.readyState) {
      case EventSource.CONNECTING:
        return "CONNECTING";
      case EventSource.OPEN:
        return "CONNECTED";
      case EventSource.CLOSED:
        return "CLOSED";
      default:
        return "UNKNOWN";
    }
  }
}

const mercureService = new MercureService();
export default mercureService;
