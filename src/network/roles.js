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
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}
