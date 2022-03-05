import { request } from './request'

// 获取参数列表数据
// sel[only,many] [静态参数,动态参数]
export function getParamsList (id, sel) {
  return request({
    url: `/categories/${id}/attributes`,
    params: {
      sel
    }
  })
}

// 添加动态参数或静态参数
export function addParams (id, data) {
  return request({
    url: `/categories/${id}/attributes`,
    method: 'post',
    data
  })
}

// 根据 id 查询 参数
export function getParams (id, attrId, params) {
  return request({
    url: `/categories/${id}/attributes/${attrId}`,
    params
  })
}

// 修改参数
export function updateParams (id, attrId, data) {
  return request({
    url: `/categories/${id}/attributes/${attrId}`,
    method: 'put',
    data
  })
}

// 删除参数
export function deleteParams (id, attrId) {
  return request({
    url: `/categories/${id}/attributes/${attrId}`,
    method: 'delete'
  })
}

// 编辑提交参数值
export function updateParamsValue (id, attrId, data) {
  return request({
    url: `/categories/${id}/attributes/${attrId}`,
    method: 'put',
    data
  })
}
