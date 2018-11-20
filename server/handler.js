const router = new (require('koa-router'))({prefix: '/handler'})
  , redis = require('./util/redis')
  , uuidv1 = require('uuid/v1')
  , date = require('date-and-time')
  , safeEval = require('safe-eval');

// get all handlers
router.get('/', async function (ctx) {
  const redisClient = redis.getConn();
  const handlers = await redisClient.hgetallAsync('monitor-man-handler');
  ctx.response.body = [];
  for (let id in handlers) {
    const handler = JSON.parse(handlers[id]);
    ctx.response.body.push(Object.assign({
      id: id
    }, handler));
  }
});

// get handler
router.get('/:id', async function (ctx) {
  const redisClient = redis.getConn();
  ctx.response.body = await redisClient.hgetAsync('monitor-man-handler', ctx.params.id);
});

// create handler
router.post('/', async function (ctx) {
  const redisClient = redis.getConn();
  let handler = {};
  handler['name'] = ctx.checkBody('name').notEmpty().value;
  handler['description'] = ctx.checkBody('description').notEmpty().value;
  handler['code'] = ctx.checkBody('code').notEmpty().value;
  if (ctx.errors) {
    ctx.response.status = 400;
    ctx.response.body = ctx.errors;
    return;
  }

  const handlerId = uuidv1();
  await redisClient.hsetAsync('monitor-man-handler', handlerId, JSON.stringify(handler));
  ctx.response.body = '';
});

// update handler
router.post('/:id/update', async function (ctx) {
  const redisClient = redis.getConn();
  let handler = {};
  handler['name'] = ctx.checkBody('name').notEmpty().value;
  handler['description'] = ctx.checkBody('description').notEmpty().value;
  handler['code'] = ctx.checkBody('code').notEmpty().value;
  if (ctx.errors) {
    ctx.response.status = 400;
    ctx.response.body = ctx.errors;
    return;
  }

  await redisClient.hsetAsync('monitor-man-handler', ctx.params.id, JSON.stringify(handler));
  ctx.response.body = '';
});

// remove handler
router.delete('/:id', async function (ctx) {
  const redisClient = redis.getConn();
  await redisClient.hdelAsync('monitor-man-handler', ctx.params.id);
  ctx.response.body = '';
});

// debug handler
router.post('/:id/debug', async function (ctx) {
  const code = ctx.checkBody('code').notEmpty().value;
  const handlerParams = {};
  const request = require('postman-request');
  const Socks5HttpsAgent = require('socks5-https-client/lib/Agent');
  const Socks5HttpAgent = require('socks5-http-client/lib/Agent');
  const sprintf = require("sprintf-js").sprintf;
  const vsprintf = require("sprintf-js").vsprintf;
  const redisClient = redis.getConn();
  const failures = JSON.parse('{"fcb42aa3-979c-4727-941e-32af45e515eb":{"failures":[{"error":{"name":"AssertionFailure","index":1,"message":"Status code is not 200","stack":"AssertionFailure: Expected tests[\\"Status code is not 200\\"] to be true-like\\n   at Object.eval test.js:2:1)","checksum":"7e996e6ca03a0ddc3e4d53524636a1ec","id":"0a5e556c-80dd-41fa-908c-47587c34bbd8","timestamp":1504343055227,"stacktrace":[{"fileName":"test.js","lineNumber":2,"functionName":"Object.eval","typeName":"Object","methodName":"eval","columnNumber":1,"native":false}]},"at":"assertion:1 in test-script","source":{"id":"58b137ed-1e88-453f-8405-685e09186509","name":"Test Assertion","request":{"url":"http://abc.com/test","method":"GET","body":{},"description":{"content":"","type":"text/plain"}},"response":[],"event":[{"listen":"test","script":{"type":"text/javascript","exec":["tests[\\"Status code is not 200\\"] = responseCode.code !== 200;"],"_lastExecutionId":"e5dc068a-e38a-4a5c-9365-fded0ae4c3ea"}}]},"parent":{"info":{"id":"c3a34a9d-a660-83a5-223a-54afb11ace02","name":"Test abc.com","schema":"https://schema.getpostman.com/json/collection/v2.0.0/collection.json"},"event":[],"variable":[],"item":[{"id":"58b137ed-1e88-453f-8405-685e09186509","name":"Test Assertion","request":{"url":"http://abc.com/test","method":"GET","body":{},"description":{"content":"","type":"text/plain"}},"response":[],"event":[{"listen":"test","script":{"type":"text/javascript","exec":["tests[\\"Status code is not 200\\"] = responseCode.code !== 200;"],"_lastExecutionId":"e5dc068a-e38a-4a5c-9365-fded0ae4c3ea"}}]},{"id":"4a6e6124-17f3-4d35-a606-4982dda5c77a","name":"Test Script Failures","request":{"url":"http://abc.com","method":"GET","body":{},"description":{"content":"","type":"text/plain"}},"response":[],"event":[{"listen":"test","script":{"type":"text/javascript","exec":["var jsonData = JSON.parse(responseBody);","tests[\\"Your test name\\"] = jsonData.value === 100;"],"_lastExecutionId":"acbea48a-825f-49fe-a62d-5db616e3d2a0"}}]}]},"cursor":{"position":0,"iteration":0,"length":2,"cycles":1,"empty":false,"eof":false,"bof":true,"cr":false,"ref":"fcb42aa3-979c-4727-941e-32af45e515eb"}}],"execution":{"cursor":{"position":0,"iteration":0,"length":2,"cycles":1,"empty":false,"eof":false,"bof":true,"cr":false,"ref":"fcb42aa3-979c-4727-941e-32af45e515eb"},"item":{"id":"58b137ed-1e88-453f-8405-685e09186509","name":"Test Assertion","request":{"url":"http://abc.com/test","method":"GET","body":{},"description":{"content":"","type":"text/plain"}},"response":[],"event":[{"listen":"test","script":{"type":"text/javascript","exec":["tests[\\"Status code is not 200\\"] = responseCode.code !== 200;"],"_lastExecutionId":"e5dc068a-e38a-4a5c-9365-fded0ae4c3ea"}}]},"request":{"url":"http://abc.com/test","method":"GET","header":[{"key":"User-Agent","value":"PostmanRuntime/6.2.5"},{"key":"Accept","value":"*/*"},{"key":"Host","value":"abc.com"},{"key":"accept-encoding","value":"gzip, deflate"}],"body":{},"description":{"content":"","type":"text/plain"}},"response":{"id":"d84c359e-59f7-4133-a803-a4a28ca99351","status":"OK","code":200,"header":[{"key":"Server","value":"openresty"},{"key":"Date","value":"Sat, 02 Sep 2017 09:04:15 GMT"},{"key":"Content-Type","value":"application/json; charset=utf-8"},{"key":"Transfer-Encoding","value":"chunked"},{"key":"Connection","value":"keep-alive"}],"stream":"[\\"天气\\",[\\"天气预报\\",\\"天气预报15天查询\\",\\"天气查询\\",\\"天气预报查询一周\\",\\"天气预报查询一周15天\\",\\"天气通\\"]]\\n","cookie":[],"responseTime":40,"responseSize":140},"id":"58b137ed-1e88-453f-8405-685e09186509","assertions":[{"assertion":"Status code is not 200","error":{"name":"AssertionFailure","index":1,"message":"Status code is not 200","stack":"AssertionFailure: Expected tests[\\"Status code is not 200\\"] to be true-like\\n   at Object.eval test.js:2:1)"}}]}},"0f661e64-2e66-4219-9300-7ebc50e79257":{"failures":[{"error":{"type":"Error","name":"JSONError","message":"Unexpected token \'<\' at 1:1\\n<html>\\n^","checksum":"b7db65fd7db5667f384af70acdddcfb0","id":"a5662684-90e6-4606-937f-507bfb530e01","timestamp":1504343055274,"stacktrace":[]},"at":"test-script","source":{"id":"4a6e6124-17f3-4d35-a606-4982dda5c77a","name":"Test Script Failures","request":{"url":"http://abc.com","method":"GET","body":{},"description":{"content":"","type":"text/plain"}},"response":[],"event":[{"listen":"test","script":{"type":"text/javascript","exec":["var jsonData = JSON.parse(responseBody);","tests[\\"Your test name\\"] = jsonData.value === 100;"],"_lastExecutionId":"acbea48a-825f-49fe-a62d-5db616e3d2a0"}}]},"parent":{"info":{"id":"c3a34a9d-a660-83a5-223a-54afb11ace02","name":"Test abc.com","schema":"https://schema.getpostman.com/json/collection/v2.0.0/collection.json"},"event":[],"variable":[],"item":[{"id":"58b137ed-1e88-453f-8405-685e09186509","name":"Test Assertion","request":{"url":"http://abc.com/test","method":"GET","body":{},"description":{"content":"","type":"text/plain"}},"response":[],"event":[{"listen":"test","script":{"type":"text/javascript","exec":["tests[\\"Status code is not 200\\"] = responseCode.code !== 200;"],"_lastExecutionId":"e5dc068a-e38a-4a5c-9365-fded0ae4c3ea"}}]},{"id":"4a6e6124-17f3-4d35-a606-4982dda5c77a","name":"Test Script Failures","request":{"url":"http://abc.com","method":"GET","body":{},"description":{"content":"","type":"text/plain"}},"response":[],"event":[{"listen":"test","script":{"type":"text/javascript","exec":["var jsonData = JSON.parse(responseBody);","tests[\\"Your test name\\"] = jsonData.value === 100;"],"_lastExecutionId":"acbea48a-825f-49fe-a62d-5db616e3d2a0"}}]}]},"cursor":{"ref":"0f661e64-2e66-4219-9300-7ebc50e79257","length":2,"cycles":1,"position":1,"iteration":0}}],"execution":{"cursor":{"ref":"0f661e64-2e66-4219-9300-7ebc50e79257","length":2,"cycles":1,"position":1,"iteration":0},"item":{"id":"4a6e6124-17f3-4d35-a606-4982dda5c77a","name":"Test Script Failures","request":{"url":"http://abc.com","method":"GET","body":{},"description":{"content":"","type":"text/plain"}},"response":[],"event":[{"listen":"test","script":{"type":"text/javascript","exec":["var jsonData = JSON.parse(responseBody);","tests[\\"Your test name\\"] = jsonData.value === 100;"],"_lastExecutionId":"acbea48a-825f-49fe-a62d-5db616e3d2a0"}}]},"request":{"url":"http://abc.com","method":"GET","header":[{"key":"User-Agent","value":"PostmanRuntime/6.2.5"},{"key":"Accept","value":"*/*"},{"key":"Host","value":"abc.com"},{"key":"accept-encoding","value":"gzip, deflate"}],"body":{},"description":{"content":"","type":"text/plain"}},"response":{"id":"6c461534-02ae-4098-9026-d4f96affe71b","status":"Not Found","code":404,"header":[{"key":"Server","value":"openresty"},{"key":"Date","value":"Sat, 02 Sep 2017 09:04:15 GMT"},{"key":"Content-Type","value":"text/html"},{"key":"Content-Length","value":"162"},{"key":"Connection","value":"keep-alive"}],"stream":"<html>\\r\\n<head><title>404 Not Found</title></head>\\r\\n<body bgcolor=\\"white\\">\\r\\n<center><h1>404 Not Found</h1></center>\\r\\n<hr><center>nginx</center>\\r\\n</body>\\r\\n</html>\\r\\n","cookie":[],"responseTime":30,"responseSize":162},"id":"4a6e6124-17f3-4d35-a606-4982dda5c77a","testScript":[{"error":{"type":"Error","name":"JSONError","message":"Unexpected token \'<\' at 1:1\\n<html>\\n^","checksum":"b7db65fd7db5667f384af70acdddcfb0","id":"a5662684-90e6-4606-937f-507bfb530e01","timestamp":1504343055274,"stacktrace":[]}}]}}}');

  const context = {
    console: console,
    failures: failures,
    redis: redisClient,
    request: request,
    Socks5HttpsAgent: Socks5HttpsAgent,
    Socks5HttpAgent: Socks5HttpAgent,
    date: date,
    sprintf: sprintf,
    vsprintf: vsprintf,
    handlerParams: handlerParams
  };
  try {
    const res = safeEval(code, context);
    ctx.response.body = await res;
  } catch (err) {
    ctx.response.status = 400;
    ctx.response.body = err.message;
  }
});

module.exports = router;
