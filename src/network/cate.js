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

// 根据 id 查询分类
export function getCateById (id) {
  return request({
    url: `/categories/${id}`
  })
}

// 编辑提交分类
export function updateCate (id, catName) {
  return request({
    url: `/categories/${id}`,
    method: 'put',
    data: {
      cat_name: catName
    }
  })
}
