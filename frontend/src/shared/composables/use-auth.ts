import { computed } from 'vue';
import { useStorage } from '@vueuse/core';

const token = useStorage<string | null>('token', null);

export function useAuth() {
    const isAuth = computed(() => !!token.value);

    const setToken = (newToken: string) => (token.value = newToken);

    const clearToken = () => (token.value = null);

    return {
        token,
        isAuth,
        setToken,
        clearToken,
    };
}
