import Notification from './notification.vue'
import notify from './function'

export default (Vue) => {
  Vue.component(Notification.name, Notification)
  // 在 Vue.prototype 上添加的方法，可以直接在组件上通过 this 调用
  Vue.prototype.$notify = notify
}
