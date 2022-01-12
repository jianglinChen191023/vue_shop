import { request } from './request'

// 获取所有权限列表数据
export function getRightsList () {
  return request({
    url: '/rights/list'
  })
}
