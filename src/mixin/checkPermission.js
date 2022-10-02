import store from '@/store'
// 默认导出一个混入对象
export default {
  // 一个混入对象可以包含任意组件选项
  methods: {
    // 检查按钮操作权限
    checkPermission(key) {
      const { userInfo } = store.state.user
      if (userInfo.roles.points && userInfo.roles.points.length) {
        // 如果用户资料的points属性数组中的权限标识item与key相同，说明用户拥有该按钮操作权限
        // 简单来说：用户资料的points属性数组中有没有key，如果有key，说明用户拥有该按钮操作权限；如果没有key，说明不能点击该按钮或隐藏该按钮
        // some() 方法测试数组中是不是至少有 1 个元素通过了被提供的函数测试。它返回的是一个 Boolean 类型的值
        return userInfo.roles.points.some(item => item === key)
      }
      //  如果没有进入if判断，说明没有权限，直接返回false
      return false
    }
  }
}
