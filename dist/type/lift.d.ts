import Evt from './event';
export default class Elevator extends Evt {
    private index;
    private pool;
    private finalFn;
    private config;
    constructor();
    setConfig(cb: Function): void;
    up(currentCbIndex: number): (n?: number) => void;
    next(currentCbIndex: number): (n?: number, result?: any) => void;
    end(result?: any): void;
    use(cb: Function): void;
    useSome(arr: Array<Function>): void;
    useEvery(arr: Array<Function>): void;
    invoke(cb: Function): void;
    start(n?: number): void;
}
