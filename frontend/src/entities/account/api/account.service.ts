import { api } from '@/shared/api';
import type {
    AuthResponse,
    ChangePasswordBody,
    LoginBody,
    ProfileResponse,
    RegisterBody,
} from '@/entities';

export const accountService = {
    login: (data: LoginBody) => api.post<AuthResponse>('login', data).then((res) => res.data),

    register: (data: RegisterBody) =>
        api.post<AuthResponse>('register', data).then((res) => res.data),

    profile: () => api.get<ProfileResponse>('user').then((res) => res.data),

    logout: () => api.post('logout'),

    changePassword: (data: ChangePasswordBody) =>
        api.post('change-password', data).then((res) => res.data),
};
