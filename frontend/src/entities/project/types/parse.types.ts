import type { Comment } from '@/entities/comment/types/comment.types';
import type { Sprint } from '@/entities/sprint/types/sprint.types';
import type { Task } from '@/entities/task/types/task.types';
import type { Project } from './project.types';

export interface ParseTask extends Task {
    comments: Comment[];
}

export interface ParseSprint extends Sprint {
    tasks: ParseTask[];
}

export interface ParseProject extends Project {
    sprints: ParseSprint[];
}
