<script>
export default {
  name: 'MenuItem',
  // 说明该组件是函数式组件
  functional: true,
  props: {
    // Item子组件是函数式组件，接收父组件(比如SidebarItem组件
    // 使用了Item组件)传过来的icon和title prop属性
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    // console.log('context', context, typeof context)
    const { icon, title } = context.props
    const vnodes = []
    if (icon) {
      if (icon.includes('el-icon')) {
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else {
        // svg-icon组件使用者给子组件svg-icon传递icon-class prop属性
        vnodes.push(<svg-icon icon-class={icon} />)
      }
    }

    if (title) {
      vnodes.push(<span slot='title'>{title}</span>)
    }
    // console.log('vnodes', vnodes, typeof vnodes)
    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
