import { onBeforeUnmount, ref, unref, type Ref } from 'vue';

interface IBarLike {
    x: number;
    days: number;
}

interface Options {
    /** ширина одного дня в пикселях */
    dayWidth: Ref<number> | number;
    /** минимальное число дней, до которого можно сжать бар */
    minDays?: number;
    /** запретить уезжать левым краем левее нуля */
    minX?: number;
    /** колбэк с новым состоянием — сюда пишем в store / emit */
    onChange: (next: { x: number; days: number }) => void;
}

export function useGanttBarResize(getBar: () => IBarLike, options: Options) {
    const { dayWidth, minDays = 1, minX = 0, onChange } = options;
    const isResizing = ref(false);

    let side: 'left' | 'right' = 'right';
    let startX = 0;
    let startLeft = 0;
    let startDays = 1;

    const onMouseMove = (e: MouseEvent) => {
        const dw = unref(dayWidth);
        const dx = e.clientX - startX;
        // округляем до целых дней — бар «магнитится» к сетке
        const deltaDays = Math.round(dx / dw);

        let nextX = startLeft;
        let nextDays = startDays;

        if (side === 'right') {
            // правая ручка: меняем только days
            nextDays = Math.max(minDays, startDays + deltaDays);
        } else {
            // левая ручка: двигаем x, days уменьшается на ту же величину
            // но не даём схлопнуть бар меньше minDays и уехать левее minX
            const minLeftDelta = Math.ceil((minX - startLeft) / dw); // отрицательное или 0
            const maxLeftDelta = startDays - minDays; // положительное
            const leftDelta = Math.max(minLeftDelta, Math.min(deltaDays, maxLeftDelta));

            nextX = startLeft + leftDelta * dw;
            nextDays = startDays - leftDelta;
        }

        onChange({ x: nextX, days: nextDays });
    };

    const onMouseUp = () => {
        isResizing.value = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
    };

    const start = (e: MouseEvent, s: 'left' | 'right') => {
        e.preventDefault();
        const bar = getBar();
        side = s;
        startX = e.clientX;
        startLeft = bar.x;
        startDays = bar.days;
        isResizing.value = true;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'col-resize';
    };

    onBeforeUnmount(onMouseUp);

    return {
        isResizing,
        startLeft: (e: MouseEvent) => start(e, 'left'),
        startRight: (e: MouseEvent) => start(e, 'right'),
    };
}
