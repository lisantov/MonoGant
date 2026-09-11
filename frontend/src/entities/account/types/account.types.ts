export interface Account {
    user: {
        name: string;
        email: string;
    };
    projects: [];
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
