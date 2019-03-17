import createApp from './create-app.js'

export default context => {
  return new Promise((resolve, reject) => {
    const {
      app,
      router,
      store
    } = createApp()

    if (context.user) {
      store.state.user = context.user
    }

    // 想要导航到不同的 URL,使用 router.push 方法,向 history 栈添加一个新的记录
    router.push(context.url)
    // 当一个路由记录被推入，所有的异步操作（加载组件）做完后执行 onReady 回调
    router.onReady(() => {
      const matchComponents = router.getMatchedComponents()
      if (!matchComponents.length) {
        return reject(new Error('no component matched'))
      }
      Promise.all(matchComponents.map(Component => {
        if (Component.asyncData) {
          return Component.asyncData({
            route: router.currentRoute,
            router,
            store
          })
        }
      })).then(data => {
        context.meta = app.$meta()
        context.state = store.state
        context.router = router
        resolve(app)
      })
    })
  })
}
