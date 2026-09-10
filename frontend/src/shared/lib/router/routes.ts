export const Routes = {
    home: {
        path: '/',
        name: 'home',
    },
    login: {
        path: '/auth/login',
        name: 'login',
    },
    gantt: {
        path: '/gantt',
        name: 'gantt',
    },
    notFound: {
        path: '/:pathMatch(.*)*',
        name: 'notFound',
    },
} as const;

export const ProtectedRoutes: string[] = [] as const;

export type RouteName = keyof typeof Routes;
