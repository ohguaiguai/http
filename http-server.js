const http = require('http');
const fs = require('fs');
const path = require('path');
const server = http.createServer(function (req, res) {
  if (['/get.html', '/post.html'].includes(req.url)) {
    res.writeHead(200, { 'Context-type': 'text-html' });
    res.end(fs.readFileSync(path.join(__dirname, 'static', req.url.slice(1))));
  } else if (req.url === '/get') {
    res.writeHead(200, { 'Context-type': 'text-plain' });
    res.end('get');
  } else if (req.url === '/post') {
    let buffers = [];
    // tcp传输的时候有可能会分包
    // on data 中拿到的只是请求体
    req.on('data', (data) => {
      buffers.push(data);
    });
    req.on('end', (data) => {
      console.log('method', req.method);
      console.log('url', req.url);
      console.log('headers', req.headers);
      let body = Buffer.concat(buffers);
      console.log('body', body.toString());
      res.statusCode = 200;
      res.setHeader('Context-type', 'text-plain');
      res.write(body);
      res.end();
    });
  } else {
    res.statusCode = 400;
    res.end();
  }
});
server.listen(8080);
