import Vue from 'vue'

const component = {
  props: {
    active: Boolean,
    propOne: String
  },
  template: `
    <div>
      <input type="text" v-model="text">
      <span @click="handleChange">{{propOne}}</span>
      <span v-show="active">see me if active</span>
    </div>
  `,
  data () {
    return {
      text: 0
    }
  },
  mounted () {
    console.log('comp mounted')
  },
  methods: {
    handleChange () {
      this.$emit('change')
    }
  }
}

const parent = new Vue({
  name: 'parent'
})

const componet2 = {
  extends: component,
  data () {
    return {
      text: 1
    }
  },
  mounted () {
    console.log(this.$parent.$options.name)
  }


// const CompVue = Vue.extend(component)

// new CompVue({
//   el: '#root',
//   propsData: {
//     propOne: 'xxx'
//   },
//   data: {
//     text: '123'
//   },
//   mounted () {
//     console.log('instance mounted')
//   }
// })

/* eslint-disable no-new */
new Vue({
  parent: parent,
  name: 'Root',
  el: '#root',
  mounted () {
    console.log(this.$parent.$options.name)
  },
  components: {
    Comp: componet2
  },
  data: {
    text: 23333
  },
  template: `
    <div>
      <span>{{text}}</span>
      <comp></comp>
    </div>
  `
})
