import Vuex from 'vuex'

// defaultState 内容与业务无关，服务端渲染部分数据会覆盖 defaultState
// mutations 定义动作与数据无关，可以直接使用相同命名
import defaultState from './state/state.js'
import mutations from './mutations/mutations.js'
import getters from './getters/getters.js'
import actions from './actions/actions'

const isDev = process.env.NODE_ENV === 'development'

export default () => {
  return new Vuex.Store({
    // strict 限制外部修改 store 只能在开发环境中使用
    strict: isDev,
    state: defaultState,
    mutations,
    getters,
    actions
  })
}
