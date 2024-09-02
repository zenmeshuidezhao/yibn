// t=> 当前时间，b=> 起点，c=> 终点，d=> 总时间
export function easeInOutCubic(t: number, b: number, c: number, d: number) {
    const cc = c - b;
    t /= d / 2;

    if (t < 1) {
        return (cc / 2) * t * t * t + b;
    }

    return (cc / 2) * ((t -= 2) * t * t + 2) + b
}