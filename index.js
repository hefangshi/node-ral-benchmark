var async = require('async');
var now = require('performance-now');
var count = 2000;
var limit = 200;

function startBenchmark(name, func, callback) {
    var tasks = [];
    for (var i = 0; i < count; i++) {
        tasks.push(func);
    }
    var start = now();
    async.parallelLimit(tasks, limit, function (err, results) {
        var end = now();
        var failCount = 0;
        var succCount = 0;
        var lastErr;
        results.forEach(function (data) {
            if (data.err) {
                lastErr = data.err;
                failCount++;
            } else {
                succCount++;
            }
        });
        lastErr = lastErr || 'none';
        console.log(name,
            'qps:', Math.round(count / (end - start) * 1000),
            'time:', (end - start).toFixed(3), 'ms',
            'succ:', succCount, 'failed:', failCount, 'lastError:', lastErr);
        callback();
    });
}


var tasks = [

    function (cb) {
        startBenchmark('0ms_client', require('./ping_client/index.js').run('/ping'), cb);
    },
    function (cb) {
        startBenchmark('0ms_client_no_log', require('./ping_client_no_log/index.js').run('/ping'), cb);
    },
    function (cb) {
        startBenchmark('800ms_client', require('./ping_client/index.js').run('/slowping'), cb);
    },
    function (cb) {
        startBenchmark('800ms_client_no_log', require('./ping_client_no_log/index.js').run('/slowping'),
            cb);
    }
];
async.series(tasks, function () {});