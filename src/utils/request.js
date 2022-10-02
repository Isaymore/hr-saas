import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken, isExpire } from './auth'
import router from '@/router'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

service.interceptors.request.use(config => {
  // 如果本地缓存有token，给请求头参数Authorization注入token
  // if判断条件可以写getToken()或store.getters.token
  // 每个请求都会携带token
  if (store.getters.token) {
    /**
     * 判断token是否过期，如果过期，分发action：退出登录
     * 并路由跳转到/login
     */
    if (isExpire()) {
      console.log(666)
      store.dispatch('user/logout')
      router.push({ path: '/login' })
      // 加return，返回一个失败的promise对象，不会执行当前函数后面的代码
      return Promise.reject(new Error('token过期'))
    }
    config.headers.Authorization = `Bearer ${getToken()}`
    // 或者使用对象的枚举属性写法
    // config.headers['Authorization'] = `Bearer ${getToken()}`
  }
  // 必须要返回config,config是请求的配置信息对象
  return config
}, error => {
  return Promise.reject(error)
})

service.interceptors.response.use(response => {
  // axios请求默认给response加一层data包裹，reponse.data可以直接拿到后台返回的数据
  const res = response.data
  // 方法一：res.code === 10000，说明接口请求成功
  // 方法二：res.success为true,说明接口成功
  if (res.success) {
    return res
  } else {
    // 比如登录用户名密码不正确，会走这里的代码逻辑
    Message.error(res.message)
    return Promise.reject(new Error(res.message))
  }
}, error => {
  /**
   * if判断后端返回的状态码是不是10002,如果是，说明token过期
   * token过期，分发action：退出登录，并路由跳转到/login
   */
  if (error.response.data.code === 10002) {
    console.log(888)
    store.dispatch('user/logout')
    router.push({ path: '/login' })
  } else {
    Message.error(error.message)
  }
  return Promise.reject(error)
})

export default service
