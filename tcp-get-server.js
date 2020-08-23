const net = require('net');
const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    // 解析请求
    let request = data.toString();
    console.log(request);
    let [requestLine, ...headerRows] = request.split('\r\n');
    let [method, path] = requestLine.split(' ');
    // splice(0, -2) 就是把字符串的后两个字符截取掉
    let headers = headerRows.slice(0, -2).reduce((memo, row) => {
      let [key, value] = row.split(': ');
      memo[key] = value;
      return memo;
    }, {});
    console.log('method', method);
    console.log('path', path);
    console.log('headers', headers);

    // 构建响应
    let rows = [];
    rows.push(`HTTP/1.1 200 OK`);
    rows.push(`Context-type: text-plain`);
    rows.push(`Date: ${new Date().toGMTString()}`);
    rows.push(`Connection: keep-alive`);
    rows.push(`Transfer-Encoding: chunked`);
    let responseBody = 'get';
    // 3
    // get
    // 0    0 表示响应体的结束

    // 响应体
    // 返回responseBody的字节长度
    rows.push(`\r\n${Buffer.byteLength(responseBody).toString(16)}\r\n${responseBody}\r\n0`);
    let response = rows.join('\r\n');
    socket.end(response);
  });
});
server.on('error', (err) => {
  console.error('失败了', err);
});

server.listen(8080, () => {
  console.log('服务器已经启动', server.address());
});
