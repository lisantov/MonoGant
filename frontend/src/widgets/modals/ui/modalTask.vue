<script setup lang="ts">
import { FormCreateTask } from '@/features';
import { AppModal } from '@/shared';

interface IProps {
    sprintId: number;
    sprintName?: string;
    userOptions?: Array<{ name: string; email: string }>;
    projectId?: number;
}
withDefaults(defineProps<IProps>(), {
    sprintName: 'Спринт',
    userOptions: () => [],
    projectId: undefined,
});
</script>

<template>
    <app-modal name="taskApp">
        <div class="bg-gray p-[16px] rounded-[15px] relative">
            <div class="flex w-full">
                <div
                    class="absolute flex items-center whitespace-nowrap justify-between px-[12px] py-[7px] border-[1px] rounded-[10px] text-accent-light border-accent-light text-[22px] gap-[5px] font-jost"
                >
                    <div class="size-[8px] rounded-[4px] bg-accent-light" />
                    {{ sprintName }}
                </div>
                <h3 class="w-full text-accent-light text-[36px] text-center textTask">Задачи</h3>
            </div>
            <form-create-task
                v-if="sprintId != null"
                :sprint-id="sprintId"
                :project-id="projectId"
                :user-options="userOptions"
            />
        </div>
    </app-modal>
</template>

<style scoped lang="scss">
.textTask {
    text-shadow: 0 19px 10px 0 rgba(85, 240, 91, 0.25);
}
</style>
