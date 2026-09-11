import { defineQuery, defineMutation, useQuery, useMutation, useQueryCache } from '@pinia/colada';
import { useAuth } from '@/shared/composables';
import { accountService, ACCOUNT_QUERY_KEYS } from '@/entities';
import { useRouter } from 'vue-router';

export const useProfile = defineQuery(() => {
    const { isAuth } = useAuth();

    return useQuery({
        key: ACCOUNT_QUERY_KEYS.profile,
        query: accountService.profile,
        enabled: () => isAuth.value,
    });
});

export const useLogin = defineMutation(() => {
    const { setToken } = useAuth();
    const queryCache = useQueryCache();
    const router = useRouter();

    return useMutation({
        mutation: accountService.login,
        onSuccess(data) {
            setToken(data.token);
            queryCache.invalidateQueries({ key: ACCOUNT_QUERY_KEYS.all() });
            router.push('/main');
        },
    });
});

export const useRegister = defineMutation(() => {
    const { setToken } = useAuth();
    const queryCache = useQueryCache();
    const router = useRouter();

    return useMutation({
        mutation: accountService.register,
        onSuccess(data) {
            setToken(data.token);
            queryCache.invalidateQueries({ key: ACCOUNT_QUERY_KEYS.all() });
            router.push('/main');
        },
    });
});

export const useLogout = defineMutation(() => {
    const { clearToken } = useAuth();
    const queryCache = useQueryCache();
    const router = useRouter();

    return useMutation({
        mutation: accountService.logout,
        onSuccess() {
            clearToken();
            queryCache.setQueryData(ACCOUNT_QUERY_KEYS.profile(), undefined);
            queryCache.invalidateQueries({ key: ACCOUNT_QUERY_KEYS.all() });
            router.push('/');
        },
    });
});

export const useChangePassword = defineMutation(() =>
    useMutation({
        mutation: accountService.changePassword,
    })
);
