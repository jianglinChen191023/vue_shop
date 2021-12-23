export default {
  token: state => state.token || window.localStorage.getItem('token')
}
