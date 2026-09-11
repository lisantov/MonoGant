import { createRouter, createWebHistory } from 'vue-router';
import { Routes } from '@/shared/lib';
import { GuestRoutes, ProtectedRoutes } from '@/shared/lib/router/routes';
import { useAuth } from '@/shared';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: Routes.home.path,
            name: Routes.home.name,
            component: () => import('@/pages/home/HomePage.vue'),
        },
        {
            path: Routes.main.path,
            name: Routes.main.name,
            component: () => import('@/pages/main/MainPage.vue'),
        },
        {
            path: Routes.login.path,
            name: Routes.login.name,
            component: () => import('@/pages/login/LoginPage.vue'),
        },
        {
            path: Routes.gantt.path,
            name: Routes.gantt.name,
            component: () => import('@/pages/gantt/GanttTestPage.vue'),
        },
        {
            path: Routes.ganttById.path,
            name: Routes.ganttById.name,
            component: () => import('@/pages/gantt/GanttTestPage.vue'),
        },
        {
            path: Routes.register.path,
            name: Routes.register.name,
            component: () => import('@/pages/register/RegisterPage.vue'),
        },
        {
            path: Routes.notFound.path,
            name: Routes.notFound.name,
            component: () => import('@/pages/not-found.vue'),
        },
    ],
});

router.beforeEach((to) => {
    const { isAuth } = useAuth();
    if (ProtectedRoutes.includes(to.path) && !isAuth.value) router.push(Routes.login.name);
    else if (GuestRoutes.includes(to.path) && isAuth.value) router.push(Routes.main.path);
});

export default router;
