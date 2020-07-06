const Elevator = require('../dist/lift');

let lift = new Elevator();

lift.setConfig(function() {
    return {
        a: 1,
        b: 2
    };
});

lift.use(function() {
    // do something
    const {a, b} = this.config;

    this.next(1, a + b);
});

lift.use(function(data) {
    // do something
    const {a, b} = this.config;

    this.next(1, a + b + data);
});

lift.invoke(function(data) {
    console.info(data);
});