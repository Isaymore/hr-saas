// 社保的路由规则

import Layout from '@/layout'
export default {
  id: 'social_securitys',
  // 一级路由
  path: '/social',
  // 如果name属性值和用户信息menus属性数组中的权限标识相同，说明用户拥有该动态/权限路由
  // name: 'social_securitys',
  // Layout是一级路由组件：访问/social，映射Layout组件
  component: Layout,
  // 二级路由
  children: [
    {
      // 二级路由路径为空，默认使用一级路由路径作为二级路由路径
      path: '',
      // 访问/social，也会映射二级路由组件
      component: () => import('@/views/social'),
      meta: { title: '社保', icon: 'table' }
    }
  ]
}
