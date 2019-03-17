import Vue from 'vue'

const app = new Vue({
  // el: '#root',
  data: {
    text: 0,
    obj: {}
  },
  template: '<div ref="div">{{text}} {{obj.a}}</div>'
  // watch: {
  //   text (newText, oldText) {
  //     console.log(`${newText} : ${oldText}`)
  //   }
  // }
})

app.$mount('#root')

let i = 0
setInterval(() => {
  i++
  // Vue的异步渲染，五次增值一次渲染+5；使用 $nextTick([callback]) 让回调延迟到下次DOM更新循环后执行
  // app.text += 1
  // app.text += 1
  // app.text += 1
  // app.text += 1
  // app.text += 1
  // app.obj.a = i
  // 使用 $set 让内容 reactive
  app.$set(app.obj, 'a', i)
  // app.$forceUpdate()
  // app.$options.data.text += 1
  // app.$data.text += 1
}, 1000)

// console.log(app.$data)
// console.log(app.$props)
// console.log(app.$el)
// console.log(app.$options)
// app.$options.render = (h) => {
//   return h('div', {}, 'new render function')
// }
// console.log(app.$root === app)
// console.log(app.$children)
// console.log(app.$slots)
// console.log(app.$scopedSlots)
// console.log(app.$refs)  快速定位到模版中的节点或组件
// console.log(app.$isServer)

// const unWatch = app.$watch('text', (newText, oldText) => {
//   console.log(`${newText} : ${oldText}`)
// })
// setTimeout(() => {
//   unWatch()
// }, 2000)

// app.$once('test', (a, b) => {
//   console.log(`test emited ${1} ${b}`)
// })

// setInterval(() => {
//   app.$emit('test', 1, 2)
// }, 1000)

// app.$forceUpdate() 强制组件重新渲染
