import { request } from './request'

// 获取角色列表数据
export function getRolesList () {
  return request({
    url: '/roles'
  })
}

// 删除该角色指定的权限
export function deleteRightById (roleId, rightId) {
  return request({
    url: `/roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}

// 根据 ID 查询角色
export function getRoleById (roleId) {
  return request({
    url: `/roles/${roleId}`
  })
}

// 更新角色
export function updateRoleById (roleId, roleName, roleDesc) {
  return request({
    url: `/roles/${roleId}`,
    method: 'put',
    data: {
      roleName,
      roleDesc
    }
  })
}

// 根据 ID 删除角色
export function deleteRoleById (roleId) {
  return request({
    url: `/roles/${roleId}`,
    method: 'delete'
  })
}

// 添加角色
export function addRole (addFormData) {
  return request({
    url: '/roles',
    method: 'post',
    data: addFormData
  })
}

// 获取所有权限
export function getRightsTree () {
  return request({
    url: '/rights/tree'
  })
}

// 更新角色权限
export function updateRightsByRoleId (roleId, rids) {
  return request({
    url: `/roles/${roleId}/rights`,
    method: 'post',
    data: {
      rids
    }
  })
}
