import { onBeforeUnmount, ref, unref, type Ref } from 'vue';

interface IBarLike {
    x: number;
    days: number;
}

interface Options {
    dayWidth: Ref<number> | number;
    minX?: number;
    maxX?: number;
    /** вызывается один раз — при отпускании, если позиция изменилась */
    onChange: (next: { x: number }) => void;
}

export function useGanttBarDrag(getBar: () => IBarLike, options: Options) {
    const { dayWidth, minX = 0, maxX = Infinity, onChange } = options;

    const isDragging = ref(false);
    /** снапнутая позиция призрака (px, относительно сетки) */
    const ghostX = ref(0);

    let startX = 0;
    let startLeft = 0;

    const computeTarget = (clientX: number) => {
        const dw = unref(dayWidth);
        const deltaDays = Math.round((clientX - startX) / dw);
        const next = startLeft + deltaDays * dw;
        return Math.max(minX, Math.min(maxX, next));
    };

    const onMouseMove = (e: MouseEvent) => {
        ghostX.value = computeTarget(e.clientX);
    };

    const onMouseUp = (e: MouseEvent) => {
        if (isDragging.value) {
            const nextX = computeTarget(e.clientX);
            if (nextX !== startLeft) onChange({ x: nextX });
        }
        isDragging.value = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
    };

    const start = (e: MouseEvent) => {
        if (e.button !== 0) return;
        e.preventDefault();

        const bar = getBar();
        startX = e.clientX;
        startLeft = bar.x;
        ghostX.value = bar.x;
        isDragging.value = true;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'grabbing';
    };

    onBeforeUnmount(onMouseUp);

    return { isDragging, ghostX, start };
}
