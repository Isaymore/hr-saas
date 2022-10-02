// 该文件作用：导航守卫。先判断权限拦截，再路由跳转
import router from '@/router'
import { getToken } from '@/utils/auth'
import NProgress from 'nprogress'
import('nprogress/nprogress.css')
import store from '@/store'

// 路由白名单
const whiteList = ['/login', '/404']
// 全局前置守卫
router.beforeEach(async(to, from, next) => {
  // 开启加载进度条
  NProgress.start()
  // 设置进度条的加载类型和速度
  NProgress.configure({ easing: 'ease', speed: 1000 })
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // 分发获取用户信息的action的方法一：Navbar组件挂载后分发
      // 分发获取用户资料的action的方法二：permission.js中分发
      // 说明：其实这里的if判断只要写在if(hasToken)块级作用域即可，不能写在if (to.path === '/login')内
      // 写在这里，只是更加语义化：获取用户资料后，再放行
      // if判断是为了避免重复请求，如果没有userId，再分发action；如果有，不分发action
      if (!store.getters.userId) {
        // 使用方法一记得先删除else，将next()放行函数写在跟if同级
        // // 方法一：获取用户资料后，再根据用户资料获取数据menus，所以要写await操作符
        // await store.dispatch('user/getUserInfo')
        // // 直接从user小仓库中取菜单权限menus
        // const menus = store.state.user.userInfo.roles.menus
        // await store.dispatch('permission/filterRoutes', menus)
        // // 直接从permission小仓库中取路由数组routes，包含静态和动态路由
        // const routes = store.state.permission.routes
        // console.log('routes', routes, typeof routes)
        // // 添加路由规则到路由表，routes包含静态和动态路由
        // router.addRoutes(routes)

        // 方法二：小技巧，user小仓库中的获取用户资料的action return返回userInfo
        // 使用await操作符等待Promise对象成功的返回值
        // async 函数return的内容 用 await可以接收
        const { roles } = await store.dispatch('user/getUserInfo')
        // 分发过滤筛选动态/权限路由的action
        // 调用dispatch方法，默认返回Promise对象；使用await操作符等待Promise对象成功的返回值
        // routes是过滤筛选的动态路由数组
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        // console.log('routes', routes, typeof routes)
        // 添加动态路由规则到路由表(比如成铺路)，路由表默认只有静态路由
        // 方法一：直接传入一个动态路由数组routes，另外404页面写在路由表最后
        // router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
        // 方法二：或者遍历动态路由数组routes
        routes.forEach(item => {
          // 遍历添加一条新动态路由规则
          router.addRoute(item)
        })
        // 另外404页面写在路由表最后
        router.addRoute({ path: '*', redirect: '/404', hidden: true })
        // 添加完动态路由之后，必须 用 next(to.path) 不能用next()，否则有bug：手动刷新页面（比如/employees），路由权限失效，页面空白
        // bug原因：因为routers正在添加动态路由规则，属于vue-router的已知缺陷
        next(to.path) // 相当于跳到对应的地址  相当于多做一次跳转 为什么要多做一次跳转
        // 进门了，但是进门之后发现我要去的地方的路还没有铺好，直接走，掉坑里，多做一次跳转，再从门外往里进一次，跳转之前 把路铺好，再次进来的时候，路就铺好了
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next({ path: '/login' })
    }
  }
  // NProgress.done() // 可不写。因为注释这行，进度条也会正常关闭。使用目的：解决手动切换地址时 进度条不关闭的问题
})

router.afterEach(() => {
  // 关闭加载进度条
  NProgress.done()
})
