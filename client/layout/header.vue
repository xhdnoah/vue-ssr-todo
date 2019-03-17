<template>
  <header class="main-header">
    <p class="time">
      {{ time }}
    </p>
    <p class="week">
      {{ week }}
    </p>
    <p>What's your main focus</p>
  </header>
</template>

<script>
export default {
  data() {
    return {
      time: '',
      week: ''
    }
  },
  mounted() {
    setInterval(() => {
      this.time = new Date().getHours() + ':' + new Date().getMinutes()
      var day = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      this.week = day[new Date().getDay()]
    })
  }
}
</script>

<style lang="stylus" scoped>
.main-header
    text-align center
    .time
        font-size 70px
        font-weight 500
        color #fff
    .week
        color #fff
</style>
