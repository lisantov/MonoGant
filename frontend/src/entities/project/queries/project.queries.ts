import { toValue, type MaybeRefOrGetter } from 'vue';
import { defineQuery, defineMutation, useQuery, useMutation, useQueryCache } from '@pinia/colada';
import { projectService, PROJECT_QUERY_KEYS } from '@/entities';
import type { ProjectMemberRole, UpdateProjectBody } from '@/entities/project/types/project.types';

export const useProjects = defineQuery(() =>
    useQuery({
        key: PROJECT_QUERY_KEYS.all,
        query: projectService.list,
    })
);

export const useProject = (id: MaybeRefOrGetter<number>) =>
    useQuery({
        key: () => PROJECT_QUERY_KEYS.byId(toValue(id)),
        query: () => projectService.show(toValue(id)),
    });

export const useParseProject = (projectId: MaybeRefOrGetter<number | undefined>) =>
    useQuery({
        key: () => PROJECT_QUERY_KEYS.parse(toValue(projectId) ?? -1),
        query: () =>
            toValue(projectId) == null
                ? Promise.resolve(null)
                : projectService.parse(toValue(projectId) as number),
        enabled: () => toValue(projectId) != null,
    });

export const useCreateProject = defineMutation(() => {
    const queryCache = useQueryCache();

    return useMutation({
        mutation: projectService.create,
        onSuccess() {
            queryCache.invalidateQueries({ key: PROJECT_QUERY_KEYS.all() });
        },
    });
});

export const useUpdateProject = defineMutation(() => {
    const queryCache = useQueryCache();

    return useMutation({
        mutation: ({ id, data }: { id: number; data: UpdateProjectBody }) =>
            projectService.update(id, data),
        onSuccess(_data, vars) {
            queryCache.invalidateQueries({ key: PROJECT_QUERY_KEYS.byId(vars.id) });
            queryCache.invalidateQueries({ key: PROJECT_QUERY_KEYS.all() });
        },
    });
});

export const useDeleteProject = defineMutation(() => {
    const queryCache = useQueryCache();

    return useMutation({
        mutation: (id: number) => projectService.remove(id),
        onSuccess(_data, id) {
            queryCache.invalidateQueries({ key: PROJECT_QUERY_KEYS.byId(id) });
            queryCache.invalidateQueries({ key: PROJECT_QUERY_KEYS.all() });
        },
    });
});

export const useAddProjectMembers = defineMutation(() => {
    const queryCache = useQueryCache();

    return useMutation({
        mutation: ({ id, emails }: { id: number; emails: string[] }) =>
            projectService.addMembers(id, emails),
        onSuccess(_data, vars) {
            queryCache.invalidateQueries({ key: PROJECT_QUERY_KEYS.members(vars.id) });
            queryCache.invalidateQueries({ key: PROJECT_QUERY_KEYS.byId(vars.id) });
        },
    });
});

export const useSetMemberRole = defineMutation(() => {
    const queryCache = useQueryCache();

    return useMutation({
        mutation: ({
            id,
            memberId,
            role,
        }: {
            id: number;
            memberId: number;
            role: ProjectMemberRole;
        }) => projectService.setMemberRole(id, memberId, role),
        onSuccess(_data, vars) {
            queryCache.invalidateQueries({ key: PROJECT_QUERY_KEYS.members(vars.id) });
            queryCache.invalidateQueries({ key: PROJECT_QUERY_KEYS.byId(vars.id) });
        },
    });
});

export const useRemoveMember = defineMutation(() => {
    const queryCache = useQueryCache();

    return useMutation({
        mutation: ({ id, memberId }: { id: number; memberId: number }) =>
            projectService.removeMember(id, memberId),
        onSuccess(_data, vars) {
            queryCache.invalidateQueries({ key: PROJECT_QUERY_KEYS.members(vars.id) });
            queryCache.invalidateQueries({ key: PROJECT_QUERY_KEYS.byId(vars.id) });
        },
    });
});
