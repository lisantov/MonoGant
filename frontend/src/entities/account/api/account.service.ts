import { api } from '@/shared/api';
import type { Account, LoginBody, LoginResponse, RegisterBody } from '@/entities';

export const accountService = {
    login: (data: LoginBody) => api.post<LoginResponse>('login', data).then((res) => res.data),

    register: (data: RegisterBody) =>
        api.post<LoginResponse>('register', data).then((res) => res.data),

    profile: () => api.get<Account>('user').then((res) => res.data),

    logout: () => api.post('logout'),

    updateProfile: (data: Partial<Account>) =>
        api.patch<Account>('profile', data).then((res) => res.data),
};
