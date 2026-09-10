import { onBeforeUnmount, ref } from 'vue';

interface Options {
    /** селектор или предикат: если true — панорамирование не запускаем */
    shouldIgnore?: (target: HTMLElement) => boolean;
}

export function usePanScroll(containerRef: { value: HTMLElement | null }, options: Options = {}) {
    const isPanning = ref(false);

    let startX = 0;
    let startY = 0;
    let startScrollLeft = 0;
    let startScrollTop = 0;

    const onMouseMove = (e: MouseEvent) => {
        if (!isPanning.value) return;
        const el = containerRef.value;
        if (!el) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        el.scrollLeft = startScrollLeft - dx;
        el.scrollTop = startScrollTop - dy;
    };

    const onMouseUp = () => {
        isPanning.value = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
    };

    const onMouseDown = (e: MouseEvent) => {
        if (e.button !== 0) return;

        const target = e.target as HTMLElement;
        // не запускаем панорамирование на интерактивных элементах
        if (options.shouldIgnore?.(target)) return;

        const el = containerRef.value;
        if (!el) return;

        isPanning.value = true;
        startX = e.clientX;
        startY = e.clientY;
        startScrollLeft = el.scrollLeft;
        startScrollTop = el.scrollTop;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'grabbing';
    };

    onBeforeUnmount(onMouseUp);

    return { isPanning, onMouseDown };
}
