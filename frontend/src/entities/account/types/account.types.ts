export interface Account {
    id: number;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface LoginBody {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: Account;
}

export interface RegisterBody {
    email: string;
    password: string;
    name: string;
}
