import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
// 完整引入 ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import '@/icons' // icon
import '@/permission' // permission control
import * as directives from '@/directives' // 批量引入指令定义对象
// 批量引入过滤器函数，filters指向filters/index.js模块对象
import * as filters from '@/filters'
// console.log('filters', filters, typeof filters)
// 引入一个插件对象，该插件对象内的install方法，统一注册所有自定义的全局组件
import Components from '@/components'
// 引入一个混入对象，该混入对象内methods中配置的方法checkPermission会合并到每一个组件实例
import CheckPermission from '@/mixin/checkPermission'
// console.log('Components', Components, typeof Components)
// 安装插件，调用install方法
Vue.use(Components)
// 全局注册混入对象，该混入对象内methods中配置的方法checkPermission会合并到每一个组件实例
// 简单来说，每个组件实例都可以访问checkPermission方法
Vue.mixin(CheckPermission)
// 使用es6新语法：Object.keys()，推荐使用
// k是自定义指令名，directives[k]是指令定义对象
Object.keys(directives).forEach(k => {
  // 遍历注册所有的全局自定义指令，directives[k]是访问对象属性的枚举写法
  Vue.directive(k, directives[k])
})
// 使用es6新语法：Object.keys()，推荐使用
// k是过滤器函数名，filters[k]是过滤器函数
Object.keys(filters).forEach(k => {
  // console.log(k)
  // console.log(filters[k])
  // 遍历注册所有的全局过滤器函数，filters[k]是访问对象属性的枚举写法
  Vue.filter(k, filters[k])
})

// 使用es5语法
// for (const k in directives) {
//   console.log(k, typeof k)
// }
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  // 安装全局事件总线，$bus指向Vue根实例
  beforeCreate() {
    Vue.prototype.$bus = this
  },
  // 将App根组件渲染到el指向的#app  箭头函数写法一
  render: h => h(App)
  // 将App根组件渲染到el指向的#app  普通函数写法二
  // render(h) { return h(App) }
})

