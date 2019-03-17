<template>
  <transition
    name="fade"
    @after-leave="afterLeave"
    @after-enter="afterEnter"
    @mouseenter="clearTimer"
    @mouseleave="createTimer"
  >
    <div
      v-show="visible"
      class="notification"
      :style="style"
    >
      <span class="content">
        {{ content }}
      </span>
      <a
        href=""
        class="btn"
        @click="handleClose"
      >
        {{ btn || 'close' }}
      </a>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Notification',
  props: {
    content: {
      type: String,
      required: true
    },
    btn: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: true
    }
  },
  computed: {
    style() {
      return {}
    }
  },
  methods: {
    handleClose(e) {
      e.preventDefault()
      this.$emit('close')
    },
    afterLeave() {
      this.$emit('closed')
    },
    afterEnter() {},
    clearTimer() {},
    createTimer() {}
  }
}
</script>

<style lang="stylus" scoped>
.notification {
  display: flex;
  background-color: #303030;
  color: rgba(225, 225, 225, 1);
  align-items: center;
  padding: 20px;
  position: fixed;
  min-width: 280px;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
  flex-wrap: wrap;
  transition: all 0.3s;
}

.content {
  padding: 0;
}

.btn {
  color: #ff4081;
  padding-left: 24px;
  margin-left: auto;
  cursor: point;
}
</style>
