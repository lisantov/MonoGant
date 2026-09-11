import { toValue, type MaybeRefOrGetter } from 'vue';
import { defineMutation, useMutation, useQuery, useQueryCache } from '@pinia/colada';
import { taskService, TASK_QUERY_KEYS } from '@/entities';
import type { UpdateBody } from '@/entities/task/types/task.types';

export const useTasksBySprint = (sprintId: MaybeRefOrGetter<number | null>) =>
    useQuery({
        key: () => TASK_QUERY_KEYS.bySprint(toValue(sprintId)!),
        query: () => taskService.list(toValue(sprintId)!),
        enabled: () => toValue(sprintId) != null,
    });

export const useTask = (taskId: MaybeRefOrGetter<number | null>) =>
    useQuery({
        key: () => TASK_QUERY_KEYS.byId(toValue(taskId)!),
        query: () => taskService.show(toValue(taskId)!),
        enabled: () => toValue(taskId) != null,
    });

export const useCreateTask = defineMutation(() => {
    const queryCache = useQueryCache();

    return useMutation({
        mutation: taskService.create,
        onSuccess(_data, vars) {
            queryCache.invalidateQueries({ key: TASK_QUERY_KEYS.bySprint(vars.sprintId) });
            queryCache.invalidateQueries({ key: TASK_QUERY_KEYS.all() });
        },
    });
});

export const useUpdateTask = defineMutation(() => {
    const queryCache = useQueryCache();

    return useMutation({
        mutation: ({ id, data }: { id: number; data: UpdateBody }) => taskService.update(id, data),
        onSuccess(_data, vars) {
            queryCache.invalidateQueries({ key: TASK_QUERY_KEYS.byId(vars.id) });
            queryCache.invalidateQueries({ key: TASK_QUERY_KEYS.all() });
        },
    });
});

export const useDeleteTask = defineMutation(() => {
    const queryCache = useQueryCache();

    return useMutation({
        mutation: (id: number) => taskService.remove(id),
        onSuccess(_data, id) {
            queryCache.invalidateQueries({ key: TASK_QUERY_KEYS.byId(id) });
            queryCache.invalidateQueries({ key: TASK_QUERY_KEYS.all() });
        },
    });
});
