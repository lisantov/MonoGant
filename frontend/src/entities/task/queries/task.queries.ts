import { defineMutation, useMutation, useQueryCache } from '@pinia/colada';
import { taskService, TASK_QUERY_KEYS } from '@/entities';

export const useCreateTask = defineMutation(() => {
    const queryCache = useQueryCache();

    return useMutation({
        mutation: taskService.create,
        onSuccess() {
            queryCache.invalidateQueries({ key: TASK_QUERY_KEYS.all() });
        },
    });
});
