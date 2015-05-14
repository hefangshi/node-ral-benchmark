var http = require('http');
var server = http.createServer(function (req, res) {
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