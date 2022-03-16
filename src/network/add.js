import { request } from './request'

// 根据 id 查询动态参数
export function getManyListById (id) {
  return request({
    url: `/categories/${id}/attributes`,
    params: {
      sel: 'many'
    }
  })
}

// 根据 id 查询静态参数
export function getOnlyListById (id) {
  return request({
    url: `/categories/${id}/attributes`,
    params: {
      sel: 'only'
    }
  })
}

// 添加商品
export function addGoods (data) {
  return request({
    url: '/goods',
    method: 'post',
    data
  })
}
