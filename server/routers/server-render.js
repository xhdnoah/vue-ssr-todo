const ejs = require('ejs')

module.exports = async (ctx, renderer, template) => {
  ctx.headers['ContentType'] = 'text/html'
  // context 对象用于向 VueServerRender 传入客户端 js,css 路径等
  const context = {
    url: ctx.path,
    user: ctx.session.user
  }

  try {
    // server-entry 传入 context，把 app 渲染 appstring，是 SSR 最耗时的部分
    const appString = await renderer.renderToString(context)

    if (context.router.currentRoute.fullPath !== ctx.path) {
      return ctx.redirect(context.router.currentRoute.fullPath)
    }

    const {
      title
    } = context.meta.inject()

    const html = ejs.render(template, {
      appString,
      style: context.renderStyles(),
      scripts: context.renderScripts(),
      title: title.text(),
      initialState: context.renderState()
    })
    ctx.body = html
  } catch (err) {
    console.log('render error', err)
    throw err
  }
}
