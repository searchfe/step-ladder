export default class Evt {
    private eventMap;
    constructor();
    on(type: string, fn: Function): void;
    emit(type: string, ...args: any[]): void;
    off(type?: string, fn?: Function): void;
    one(type: string, fn: Function): void;
}
