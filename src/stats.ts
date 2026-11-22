export const instantWPM = (cps: number): number => (cps * 60) / 5;
//this is just the formula for cps to wpm but in my program i happen to use it for only instantaneous calcs mostly
export const accuracy = (interval: number, incorrect: number): number =>
    interval > 0 ? ((interval - incorrect) / interval) * 100 : 100;

export const normalized = (speed: number, acc: number): number => (speed * acc) / 100;

export const instantCPS = (now: number, last: number, previous: number): number =>
    now - last !== 0 ? 1000 / (now - last) : previous;

export const avgCPS = (interval: number, totalMs: number): number =>
    totalMs > 0 ? (1000 * interval) / totalMs : 0;

export const avgWPM = (interval: number, totalMs: number): number =>
    instantWPM(avgCPS(interval, totalMs)); //basically converting avg cps to avg wpm using the cps to wpm function

export const maxTimeGap = 2000;
export const affectsAverage = (gap: number): boolean => gap <= maxTimeGap;