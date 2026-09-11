export const COMMENT_QUERY_KEYS = {
    all: () => ['comment'] as const,
    byId: (id: number) => [...COMMENT_QUERY_KEYS.all(), id] as const,
    byTask: (taskId: number) => [...COMMENT_QUERY_KEYS.all(), 'task', taskId] as const,
};
