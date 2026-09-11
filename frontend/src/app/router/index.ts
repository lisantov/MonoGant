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
            meta: { title: 'Главная' },
        },
        {
            path: Routes.main.path,
            name: Routes.main.name,
            component: () => import('@/pages/main/MainPage.vue'),
            meta: { layout: 'empty', title: 'Профиль' },
        },
        {
            path: Routes.login.path,
            name: Routes.login.name,
            component: () => import('@/pages/login/LoginPage.vue'),
            meta: { title: 'Вход' },
        },
        {
            path: Routes.ganttById.path,
            name: Routes.ganttById.name,
            component: () => import('@/pages/gantt/GanttTestPage.vue'),
            meta: { layout: 'empty', title: 'Схема Ганта' },
        },
        {
            path: Routes.register.path,
            name: Routes.register.name,
            component: () => import('@/pages/register/RegisterPage.vue'),
            meta: { title: 'Регистрация' },
        },
        {
            path: Routes.notFound.path,
            name: Routes.notFound.name,
            component: () => import('@/pages/not-found.vue'),
            meta: { title: '404' },
        },
    ],
});

router.beforeEach((to) => {
    const { isAuth } = useAuth();
    if (ProtectedRoutes.includes(to.path) && !isAuth.value) router.push(Routes.login.name);
    else if (GuestRoutes.includes(to.path) && isAuth.value) router.push(Routes.main.path);
});

router.afterEach((to) => {
    const title = to.meta.title;
    if (typeof title === 'string') document.title = title;
});

export default router;
