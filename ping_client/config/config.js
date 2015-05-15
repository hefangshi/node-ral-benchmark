module.exports.SERVER = {
    protocol: 'http',
    pack: 'querystring',
    unpack: 'string',
    method: 'GET',
    encoding: 'utf-8',
    balance: 'roundrobin',
    timeout: 2000,
    retry: 0,
    path: '/ping',
    server: [ // 可以配置多个后端地址
        {
            host: '127.0.0.1',
            port: 8195
        }
    ]
};