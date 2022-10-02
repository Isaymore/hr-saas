import Cookies from 'js-cookie'

// 用户登录token
const TokenKey = 'hrsaas-token'
// 用户登录成功时的时间戳，判断token是否过期
const TimeKey = 'hrsaas-timestamp-key'
// token过期时间 单位是s 1h=3600s
const expire = 3600

export const getToken = () => {
  return Cookies.get(TokenKey)
}

export const setToken = (token) => {
  return Cookies.set(TokenKey, token)
}

export const removeToken = () => {
  Cookies.remove(TokenKey)
}

// 获取时间戳
export const getTimestamp = () => {
  return Cookies.get(TimeKey)
}

// 设置时间戳
export const setTimestamp = () => {
  return Cookies.set(TimeKey, Date.now())
}

// 检测token是否过期
export const isExpire = () => {
  const currentTime = Date.now()
  const loginSuccessTime = getTimestamp()
  // 时间戳单位是ms   1s = 1000ms
  // 方法一：if...else
  // if ((currentTime - loginSuccessTime) / 1000 > expire) {
  //   return true
  // } else {
  //   return false
  // }
  // 方法二：直接return一个表达式计算得出的布尔值
  return (currentTime - loginSuccessTime) / 1000 > expire
}
