var async = require('async');
var http = require('http');
var now = require('performance-now');
var count = 8000;
var argv = process.argv.splice(2);
var limit = argv[0] || 100;
// var agent = require('webkit-devtools-agent');
// agent.start({
//     port: 9999,
//     bind_to: '0.0.0.0',
//     ipc_port: 3333,
//     verbose: true
// });
// console.log('test with', limit, 'concurrency');

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

function httpRequest(callback) {
    var options = {
        host: '127.0.0.1',
        path: '/ping',
        port: 8195,
        method: 'GET',
        agent: false
    };

    var req = http.request(options, function (res) {
        if (res.statusCode > 200) {
            callback(null, new Error('503'));
        } else {
            req.on('close', function (data) {
                callback(null, {});
            });
        }
    });
    req.on('error', function (err) {
        callback(null, err);
    });
    req.end();
}

// http.createServer(function (req, res) {
var tasks = [

    function (cb) {
        startBenchmark('0ms_client', require('./ping_client/index.js').run('/ping'), cb);
    },
    function (cb) {
        setTimeout(function () {
            cb && cb();
        }, 10000);
    },
    function (cb) {
        startBenchmark('http', httpRequest, cb);
    },
    function (cb) {
        setTimeout(function () {
            cb && cb();
        }, 10000);
    },
    function (cb) {
        startBenchmark('0ms_client_no_log', require('./ping_client_no_log/index.js').run('/ping'), cb);
    }
    // function (cb) {
    //     startBenchmark('800ms_client', require('./ping_client/index.js').run('/slowping'), cb);
    // },
    // function (cb) {
    //     startBenchmark('800ms_client_no_log', require('./ping_client_no_log/index.js').run('/slowping'),
    //         cb);
    // }
];
async.series(tasks, function () {
    // res.end('end');
});
// }).listen(8000);