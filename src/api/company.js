import request from '@/utils/request'

// 封装获取公司信息api的方法
// companyId来源：用户登录成功后，vuex小仓库user.js中的state对象保存的用户资料userInfo有companyId
export const getCompanyInfoById = (companyId) => {
  return request({
    url: `/company/${companyId}`
  })
}
