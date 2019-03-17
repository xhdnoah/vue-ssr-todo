const Router = require('koa-router')
const send = require('koa-send')
// 只处理前缀 '/public' 静态文件的中间件
const staticRouter = new Router({
  prefix: '/public'
})

staticRouter.get('/*', async ctx => {
  await send(ctx, ctx.path)
})

module.exports = staticRouter
