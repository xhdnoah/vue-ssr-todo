import model from 'model'
import notify from '../../components/notification/function'
import bus from '../../util/bus.js'

const handleError = (err) => {
  // handle error
  if (err.code === 401) {
    notify({
      content: 'login in please'
    })
    bus.$emit('auth')
  }
}

export default {
  updateCountAsync(store, data) {
    setTimeout(() => {
      store.commit('updateCount', {
        num: data.num
      })
    }, data.time)
  },
  fetchTodos({
    commit
  }) {
    commit('startLoading')
    return model.getAllTodos()
      .then(data => {
        commit('endLoading')
        commit('fillTodos', data)
      })
      .catch(err => {
        handleError(err)
        commit('endLoading')
      })
  },
  login({
    commit
  }, {
    username,
    password
  }) {
    commit('startLoading')
    return new Promise((resolve, reject) => {
      model.login(username, password)
        .then(data => {
          commit('doLogin', data)
          commit('endLoading')
          notify({
            content: 'login success'
          })
          resolve()
        }).catch(err => {
          handleError(err)
          reject(err)
          commit('endLoading')
        })
    })
  },
  addTodo({
    commit
  }, todo) {
    commit('startLoading')
    model.createTodo(todo)
      .then(data => {
        commit('addTodo', data)
        commit('endLoading')
        notify({
          content: 'another job to finish'
        })
      }).catch(err => {
        handleError(err)
        commit('endLoading')
      })
  },
  updateTodo({
    commit
  }, {
    id,
    todo
  }) {
    commit('startLoading')
    model.updateTodo(id, todo)
      .then(data => {
        commit('updateTodo', {
          id,
          todo: data
        })
        commit('endLoading')
      }).catch(err => {
        handleError(err)
        commit('endLoading')
      })
  },
  deleteTodo({
    commit
  }, id) {
    commit('startLoading')
    model.deleteTodo(id)
      .then(data => {
        commit('deleteTodo', id)
        commit('endLoading')
        notify({
          content: 'one less thing to do'
        })
      }).catch(err => {
        handleError(err)
        commit('endLoading')
      })
  },
  deleteAllCompleted({
    commit,
    state
  }) {
    commit('startLoading')
    const ids = state.todos.filter(t => t.completed).map(t => t.id)
    model.deleteAllCompleted(ids)
      .then(() => {
        commit('deleteAllCompleted')
        commit('endLoading')
        notify({
          content: 'clean up'
        })
      }).catch(err => {
        handleError(err)
        commit('endLoading')
      })
  }
}
