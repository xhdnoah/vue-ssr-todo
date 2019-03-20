import Notification from './notification.vue'

export default {
  extends: Notification,
  computed: {
    // 覆盖原组件中的 style 属性
    style () {
      return {
        position: 'fixed',
        right: '20px',
        bottom: `${this.verticalOffset}px`
      }
    }
  },
  mounted () {
    this.createTimer()
  },
  methods: {
    createTimer () {
      console.log(this.autoClose)
      if (this.autoClose) {
        this.timer = setTimeout(() => {
          this.visible = false
        }, this.autoClose)
      }
    },
    clearTimer () {
      if (this.timer) {
        clearTimeout(this.timer)
      }
    },
    afterEnter () {
      this.height = this.$el.offsetHeight
    }
  },
  beforeDestory () {
    this.clearTimer()
  },
  data () {
    return {
      verticalOffset: 0,
      height: 0,
      visible: false
    }
  }
}
