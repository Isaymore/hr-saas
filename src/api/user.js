import request from '@/utils/request'

// 封装登录api的方法
export const reqlogin = ({ mobile, password }) => {
  return request({
    url: '/sys/login',
    method: 'post',
    data: {
      mobile,
      password
    }
  })
}

// 封装获取用户资料api的方法
export const getUserInfo = () => {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

// 封装获取用户基本信息-用户头像api的方法
export const reqUserDetailById = (id) => {
  return request({
    url: `/sys/user/${id}`,
    // axios请求方法默认是get，可写，可不写
    method: 'get'
  })
}
