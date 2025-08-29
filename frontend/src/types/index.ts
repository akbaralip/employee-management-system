
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

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export type NavigateFunction = (path: string) => void;

export interface DashboardItem {
  title: string;
  icon: string;
  description: string;
  link: string;
}

export interface Employee {
  id: number;
  form_template_name: string;
  data: Array<{
    field_label: string;
    field_value: string;
  }>;
}

export interface FormField {
  id: string;
  label: string;
  field_type: string;
  required: boolean;
}