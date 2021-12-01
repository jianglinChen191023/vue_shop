import {
  ADD_TOKEN,
  UPDATE_TOKEN
} from './mutation-types'

export default {
  addToken (context, payload) {
    return new Promise((resolve, reject) => {
      context.commit(ADD_TOKEN, payload)
      resolve('添加 token 成功')
    })
  },
  updateToken (context, payload) {
    return new Promise((resolve, reject) => {
      context.commit(UPDATE_TOKEN, payload)
      resolve('修改 token 成功')
    })
  }
}
