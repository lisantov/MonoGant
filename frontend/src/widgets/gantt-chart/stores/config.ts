import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGranttConfigStore = defineStore('granttConfigStore', () => {
    const dayWidth = ref(40);
    const dayHeight = ref(40);

    return {
        dayHeight,
        dayWidth,
    };
});
