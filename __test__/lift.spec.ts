import Elevator from '../src/lift';

let elev: Elevator;

beforeEach(() => {
    elev = new Elevator();
});

it('create a Elevator instance', () => {
    expect(elev).toBeTruthy();
});

it('test setConfig method', () => {
    const mockFn = jest.fn(() => ({a: 1}));

    elev.setConfig(mockFn);
    expect(mockFn).toHaveBeenCalled();
    expect(mockFn.mock.results[0].value).toEqual({a: 1});
});

it('test invoke method', () => {
    let result = null;
    elev.invoke(() => {
        result = {a: 1};
    });
    expect(result).toEqual({a: 1});
});

it('test use without execute next method', () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const mockFn3 = jest.fn();
    elev.use(mockFn1);
    elev.use(mockFn2);
    elev.invoke(mockFn3);

    expect(mockFn1).toHaveBeenCalled();
    expect(mockFn2).not.toHaveBeenCalled();
    expect(mockFn3).not.toHaveBeenCalled();
});

it('test use with execute next method', () => {
    interface Context {
        next: (n: number, result?: any) => void
    }

    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const mockFn3 = jest.fn();

    const fn1 =  function (this: Context) {
        mockFn1();
        this.next(1, 11);
    };
    const fn2 =  function (this: Context, data: any) {
        mockFn2(data);
        this.next(1, 12);
    };
    const fn3 =  function (this: Context, data: any) {
        mockFn3(data);
    };

    elev.use(fn1);
    elev.use(fn2);
    elev.invoke(fn3);

    expect(mockFn1).toHaveBeenCalled();
    expect(mockFn2).toHaveBeenCalledWith(11);
    expect(mockFn3).toHaveBeenCalledWith(12);
});

it('test use with execute next method for skip some steps', () => {
    interface Context {
        next: (n: number, result?: any) => void
    }

    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const mockFn3 = jest.fn();
    const mockFn4 = jest.fn();
    const mockFn5 = jest.fn();

    const fn1 =  function (this: Context) {
        mockFn1();
        this.next(2, 11);
    };
    const fn2 =  function (this: Context, data: any) {
        mockFn2(data);
        this.next(1, 12);
    };
    const fn3 =  function (this: Context, data: any) {
        mockFn3(data);
        this.next(10, 13);
    };
    const fn4 =  function (this: Context, data: any) {
        mockFn4(data);
        this.next(1, 14);
    };
    const fn5 =  function (this: Context, data: any) {
        mockFn5(data);
    };

    elev.use(fn1);
    elev.use(fn2);
    elev.use(fn3);
    elev.use(fn4);
    elev.invoke(fn5);

    expect(mockFn1).toHaveBeenCalled();
    expect(mockFn2).not.toHaveBeenCalled();
    expect(mockFn3).toHaveBeenCalledWith(11);
    expect(mockFn4).not.toHaveBeenCalled();
    expect(mockFn5).toHaveBeenCalledWith(13);
});

it('test use with execute up method', () => {
    interface Context {
        next: (n?: number, result?: any) => void;
        up: (n?: number) => void;
    }

    let n = 1;

    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const mockFn3 = jest.fn();
    const mockFn4 = jest.fn();
    const mockFn5 = jest.fn();

    const fn1 =  function (this: Context) {
        mockFn1();
        this.next(1, 1);
    };
    const fn2 =  function (this: Context, data: any) {
        if (n === 1) {
            n++;
            this.up();
            return;
        }
        mockFn2(data);
        this.next(1, 2);
    };
    const fn3 =  function (this: Context, data: any) {
        mockFn3(data);
        this.next();
    };
    const fn4 =  function (this: Context, data: any) {
        if (n === 2) {
            n++;
            this.up(10);
            return;
        }
        mockFn4(data);
        this.next(1, 14);
    };
    const fn5 =  function (this: Context, data: any) {
        mockFn5(data);
    };

    elev.use(fn1);
    elev.use(fn2);
    elev.use(fn3);
    elev.use(fn4);
    elev.invoke(fn5);

    expect(mockFn1.mock.calls.length).toBe(3);
    expect(mockFn2.mock.calls.length).toBe(2);
    expect(mockFn3.mock.calls.length).toBe(2);
    expect(mockFn4.mock.calls.length).toBe(1);
});

it('test useEvery method', () => {
    interface Context {
        next: (n: number, result?: any) => void;
    };
    interface InnerContext {
        cb: (result?: any) => void;
    };

    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const mockFn3 = jest.fn();
    const mockFn4 = jest.fn();
    const mockFn5 = jest.fn();

    const fn1 =  function (this: Context) {
        mockFn1();
        this.next(1, 11);
    };
    const fn2 =  function (this: InnerContext, data: any) {
        mockFn2(data);
        this.cb(12);
    };
    const fn3 =  function (this: InnerContext, data: any) {
        mockFn3(data);
        this.cb(13);
    };
    const fn4 =  function (this: InnerContext, data: any) {
        mockFn4(data);
        this.cb(14);
    };
    const fn5 =  function (this: Context, data: any) {
        mockFn5(data);
    };

    elev.use(fn1);
    elev.useEvery([fn2, fn3, fn4]);
    elev.invoke(fn5);

    expect(mockFn1).toHaveBeenCalled();
    expect(mockFn2).toHaveBeenCalledWith(11);
    expect(mockFn3).toHaveBeenCalledWith(11);
    expect(mockFn4).toHaveBeenCalledWith(11);
    expect(mockFn5).toHaveBeenCalledWith([12, 13, 14]);

    expect(elev.useEvery([])).toBeUndefined();
});

it('test useSome method', () => {
    interface Context {
        next: (n: number, result?: any) => void;
    };
    interface InnerContext {
        cb: (result?: any) => void;
    };

    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const mockFn3 = jest.fn();
    const mockFn4 = jest.fn();
    const mockFn5 = jest.fn();

    const fn1 =  function (this: Context) {
        mockFn1();
        this.next(1, [10, 20, 30]);
    };
    const fn2 =  function (this: InnerContext, data: any) {
        mockFn2(data);
        this.cb(data === 10 ? data + 10 : false);
    };
    const fn3 =  function (this: InnerContext, data: any) {
        mockFn3(data);
        this.cb(data === 20 ? data + 10 : false);
    };
    const fn4 =  function (this: InnerContext, data: any) {
        mockFn4(data);
        this.cb(data === 30 ? data + 10 : false);
    };
    const fn5 =  function (this: Context, data: any) {
        mockFn5(data);
    };

    elev.use(fn1);
    elev.useSome([fn2, fn3, fn4]);
    elev.invoke(fn5);

    expect(mockFn1).toHaveBeenCalled();
    expect(mockFn2.mock.calls.length).toBe(3);
    expect(mockFn3.mock.calls.length).toBe(3);
    expect(mockFn4.mock.calls.length).toBe(3);
    expect(mockFn5).toHaveBeenCalledWith([20, 30, 40]);
});

it('test useSome method and condition does not match', () => {
    interface Context {
        next: (n: number, result?: any) => void;
    };
    interface InnerContext {
        cb: (result?: any) => void;
    };

    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const mockFn3 = jest.fn();
    const mockFn4 = jest.fn();
    const mockFn5 = jest.fn();
    const mockFn6 = jest.fn();
    const mockFn7 = jest.fn();
    const mockFn8 = jest.fn();

    const fn1 =  function (this: Context) {
        mockFn1();
        this.next(1, [1, 2, 3]);
    };
    const fn2 =  function (this: InnerContext, data: any) {
        mockFn2(data);
        this.cb(data === 10 ? data + 10 : false);
    };
    const fn3 =  function (this: InnerContext, data: any) {
        mockFn3(data);
        this.cb(data === 20 ? data + 10 : false);
    };
    const fn4 =  function (this: InnerContext, data: any) {
        mockFn4(data);
        this.cb(data === 30 ? data + 10 : false);
    };
    const fn5 =  function (this: Context, data: any) {
        mockFn5(data);
        this.next(1, data);
    };

    const fn6 =  function (this: InnerContext, data: any) {
        mockFn6(data);
        this.cb();
    };
    const fn7 =  function (this: InnerContext, data: any) {
        mockFn7(data);
        this.cb();
    };

    elev.use(fn1);
    elev.useSome([fn2, fn3, fn4]);
    elev.use(fn5);
    elev.useSome([fn6, fn7]);
    elev.invoke(mockFn8);

    expect(mockFn1).toHaveBeenCalled();
    expect(mockFn2.mock.calls.length).toBe(3);
    expect(mockFn3.mock.calls.length).toBe(3);
    expect(mockFn4.mock.calls.length).toBe(3);
    expect(mockFn5).toHaveBeenCalledWith([]);
    expect(mockFn6).not.toHaveBeenCalled();
    expect(mockFn7).not.toHaveBeenCalled();
    expect(mockFn8).toHaveBeenCalledWith([]);
});

it('test start method', () => {
    interface Context {
        next: (n?: number, result?: any) => void;
    };

    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const mockFn3 = jest.fn();

    const fn1 =  function (this: Context) {
        mockFn1();
        this.next();
    };
    const fn2 =  function (this: Context, data: any) {
        mockFn2(data);
        this.next();
    };
    const fn3 =  function (this: Context, data: any) {
        mockFn3(data);
        this.next();
    };

    elev.use(fn1);
    elev.use(fn2);
    elev.use(fn3);

    expect(mockFn1).not.toHaveBeenCalled();
    expect(mockFn2).not.toHaveBeenCalled();
    expect(mockFn3).not.toHaveBeenCalled();

    elev.start(1);

    expect(mockFn1).not.toHaveBeenCalled();
    expect(mockFn2).toHaveBeenCalled();
    expect(mockFn3).toHaveBeenCalled();
});
