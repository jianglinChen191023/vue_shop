import { request } from './request'

export function getUsers (queryInfo) {
  return request({
    url: '/users',
    params: queryInfo
  })
}
