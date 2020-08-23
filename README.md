<!--
 * @file: description
 * @author: zhangxing
 * @Date: 2020-08-23 10:47:17
 * @LastEditors: zhangxing
 * @LastEditTime: 2020-08-23 18:02:32
-->

HTTP 是协议名， http 是实现 http 协议的模块，应用层，解析数据

TCP 是协议名，net 是实现 TCP 协议的模块，传输层，与内容无关

#### get

请求

```
 GET /get HTTP/1.1\r\n
 Host: localhost:8080\r\n
 Connection: keep-alive\r\n
 User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36\r\n
 Accept: */*\r\n
 Sec-Fetch-Site: same-origin\r\n
 Sec-Fetch-Mode: cors\r\n
 Sec-Fetch-Dest: empty\r\n
 Referer: http://localhost:8080/get.html\r\n
 Accept-Encoding: gzip, deflate, br\r\n
 Accept-Language: zh-CN,zh;q=0.9,en;q=0.8\r\n
 Cookie: _did=web_719284726C70A566; lbcookie=4\r\n
 \r\n
```

响应

```
 HTTP/1.1 200 OK\r\n
 Context-type: text-plain\r\n
 Date: Fri, 21 Aug 2020 10:15:16 GMT\r\n
 Connection: keep-alive\r\n
 Transfer-Encoding: chunked\r\n  // 设置这个响应头就会返回下面的内容 : \r\n\r\n3\r\nget\r\n0
 \r\n
 3\r\n // 3是'get'的长度, 十六进制
 get\r\n
 0
```

#### post

请求

```
POST /post HTTP/1.1\r\n
Host: 127.0.0.1:8080\r\n
Connection: keep-alive\r\n
Content-Type: application/json\r\n
Content-Length: 13\r\n
\r\n
{"name":"zx"}
```

响应

```
HTTP/1.1 200 OK\r\n
Context-type: text-plain\r\n
Date: Sun, 23 Aug 2020 07:57:44 GMT\r\n
Connection: keep-alive\r\n
Transfer-Encoding: chunked\r\n
\r\n
d\r\n // 十六进制
{"name":"zx"}\r\n
0
```
