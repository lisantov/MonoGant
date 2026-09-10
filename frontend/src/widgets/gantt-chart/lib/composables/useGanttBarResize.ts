import { onBeforeUnmount, ref, unref, type Ref } from 'vue';

interface IBarLike {
    x: number;
    days: number;
}

interface Options {
    dayWidth: Ref<number> | number;
    minDays?: number;
    minX?: number;
    maxX?: number;
    onChange: (next: { x: number; days: number }) => void;
}

export function useGanttBarResize(getBar: () => IBarLike, options: Options) {
    const { dayWidth, minDays = 1, minX = 0, maxX = Infinity, onChange } = options;

    const isResizing = ref(false);
    /** снапнутая позиция призрака (px) */
    const ghostX = ref(0);
    /** снапнутая ширина призрака (в днях) */
    const ghostDays = ref(1);

    let side: 'left' | 'right' = 'right';
    let startX = 0;
    let startLeft = 0;
    let startDays = 1;

    const computeTarget = (clientX: number) => {
        const dw = unref(dayWidth);
        const deltaDays = Math.round((clientX - startX) / dw);

        if (side === 'right') {
            let days = startDays + deltaDays;
            days = Math.max(minDays, days);

            // не даём правому краю выйти за maxX
            const maxDays = Math.floor((maxX - startLeft) / dw);
            days = Math.min(days, maxDays);

            return { x: startLeft, days };
        }

        // left: двигаем x, days компенсируем, чтобы правый край стоял
        const minLeftDelta = Math.ceil((minX - startLeft) / dw); // <= 0
        const maxLeftDelta = startDays - minDays; // >= 0
        const leftDelta = Math.max(minLeftDelta, Math.min(deltaDays, maxLeftDelta));

        return {
            x: startLeft + leftDelta * dw,
            days: startDays - leftDelta,
        };
    };

    const onMouseMove = (e: MouseEvent) => {
        const { x, days } = computeTarget(e.clientX);
        ghostX.value = x;
        ghostDays.value = days;
    };

    const onMouseUp = (e: MouseEvent) => {
        if (isResizing.value) {
            const { x, days } = computeTarget(e.clientX);
            if (x !== startLeft || days !== startDays) {
                onChange({ x, days });
            }
        }
        isResizing.value = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
    };

    const start = (e: MouseEvent, s: 'left' | 'right') => {
        if (e.button !== 0) return;
        e.preventDefault();

        const bar = getBar();
        side = s;
        startX = e.clientX;
        startLeft = bar.x;
        startDays = bar.days;

        ghostX.value = bar.x;
        ghostDays.value = bar.days;
        isResizing.value = true;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'col-resize';
    };

    onBeforeUnmount(onMouseUp);

    return {
        isResizing,
        ghostX,
        ghostDays,
        startLeft: (e: MouseEvent) => start(e, 'left'),
        startRight: (e: MouseEvent) => start(e, 'right'),
    };
}
