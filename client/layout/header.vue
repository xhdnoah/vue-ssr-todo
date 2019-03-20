<template>
  <header class="main-header">
    <div class="clock">
      <p class="time">
        {{ time }}
      </p>
    </div>
    <p class="week">
      {{ week }}
    </p>
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
    var i = new Date().getMinutes()
    if (i < 10) {
      i = '0' + i
    }
    setInterval(() => {
      this.time = new Date().getHours() + ':' + i
      var day = [
        '星期日',
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六'
      ]
      this.week = day[new Date().getDay()]
    })
  }
}
</script>

<style lang="stylus" scoped>
.main-header {
  text-align: center;

  .time {
    font-size: 10em;
    font-weight: 500;
    color: #fff;
    position: relative;
    margin: 20px 0 0 0;
  }

  .week {
    font-size: 200%;
    color: #fff;
  }
}
</style>
