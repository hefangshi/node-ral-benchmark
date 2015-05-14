var http = require('http');
var cluster = require('cluster');
var http = require('http');
var numCPUs = 5;

if (cluster.isMaster) {
    console.log("master start...");

    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('listening', function (worker, address) {
        console.log('listening: worker ' + worker.process.pid + ', Address: ' + address.address + ":" + address.port);
    });

    cluster.on('exit', function (worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    });
} else {
    http.createServer(function (req, res) {
        switch (req.url) {
        case '/slowping':
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            setTimeout(function () {
                res.end('pong');
            }, 800);
            break;
        case '/ping':
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('pong');
            break;
        default:
            res.end('end');
        }

    }).listen(9095);
}