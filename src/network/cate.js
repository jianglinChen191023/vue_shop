import { request } from './request'

// 获取商品分类列表数据
export function getCateList (queryInfo) {
  return request({
    url: '/categories',
    params: queryInfo
  })
}
