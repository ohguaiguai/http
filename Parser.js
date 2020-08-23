/**
 * @file: 使用状态机来解析请求, 不能再使用split，因为数据传输是流式的，而且可能很大
 * @author: zhangxing
 *
 *
 * @Date: 2020-08-23 15:51:16
 * @LastEditors: zhangxing
 * @LastEditTime: 2020-08-23 17:41:47
 */

// POST /post HTTP/1.1
// Host: 127.0.0.1:8080
// Connection: keep-alive
// Content-Length: 22
// User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36
// Content-Type: application/json
// Accept: */*
// Origin: http://127.0.0.1:8080
// Sec-Fetch-Site: same-origin
// Sec-Fetch-Mode: cors
// Sec-Fetch-Dest: empty
// Referer: http://127.0.0.1:8080/post.html
// Accept-Encoding: gzip, deflate, br
// Accept-Language: zh-CN,zh;q=0.9,en;q=0.8

// {"name":"zx","age":25}

let LF = 10, //换行  line feed
  CR = 13, //回车 carriage return
  SPACE = 32, //空格
  COLON = 58; //冒号
let PARSER_UNINITIALIZED = 0, //未解析
  START = 1, //开始解析
  REQUEST_LINE = 2, // 请求行
  HEADER_FIELD_START = 3, // 遇到请求头的key
  HEADER_FIELD = 4, // 处理请求头的key
  HEADER_VALUE_START = 5, // 遇到请求头的value
  HEADER_VALUE = 6, // 处理请求头的value
  READING_BODY = 7;
class Parser {
  constructor() {
    this.state = PARSER_UNINITIALIZED;
  }
  parse(buffer) {
    let self = this,
      requestLine = '',
      headers = {}, // 请求头
      body = '', // 请求体
      i = 0,
      char,
      state = START, //开始解析
      headerField = '',
      headerValue = '';
    console.log('请求', buffer.toString());
    for (i = 0; i < buffer.length; i++) {
      char = buffer[i];
      switch (state) {
        case START:
          state = REQUEST_LINE;
          self['requestLineMark'] = i; // 记录一下请求行开始的索引
        case REQUEST_LINE: // POST /post HTTP/1.1\r\n
          if (char == CR) {
            //换行 \r
            requestLine = buffer.toString('utf8', self['requestLineMark'], i);
            break;
          } else if (char == LF) {
            //回车 \n
            state = HEADER_FIELD_START;
          }
          break;
        case HEADER_FIELD_START: // Host: 127.0.0.1:8080
          if (char === CR) {
            // \r 说明该请求体了
            state = READING_BODY;
            self['bodyMark'] = i + 2; // 请求头和请求体之间有两个 \r\n
            break;
          } else {
            state = HEADER_FIELD;
            self['headerFieldMark'] = i;
          }
        case HEADER_FIELD: // Host
          if (char == COLON) {
            // 冒号
            headerField = buffer.toString('utf8', self['headerFieldMark'], i);
            state = HEADER_VALUE_START;
          }
          break;
        case HEADER_VALUE_START: // 127.0.0.1:8080
          if (char == SPACE) {
            // 空格
            break;
          }
          self['headerValueMark'] = i;
          state = HEADER_VALUE;
        case HEADER_VALUE:
          if (char === CR) {
            //
            headerValue = buffer.toString('utf8', self['headerValueMark'], i);
            headers[headerField] = headerValue;
            headerField = '';
            headerValue = '';
          } else if (char === LF) {
            state = HEADER_FIELD_START;
          }
          break;
        default:
          break;
      }
    }
    let [method, url] = requestLine.split(' ');
    body = buffer.toString('utf8', self['bodyMark'], i);
    return { method, url, headers, body };
  }
}
module.exports = Parser;
