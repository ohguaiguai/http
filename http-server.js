const http = require('http');
const fs = require('fs');
const path = require('path');
const server = http.createServer(function (req, res) {
  if (['/get.html'].includes(req.url)) {
    res.writeHead(200, { 'Context-type': 'text-html' });
    res.end(fs.readFileSync(path.join(__dirname, 'static', req.url.slice(1))));
  } else if (req.url === '/get') {
    res.writeHead(200, { 'Context-type': 'text-plain' });
    res.end('get');
  }
});
server.listen(8080);
