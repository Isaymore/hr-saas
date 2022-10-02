// 专门处理路由权限的vuex权限模块，或者叫小仓库permission
// vuex中的permission模块，用于存放当前用户的 静态路由 + 动态路由（或者叫权限路由）
import { constantRoutes } from '@/router' // 引入静态路由
import { asyncRoutes } from '@/router' // 引入动态路由
const state = {
  // 路由表，存放当前用户拥有的所有路由的数组
  // 默认值是constantRoutes，说明所有用户默认拥有静态路由
  routes: constantRoutes
}
const mutations = {
  SET_ROUTES: (state, newRoutes) => {
    // 参数newRoutes是用户登录并判断路由权限后，新添加的路由
    // 这么写业务逻辑不对
    // 比如法外狂徒张三是系统管理员登录，获得动态路由后添加到路由数组上。张三退出登录，李四是普通用户登录，也能获得张三的的动态路由
    // state.routes = [...state.routes, ...newRoutes]
    // 正确写法：每次登录，都在静态路由的基础上添加
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  // 过滤筛选动态/权限路由
  // 第二个参数是当前用户拥有的菜单权限数组
  // menus: ["settings","permissions"]
  // asyncRoutes是所有动态路由的数组
  // asyncRoutes  [{path: 'setting',name: 'setting'},{}]
  filterRoutes({ commit }, menus) {
    // 声明动态路由空数组，接收动态路由对象
    const routes = []
    // 为什么是遍历menus，不是遍历asyncRoutes
    // 因为要根据当前用户的权限标识，去判断路由权限，后面filter方法过滤出的newRoutes是路由对象数组
    // 如果遍历asyncRoutes，后面filter方法过滤出的newRoutes是字符串数组
    menus.forEach(key => {
      // key是权限标识
      // 如果路由对象的name属性值(这里建议用id属性值)和用户资料的menus属性数组中的权限标识相同，说明用户拥有该动态/权限路由
      // newRoutes是路由对象数组
      const newRoutes = asyncRoutes.filter(item => item.id === key)
      // console.log('newRoutes', newRoutes, typeof newRoutes)
      // 数组解构得到路由对象后，再push压入动态路由数组routes
      routes.push(...newRoutes)
    })
    // console.log('routes', routes, typeof routes)
    // routes是满足权限要求的动态路由组成的routes数组
    // 或者说，routes是当前用户拥有的动态路由组成的数组
    // 将routes动态路由数组，提交给mutations
    commit('SET_ROUTES', routes)
    // state对象的routes属性是用于显示左侧菜单
    // return返回routes，传给路由实例方法addRoutes或addRoute
    return routes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
