<template>
  <div id="app">
    <div id="cover" />
    <div
      v-show="loading"
      id="loading"
    >
      <Loading />
    </div>
    <Header />
    <!-- <p>{{ fullName }} {{ count }} </p> -->
    <!-- <router-link to="/app/001">
      app001
    </router-link>
    <router-link to="/app/002">
      app002
    </router-link> -->
    <!-- <router-link to="/login">
      Login
    </router-link> -->
    <!-- <Todo /> -->
    <Transition
      name="fade"
      mode="out-in"
    >
      <RouterView />
    </Transition>
    <!-- <button @click="notify">
      click me
    </button> -->
    <!-- <notification content="test notify" /> -->
    <Footer />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Header from './layout/header.vue'
import Footer from './layout/footer.jsx'
import Loading from './components/loading/loading.vue'
// import Todo from './views/todo/todo.vue'
export default {
  metaInfo: {
    title: "Noah's to-do app"
  },
  components: {
    Header,
    Footer,
    Loading
  },
  computed: {
    ...mapState(['loading'])
    // count() {
    //   return this.$store.state.count
    // },
    // fullName() {
    //   return this.$store.getters.fullName
    // }
  },
  mounted() {
    this.$notify({
      content: 'test $notify',
      btn: 'close'
    })
    // console.log(this.$store)
    // // 修改 count
    // this.$store.dispatch('updateCountAsync', {
    //   num: 5,
    //   time: 2000
    // })
    // let i = 1
    // setInterval(() => {
    //   this.$store.commit('updateCount', i++)
    // }, 1000)
  },
  methods: {
    notify() {
      this.$notify({
        content: 'test $notify',
        btn: 'close'
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
#app {
  position: relative;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

#cover {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  opacity: 0.9;
  z-index: -1;
}

#loading {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.3);
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
