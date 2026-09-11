import { toValue, type MaybeRefOrGetter } from 'vue';
import { defineMutation, useMutation, useQuery, useQueryCache } from '@pinia/colada';
import { sprintService, SPRINT_QUERY_KEYS } from '@/entities';
import type { StoreSprintBody, UpdateSprintBody } from '@/entities/sprint/types/sprint.types';

export const useSprints = (projectId: MaybeRefOrGetter<number>) =>
    useQuery({
        key: () => SPRINT_QUERY_KEYS.toProject(toValue(projectId)),
        query: () => sprintService.list(toValue(projectId)),
    });

export const useSprint = (id: MaybeRefOrGetter<number>) =>
    useQuery({
        key: () => SPRINT_QUERY_KEYS.byId(toValue(id)),
        query: () => sprintService.show(toValue(id)),
    });

export const useCreateSprint = defineMutation(() => {
    const queryCache = useQueryCache();

    return useMutation({
        mutation: ({ projectId, ...body }: StoreSprintBody & { projectId: number }) =>
            sprintService.create(projectId, body),
        onSuccess(_data, vars) {
            queryCache.invalidateQueries({ key: SPRINT_QUERY_KEYS.toProject(vars.projectId) });
            queryCache.invalidateQueries({ key: SPRINT_QUERY_KEYS.all() });
        },
    });
});

export const useUpdateSprint = defineMutation(() => {
    const queryCache = useQueryCache();

    return useMutation({
        mutation: ({ id, data }: { id: number; data: UpdateSprintBody }) =>
            sprintService.update(id, data),
        onSuccess(_data, vars) {
            queryCache.invalidateQueries({ key: SPRINT_QUERY_KEYS.byId(vars.id) });
            queryCache.invalidateQueries({ key: SPRINT_QUERY_KEYS.all() });
        },
    });
});

export const useDeleteSprint = defineMutation(() => {
    const queryCache = useQueryCache();

    return useMutation({
        mutation: (id: number) => sprintService.remove(id),
        onSuccess(_data, id) {
            queryCache.invalidateQueries({ key: SPRINT_QUERY_KEYS.byId(id) });
            queryCache.invalidateQueries({ key: SPRINT_QUERY_KEYS.all() });
        },
    });
});
