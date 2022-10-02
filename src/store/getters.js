// getter是为了简化数据而生
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // state是大仓库store的全局state对象,user是小仓库
  token: state => state.user.token,
  username: state => state.user.userInfo.username,
  company: state => state.user.userInfo.company,
  userId: state => state.user.userInfo.userId,
  companyId: state => state.user.userInfo.companyId,
  // staffPhoto: state => state.user.userInfo.staffPhoto
  // 修改flower为flowe, 模拟图片加载失败
  // 头像img元素绑定了v-imageerror指令，触发error事件,默认显示兜底的图片
  staffPhoto: () => 'http://wjh-heima-1313412336.cos.ap-beijing.myqcloud.com/flowe.jpg',
  // routes路由数组，包含静态和动态路由
  routes: (state) => state.permission.routes
}
export default getters
