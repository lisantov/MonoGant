export const PROJECT_QUERY_KEYS = {
    all: () => ['project'] as const,
    byId: (id: number) => [...PROJECT_QUERY_KEYS.all(), id] as const,
    parse: (id: number) => [...PROJECT_QUERY_KEYS.byId(id), 'parse'] as const,
    members: (id: number) => [...PROJECT_QUERY_KEYS.byId(id), 'members'] as const,
};
