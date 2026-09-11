export const PROJECT_QUERY_KEYS = {
    all: () => ['project'] as const,
    byId: (id: number) => [...PROJECT_QUERY_KEYS.all(), id] as const,
};
