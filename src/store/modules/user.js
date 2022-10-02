import { getToken, setToken, removeToken, setTimestamp } from '@/utils/auth'
import { reqlogin, getUserInfo, reqUserDetailById } from '@/api/user'
import { resetRouter } from '@/router' // 引入重置router实例的方法
const state = {
  token: getToken(),
  userInfo: {}
}
// mutation是唯一修改state对象的地方
const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 修改state对象的userInfo
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  LOGOUT: state => {
    // 删除vuex中的token
    state.token = undefined
    state.userInfo = {}
  }
}
const actions = {
  // 封装登录的action
  async login({ commit }, userInfo) {
    const { mobile, password } = userInfo
    const result = await reqlogin({ mobile: mobile.trim(), password })
    // 提交mutation，唯一修改state对象的属性token的方法
    commit('SET_TOKEN', result.data)
    setToken(result.data)
    // 登录成功时，获取时间戳
    setTimestamp()
  },
  // 封装获取用户资料的action
  async getUserInfo({ commit }) {
    const result = await getUserInfo()
    // 传入用户id，为了获取用户资料的用户头像
    const baseUserInfo = await reqUserDetailById(result.data.userId)
    // 方法一：使用展开运算符，对象合并，将2个接口返回的结果合并，浅拷贝，不会改变原来的对象
    const userInfo = { ...result.data, ...baseUserInfo.data }
    // 方法二：使用原生js：Object.assign(target, source),会改变原来的target对象
    // const userInfo = Object.assign(result.data, baseUserInfo.data)
    // 提交mutation，唯一修改state对象的属性userInfo的方法
    commit('SET_USERINFO', userInfo)
    // 后期权限需要使用，埋下伏笔 返回result或userInfo都行
    return userInfo
  },
  // 封装退出登录的action
  logout({ commit }) {
    // 删除本地缓存的token
    removeToken()
    commit('LOGOUT')
    // 重置router实例
    // 因为前一个用户登录获取资料后，router.addRoutes或router.addRoute添加动态路由规则
    // 如果退出登录后，没有重置router实例，切换用户登录，虽然左侧菜单没有显示
    // 但用户直接在地址栏输入url，也可以访问
    resetRouter()
    // 重置vuex的permission.js中的state对象的routes路由数组为初始值，默认拥有静态路由
    // 因为不重置routes路由数组数据，用户退出登录后，permission.js还存在routes数据，占用内存
    // 开启命名空间的user.js，怎么提交开启命名空间的permission.js中的mutation
    // 添加option对象，root: true，提交根的mutation
    commit('permission/SET_ROUTES', [], { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
