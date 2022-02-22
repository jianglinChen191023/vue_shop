import { request } from './request'

// 获取商品分类列表数据
export function getCateList (queryInfo) {
  return request({
    url: '/categories',
    params: queryInfo
  })
}

// 添加分类
export function addCate (data) {
  return request({
    url: '/categories',
    method: 'post',
    data: data
  })
}
