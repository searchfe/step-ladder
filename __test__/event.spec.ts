import Evt from '../src/event';

let e: Evt;

beforeEach(() => {
    e = new Evt();
});

it('create a Evt instance', () => {
    expect(e).toBeTruthy();
});

it('test on、emit method', () => {
    const mockCb1ForEvt1 = jest.fn((x: any): any => x);
    const mockCb2ForEvt1 = jest.fn((x: number): number => x + 1);

    e.on('evt1', mockCb1ForEvt1);
    e.on('evt1', mockCb2ForEvt1);

    e.emit('evt1', 10);
    expect(mockCb1ForEvt1).toHaveBeenCalledWith(10);
    expect(mockCb2ForEvt1).toHaveBeenCalledWith(10);
    expect(mockCb1ForEvt1.mock.results[0].value).toBe(10);
    expect(mockCb2ForEvt1.mock.results[0].value).toBe(11);

    const mockCb1ForEvt2 = jest.fn((x: number): number => x + 3);
    e.on('evt2', mockCb1ForEvt2);
    e.emit('evt2', 20);
    expect(mockCb1ForEvt2).toHaveBeenCalledWith(20);
    expect(mockCb1ForEvt2.mock.results[0].value).toBe(23);

    e.emit('evt2', 30);
    expect(mockCb1ForEvt2).toHaveBeenCalledWith(30);
    expect(mockCb1ForEvt2.mock.results[1].value).toBe(33);
});

it('test off method', () => {
    const mockCb1ForEvt3 = jest.fn((x: number): number => x + 2);
    e.on('evt3', mockCb1ForEvt3);
    e.off('evt3', mockCb1ForEvt3);
    e.emit('evt3', 10);
    expect(mockCb1ForEvt3).not.toHaveBeenCalled();

    const mockCb1ForEvt4 = jest.fn((x: number): number => x + 1);
    e.on('evt4', mockCb1ForEvt4);
    e.off('evt4');
    e.emit('evt4', 10);
    expect(mockCb1ForEvt4).not.toHaveBeenCalled();

    const mockCb1ForEvt5 = jest.fn((x: number): number => x + 1);
    e.on('evt5', mockCb1ForEvt4);
    e.off();
    e.emit('evt5', 10);
    expect(mockCb1ForEvt5).not.toHaveBeenCalled();
});

it('test one method', () => {
    const mockCb1ForEvt1 = jest.fn((x: any): any => x);
    e.one('evt1', mockCb1ForEvt1);
    e.emit('evt1', 10);
    expect(mockCb1ForEvt1).toHaveBeenCalledWith(10);
    expect(mockCb1ForEvt1.mock.results[0].value).toBe(10);

    e.emit('evt1', 11);
    expect(mockCb1ForEvt1.mock.results[1]).toBeUndefined();
});
