import { getDepartments } from '@/api/departments'
const state = {
  companyName: '',
  companyManage: '',
  depts: []
}
const mutations = {
  // 每个mutation只能接收2个参数，一个是state对象，一个是提交mutation传过来的数据
  SET_COMPANY_COMPANYNAME: (state, companyName) => {
    state.companyName = companyName
  },
  SET_COMPANY_MANAGE: (state, companyManage) => {
    state.companyManage = companyManage
  },
  SET_DEPTS: (state, depts) => {
    state.depts = depts
  }
}
const actions = {
  // 封装获取部门的action
  async getDepartments({ commit }) {
    const response = await getDepartments()
    const { companyName, companyManage, depts } = response.data
    commit('SET_COMPANY_COMPANYNAME', companyName)
    commit('SET_COMPANY_MANAGE', companyManage)
    commit('SET_DEPTS', depts)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
