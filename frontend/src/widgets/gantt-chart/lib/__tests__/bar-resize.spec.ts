import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useGanttBarResize } from '../composables/useGanttBarResize';

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

describe('useGanttBarResize', () => {
    describe('правый край', () => {
        it('растягивает ширину, снапуя по дням', () => {
            const onChange = vi.fn();
            const { isResizing, ghostX, ghostDays, startRight } = useGanttBarResize(
                () => ({ x: 0, days: 2 }),
                { dayWidth: 100, minDays: 1, maxX: 500, onChange }
            );

            startRight(mouse({ clientX: 300 }));
            expect(isResizing.value).toBe(true);
            expect(ghostX.value).toBe(0);
            expect(ghostDays.value).toBe(2);

            move(450); // delta 150px → 2 дня → days = 4
            expect(ghostDays.value).toBe(4);

            up(450);
            expect(isResizing.value).toBe(false);
            expect(onChange).toHaveBeenCalledWith({ x: 0, days: 4 });
        });

        it('не позволяет сжать меньше minDays', () => {
            const onChange = vi.fn();
            const { ghostDays, startRight } = useGanttBarResize(() => ({ x: 0, days: 2 }), {
                dayWidth: 100,
                minDays: 1,
                maxX: 500,
                onChange,
            });

            startRight(mouse({ clientX: 300 }));
            move(100); // delta −200px → −2 дня → days = 0 → clamp до 1
            expect(ghostDays.value).toBe(1);
        });

        it('не позволяет выйти за maxX', () => {
            const onChange = vi.fn();
            const { ghostDays, startRight } = useGanttBarResize(() => ({ x: 0, days: 2 }), {
                dayWidth: 100,
                minDays: 1,
                maxX: 300,
                onChange,
            });

            startRight(mouse({ clientX: 300 }));
            move(700); // delta 400px → 4 дня → days = 6, но maxDays = floor(300/100) = 3
            expect(ghostDays.value).toBe(3);
        });
    });

    describe('левый край', () => {
        it('сдвигает x и компенсирует ширину, сохраняя правый край', () => {
            const onChange = vi.fn();
            const { ghostX, ghostDays, startLeft } = useGanttBarResize(
                () => ({ x: 200, days: 3 }),
                { dayWidth: 100, minDays: 1, minX: 0, maxX: 1000, onChange }
            );

            startLeft(mouse({ clientX: 400 }));
            move(250); // delta −150px → −1.5 дня → снап −1
            expect(ghostX.value).toBe(100);
            expect(ghostDays.value).toBe(4);
            // правый край неизменен: 200 + 3*100 = 100 + 4*100 = 500
        });

        it('не даёт выйти за minX', () => {
            const onChange = vi.fn();
            const { ghostX, ghostDays, startLeft } = useGanttBarResize(
                () => ({ x: 200, days: 3 }),
                { dayWidth: 100, minDays: 1, minX: 0, maxX: 1000, onChange }
            );

            startLeft(mouse({ clientX: 400 }));
            move(-1000); // delta −14 дней → clamp до minLeftDelta = −2
            expect(ghostX.value).toBe(0);
            expect(ghostDays.value).toBe(5);
        });

        it('не даёт сжать меньше minDays', () => {
            const onChange = vi.fn();
            const { ghostX, ghostDays, startLeft } = useGanttBarResize(
                () => ({ x: 200, days: 3 }),
                { dayWidth: 100, minDays: 1, minX: 0, maxX: 1000, onChange }
            );

            startLeft(mouse({ clientX: 400 }));
            move(600); // delta 200px → 2 дня → clamp до maxLeftDelta = 2
            expect(ghostX.value).toBe(400);
            expect(ghostDays.value).toBe(1);
        });
    });

    it('не вызывает onChange, если размер не изменился', () => {
        const onChange = vi.fn();
        const { startRight } = useGanttBarResize(() => ({ x: 0, days: 2 }), {
            dayWidth: 100,
            minDays: 1,
            maxX: 1000,
            onChange,
        });

        startRight(mouse({ clientX: 300 }));
        move(340); // delta 40px → меньше полудня → days остаётся 2
        up(340);

        expect(onChange).not.toHaveBeenCalled();
    });
});
