var RAL = require('node-ral').RAL;
var path = require('path');
var assert = require('assert');

// 初始化RAL，只需在程序入口运行一次
RAL.init({
    // 指定RAL配置目录
    confDir: path.join(__dirname, 'config')
});

module.exports.run = function (requestPath) {
    return function (cb) {
        RAL('SERVER', {
            data: {},
            path: requestPath
        }).on('data', function (data) {
            cb && cb(null, data);
        }).on('error', function (err) {
            cb && cb(null, {
                err: err
            });
        });
    };
};