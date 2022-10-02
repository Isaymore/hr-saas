// 员工的路由规则

import Layout from '@/layout'
export default {
  // 不使用name属性，是因为子路由的path为空（命名路由“employees”具有默认的子路由），会有vue-router warn
  // 使用编程式导航this.$router.push({name:'employees'})或声明式导航，不映射二级路由组件，导致二级路由页面显示空白
  // 所以，这里用id自定义属性
  id: 'employees',
  // 一级路由
  path: '/employees',
  // 如果name属性值和用户资料的menus属性数组中的权限标识相同，说明用户拥有该动态/权限路由
  // name: 'employees',
  // Layout是一级路由组件：访问/employees，映射Layout组件
  component: Layout,
  // 二级路由
  children: [
    {
      // 二级路由路径为空，默认使用一级路由路径作为二级路由路径
      path: '',
      // 访问/employees，也会映射二级路由组件
      component: () => import('@/views/employees'),
      // 左侧菜单读取title和icon属性
      // 这里的icon属性值people，对应src/icons/svg目录有一个people.svg
      meta: { title: '员工管理', icon: 'people' }
    },
    {
      // 动态路由传参(加:占位)  /employees/detail/666
      // 加?，可传or不传id
      path: 'detail/:id?',
      component: () => import('@/views/employees/Detail.vue'),
      // 标记当前路由规则的中文名称 后续在做左侧菜单时使用
      meta: { title: '员工详情' },
      // 该组件不在左侧菜单显示
      hidden: true
    }
  ]
}
