import axios from "axios";
import type { AuthResponse, ChangePasswordData, RegistrationData } from "../types"
import axiosInstance from "./axiosInstance";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * @description Registers a new user.
 * Public axios instance because the user is not yet authenticated.
 * @param userData - The user's registration details.
 * @returns A promise that resolves to the authentication tokens and user data.
 */
export const registerUser = (userData: RegistrationData): Promise<AuthResponse> => {
    return axios.post(`${API_BASE_URL}/auth/register/`, userData)
}

/**
 * @description Logs in a user.
 * Public axios instance because the user is not yet authenticated.
 * @param credentials - The user's login details (username & password).
 * @returns A promise that resolves to the authentication tokens and user data.
 */
export const loginUser = (credentials: { username: string; password: string }): Promise<AuthResponse> => {
  return axios.post(`${API_BASE_URL}/auth/login/`, credentials);
};

/**
 * @description Changes the authenticated user's password.
 * Uses the authenticated axiosInstance so the auth token is automatically included.
 * @param passwordData - The old and new password.
 * @returns A promise that resolves to the success message.
 */
export const changeUserPassword = (passwordData: ChangePasswordData): Promise<{ message: string }> => {
    return axiosInstance.post('/auth/change-password/', passwordData);
};
