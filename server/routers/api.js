const Router = require('koa-router')

const apiRouter = new Router({
  prefix: '/api'
})

// 登录验证
const validateUser = async (ctx, next) => {
  if (!ctx.session.user) {
    ctx.status = 401
    ctx.body = 'need login'
  } else {
    await next()
  }
}

// apiRouter 可以看成是子 app，可以注册中间件只处理它内部的请求
// 在 apiRouter 每个请求上添加用户验证
apiRouter.use(validateUser)

const successResponse = (data) => {
  return {
    success: true,
    data

  }
}
// '/api/todos'
apiRouter
  .get('/todos', async (ctx) => {
    const todos = await ctx.db.getAllTodos()
    ctx.body = successResponse(todos)
  })
  // 返回的 data 中包含了自动生成的 todo.id
  .post('/todo', async (ctx) => {
    const data = await ctx.db.addTodo(ctx.request.body)
    ctx.body = successResponse(data)
  })
  // id 定位要修改的 todo 项，body 确定修改的内容
  .put('/todo/:id', async (ctx) => {
    const data = await ctx.db.updateTodo(ctx.params.id, ctx.request.body)
    ctx.body = successResponse(data)
  })
  .delete('/todo/:id', async (ctx) => {
    const data = await ctx.db.deleteTodo(ctx.params.id)
    ctx.body = successResponse(data)
  })
  .post('/delete/completed', async (ctx) => {
    const data = await ctx.db.deleteCompleted(ctx.request.body.ids)
    ctx.body = successResponse(data)
  })
module.exports = apiRouter
