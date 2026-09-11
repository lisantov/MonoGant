export const TASK_QUERY_KEYS = {
    all: () => ['task'] as const,
    byId: (id: number) => [...TASK_QUERY_KEYS.all(), id] as const,
};
