
// FieldType based on Django models
export type FieldType = 'text' | 'number' | 'email' | 'password' | 'date' | 'textarea' | 'select';

export interface User {
    id: number;
    username: string;
    email: string;
}

export interface AuthResponse {
    data: {
        access: string;
        refresh: string;
        user?: User;
    }
} 

export interface RegistrationData {
    username?: string;  
    email?: string;
    first_name?: string;
    last_name?: string;
    password?: string;
    password_confirm?: string;
}

export interface ChangePasswordData {
  old_password?: string;
  new_password?: string;
}