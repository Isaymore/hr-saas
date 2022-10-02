/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * 验证url的path、svg-icon组件接收的prop属性是否匹配
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 验证登录用户名
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  // return valid_map.indexOf(str.trim()) >= 0
  return valid_map.indexOf(str.trim()) !== -1
}

/**
 *验证手机号
 * @param {string} str
 * @returns {Boolean}
 */
export const validMobile = (str) => {
  const mobileRegexp = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
  return mobileRegexp.test(str)
}

/**
 *
 * @param {string} str
 * @returns {Boolean}
 */
export const validPassword = (str) => {
  const passwordRegexp = /^[a-zA-Z]\w{5,17}$/
  return passwordRegexp.test(str)
}
