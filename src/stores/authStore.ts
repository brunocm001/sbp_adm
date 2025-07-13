import { apiClient, Admin } from '../utils/api';

export interface AuthState {
  isAuthenticated: boolean;
  admin: Admin | null;
  loading: boolean;
  error: string | null;
}

class AuthStore {
  private state: AuthState = {
    isAuthenticated: false,
    admin: null,
    loading: false,
    error: null,
  };

  private listeners: Set<(state: AuthState) => void> = new Set();

  getState(): AuthState {
    return { ...this.state };
  }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  private setState(updates: Partial<AuthState>) {
    this.state = { ...this.state, ...updates };
    this.notify();
  }

  async login(email: string, password: string): Promise<boolean> {
    this.setState({ loading: true, error: null });

    try {
      const response = await apiClient.login(email, password);
      
      if (response.success && response.data) {
        apiClient.setToken(response.data.token);
        this.setState({
          isAuthenticated: true,
          admin: response.data.admin,
          loading: false,
          error: null,
        });
        return true;
      } else {
        this.setState({
          loading: false,
          error: response.message || 'Échec de la connexion',
        });
        return false;
      }
    } catch (error) {
      this.setState({
        loading: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue',
      });
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      apiClient.clearToken();
      this.setState({
        isAuthenticated: false,
        admin: null,
        loading: false,
        error: null,
      });
    }
  }

  checkAuth(): boolean {
    const token = apiClient.getToken();
    const isAuthenticated = !!token;
    
    if (!isAuthenticated) {
      this.setState({
        isAuthenticated: false,
        admin: null,
      });
    }
    
    return isAuthenticated;
  }

  clearError(): void {
    this.setState({ error: null });
  }
}

export const authStore = new AuthStore(); 