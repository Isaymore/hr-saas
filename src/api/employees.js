// 引入request请求工具，或者说引入axios实例（该axios实例支持函数调用或对象调用）
import request from '@/utils/request'

// 封装获取员工简单列表api的方法
export const reqUserSimpleList = () => {
  return request({
    url: '/sys/user/simple'
  })
}

// 封装获取员工列表api的方法
export const getEmployeeList = ({ page, size }) => {
  return request({
    url: '/sys/user',
    params: {
      page,
      size
    }
  })
}

// 封装删除员工api的方法
export const delEmployeeById = (id) => {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

// 封装新增员工api的方法
export const addEmployee = (data) => {
  return request({
    url: '/sys/user',
    method: 'post',
    data
  })
}

// 封装更新员工api的方法
export const updateEmployeeById = (id, data) => {
  return request({
    url: `/sys/user/${id}`,
    method: 'put',
    data
  })
}

// 封装获取员工基本信息api的方法
export const getUserInfoById = (id) => {
  return request({
    url: `/sys/user/${id}`
  })
}

// 封装保存员工基本信息api的方法
export const updateUserInfoById = (data) => {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}

// 封装批量导入员工api的方法  这里的data是一个对象数组
export const importEmployees = (data) => {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

/** *
 *  读取用户详情的基础信息
 * **/
export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

/** *
 *  更新用户详情的基础信息
 * **/
export function updatePersonal(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}

/** **
 * 获取用户的岗位信息
 *
 * ****/
export function getJobDetail(id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}

/**
 * 保存岗位信息
 * ****/
export function updateJob(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}

// 封装给员工分配角色api的方法
export const assignRoles = ({ id, roleIds }) => {
  return request({
    url: '/sys/user/assignRoles',
    method: 'put',
    data: {
      id,
      roleIds
    }
  })
}
