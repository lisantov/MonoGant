export const SPRINT_QUERY_KEYS = {
    all: () => ['sprint'] as const,
    toProject: (projectId: number) => [...SPRINT_QUERY_KEYS.all(), 'project', projectId] as const,
    byId: (id: number) => [...SPRINT_QUERY_KEYS.all(), id] as const,
};
