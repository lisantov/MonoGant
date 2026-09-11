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
    ganttById: {
        path: '/gantt/:id',
        name: 'ganttId',
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

export const ProtectedRoutes: string[] = [
    Routes.gantt.path,
    Routes.ganttById.path,
    Routes.main.path,
] as const;
export const GuestRoutes: string[] = [Routes.login.path, Routes.register.path] as const;

export type RouteName = keyof typeof Routes;
