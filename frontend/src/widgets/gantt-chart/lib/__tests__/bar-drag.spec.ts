import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useGanttBarDrag } from '../composables/useGanttBarDrag';

type Handler = (e: MouseEvent) => void;

const mouse = (partial: Partial<MouseEvent> = {}): MouseEvent =>
    ({ button: 0, clientX: 0, preventDefault: () => {}, ...partial }) as MouseEvent;

let handlers = new Map<string, Handler>();

beforeEach(() => {
    handlers = new Map();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.stubGlobal('document', {
        body: { style: {} as Record<string, string> },
        addEventListener: (_type: string, fn: Handler) => handlers.set(_type, fn),
        removeEventListener: (_type: string, fn: Handler) => handlers.set(_type, fn),
    });
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

const move = (clientX: number) => handlers.get('mousemove')!(mouse({ clientX }));
const up = (clientX: number) => handlers.get('mouseup')!(mouse({ clientX }));

describe('useGanttBarDrag', () => {
    it('не начинает перетаскивание по правой/средней кнопке', () => {
        const onChange = vi.fn();
        const { isDragging, start } = useGanttBarDrag(() => ({ x: 0, days: 2 }), {
            dayWidth: 100,
            onChange,
        });

        start(mouse({ button: 2 }));
        expect(isDragging.value).toBe(false);
        expect(handlers.has('mousemove')).toBe(false);
        expect(onChange).not.toHaveBeenCalled();
    });

    it('снапует позицию по сетке дней и вызывает onChange при отпускании', () => {
        const onChange = vi.fn();
        const { isDragging, ghostX, start } = useGanttBarDrag(() => ({ x: 0, days: 2 }), {
            dayWidth: 100,
            onChange,
        });

        start(mouse({ clientX: 300 }));
        expect(isDragging.value).toBe(true);
        expect(ghostX.value).toBe(0);

        move(450); // delta 150px → 1.5 дня → снап в 2 дня → 200px
        expect(ghostX.value).toBe(200);

        up(450);
        expect(isDragging.value).toBe(false);
        expect(onChange).toHaveBeenCalledWith({ x: 200 });
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('не вызывает onChange, если позиция на сетке не изменилась', () => {
        const onChange = vi.fn();
        const { start } = useGanttBarDrag(() => ({ x: 0, days: 2 }), {
            dayWidth: 100,
            onChange,
        });

        start(mouse({ clientX: 300 }));
        move(340); // delta 40px → меньше полудня → снап в 0
        up(340);

        expect(onChange).not.toHaveBeenCalled();
    });

    it('ограничивает позицию minX/maxX', () => {
        const onChange = vi.fn();
        const { ghostX, start } = useGanttBarDrag(() => ({ x: 0, days: 2 }), {
            dayWidth: 100,
            minX: 0,
            maxX: 150,
            onChange,
        });

        start(mouse({ clientX: 300 }));
        move(700); // delta 400px → 4 дня → 400px, но maxX = 150
        expect(ghostX.value).toBe(150);

        up(700);
        expect(onChange).toHaveBeenCalledWith({ x: 150 });
    });
});
