<script>
export default {
  name: 'Tab',
  props: {
    // index 判断 tab 是否被选中
    index: {
      required: true,
      type: [Number, String]
    },
    label: {
      type: String,
      default: 'tab'
    }
  },
  computed: {
    active() {
      return this.$parent.value === this.index
    }
  },
  mounted() {
    this.$parent.panes.push(this)
  },
  methods: {
    handleClick() {
      this.$parent.onChange(this.index)
    }
  },
  render() {
    const tab = this.$slots.label || <span>{this.label}</span>
    const classNames = {
      tab: true,
      active: this.active
    }
    return (
      <li class={classNames} on-click={this.handleClick}>
        {tab}
      </li>
    )
  }
}
</script>

<style lang="stylus" scoped>
.tab {
  list-style: none;
  line-height: 40px;
  margin-right: 30px;
  position: relative;
  bottom: -2px;
  cursor: pointer;

  &.active {
    border-bottom: 2px solid blue;
  }

  &:last-child {
    margin-right: 0;
  }
}
</style>
