import type { Project } from '@/entities/project/types/project.types';

export interface User {
    name: string;
    email: string;
}

export interface LoginBody {
    email: string;
    password: string;
}

export interface RegisterBody {
    name: string;
    email: string;
    password: string;
}

export interface ChangePasswordBody {
    old_password: string;
    new_password: string;
}

export interface UpdateUserBody {
    name?: string;
    email?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface ProfileResponse {
    user: User;
    projects: Project[];
}
