const Elevator = require('../dist/lift');

let lift = new Elevator();

lift.setConfig(function() {
    return {
        list: [1, 2, 3]
    };
});

lift.use(function() {
    // do something
    this.next(1, this.config.list);
});

lift.useSome([function(data){
    if (data === 1) {
        this.cb('first');
    }
}, function(data){
    if (data === 2) {
        this.cb('second');
    }
}, function(data){
    if (data === 3) {
        this.cb('third');
    }
}]);

lift.use(function(data) {
    // do something
    this.next(1, data);
});

lift.invoke(function(data) {
    console.info(data);
});