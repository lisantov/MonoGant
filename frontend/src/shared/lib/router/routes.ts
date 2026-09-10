export const Routes = {
    home: {
        path: '/',
        name: 'home',
    },
    main: {
        path: '/main',
        name: 'main',
    },
    login: {
        path: '/auth/login',
        name: 'login',
    },
    gantt: {
        path: '/gantt',
        name: 'gantt',
    },
    register: {
        path: '/auth/register',
        name: 'register',
    },
    notFound: {
        path: '/:pathMatch(.*)*',
        name: 'notFound',
    },
} as const;

export const ProtectedRoutes: string[] = [] as const;

export type RouteName = keyof typeof Routes;
