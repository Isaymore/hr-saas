import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// import { getToken } from '@/utils/auth'
/* Layout */
import Layout from '@/layout'
import approvals from '@/router/modules/approvals'
import attendances from '@/router/modules/attendances'
import departments from '@/router/modules/departments'
import employees from '@/router/modules/employees'
import permission from '@/router/modules/permission'
import salary from '@/router/modules/salary'
import setting from '@/router/modules/setting'
import social from '@/router/modules/social'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
// 静态路由
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'), // 路由懒加载
    // 路由对象的属性hidden为true时，说明该路由组件不显示在左侧菜单中
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    // 一级路由
    path: '/',
    // Layout是一级路由组件
    component: Layout,
    // component: () => import('@/layout'),
    redirect: '/dashboard',
    // 二级路由
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        // 二级路由组件
        component: () => import('@/views/dashboard/index'),
        // 左侧菜单读取title和icon属性
        // 这里的icon属性值dashboard，对应src/icons/svg目录有一个dashboard.svg
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  },

  {
    path: '/import',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '',
        component: () => import('@/views/import')
      }
    ]
  }

  // 404页面必须放在路由表的最后面，但因为router.addRoutes或router.addRoute添加动态路由，404页面放在中间。
  // 所以，手动刷新页面（比如/employees），重新访问router路由器的routes数组，
  // 但routers正在添加动态路由规则，并且routes数组是有序的，导致找不到动态路由地址（比如/employees），就会出现404
  // 404页面不能写在静态路由
  // { path: '*', redirect: '/404', hidden: true }
]
// 动态路由
export const asyncRoutes = [approvals, attendances, departments, employees, permission, salary, setting, social]
// console.log('asyncRoutes', asyncRoutes, typeof asyncRoutes)
// 静态路由和动态路由的临时合并
const newRoutes = [...constantRoutes, ...asyncRoutes]
// console.log('newRoutes', newRoutes, typeof newRoutes)
// 封装一个创建 router 实例的方法：箭头函数return返回一个 router 实例
const createRouter = () => new VueRouter({
  mode: 'history', // require service support
  routes: constantRoutes,
  // 提供scrollBehavior方法：return 滚动位置的对象信息
  scrollBehavior: (to, from, savedPosition) => {
    // 返回 savedPosition，在按下 后退/前进 按钮时，就会像浏览器的原生表现那样，停留在最近一次滚动的位置
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

// 创建 router 实例，然后传 `routes`和 `scrollBehavior` 配置
const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// 重置router实例
export function resetRouter() {
  const newRouter = createRouter()
  // console.log('router.matcher', router.matcher, typeof router.matcher)
  // console.log('newRouter.matcher', newRouter.matcher, typeof newRouter.matcher)
  // 重置路由的匹配器(可匹配路径)
  router.matcher = newRouter.matcher // reset router
}

// 解决bug：Error: Redirected when going from “/login” to “/home” via a navigation guard.
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
// router.beforeEach((to, from, next) => {
//   // if (!getToken() && to.path !== '/login') {
//   //   next({ path: '/login' })
//   // } else {
//   //   next()
//   // }
//   console.log(666)
//   if (getToken()) {
//     if (to.path === '/login') {
//       next({ path: '/' })
//     } else {
//       // 放行
//       next()
//     }
//   } else {
//     if (!getToken() && to.path !== '/login') {
//       next({ path: '/login' })
//     } else {
//       // 放行
//       next()
//     }
//   }
// })

export default router
