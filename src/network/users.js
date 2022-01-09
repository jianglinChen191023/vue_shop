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
