import request from '@/utils/request'

// 封装获取角色列表api的方法
export const getRoleList = ({ page, pagesize }) => {
  return request({
    url: '/sys/role',
    params: {
      page,
      pagesize
    }
  })
}

// 封装给角色分配权限api的方法
export const assignPrem = ({ id, permIds }) => {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data: {
      id,
      permIds
    }
  })
}

// 封装删除角色api的方法
export const delRoleById = (id) => {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

// 封装更新角色api的方法
export const updateRoleById = (id, data) => {
  return request({
    url: `/sys/role/${id}`,
    method: 'put',
    data
  })
}

// 封装获取角色详情api的方法
export const getRoleDetailById = (id) => {
  return request({
    url: `/sys/role/${id}`
  })
}

// 封装添加角色api的方法
export const addRole = ({ name, description }) => {
  return request({
    url: '/sys/role',
    method: 'post',
    data: {
      name,
      description
    }
  })
}
