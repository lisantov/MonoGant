import { toValue, type MaybeRefOrGetter } from 'vue';
import { defineMutation, useMutation, useQuery, useQueryCache } from '@pinia/colada';
import { commentService, COMMENT_QUERY_KEYS } from '@/entities';
import type { StoreCommentBody } from '@/entities/comment/types/comment.types';

export const useComments = (taskId: MaybeRefOrGetter<number | null>) =>
    useQuery({
        key: () => COMMENT_QUERY_KEYS.byTask(toValue(taskId)!),
        query: () => commentService.list(toValue(taskId)!),
        enabled: () => toValue(taskId) != null,
    });

export const useComment = (id: MaybeRefOrGetter<number>) =>
    useQuery({
        key: () => COMMENT_QUERY_KEYS.byId(toValue(id)),
        query: () => commentService.show(toValue(id)),
    });

export const useCreateComment = defineMutation(() => {
    const queryCache = useQueryCache();

    return useMutation({
        mutation: ({ taskId, body }: { taskId: number; body: StoreCommentBody }) =>
            commentService.create(taskId, body),
        onSuccess(_data, vars) {
            queryCache.invalidateQueries({ key: COMMENT_QUERY_KEYS.byTask(vars.taskId) });
        },
    });
});
