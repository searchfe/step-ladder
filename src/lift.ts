import Evt from './event';

export default class Elevator extends Evt {
    private index: number = -1;
    private pool: Function[] = [];
    private finalFn: Function = () => {};
    private config: any;
    constructor() {
        super();
    }

    setConfig(cb: Function) {
        this.config = cb();
    }

    up(currentCbIndex: number) {
        return (n: number = 1) => {
            const arriveIndex = currentCbIndex - n;
            if (arriveIndex < 0) {
                this.pool[0]();
            }
            else {
                this.pool[arriveIndex]();
            }
        };
    }

    next(currentCbIndex: number) {
        return (n: number = 1, result?: any) => {
            let arriveIndex = currentCbIndex + n;
            let poolSize = this.pool.length;
            if (arriveIndex > poolSize - 1) {
                this.end(result);
            }
            else {
                this.pool[arriveIndex](result);
            }
        };
    }

    end(result?: any) {
        this.finalFn(result);
    }

    use(cb: Function) {
        const cbIndex = ++this.index;
        let context = {
            up: this.up(cbIndex),
            next: this.next(cbIndex),
            end: this.end,
            config: this.config
        };

        this.pool.push(cb.bind(context));
    }

    useSome(arr: Array<Function>) {
        if (!arr || arr.length === 0) return;

        const cbIndex = ++this.index;
        let context = {
            next: this.next(cbIndex),
            config: this.config
        };
        this.pool.push((list: Array<any>) => {
            if (!list || list.length === 0) {
                context.next(1, []);
                return;
            }
            let totalCount = list.length;
            let executedCount = 0;
            let executedResult: Array<any> = [];

            let countMap = {};

            for (let j = 0; j < list.length; j++) {
                const item = list[j];
                for (let i = 0; i < arr.length; i++) {
                    let innerContext = {
                        order: j,
                        config: context.config,
                        cb(data?: any) {
                            if (countMap[`${this.order}`] === undefined) {
                                countMap[`${this.order}`] = 1;
                            }
                            else {
                                countMap[`${this.order}`]++;
                            }
                            if (data && !executedResult[this.order]) {
                                executedResult[this.order] = data;
                                executedCount++;
                            }
                            else if (countMap[`${this.order}`] === arr.length && !executedResult[this.order]) {
                                executedCount++;
                            }

                            if (executedCount === totalCount) {
                                context.next(1, executedResult);
                            }
                        }
                    };
                    arr[i].bind(innerContext)(item);
                }
            }
        });
    }

    useEvery(arr: Array<Function>) {
        if (!arr || arr.length === 0) return;

        const cbIndex = ++this.index;
        let context = {
            next: this.next(cbIndex),
            config: this.config
        };

        this.pool.push((result?: any) => {
            let totalCount = arr.length;
            let executedCount = 0;
            let executedResult: Array<any> = [];

            for (let i = 0; i < arr.length; i++) {
                let innerContext = {
                    fnIndex: i,
                    config: context.config,
                    cb(data?: any) {
                        executedResult[this.fnIndex] = data;
                        executedCount++;
                        if (executedCount === totalCount) {
                            context.next(1, executedResult);
                        }
                    }
                };
                arr[i].bind(innerContext)(result);
            }
        });
    }

    invoke(cb: Function) {
        if (!cb) return;

        this.finalFn = cb;
        if (this.pool.length > 0) {
            this.pool[0]();
        }
        else {
            this.finalFn();
        }
    }

    start(n: number = 0) {
        if (this.pool.length > 0 && this.pool[n]) {
            this.pool[n]();
        }
    }
};
