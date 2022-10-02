// 公司设置由规则

import Layout from '@/layout'
export default {
  id: 'settings',
  // 一级路由
  path: '/setting',
  // 如果name属性值和用户信息menus属性数组中的权限标识相同，说明用户拥有该动态/权限路由
  // name: 'settings',
  // Layout是一级路由组件：访问/setting，映射Layout组件
  component: Layout,
  // 二级路由
  children: [
    {
      // 二级路由路径为空，默认使用一级路由路径作为二级路由路径
      path: '',
      // 访问/setting，也会映射二级路由组件
      component: () => import('@/views/setting'),
      meta: { title: '公司设置', icon: 'setting' }
    }
  ]
}
