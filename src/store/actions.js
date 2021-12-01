import {
  ADD_TOKEN
} from './mutation-types'

export default {
  addToken (context, payload) {
    context.commit(ADD_TOKEN, payload)
  }
}
