<template>
  <div class="helper">
    <span class="left">
      {{ unFinishedLength }} items left
    </span>
    <span
      class="clear"
      @click="clearAllCompleted"
    >
      Clear Completed
    </span>
  </div>
</template>

<script>
export default {
  props: {
    todos: {
      type: Array,
      required: true
    },
    filter: {
      type: String,
      required: true
    }
  },
  computed: {
    unFinishedLength() {
      return this.todos.filter(todo => !todo.completed).length
    }
  },
  methods: {
    clearAllCompleted() {
      this.$emit('clearAll')
    },
    toggleFilter(state) {
      this.$emit('toggleFilter', state)
    }
  }
}
</script>

<style lang="stylus">
.helper {
  font-weight: 100;
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  line-height: 30px;
  background-color: #fff;
  font-size: 14px;
  font-smoothing: antialiased;
}

.left, .clear, .helpers {
  padding: 0 10px;
  box-sizing: border-box;
}

.left, .clear {
  width: 150px;
}

.left {
  text-align: left;
}

.clear {
  text-align: right;
  cursor: pointer;
}

.helpers {
  width: 200px;
  display: flex;
  justify-content: space-around;

  * {
    display: inline-block;
    padding: 0 10px;
    cursor: pointer;
    border: 1px solid rgba(175, 47, 47, 0);

    &.actived {
      border-color: rgba(175, 47, 47, 0.4);
      border-radius: 5px;
    }
  }
}
</style>
