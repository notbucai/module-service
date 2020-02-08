const path = require('path');
const Koa = require('koa');
const KoaRouter = require('koa-router');
const koaBody = require('koa-body');
const logger = require('koa-logger')
const { HTTPError } = require('./errors');
const { installModule } = require('./install');
const app = new Koa();
const router = new KoaRouter();
app.use(logger());
app.use(async (ctx, next) => {
  const resData = {
    code: ctx.res.statusCode,
    result: null,
  };
  try {
    await next();
    resData.result = ctx.body;
    resData.code = ctx.res.statusCode;
  } catch (error) {
    console.log(error);
    resData.msg = error.message || error.toString();
    resData.code = error.code || ctx.res.statusCode;
  }
  ctx.res.statusCode = 200;
  ctx.body = resData;
});

router.get('/', async (ctx, next) => {
  ctx.body = '哈哈哈';
});

router.post('/installmodule', koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
  }
}), async (ctx) => {
  // 上传单个文件
  const file = ctx.request.files.zip; // 获取上传文件

  if (Object.prototype.toString.call(file) !== '[object Object]') {
    return ctx.throw(new HTTPError("请输入正确的数据", 1000));
  }

  if (file.type !== 'application/zip') {
    return ctx.body = ctx.throw(new HTTPError("请传入正确格式的文件", 1000));
  }

  // console.log(file);
  installModule(file.path);
  // // 创建可读流
  // const reader = fs.createReadStream(file.path);
  // let filePath = path.join(__dirname, 'temp') + `/${file.name}`;
  // // 创建可写流
  // const upStream = fs.createWriteStream(filePath);
  // // 可读流通过管道写入可写流
  // reader.pipe(upStream);
  return ctx.body = "安装模块成功";
});

router.all('/modules/:module', async (ctx, next) => {
  // ctx.params.module
  ctx.body = '该模块未安装';
});

app.use(router.routes()).use(router.allowedMethods());
// 模块最后判断


app.listen(3000, () => {
  console.log('http://localhost:3000');
});