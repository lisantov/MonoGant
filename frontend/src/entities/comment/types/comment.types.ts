export interface Comment {
    id: number;
    body: string;
    user_id: number;
    task_id: number;
    created_at: string;
}

export interface StoreCommentBody {
    body: string;
}

export interface CommentListResponse {
    data: Comment[];
}

export interface CommentResponse {
    message: string;
    comment: Comment;
}
