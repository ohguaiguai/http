const net = require('net');
const Parer = require('./Parser');
const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    // 解析请求
    let parser = new Parer();
    let { method, url, headers, body } = parser.parse(data);
    console.log('method', method);
    console.log('url', url);
    console.log('headers', headers);
    console.log('body', body);
    let rows = [];
    rows.push(`HTTP/1.1 200 OK`);
    rows.push(`Context-type: text-plain`);
    rows.push(`Date: ${new Date().toGMTString()}`);
    rows.push(`Connection: keep-alive`);
    rows.push(`Transfer-Encoding: chunked`);
    rows.push(`\r\n${Buffer.byteLength(body).toString(16)}\r\n${body}\r\n0`);
    let response = rows.join('\r\n');
    socket.end(response);
  });
});
server.on('error', (err) => {
  console.error(err);
});

server.listen(8080, () => {
  console.log('服务器已经启动', server.address());
});
