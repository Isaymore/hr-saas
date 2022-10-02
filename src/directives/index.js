// 自定义指令v-imageerror的指令定义对象
export const imageerror = {
  inserted(el, binding) {
    // 监听img元素的错误事件，如果图片加载失败，触发error事件
    el.addEventListener('error', () => {
      // 图片加载失败，默认给一个兜底图片  binding.value是指令的绑定值
      el.src = binding.value
    })
  }
}
