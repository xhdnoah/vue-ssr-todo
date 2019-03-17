<template>
  <section class="real-app">
    <div class="tab-container">
      <tabs
        :value="filter"
        @change="handleChangeTabjjk"
      >
        <tab
          v-for="tab in stats"
          :key="tab"
          :label="tab"
          :index="tab"
        ></tab>
      </tabs>
    </div>
    <input
      autofocus="autofocus"
      class="add-input"
      placeholder="what's next"
      type="text"
      @keyup.enter="handleAdd"
    >
    <Item
      v-for="todo in filteredTodos"
      :key="todo.id"
      :todo="todo"
      @del="deleteTodo"
      @toggle="toggleTodoState"
    />
    <helper
      :filter="filter"
      :todos="todos"
      @clearAll="clearAllCompleted"
    />
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Item from './item.vue'
import Helper from './helper.vue'

export default {
  beforeRouteEnter(to, from, next) {
    console.log('todo before enter')
    next(vm => {
      console.log('after enter vm.id is ', vm.id)
    })
  },
  beforeRouteUpdate(to, from, next) {
    console.log('todo update enter')
    next()
  },
  beforeRouteLeave(to, from, next) {
    console.log('todo leave enter')
    if (global.confirm('are you sure?')) {
      next()
    }
  },
  components: {
    Item,
    Helper
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      filter: 'all',
      stats: ['all', 'active', 'completed']
    }
  },
  computed: {
    ...mapState(['todos']),
    filteredTodos() {
      if (this.filter === 'all') {
        return this.todos
      }
      const completed = this.filter === 'completed'
      return this.todos.filter(todo => completed === todo.completed)
    }
  },
  mounted() {
    if (this.todos && this.todos.length < 1) {
      this.fetchTodos()
    }
  },
  asyncData({ store, router }) {
    if (store.state.user) {
      return store.dispatch('fetchTodos')
    }
    router.replace('/login')
    return Promise.resolve()
  },
  methods: {
    ...mapActions([
      'fetchTodos',
      'addTodo',
      'deleteTodo',
      'updateTodo',
      'deleteAllCompleted'
    ]),
    // addTodo(e) {
    //   this.todos.unshift({
    //     id: id++,
    //     content: e.target.value.trim(),
    //     completed: false
    //   })
    //   e.target.value = ''
    // },
    handleAdd(e) {
      const content = e.target.value.trim()
      if (!content) {
        this.$notify({
          content: 'input something'
        })
        return
      }
      const todo = {
        content,
        completed: false
      }
      this.addTodo(todo)
      e.target.value = ''
    },
    // deleteTodo(id) {
    //   this.todos.splice(this.todos.findIndex(todo => todo.id === id), 1)
    // },
    toggleTodoState(todo) {
      this.updateTodo({
        id: todo.id,
        // store 中的 todo 不能直接更改，需生成新的对象
        todo: Object.assign({}, todo, {
          completed: !todo.completed
        })
      })
    },
    clearAllCompleted() {
      // this.todos = this.todos.filter(todo => !todo.completed)
      this.deleteAllCompleted()
    },
    handleChangeTab(value) {
      this.filter = value
    }
  }
}
</script>

<style lang="stylus" scoped>
.real-app {
  width: 600px;
  margin: 0 auto;
  box-shadow: 0 0 5px #666;
}

.add-input {
  position: relative;
  margin: 0;
  width: 100%;
  font-size: 24px;
  font-family: inherit;
  font-weight: inherit;
  line-height: 1.4em;
  border: 0;
  outline: none;
  color: inherit;
  padding: 6px;
  border: 1px solid #999;
  box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  font-smoothing: antialiased;
  padding: 16px 16px 16px 60px;
  border: none;
  box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
}

.tab-container {
  background-color: #ffffff;
  padding: 0 15px;
}
</style>
