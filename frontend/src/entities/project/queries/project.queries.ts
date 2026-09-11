import { useQuery } from '@pinia/colada';
import { projectService, TASK_QUERY_KEYS } from '@/entities';

export const useProjects = useQuery({
    key: TASK_QUERY_KEYS.all,
    query: projectService.getProjects,
});
