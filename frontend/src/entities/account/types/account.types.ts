export interface Account {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
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
    firstName: string;
    lastName: string;
}
