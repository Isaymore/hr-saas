// 引入request请求工具，或者说引入axios实例（该axios实例支持函数调用或对象调用）
import request from '@/utils/request'

// 封装获取部门列表api的方法
export const getDepartments = () => {
  return request({
    url: '/company/department'
  })
}

// 封装删除部门api的方法
export const delDepartmentById = (id) => {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

// 封装新增部门api的方法
export const addDepartment = (data) => {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

// 封装查询部门详情api的方法
export const getDepartmentDetailById = (id) => {
  return request({
    url: `/company/department/${id}`
  })
}

// 封装修改部门详情api的方法
export const updateDepartmentById = (id, data) => {
  return request({
    url: `/company/department/${id}`,
    method: 'put',
    data
  })
}

