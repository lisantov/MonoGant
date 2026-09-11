import { ref } from 'vue';

type Modal = 'mini' | 'taskDetails';

const currentModal = ref<Modal | null>(null);

export const useModal = () => {
    const openModal = (name: Modal | null) => {
        currentModal.value = name;
    };

    const closeModal = () => {
        currentModal.value = null;
    };

    return { openModal, closeModal, currentModal };
};
