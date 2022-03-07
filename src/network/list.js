import { request } from './request'

// 获取商品分类列表数据
export function getGoodsList (queryInfo) {
  return request({
    url: '/goods',
    params: queryInfo
  })
}
