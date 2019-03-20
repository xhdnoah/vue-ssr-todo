# vue-ssr-todo
## 2.1 vue-loader+webpack 项目配置

`npm init`

`npm i webpack vue vue-loader vue-template-compiler css-loader`

## 2.2 webpack 配置项目加载各种静态资源及 css 预处理器

在 webpack.config.js 中添加用于加载 .vue .css .svg 等静态资源的规则，同时配合不同的预处理 loader

## 2.3 webpack-dev-server 的配置和使用

`npm i webpack-dev-server`

`"dev": "webpack-dev-server --config webpack.config.js`

`target:'web'`

---

`npm i cross-env` 实现跨平台运行脚本

通过环境变量标识开发环境 or 正式环境

`const idDev = process.env.NODE_ENV === 'development'`

---

### html 自动包含 bundle.js

`$ npm i html-webpack-plugin`

`const HTMLPlugin = require('html-webpack')`

`plugins:[new HTMLPlugin]`

---

- `open:true`自动打开浏览器
- `historyFallback:{}`将前端路由中没有做映射的地址自动跳转到入口 index 页面

---

### hot module replacement 模块热替换

`hot:true` 模块热替换 HMR 功能在应用程序运行过程中替换、添加或删除模块，而无需重新加载整个页面。

`config.plugins.push(new webpack.HotModuleReplacementPlugin())`

---

**配置 devTool**

`config.devtool = '#cheap-module-eval-source-map'` 映射到源代码而不是打包后的代码

## Vue2 核心知识

- 数据双向绑定

- .vue 文件开发方式

- **render 方法**

  组件中每次数据变化，都会重新执行 render 方法，render 方法通过 `createElement()`层层遍历 template 标签内的节点、属性，最终形成完整的节点树

### API 重点

- 生命周期方法
- computed：computed 是对 Vue reactive 的深度使用

## 配置 vue 的 jsx 写法及 postcss

`npm i postcss-loader autoprefixer babel-loader babel-core`

**使用 autoprefixer 后处理 css**：自动添加浏览器前缀

---

### .babelrc 配置 vue 的 jsx 写法

`npm i babel-preset-env babel-plugin-transform-vue-jsx`

同时在 webpack 中添加处理 .jsx 的规则：

```
{
    test:/\.jsx$/,
    loader:'babel-loader'
}
```

jsx 将 html 写在 js 代码中

## webpack 配置 css 单独分离打包

`npm i extract-text-webpack-plugin`

`const ExtractPlugin = require('extract-text-webpack-plugin')`

安装此插件帮助我们将非 javascript 代码的 text 分离打包成静态资源文件，最终在 html 头中引入单独的 css 文件

---

在 webpack.config.js 中根据不同环境配置打包规则

```
if(isDev){
    config.module.rules.push({
	test:/\.styl/,
	use:[
        'style-loader
		... // 开发环境下 styl 的处理
	})
} else {
    config.module.rules.push({
        test:/\.styl/,
        use: ExtractPlugin.extract({
			... // 正式环境下的配置
		})
    })
}
```

> extract-text-webpack-plugin 只支持 webpack4.0 以下，解决方法：
>
> - 一：安装指定 `extract-text-webpack-plugin` 版本 `@next`
> - 二：使用 `mini-css-extract-plugin` 替代

## 4-2 webpack 区分打包类库代码及 hash 优化

类库代码较业务代码稳定，我们希望尽可能利用浏览器缓存稳定的代码，需要把类库代码和业务代码区分打包。

**通过 `entry` 分割不同入口：**

```
config.entry = {
	app: path.join(_dirname,'src/index.js'),
	vendor:['vue']
}
```

在 webpack4.0 中我们使用 `optimization` 配置项替代 `CommonsChunkPlugin` 插件分割 Chunk

```
 // 在 config 中添加如下配置
 optimization:{
        splitChunks:{
            cacheGroups:{
                commons:{
                    chunks:'initial',
                    minChunks:2,
                    maxInitialRequests: 5,
                    minSize: 0
                },
                vendor:{
                    test:/node_modules/,
                    chunks:'initial',
                    name:'vendor',
                    priority: 10,
                    enforce: true
                }
            }
        }
    }
```

## 4-3 总结

- vue 开发离不开 webpack
- 理解 vue 的重点不是 api 和指令，而是整个应用的渲染过程
- 学习 vue 中的 jsx 写法可以帮助我们理解 vue

## 2-1 项目目录升级

```
+ build/webpack.config.base.js
+ build/webpack.config.client.js
```

在 base 中只保留最基本的公共配置，安装 `webpack merge` 扩展 `baseConfig` 配置文件

```
config = merge(baseConfig,{
    ...// client 配置项
})
```

---

在 package.json 中，将依赖包都放在 `devDependencies`中，只保留 `vue`在`dependencies`

> `dependencies` 表示在生产环境下使用该依赖，``devDependencies` 表示仅在开发环境使用该依赖

最后，更改 json 文件中 dev,build 配置文件路径。

---

新建 defaultPlugins 数组，放入默认插件 `webpack.DefinePlugin,HTMLPlugin.VueLoaderPlugin`

再在不同运行环境中 `defaultPlugins.concat([])` 串联各自不同的插件

---

**改进 /src 文件夹结构**

页面相关组件 => /views

todo 页面相关组件 => /views/todo

footer,header 等非页面相关组件 => /layouts

## 2-2 Vue-loader 配置

`+ build/vue-loader-config.js`

```
// 处理 html 中多余的空格
preserveWhitespace : true,
// 将 .vue 文件中的 css 样式分离出来打包
extractcss : !isDev,
cssModules: {},
hotReload:
```

> 实现样式热更新 => 使用 `vue-style-loader` 处理 `.styl`

在`webpack.config.base.js` 中添加 vue-loader 配置项

```
const createVueLoaderOptions = require('./vue-loader.config')
...
    test /\.vue$/,
    loader: 'vue-loader',
    options: createVueLoaderOptions(isDev)
```

> `npm i rimraf`
>
> 以包的形式包装`rm -rf`命令，用来删除文件和文件夹
>
> ```
> // package.json
> "script":{
>     ...
>     "build":"npm run clean && npm run build:client"
>     "clean":"rimraf dist"
> }
> ```

`loaders:{}`为自定义的模块指定对应的 loader，此外还有`preLoaders:{}`,`postLoader:{}`

## 2-3 css-module 配置

```
localIdentName:'', // 设置 css-modules 模式下 local 类名的命名
camelCase: true // 把以 '-' 连接的 css 变量名转化为驼峰名
```

```
<template>
	<header :class="$style.mainHeader">
	</header>
</template>

<style lang="stylus" module>
.main-header{
    ...
}
<style>
```

---

在 css-loader 中开启 css-module 配置：

```
loader:'css-loader',
options:{
    module:true,
    localIndentName:'',
    camelCase: true,
}
```

## 2-4 安装使用 eslint editorcfg precommit

官方推荐的 eslint 依赖包

`npm i eslint eslint-config-standard eslint-plugin-standard eslint-plugin-promise eslint-plugin-import eslint-plugin-node`

**eslint 无法识别 .vue 中的 js 代码** => 使用`eslint-plugin-html` 解析 .vue 文件

---

在 package.json 中添加 eslint 及自动修复的脚本

```
// package.json
	"lint":"eslint --ext .js --ext .jsx --ext .vue client/",
	"lint-fix":"eslint --fix --ext .js --ext .jsx --ext .vue client/",
```

安装 `npm i eslint-loader babel-eslint -D` 让 Eslint 在每次运行代码时都检测一遍

---

使用`.editorconfig`规范不同编辑器的代码风格

---

`git init` 初始化 git 仓库

`npm i husky -D` 是一个为 `git` 客户端增加 hook 的工具。将其安装到所在仓库的过程中它会自动在 `.git/` 目录下增加相应的钩子实现在 `pre-commit` 阶段就执行一系列流程保证每一个 commit 的正确性

## 3-01 Vue 核心

```
+ webpack.config.pracitice.js
```

指定 vue 版本：

```
resolve: {
    alias: {
      'vue': path.join(__dirname, '../node_modules/vue/dist/vue.esm.js')
    }
  }
```

> vue.runtime.esm.js 和 vue.esm.js 区别是能不能写 template，runtime-only 无法写 template

```
+ template.html
// webpack.config.practice.js
...
new HTMLPlugin({
    template:path.join(__dirname,'template.html')
})
```

添加注释 `/* eslint-disable no-new */` 让 eslint 忽略 `new Vue({})` 写法

## 3-02 Vue 实例

vue 实例通过 el 属性将 template 挂载到 DOM

```
new Vue({
    el:'#root',
    template:'...'
})
```

相当于

```
const app = new Vue({
	template:'...'
})
app.$mount('#root')
```

## 3-03 Vue 生命周期方法

有哪些生命周期方法？

生命周期方法调用顺序？

生命周期中 Vue 实例有哪些区别？

## 3-04 Vue 数据绑定

### 绑定 html 内容

```
template:'
	<div>
		<p v-html="html"></p>
	</div>
',
```

### 绑定动态 class

**{对象}写法**

```
template:'
	<div :class="{active:!isActive}">
		<p v-html="html"></p>
	</div>
',
...
data:{
    isActive:false
}
```

**[数组]写法**

```
template:'
	<div :class="[isActive ? 'active' : '']">
		<p v-html="html"></p>
	</div>
',
```

**在[ ]中写对象**

```
template:'
	<div :class="[{active:isActive}]">
		<p v-html="html"></p>
	</div>
',
```

### 绑定样式

```
template:'
	<div :style="styles">
		<p></p>
	</div>
',
...
styles:{
    color:'red'
}
```

## 3-05 computed 和 watch 使用场景和方法

computed 实际相当于定义 class 时的 get 方法

computed 的优点是数据缓存

watch 用于监听数据变化然后向后台发出请求

**深入监听对象内部变化**

- 添加 `deep: true`
- `'obj.a'`字符串写法

> 尽量不要在 computed 和 watch 中更改监听对象的值

## 3-06 Vue 原生指令

v-bind

v-text

v-html

v-show

v-if,v-else

v-for

## 3-07 Vue 组件之组件定义

组件内部的 `data()` 必须是函数，return 一个独立的内部对象，这样相同组件间的数据不会相互影响。

props 单向数据流是外部对组件进行约束的工具，data 是组件自身需要并主动使用的数据。

通过 `<comp ref='comp1'></comp>` 获取 comp 实例的引用 => `console.log(this.$refs.comp1)`

组件中绑定的 props 以连接词的形式命名，并自动解析相应的驼峰写法用于变量定义。

## 3-08 Vue 组件继承

**作为子类的继承**

```
const CompVue = Vue.extend(component)
new ComVue({
    el:'#root',
    propsData:{
        ...
    },
    data:{
        ...
    }
})
```

`new Vue` 获得的 Vue 实例需要主动声明模版方法，CompVue 相当于 Vue 的一个子类，`new CompVue` 继承了 component 组件已有的模版方法。继承组件使用 `propsData` 传入原组件的 `props` ，继承组件的`data`会覆盖原组件的数据，原组件和继承组件的生命周期函数先后执行。

---

**作为子组件的继承**

```
const component2 = {
    extends: component,
    data(){
        return {
           ...
        }
    }
}
new Vue({
    el:'#root',
    components:{
    	Comp:components2
    },
    template:'<comp></comp>'
})
```

---

**组件的 parent**

_被调用的组件的 parent 自动指定_

```
const component2 = {
    extends: component,
    data(){
        return {
           ...
        }
    },
    mounted () {
    	console.log(this.$parent.$options.name) // Root
    	this.$parent.text = '12345' // 子组件可以更改父组件的 data，但不被建议
  	}
}
new Vue({
    name:'Root'
    components:{
    	Comp:components2
    }
})
```

`new Vue({})` 产生的组件可以指定 parent

```
const parent = new Vue({
    name: 'parent'
})
new Vue({
    parent:parent
})
```

## 3-09 Vue 组件之自定义双向绑定

## 3-10 Vue 组件之高级属性

### 插槽

在子组件中写入插槽，当父组件调用时，就可以把要往子组件内添加的 DOM 定位到内置组件 slot

```
const component = {
    template:'
    	<div>
    		<slot></slot>
    	</div>
    '
}
new Vue({
    el:'#root',
    components: {
    	CompOne: component
  	},
    template:'
    	<div>
    		<comp-one>
    			<span>This is content</span>
    		</comp-one>
    	</div>
    '
})
```

**具名插槽**

```
const component = {
    template:'
    	<div>
    		<slot name="header"></slot>
    	</div>
    '
}
new Vue({
    el:'#root',
    components: {
    	CompOne: component
  	},
    template:'
    	<div>
    		<comp-one>
    			<span slot="header">This is header</span>
    		</comp-one>
    	</div>
    '
})
```

**作用域插槽 slot-scope**

Sometimes you’ll want to provide a component with a reusable slot that can access data from the child component.

```
const component = {
    template:'
    	<div>
    		<slot value="123" :val="val"></slot>
    	</div>
    ',
    data(){
        return{
            val="456"
        }
    }
}
new Vue({
    el:'#root',
    components: {
    	CompOne: component
  	},
    template:'
    	<div>
    		<comp-one>
    			<span slot-scope="props">{{props.value}}{{props.val}}</span>
    		</comp-one>
    	</div>
    '
})
```

### provide/inject 跨级组件之间沟通

This pair of options are used together to allow an ancestor component to serve as a dependency injector for all its descendants, regardless of how deep the component hierarchy is, as long as they are in the same parent chain.

```
const ChildComponent = {
    inject:['ancestor',data']
}
const component = {
    components:{
        ChildComponent
    }
}
new Vue({
    components:{
        component
    },
    provide(){
		return{
            ancestor: this,
            data
		}
	}
})
```

> Note: the `provide` and `inject` bindings are NOT reactive. This is intentional. However, if you pass down an observed object, properties on that object do remain reactive.

要实现 provide 数据的 reactive 特性，使用 `Object.defineProperty` ，这样每次调用 data，都调用了 get 方法获取最新的 data 数据，这也是 Vue reactive 的实现基础。（不建议

```
new Vue({
    ...
    provide(){
        const data = {}
        Object.defineProperty(data,'value',{
            get:() => this.value,
            enumerable:true
        })
    }
})
```

## 3-11 Vue 组件 render function

Vue 组件中的 `template` 背后实现依赖于 `render` 方法

```
template:'
    	<div>
    		<comp-one ref="comp">
    			<span ref="ref">{{value}}</span>
    		</comp-one>
    	</div>
    '
```

对应 render 渲染过程：

```
render(createElement){
    return createElement('comp-one',{
        ref:'comp'
    },createElement('span',{
        ref:'span'
    },this.value))
}
```

---

**slot 渲染及 style 绑定**

```
template:'
	<div :style="style">
		<slot></slot>
	</div>
'
```

```{
render(createElement){
    return createElement('div',{
        style: this.style
    },this.$slots.default)
}
```

---

**在 render function 中绑定 props**

```
const component = {
    props:['props1'],
    render(createElement)('div',
    [this.$slots.default,this.props1]
    )
}
...
new Vue({
	components:{
        CompOne: component
	},
	data(){
		return{
            value:'123'
		}
	}
    render(createElement){
        return createElement(
        'comp-one',{
            props:{
                props1:this.value
            }
        },[
            createElement('span',this.value)
        ]
        )
    }
})
```

---

**在 render function 中绑定事件 **

```
const component = {
    render(createElement){
    	return createElement('div',{
            on:{
                click: () => {this.$emit('click')}
            }
    	}
    [this.$slots.default,this.props1]
    	)
    }
}
...
new Vue({
	components:{
        CompOne: component
	},
	data(){
		return{
            value:'123'
		}
	},
	methods:{
        handleClick(){
            ...
        }
	}
    render(createElement){
        return createElement(
        'comp-one',{
            on:{
                click:this.handleClick
            }
        },[
            createElement('span',this.value)
        ]
        )
    }
})
```

**nativeOn**

nativeOn 不需要主动 emit 事件，Vue 自动绑定事件到组件根节点的原生 DOM

**domProps**

```
createElement('span',{
    domProps:{
        innerHTML: '<span>insert content</span>'
    }
},this.value)
```

## 4-01 Vue-router 之集成

```
+ client/config/router.js // vue-router 配置
+ client/config/routes.js // 存放路由映射关系
```

---

不推荐直接 `export router`

```
const router = new Router({
	routes
})

export default router
```

导致在全局 import router 导入同一路由，就无法在每次导入时创建一个新的路由。

当我们在服务端渲染时，直接 `export router` 会导致内存溢出

```
export default () => {
    return new Router({
        routes
    })
}
```

---

**在 index.js 中集成**

```
import VueRouter from 'vue-router'
import createRouter from './config/router'

Vue.use(VueRouter)
const router = createRouter()

new Vue({
   router,
   ...
})
```

## 4-02 Vue router 配置

在 app.vue 中使用 `<router-view />` 定位路由跳转页

**Router mode**

默认为 hash 模式 `/#/`

```
mode: 'history'
```

**devServer historyApiFallback**

```
// webpack.config.client.js
const devServer = {
    historyApiFallback:{
        index: '/index.html'
    }
}
```

> publicPath 基路径
>
> ```
> // webpack.config.base.js
> const config = {
>     output: {
>         ...
>         publicPath: '/public/'
>     }
> }
>
> // webpack.config.client.js
> const devServer = {
>     historyApiFallback:{
>         index: '/public/index.html'
>     }
> }
> ```

**Router scrollBehavior**

```
scrollBehavior (to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else {
        return { x: 0, y: 0 }
      }
```

**Router parseQuery/stringQuery**

## 4-03 Vue-router 之路由参数传递

**transition 过渡动画**

**Router props**

在组件中使用`$router` 会使其与对应路由形成高度耦合，使用`props`将组件和路由解耦

```
const User = {
    props: ['id'],
    template: '<div>User {{ id }}</div>'
}
const router = new VueRouter({
    routes: [
        {
            path: '/user/:id',
            component: User,
            props: true
        }
    ]
})
```

```
// app.vue
<template>
	<router-link to="/app/001"> app001 </router-link>
</template>

<script>
	mounted(){
		console.log(this.$route)
	}
</script>

// console
...
params:{
	id: "001"
}
```

通过传参，路径中的 id 成为路由页面变量的值，`route.params`将被设置为组件属性，获取到该值可以显示相应内容（如商品详情页），组件可复用。

## 4-04 Vue-router 导航守卫

### 命名视图

需要同时（同级）展示多个视图，如一个 layout 有 sidebar 和 main。这时命名视图就派上用场。

```
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>
```

```
const router = new VueRouter({
  routes: [
    {
      path: '/',
      components: {
        default: Foo,
        a: Bar,
        b: Baz
      }
    }
  ]
})
```

### 导航卫士

**注册全局守卫**

```
// index.js
// 前置守卫可以进行数据校验、登录验证
router.beforeEach((to,from,next) => {
    next()
})

// 解析守卫
router.beforeResolve((to, from, next) => {
	next()
})

// 后置钩子
router.afterEach((to, from) => {

})
```

**路由独享守卫**

```
// routes.js
const router = new VueRouter({
    routes: [
        {
            path: 'foo',
            component: Foo,
            beforeEnter: (to,from,next) => {
                next()
            }
        }
    ]
})
```

**组件内守卫**

```
const Foo = {
    beforeRouteEnter (to, from, next){
        // 在渲染组件对应路由被 confirm 前调用，不能获取组件实例 this
        // 可以通过传一个回调给 next 访问组件实例
        next(vm => {
			// 通过 'vm' 访问组件实例获取数据
		})
    },
    beforeRouteUpdate (to, from, next){
        // 在当前路由改变，但组件被复用时调用，节省 watch 函数的开销
        // 可以在这里获取更新的数据
    },
    beforeRouteLeave (to, from, next){
        // 导航离开该组件的对应路由时调用
        // 可以询问是否离开
    }
}
```

页面加载的顺序是 全局 `beforeEach` => 路由 `beforeEnter` => 组件 `beforeRouteEnter` => 全局 `beforeResolve` => 全局 `afterEach`

### 路由懒加载

结合 Vue 异步组件和 Webpack 代码分割功能，实现路由组件的懒加载

不再在 routes.js 一开始就 import 所有组件，而是在进入相应路由中再 import 对应组件

## 4-05 Vuex 集成

`npm install vuex --D`

`import Vuex from 'vuex'`

在模块化的打包系统中，必须显式地通过 `Vue.use()` 安装模块

---

和 Vue-Router 一样，在 store.js 中导出 function ，服务端每次渲染生成新的 store，而不是使用同一个 store，造成内存溢出。

```
export default () => {
    return new Vuex.Store({
        state: {},
        mutations: {}
    })
}
```

再在外层 index.js 中创建 store 实例，并在外层 `Vue.use(Vuex)`

组件可以通过 `this.$store` 可以访问全局的 store 对象，使用`this.$store.commit` 触发状态变更。

### 4-06 Vuex state getters

Vuex 使用单一状态树，作为“唯一数据源（SSOT）”的存在。通过在根实例中注册 `store` 选项，该 store 实例会注入到根组件下的所有子组件中，且子组件能通过 `this.$store` 访问到

**`mapState` 辅助函数**

当一个组件需要获取多个状态，将这些状态都声明为计算属性会有些重复和冗余。为了解决这个问题，我们可以使用 `mapState` 辅助函数帮助我们生成计算属性

```
computed: mapState({
    count: state => state.count,
    countAlias: 'count',
    countPlusLocalState(state) {
        return state.count + this.localCount
    }
})
```

**对象展开运算符**

```
computed: {
  localComputed () { /* ... */ },
  // 使用对象展开运算符将此对象混入到外部对象中
  ...mapState({
    // 不同名的 state 需要通过 {name: 'state'} 传递
    // 同名的 state 用 ['state'] 即可
  })
}
```

### getters

可以被认为是 store 的计算属性，getters 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生改变才会重新计算

**`mapGetters` 辅助函数**

`mapGetters` 将 store 中的 getter 映射到局部计算属性

```
computed: {
    ...mapGetters([
        'doneTodosCount'
    ])
}
```

## 4-07 Vuex mutation action

mutation 类似事件，每个 mutation 都有一个字符串的 **事件类型(type)**和一个**回调函数(handler)**，回调函数接受 state 作为第一个参数

```
mutations: {
    increment (state) {
        staet.count++
    }
}

// 唤醒 handler
store.commit('increment')
```

**提交载荷（Playload)**

可以向 `store.commit` 传入额外参数，即 mutation 的**载荷**

```
mutations: {
    increment(state, n) {
        state.count += n
    }
}
```

`store.commit('increment', 10)`

载荷大多数情况下应该是一个对象，这样可以包含多个字段且记录的 mutation 更易读

```
mutations: {
    increment(state, payload) {
        state.coubt += payload.amount
    }
}
```

```
store.commit('increment',{
    amount: 10
})
```

**Mutations 需遵守 Vue 响应规则**

1. 最好提前在 store 初始化所有需要的属性
2. 当需要在对象上添加新属性时，应该
   - 使用 `Vue.set(obj, 'newProp', 123)` 或
   - 以新对象替换老对象 `state.obj = {...state.obj, newProp: 123}`

**`mapMutations`辅助函数**

使用 `mapMutations`将组件中的 methods 映射为 `store.commit` 调用（需在根节点注入 `store`)

```
import {mapMutations} from 'vuex'
export default {
    methods: {
        ...mapMutations([
            'increment'
        ]),
        ...mapMutations({
            add: 'increment'
        })
    }
}
```

### Actions

在 Vuex 中，mutations 处理同步事务，Actions 处理异步操作

Action 提交的是 mutation 而不是直接变更状态，可以包含任意异步操作

```
actions: {
    increment(context){
		context.commit('increment')
	}
}
```

Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，可以调用 `context.commit` 提交一个 mutation，或通过 `context.state/context.getters` 获取 state/getters

Action 通过 `store.dispatch`方法触发：`store.dispatch('increment')`

## 4-08 Vuex 模块

Vuex 允许将 store 分割成模块 (module)，每个模块拥有自己的 state、mutations、action、getter 甚至嵌套子模块。

```
const moduleA = {
    state: {...},
    mutations: {...},
    actions: {...},
    getters" {...}
}

const moduleB = {
    ...
}

const store = new Vuex.store({
    modules: {
        a: moduleA,
        b: moduleB
    }
})

store.state.a // -> moduleA 的状态
```

### 命名空间

默认，模块内部的 action、mutation、getter 注册在**全局命名空间**，通过添加 `namespaced: true` 可以使其成为带命名空间的模块。

**在带命名空间的模块内访问全局内容（Global Assets）**

如果希望使用全局 state 和 getter，`rootState` 和 `rootGetter` 会作为第三和第四参数传入 getter，也会通过 `context` 对象的属性传入 action。在全局命名空间内分发 action 或提交 mutation，将 `{ root: true }` 作为第三参数传给 `dispatch` 或 `commit` 即可

```
getters: {
    someGetter (state, getters, rootState, rootGetters){
        getters.someOtherGetter
        rootGetters.someOtherGetter
    }
}

actions: {
    someAction ({ dispatch, commit, getters, rootGetters}) {
        getters.someGetter
        rootGetters.someGetter

        dispatch('someOtherAction')
        dispatch('someOtherAction', null, {root: true})

        commit('someMutation')
        commit('someMutation', null, {root: true})
    }
}
```

**在带命名空间的模块注册全局 action**

```
actions: {
    someAction: {
        root: true,
        handler(namespacedContext, payload) {...}
    }
}
```

###

### 模块动态注册

```
// index.js
store.registerModule('myModule', {...})
store.registerModule(['nested','myModule'],{...})
```

### store 热更替实现

```
// store.js
export default () => {
    const store = new Vuex.Store({
    	//...
	})
    if(module.hot) {
        module.hot.accept([
            // 引用文件路径列表
            './state/state',
            './mutations/mutations',
            './actions/actions',
            './getters/getters'
        ], () => {
            const newState = require('./state/state').default
            const newMutations = require('./mutations/mutations').default
            const newActions = require('./actions/actions').default
            const newGetters = require('./getters/getters').default

            store.hotUpdate({
                state: newState,
                mutations: newMutations,
                getters: newGetters,
                actions: newActions
            })
        })
    }
    return store
}
```

## 4-09 Vuex API 拾遗

**store.watch**

```
store.watch((state) => state.count + 1, (newCount) => {
    console.log('new count watched:', newCount)
})
```

**store.subscribe**

```
store.subscribe((mutation, state) => {
	console.log(mutation.type)
	console.log(mutation.payload)
})
```

```
store.subscribeAction((action, state) => {
    console.log(action.type)
    console.log(action.payload)
})
```

### 插件

Vuex store 接受`plugins` 选项，暴露出每次 mutation 的钩子。Vuex 插件就是一个函数，它接收 store 作为唯一参数

```
const myPlugin = store => {
	// store 初始化后调用
    store.subscribe((mutation, state) => {
        // 每次 mutation 后调用
        // mutation 格式为 { type, payload}
    })
}
```

使用插件：

```
const store = new Vuex.Store({
    plugins: [myPlugin]
})
```

## 5-01 开发时服务端渲染的配置和原理

Vue.js 是构建客户端应用程序的框架。默认可以在浏览器中输出 Vue 组件，也可以将同一组件渲染为服务端的 HTML 字符串，发送到浏览器。

**Why SSR？**

与传统 SPA 相比，服务器端渲染（SSR）优势：

- SEO
- 更快的内容到达时间 （time-to-content）

---

```
+ build/webpack.config.server.js
+ client/server-entry.js
$ npm i vue-server-renderer -S
```

**服务器配置**用于生成传递给 `createBundleRenderer` 的 server bundle，大概如下：

```
const merge = require('...')
const nodeExternals = require('...')
const baseConfig = require('...')
const VueSSRServerPlugin = require('...')

module.exports = merge(baseConfig,{
    entry: 'entry-server.js',
    target: 'node',
    devtool: 'source-map',
    // 告知 server bundle 使用 Node 风格导出模块
    output: {
        libraryTarget: 'commonjs2'
    }
    // 外置化依赖模块（Vue,Vuex..)可使服务器构建速度更快，生成较小的 bundle 文件
    externals:nodeExternals({
        // 不要外置化 webpack 需要处理的依赖模块
    }),
    // 将服务器整个输出构建为单个 JSON 文件的插件
    plugins: [
        new VueSSRServerPlugin()
    ]
})
```

## 5-02 使用 koa 实现 node server

```
$ npm i koa -S
+ server/server.js
```

kao 服务端渲染（分不同环境处理

```
$ npm i koa-router axios -S // kao-router 处理路由
+ server/routers/dev-ssr.js && ssr.js 分别处理开发环境下和正式环境下服务器端渲染
$ npm i memory-fs -D
```

`memory-fs` 和 Node 内置 `fs` 的 api 一致，但是它直接将文件写入内存中而不是磁盘，以提高效率。

**模版引擎** ejs 用于生成完整的 html

```
$ npm i ejs -S
+ server.template.ejs
```

**vue-client-plugin 插件**

```
// webpack.config.client.js
const VueClientPlugin = require('vue-server-renderer/client-plugin')
const defaultPlugins = {
    // 生成客户端构建 manifest 对象，包含了 webpack 整个构建过程的信息
    // 从而可以让 bundle renderer 自动推导需要在 HTML 模板中注入的内容
    new VueClientPlugin()
}
// dev-ssr.js
const clinetManifestResp = await axios.get(
    'http://127.0.0.1:8000/vue-ssr-client-manifest.json'
)
```

### 5-03 服务端渲染的 entry 配置

服务端渲染的操作封装在单独的 `server-render.js`中

```
module.exports = async(ctx, renderer, template){}
```

每次服务端渲染都要创建一个新的 app，而不能使用上次渲染过的 app 对象，防止在 Node 端内存溢出。

```
+ client/create-app.js  // 类似 index.js
```

服务器 entry 使用 default export 导出函数，并在每次渲染中重复调用此函数。在这里创建和返回应用程序实例：

```
// server-entry.js
import creatApp from './create-app.js'
export default context => {
    const {app} = createApp()
    return app
}
```

启动服务端渲染：

```
// package.json
+ "dev:server": "cross-env NODE_ENV=development node server/server.js"
```

> 启动渲染时提示错误：`[vue-router] Failed to resolve async component default: ReferenceError: document is not defined`
>
> solution: Bundle your app for the client and additionally bundle your app for the server. When bundling for the server don't use mini-css-extract-plugin

> 启动渲染后提示错误信息：`[Vue warn]: Error in beforeCreate hook: "TypeError: Cannot read property 'call' of undefined"`
>
> 引起这个原因的问题是 extract-text-webpack-plugin 配置问题，在 new ExtractTextPlugin 中添加 `allChunks: true` 解决

## 5-04 开发时服务端渲染静态资源路径处理

设置 webpack.config.base.js 路径为

```
publicPath: 'http://127.0.0.1:8000/public/'
```

把静态资源的路径指定为完整的 url，即 webpack-dev-server 对应的 8000 端口

---

`npm i kao-send -S` 发送静态资源文件

```
app.use(async (ctx, next) => {
  if (ctx.path === '/favicon.ico') {
    await send(ctx, '/favicon.ico', {
      root: path.join(__dirname, '../')
    })
  } else {
    await next()
  }
})
```

---

**自动重启 node 服务**

```
npm i nodemon -D
+ nodemon.json
"dev:server": "nodemon server/server.js"
```

---

**一次性同时启动服务端、客户端**

```
npm i concurrently -D
+ "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\""
```

## 5-05 使用 vue-meta 处理元信息

在服务端无法操作 DOM 来处理元信息，需借助 vue-meta 工具

```
npm i vue-meta -D
// create-app.js
import Meta from 'vue-meta'
Vue.use(Meta)
// app.vue
export default{
    metaInfo: {
        title: '...'
    }
}
// server-entry.js
router.onReady(() => {
	...
    context.meta = app.$meta()
})
// server-render.js
const {title} = context.meta.inject()
const html = ejs.render(template, {
  title: title.text()
})
```

## 5-06 生产(build)环境服务端渲染

```
// package.json
+ "build": "npm run clean && npm run build:client && npm run build:server"

// ssr.js
const Router = require('koa-router')
const path = require('path')
const fs = require('fs')
const VueServerRender = require('vue-server-renderer')
const serverRender = require('./server-render')
const clientManifest = require('../../public/vue-ssr-client-manifest.json')
// 混合服务端和客户端的 bundle, renderer 可复用
const renderer = VueServerRender.createBundleRenderer(
  path.join(__dirname, '../../server-build/vue-ssr-server-bundle.json'), {
    inject: false,
    clientManifest
  }
)
const template = fs.readFileSync(
  path.join(__dirname, '../server.template.ejs'),
  'utf-8'
)
const pageRouter = new Router()
pageRouter.get('*', async (ctx) => {
  await serverRender(ctx, renderer, template)
})
module.exports = pageRouter

// server.js
...
let pageRouter
if(isDev){
    pageRouter = require('./routers/dev-ssr')
} else {
    pageRouter = require('./routers/ssr')
}
app.use(pageRouter.routes()).use(pageRouter.allowedMethods())

// package.json
+ "start": "cross-env NODE_ENV=production node server/server.js"
```

**解决没有启动 webpack-dev-server 时静态资源路径的问题**

```
// webpack.config.client.js
output: { publicPath: '/public/' } 去掉端口号而直接使用绝对路径
+ server/routers/static.js 处理静态文件的中间件
const Router = require('koa-router')
const send = require('koa-send')
const staticRouter = new Router({ prefix: '/public' })
staticRouter.get('/*',async ctx => {
    await send(ctx, ctx.path)
})
module.exports = staticRouter
// server.js
app.use(staticRouter.routes()).use(staticRouter.allowedMethods())
```

---

**生产环境下服务端渲染过程**

`server.js` 起一个 3333 端口的 node server

`dev-ssr.js`在 node server 中起一个 pack serverCompiler 编译出 server bundle，监听文件变化来重新打包

`server-entry` 将用户请求的地址推入路由`router.push(context.url)`

**在 html 中插入 js 路径**，从 webpack-dev-server 获取到静态资源地址后，用 VueServerRenderer 处理地址的依赖关系，通过 createBundleRenderer 构造出一个渲染器 `render`

```
// dev-ssr.js
const clientManifest = clientManifestResp.data
const render = VueServerRenderer.createBundleRenderer(bundle,{
    inject: false,
    clientManifest
})
```

`server-render` 单独处理渲染，渲染器`renderer`调用`renderToString` 在上下文 context 中传入`ctx.path`，通过 context 上暴露的 `renderStyles,renderScripts` 方法将样式和脚本的内容手动执行资源注入，再通过 ejs 模版引擎将其渲染到 html 的模版中

```
// server-render.js
...
const context = { url: ctx.path }
try {
    const appString = await renderer.renderToString(context)
    const {
        title
    } = context.meta.inject()
    const html = ejs.render(template, {
        appString,
        style: context.renderStyles(),
        scripts: context.renderScripts(),
        title: title.text()
    })
    ctx.body = html
}
```

**正式环境下服务端渲染**

不需要另起 webpack-dev-server ，只要获取到客户端构建清单 client-manifest 和服务器 server-bundle 两个文件即可

## 6-01 notification 之基本组件的实现

将 notification 组件作为一个 Vue 插件的形式在全局注册

```
+ notification/index.js
import Notification from './notification.vue'
export default(Vue) => {
	// 对每个组件内部定义其 name
    Vue.component(Notification.name, Notification)
}
```

## 6-02 notification 之通过方法调用

> 由组件显示临时性的通知不如通过方法调用方便

```
// notification.vue
<div
	v-show="visible"
>
</div>
...
data() {
    return {
        visible: true
    }
}
computed: {
    style() {
        return{}
    }
}

// 扩展 notification 组件的功能
+ notification/func-notification.js
import Notification from './notification.vue'
export default {
    extends: Notification,
    computed: {
        style() {
            return {}
        }
    },
    mounted(){
        this.createTimer()
    },
    methods: {
        createTimer(){
            ...
        }
    }
}

// 在扩展的基础上对通知方法进行封装，并在 app.vue 中调用
+ notification/function.js
import Vue from 'vue'
import Component from './func-notification'
const NotificationConstructor = Vue.extend(Component)
const notify = (options) => {
    ...
}
export default notify

// index.js 对 notify 方法在 Vue.prototype 中注册
import notify from './function'
export default(Vue) => {
    Vue.prototype.$notify = notify
}

// app.vue
...
mounted() {
    this.$notify({
        content: 'test $notify',
        btn: 'close'
    })
}
```

> Vue 中所有使用到的属性都要事先声明

---

在 webpack-dev-server 中允许跨域请求

```
// webpack.config.client.js
const devServer = {
    headers: {
        'Access-Control-Allow-Origin': '*'
    }
}
```

## 6-03 notification 之优化

实现在 notification 关闭后 DOM 节点及 vm 实例对象同时被删除

实现在其中一项通知关闭后其后的通知的高度会回落

> 在 func-notification 中要设置 `visible:false` 覆盖默认组件的 `visible: true`，再在 `function.js` 中当 `instance.vm` 插入到 DOM 节点后设置 `visible: false`，这样 `transition`动画 的 `after-enter` 才会被触发，我们才能在 `after-enter` 触发后获取到组件的 `offsetHeight`

实现当鼠标停留在通知上时，通知不会自动消失

## 6-04 tabs 组件之基本组件实现

> 实现 tabs 和 table 内容的分离

```
+ tabs.vue
props: {
    value:{
        // value 由父组件向子组件传递是否选中的信息
    }
},
render() {
    return(
		// 对于列表式的多个组件，可以用 render 代替 template，并在 render 方法中写 JSX
    )
}

+ tab.vue
props: {
    index:
    label:
},
render() {
    return(
        const tab = this.$slots.label || <span>{this.label}</span>
		return <li class={classNames}>{tab}</li>
    )
}

+ index.js
import Tabs from './tabs.vue'
import Tab from './tab.vue'
export default (Vue) => {
  Vue.component(Tabs.name, Tabs)
  Vue.component(Tab.name, Tab)
}

// create-app.js
import Tabs from './components/tabs'
Vue.use(Tabs)
```

## 6-05 tabs 组件之选中状态和切换

通过监听 tab 组件上的 click，把 tab index 值传给 tabs value

比较 tab index 和 tabs value 来给 tab 添加 active 类名，继而添加 .active 样式

---

`this.$parent` vs. `provide & inject`

`this.$parent` 只能获取到上一级父组件的属性

`provide & inject` 则可以穿透多层，缺点是通过 provide 传递的属性不是 reactive

## 6-06 tabs 组件之在父组件中渲染子组件的 slot

**解决 Vue 组件中 VNode 数据变化慢一拍的问题**

通过插槽传递的内容不可监听不是 reactive 的，需要通过 Props 来传递同步的数据、监听变化，就要新建一个 `tab-container` 组件来单独渲染 tab 的内容

## 7-01 服务端 api 请求基础实现

```
+ app.config.js // 从 apiCloud 获取到的 appId,appKey
+ server/routers/api.js // 对 api 路由做单独处理
+ server/db/db.js // 设计 api
// server.js 在服务端全局注册 api
const apiRouter = require('./routers/api')
const createDb = require('./db/db')
const config = require('../app.config')
const db = createDb(config.db.appId, config.db.appKey)
```

## 7-02 数据 API 实现

`npm i koa-body -S` 处理 ctx.body，从而拿到 body 中的内容

使用 [Restful](http://www.ruanyifeng.com/blog/2018/10/restful-api-best-practices.html) 规范设计 API，用 Restlet Client 插件调试 api

```
// db.js
module.exports = (appId, appKey) => {
    const getHeaders = () => {}
    return {
        async getAllTodos() {},
        async addTodo(todo) {},
        async updataTodo(id, todo) {},
        async deleteTodo(id) {},
        async deleteCompleted(ids) {}
    }
}

// api.js
apiRouter
	.get('/todos', async(ctx) => {
        const todos = await ctx.db.getAllTodos()
        ctx.body = successResponse(todos)
	})
	.post('/todo', async(ctx) => {
        const data = await ctx.db.addTodo(ctx.request.body)
        ...
	})
	.put('/todo/:id', async(ctx) => {
        const data = await ctx.db.updataTodo(ctx.params.id, ctx.request.body)
        ...
	})
	.delete('/delete/completed', async(ctx) => {
        const data = await ctx.db.deleteTodo(ctx.params.todo)
        ...
	})
	.post('/delete/completed',async(ctx)=> {
        const data = await ctx.db.deleteCompleted(ctx.request.body.ids)
        ...
	})
```

## 7-03 后端登录接口实现和 session 使用

`npm i koa-session -S` 设置 session

## 7-05 联调第一个 API

> 实现前端向 node server 发送 API 请求获取数据的过程  
> 对纯数据请求或发送进行封装，将数据稍做处理后返回给 action，再在 action 中提交 mutation 来更改 store 中的数据，完成数据和动作分离

```
+ client/model/client-model.js
import axios from 'axios'
const request = axios.create({
	baseURL: '/'
})

const handleRequest = (request) => {
	return new Promise((resolve, reject) => {
		...
	})
}

export default {
	getAllTodos(){
		return handleRequest(request.get('api/todos'))
	}
}

// client/store/state/state.js
export default {
	todos: []
}

// client/store/mutations/mutations.js
export default {
	fillTodos (state, todos) {
		state.todos = todos
	}
}

// client/store/actions/actions.js
import model from 'model'
export default {
	fetchTodos ({ commit }) {
		model.getAllTodos()
			.then(data => {
				commit('fillTodos', data)
			})
			.catch(err => {
				handleError(err)
			})
	}
}

// todo.vue
...
<script>
import { mapState, mapActions } from 'vuex'
export default{
	mounted() {
		this.fetchTodos)()
	},
	computed: {
		...mapState(['todos']),

	},
	methods: {
		...mapActions(['fetchTodos'])
	}
}
</script>
```

> 解决前端渲染的端口 8000 和后端 API 的端口 3333 不一致，无法跨域请求数据,需在 config 中设置代理

```
// webpack.config.client.js
	proxy: {
		'/api': 'http://127.0.0.1:3333',
		'/user': 'http://127.0.0.1:3333'
	}
```

## 7-06 请求错误处理和登录接口联调

实现提示登录错误并自动跳转到登录页

```
// actions.js
import notify from '../../components/notification/function
const handleError = (err) => {
	if(err.code === 401) {
		notify({
			content: 'need to login'
		})
	}
}

// client-model.js 在 actions 中产生的 401 错误会被 axios 捕捉
const handleRequest = (request) => {
	return new Promise((resolve, reject) => {
		...
	}).catch(err => {
		const resp = err.response
		if(resp.status === 401) {
			reject(createError(401, 'need auth'))
		}
	})
}

```

通过事件订阅获取 router 对象进行页面跳转

```
+ client/util/bus.js
import Vue from 'vue'
export default new Vue() // Vue 对象包含一个事件系统

// actions.js
import bus from '../../util/bus.js
...
	notify({
		content: 'need to login'
	})
	// 触发 auth 事件
	bus.$emit('auth')

// client-entry.js 监听 auth 事件
import bus from './util/bus'

bus.$on('auth', () => {
	router.push('/login')
})
```

实现登录功能

```
// client-model.js
export default {
	login(username, password) {
		return handleRequest(request.post('user/login', {username, password}))
	}
}

// state.js
export default {
	user: null
}

// mutations.js
export default{
	doLogin(state, userInfo) {
		state.user = userInfo
	}
}

// actions.js
// 页面在 login 成功后完成跳转，需要把 login 操作包装在 Promise 状态机中
export default {
	login({ commit }, { username, password }){
		return new Promise((resolve, reject) => {
		model.login(username,password)
			.then(data => {
				commit('doLogin', data)
				notify({
					content: 'login success'
				})
				resolve()
			}).catch(err => {
				handleError(err)
				reject(err)
			})
	})
	}
}

// login.vue
<script>
import { mapActions } from 'vuex'
export default {
	methods: {
		...mapActions(['login']),
		doSubmit(e){
			if(this.validate()){
				this.login({
					username: this.username,
					password: this.password
				})
					.then(() => {
						this.$router.replace('/app')
					})
			}
		}
	}
}
```

## 7-07 所有接口进行联调

> 由于 store 中的值无法被组件更改，当 todos 数据存到 store 后，item.vue 组件不能再由 v-model 控制 toggle 状态，改为绑定 `:checked="todo.completed` 控制状态  
> 监听到 click 事件同时阻止 input 框默认事件`e,preventDefault()`不能让它主动更改选中状态，而是通过绑定的父组件中 `todo.completed` 的变化来控制是否选中，即 React 中的 control input

**前后端数据流动过程**
`todo.vue`:用户操作触发 methods，数据作为参数传递给 actions
`actions.js`: action 调用 model 向后端 API 请求/发送数据，同时提交 mutations 更新 store 中的数据
`mutations.js`: 从 actions 拿到数据更改 state

## 7-08 在数据请求时使用全局 loading

在数据请求的过程中给页面添加 loading 动画,通过 store 内部的一个状态控制 loading 动画显示与否

```
// app.vue 把动画放到全局组件中
<div id="loading" v-show="loading">
	<Loading />
</div>
...
import { mapState } from 'vuex'
import Loading from '...'
export default {
	components: {
		Loading
	},
	computed: {
		...mapState(['loading'])
	}
}

// mutations.js 通过 state.loading 的值来控制显示，即数据驱动的思想
startLoading(state){
	state.loading = true
}

// actions.js 在数据请求过程中操作动画的起停
fetchTodos({ commit }) {
	commit('startLoading')
	return model.getAllTodos()
		.then(data => {
			commit('endLoading')
			commit('fillTodos',data)
		})
		.catch(err => {
			commit('endLoading')
			handleError(err)
		})
}
```

> app.vue 中 <router-view /> 被 <transition name="fade"></transition> 包裹，所有的路由跳转都会有 fade 动画，导致 todo 组件在页面上产生位移。解决方法是在 transition 标签添加属性 `mode = "out-in"` 即先出后进，等前组件先淡出后组件再进入

## 7-09 在服务端渲染获取数据

```
// todo.vue
...
mounted() {
  this.fetchTodos()
}
```

`mounted` 在 \$el 对象插入到 DOM 节点才会执行，所以在服务端渲染中，生命周期钩子只会执行到 beforeMount 而无法获取数据。
要实现在服务端渲染时获取数据并渲染出对应 HTML，在需要获取数据的组件中添加方法:

```
// todo.vue
asyncData({ store, router }){
		return store.dispatch('fetchTodos')
}

// server-entry.js
// 在入口文件调用 asyncData 方法拿到数据后，进一步传入上下文 context
router.onReady(() => {
	Promise.all(matchedComponents.map(Component => {
		if(Component.asyncData){
			return Component.asyncData({
				route: router.currentRoute,
				store
			})
		}
	})).then(data => {
		context.state = store.state
		resolve(app)
	})
})
```

这个时候会遇到服务端跨域请求的错误，需要将客户端和服务端的 `model.js` 单独区分并在各自的 config 中指定 alias.model 所指文件

```
+ client/model/server-model.js 服务端渲染时只用到获取数据的 API
const config = require('../../app.config')
const createDb = require('../../server/db/db.js')
const db = createDb(config.db.appId,config.db.appKey)
export default {
	getAllTodos(){
		return db.getAllTodos()
	}
}
```

> db.js v 中的 async 语法经过 babel 会生成 generator，服务端环境下报错，需设置 .babelrc 配置 `"targets":{"node": "current"}`

## 7-10 前后端数据复用和服务端用户认证

### 服务端渲染的数据在客户端复用

> 把服务端渲染的数据从上下文 context 放到 initialState 中，再插入 ejs 模板

```
// server-render.js
const html = ejs.render(template,{
	initialState: context.renderState()
})
```

> 最后在 client-entry.js 客户端初始化 Store 时替换 state 对象

```
// client-entry.js
if(window.__INITIAL_STATE__){
	store.replaceState(window.__INITIAL_STATE__)
}
```

> 在 todo.vue 中对获取数据的操作添加判断避免重复请求

```
// todo.vue
if(this.todos && this.todos.length < 1){
	this.fetchTodos()
}
```

### 服务端用户验证

> 在 server-render.js 中把 user 信息传给上下文

```
const context = { url: ctx.path, user: ctx.session.user}
```

> 在 server-entry 中把 user 传入 state

```
if(context.user){
	store.state.user = context.user
}
```

> 在 todo.vue 中添加验证

```
asyncData({ store, router }){
	if(store.state.user){
	return store.dispatch('fetchTodos')
}
	return Promise.resolve()
}
```

> Babel 7 - Removing Babel's Stage Presets

`npx babel-upgrade`

> Babel 7 - ReferenceError: regeneratorRuntime is not defined

```
npm i @babel/runtime
npm i @babel/transform-runtime -D
//.babelrc
"plugins":[
	+ "@babel/plugin-transform-runtime"
]
```

## 7-11 服务端渲染进行 redirect 操作

> 实现用户一打开直接看到 login 页面，而不是看到从 todo 页跳转，在服务端处理该流程

```
// server-entry.js
if(Component.asyncData) {
	return Component.asyncData({
		router // 把 router 对象传给 asyncData
	})
}
// todo.vue
asyncData({ store, router }){
	if(...){...}
+   router.replace('/login')
	return Promise.resolve()
}
```

但以上只是在 renderer. renderToString 时做的事情，server-entry 中 resolve 出去的 app 没有变化，todo.vue 还是会被渲染出来，访问时还是会出现 todo 页面。

需要在 server-render 中做判断，将不符合的请求直接 redirect，再进入服务端渲染的流程，提高用户体验

```
// server-entry.js
context.router = router
// server-render.js
if(context.router.currentRoute.fullPath !== ctx.path){
	return ctx.redirect(context.router.currentRoute.fullPath)
}
```

## 7-12 createRender 方式进行服务端渲染

createRender 区别于 createBundleRender

```
// webpack.config.server.js
plugins: [
-   new VueServerPlugin()
]

+ routers/dev-ssr-no-bundle.js
const NativeModule = require('module')
const vm = require('vm')

// createRender 读取的不是 json 文件而是 export 的 server-entry.js
const bundlePath = path.join(
	serverConfig.output.path,
	'server-entry.js'
)
// 以上只是获取到 js 的字符串，要变成可执行的模块，还需要做以下事情来模拟 require('') 的过程
try {
	// 声明一个模块
  const m = { exports: {} }
	const bundleStr = mfs.readFileSync(bundlePaht, 'utf-8')
	// 模块封装
	const wrapper = NativeModuel.wrap(bundleStr)
	// 字符串 => 可执行代码
	const script = new vm.Script(wrapper, {
		filename: 'server-entry.js',
		displayErrors: true
	})
	// 运行上下文，包含全局的公共变量 module,export,require
	const result = script.runInThisContext()
	// 执行的结果，exports 出的内容会放到对象 m 中
	result.call(m.exports, m.exports, require)
	bundle = m.exports.default
} catch (err) {
    console.error('compile js error:', err)
}

const renderer = VueServerRenderer
	.createRenderer({
        inject: false,
        clientManifest
	})

// server-entry.js export 出的 bundle 方法 手动传入 serverRender
await serverRender(ctx, renderer, template, bundle)

+ server-render-no-bunlde.js
try {
	- const appString = await renderer.renderToString(context)
	+ const app = await bundle(context)
	// 这时 context 已经有了可以判断是否需要 redirect 的内容，不用再经过耗时的 appString
	if(){return ctx.redirect()}
	+ const appString = await renderer.renderToString(app, context)
}

// server.js
pageRouter = require('./routers/dev-ssr-no-bundle.js')
```

> 由于在开发时所有的文件写在 memoryFs 而不是硬盘， routes.js 中组件被异步加载在内存中，dev-ssr-no-bundle.js 运行时无法在硬盘中找到 server-entry.js 文件，目前解决方法就是在 routes.js 把异步加载的组件改为同步加载。正式环境下没有此问题。

## 7-13 正式环境打包以及异步模块打包优化

`no-bundle` 的渲染方式在开发环境下存在问题，但在正式环境下没有，可以通过判断来决定

```
// webpack.config.server.js
const isDev = process.env.NODE_ENV === 'development'

if (isDev) {
	plugins.push(new VueServerPlugin())
}

// server.js
if(isDev) {
	pageRouter = require('./routers/dev-ssr')
} else {
	pageRouter = require('./routers/ssr-no-bundle')
}

+ server/routers/ssr-no-bundle.js
const bundle = require('./server-build/server-entry.js')
const renderer = VueServerRender.createRenderer(
	{
		inject: false,
		clientManifest
	}
)
pageRouter.get('*',async(ctx) => {
	await serverRender(ctx, renderer, template, bundle)
})
```

> 异步加载出来的组件打包命名用 id 来表示(如 0，1），id 表示的顺序是随机的，顺序变化会导致整个 bundle 的哈希变化，导致长缓存失效。重新打包一次，整个网站的缓存就没用了。

**解决方法**

```
// routes.js 在 import 组件的时候加一道注释
{
	component: () => import(/* webpackChunkName: "todo-view" */ '../views/todo/todo.vue)
}

// webpack.config.client.js 正式环境打包添加插件
plugins: defaultPlugins.concat([
	new webpack.NamedChunksPlugin()
])
```

这样打包出的 bundle 以组件名来命名是固定不变的

## 8-01 pm2 使用以及服务器端部署

pm2 (process manager) 是一个进程管理工具，维护一个进程列表，管理 node 进程，负责所有正在运行的进程

**全局安装**

`npm i pm2 -g`

**启动进程**
`$pm2 start pm2.yml --env production`

**显示日志**

`$ pm2 log [id]/ pm2 logs`

**添加进程监视**
`$ pm2 start app.js --name start --watch`
**设置 pm2 开机自启**
`$ pm2 startup centos`
`$ pm2 save`

### 通过 pm2 配置文件自动部署项目

1. 在项目根目录下新建一个 deploy.yaml 文件

```
# deploy.yaml
apps:
  - script: ./start.js       # 入口文件
    name: 'app'              # 程序名称
    env:                     # 环境变量
      COMMON_VARIABLE: true
    env_production:
      NODE_ENV: production

deploy:                     # 部署脚本
  production:               # 生产环境
    user: lentoo            # 服务器的用户名
    host: 192.168.2.166     # 服务器的ip地址
    port: 22                # ssh端口
    ref: origin/master      # 要拉取的git分支
    ssh_options: StrictHostKeyChecking=no # SSH 公钥检查
    repo: https://github.com/**.git # 远程仓库地址
    path: /home              # 拉取到服务器某个目录下
    pre-deploy: git fetch --all # 部署前执行
    post-deploy: npm install &&  pm2 reload deploy.yaml --env production # 部署后执行
    env:
      NODE_ENV: production
```

2. 配置 git 的 ssh 免密认证
   在服务器生成 rsa 公钥和私钥
   `# ssh-keygen -t rsa -C "xxx@xxx.com"`
   将公钥 id_rsa.pub 内容复制到 github

3. 使用 pm2 部署项目
   每次部署前先将本地代码提交到远程 git 仓库

- 首次部署
  `pm2 deploy deploy.yaml production setup`
- 再次部署
  `pm2 deploy deploy.yaml production update`

**SSH 连接到服务器**

```

\$ touch ~/.ssh/config
Host centos（实例名称）
HostName (公网 IP)
Port 22
User root
IdentityFile ~/.ssh/centos.pem (私钥文件地址)

\$ ssh centos

```

**上传文件到服务器**
`\$ scp Users/xuhaidong/Desktop/.. root@host:~/projects/..`

**CentOS 7 下安装最新版的 node**

```

$ npm i -g n
$ n lastest
$ n
$ node -v

```

运行 `$ n` 切换 node 版本失效的解决

n 的默认安装路径为 /usr/local，若 node 不是在此路径下，切换版本就不能把 bin、lib、include、share 复制到该路径，所以必须通过 N_PREFIX 变量来修改 n 的默认 node 安装路径。

```

$ vim ~/.bash_profile
export N_PREFIX=/usr/local # node 实际安装位置
export PATH=$N_PREFIX/bin:$PATH
:wq
$ source ~/.bash_profile

```

**Nginx**

> Niginx 是一款轻量级的 HTTP 服务器，采用事件驱动的异步非阻塞处理方式框架，让其具有极好的 IO 性能，常用于服务端的反向代理和负载均衡

- 正向代理：代理服务器通过代理用户端的请求向域外服务器请求响应内容，如 VPN
- 反向代理：代理服务器通过代理内部服务器接受域外客户端的请求，并将请求发送到对应的内部服务器
  使用反向代理最主要的两个原因：

1. 安全及权限，用户无法直接通过请求访问真正的内容服务器，可以在 Nginx 层将危险或没有权限的请求内容过滤，保证服务器的安全
2. 负载均衡，Nginx 可以将接收到的客户端请求均匀地分配到集群的所有服务器，实现压力的负载均衡，

访问域名默认访问 80 端口，想要让用户访问启动在其他端口的 node 服务，需要配置 nginx 做代理
**在服务端配置 nginx**

```

# yum install nginx

# cd /etc/nginx/

# ls

# cd conf.d/

# vim todo.conf

upstream todo {
server 127.0.0.1:7788;
keepalive 64;
}
server {
// 监听服务器默认端口
listen 80;
server_name [域名/公网 IP（可带端口）]
// 当用户请求 '/' 地址时
location / {
// 代理 HTTP 头
proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header Host \$http_host;
proxy_set_header X-Nginx-Proxy true;
proxy_set_header Connection;
// 代理转发的地址，proxy_pass 将 http 和 todo server 地址做拼接
proxy_pass http://todo;
}
}

# service nginx reload

```

##8-02 静态资源上传 cdn

```

// app.config.js
module.exports = {
cdn: {
host: '',(记得最后加上斜杠)
bucket: '空间名称',
// 密钥
ak:'',
sk:''
}
}

\$ npm i qiniu -D

- build/upload.js 上传操作
  // package.json
  "scripts":{
  "upload":"node build/upload.js"
  }

\$ npm run upload

// webpack.config.client.js
const cdnConfig = require('../app.config').cdn
...
output: {
publicPath: cdnConfig.host
}

```
