
import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  isTutor: boolean;
  hourlyRate?: number;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    isTutor: boolean;
    hourlyRate?: number;
    bio?: string;
    avatarUrl?: string;
    followers: number;
    following: number;
  };
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};

export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', userData);
  return response.data;
};

export const getCurrentUser = async (): Promise<AuthResponse['user']> => {
  const response = await api.get<{ user: AuthResponse['user'] }>('/auth/me');
  return response.data.user;
};

export const resetPasswordRequest = async (email: string): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>('/auth/reset-password-request', { email });
  return response.data;
};

export const updateProfile = async (profileData: Partial<AuthResponse['user']>): Promise<AuthResponse['user']> => {
  const response = await api.put<{ user: AuthResponse['user'] }>('/users/profile', profileData);
  return response.data.user;
};
