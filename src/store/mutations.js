import {
  ADD_TOKEN,
  UPDATE_TOKEN,
  UPDATE_ACTIVE_PATH
} from './mutation-types'

export default {
  // mutations 唯一的目的就是修改 state 中状态
  // mutations 中的每个方法尽可能完成的事情比较单一一点
  [ADD_TOKEN] (state, token) {
    state.token = token
  },
  [UPDATE_TOKEN] (state, token) {
    state.token = token
  },
  [UPDATE_ACTIVE_PATH] (state, activePath) {
    state.activePath = activePath
  }
}
