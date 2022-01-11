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
    url: `/users1/${id}`,
    method: 'put',
    data: {
      email,
      mobile
    }
  })
}
