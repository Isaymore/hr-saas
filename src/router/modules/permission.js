// 权限的路由规则

import Layout from '@/layout'
export default {
  id: 'permissions',
  // 一级路由
  path: '/permission',
  // 如果name属性值和用户信息menus属性数组中的权限标识相同，说明用户拥有该动态/权限路由
  // name: 'permissions',
  // Layout是一级路由组件：访问/permission，映射Layout组件
  component: Layout,
  // 二级路由
  children: [
    {
      // 二级路由路径为空，默认使用一级路由路径作为二级路由路径
      path: '',
      // 访问/permission，也会映射二级路由组件
      component: () => import('@/views/permission'),
      meta: { title: '权限管理', icon: 'lock' }
    }
  ]
}
