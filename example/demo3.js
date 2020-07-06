const Elevator = require('../dist/lift');

let lift = new Elevator();

lift.setConfig(function() {
    return {
        n: 1
    };
});

lift.use(function() {
    // do something
    this.next(1, this.config.n);
});

lift.useEvery([function(data){

    this.cb(data + 1);

}, function(data){

    this.cb(data + 2);

}, function(data){

    this.cb(data + 3);
    
}]);

lift.use(function(data) {
    // do something
    this.next(1, data);
});

lift.invoke(function(data) {
    console.info(data);
});