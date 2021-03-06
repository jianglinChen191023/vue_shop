import { request } from './request'

export function getUsers (queryInfo) {
  return request({
    url: '/users',
    params: queryInfo
  })
}

export function updateState (uId, type) {
  return request({
    url: `/users/${uId}/state/${type}`,
    method: 'put'
  })
}

export function saveUser (addForm) {
  return request({
    url: '/users',
    method: 'post',
    data: addForm
  })
}

export function getUserById (id) {
  return request({
    url: `/users/${id}`
  })
}

export function updateUserInfo (id, email, mobile) {
  return request({
    url: `/users/${id}`,
    method: 'put',
    data: {
      email,
      mobile
    }
  })
}

// 删除单个用户
export function deleteUserInfoById (id) {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  })
}

// 获取所有角色
export function getAllRole () {
  return request({
    url: '/roles'
  })
}

// 修改用户的角色
export function updateRoleByUserId (userId, rid) {
  return request({
    url: `/users/${userId}/role`,
    method: 'put',
    data: {
      rid
    }
  })
}
