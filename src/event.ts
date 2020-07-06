interface evtMap {
    [key: string]: Array<Function>
}
export default class Evt {
    private eventMap: evtMap
    constructor() {
        this.eventMap = {};
    }

    on(type: string, fn: Function) {
        !this.eventMap[type] && (this.eventMap[type] = []);
        this.eventMap[type].push(fn);
    }

    emit(type: string, ...args: any[]) {
        if (!this.eventMap[type]) return;
        for (let i = 0, arr = this.eventMap[type]; i < arr.length; i++) {
            arr[i](...args);
        }
    }

    off(type?: string, fn?: Function) {
        if (!type) {
            this.eventMap = {};
        }
        else if (type && !fn) {
            this.eventMap[type] = [];
        }
        else if (fn && this.eventMap[type]) {
            const index = this.eventMap[type].indexOf(fn);
            index > -1 && this.eventMap[type].splice(index, 1);
        }
    }

    one(type: string, fn: Function) {
        let bfn: Function;
        this.on(type, bfn = (...args: any[]) => {
            fn(...args);
            this.off(type, bfn);
        });
    }
}
