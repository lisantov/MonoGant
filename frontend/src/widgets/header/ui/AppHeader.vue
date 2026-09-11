<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { AppButton } from '@/shared/ui';
import { Routes } from '@/shared/lib';
import { useAuth } from '@/shared/composables';
import { useProfile, useLogout } from '@/entities/account';

const { isAuth } = useAuth();
const { data: profile } = useProfile();
const { mutateAsync: logout } = useLogout();
const router = useRouter();

const handleLogout = async () => {
    await logout();
    router.push(Routes.login);
};
</script>

<template>
    <header class="sticky top-0 z-9999 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div class="container mx-auto flex h-16 items-center justify-between px-4">
            <router-link :to="Routes.home" class="text-xl font-bold text-brand"> Logo </router-link>

            <nav class="flex items-center gap-4">
                <template v-if="isAuth">
                    <span v-if="profile" class="text-sm text-gray-600">
                        {{ profile?.user.name }}
                    </span>
                    <app-button variant="ghost" size="sm" @click="handleLogout"> Выйти </app-button>
                </template>

                <template v-else>
                    <router-link :to="Routes.login">
                        <app-button variant="primary" size="sm"> Войти </app-button>
                    </router-link>
                </template>
            </nav>
        </div>
    </header>
</template>
