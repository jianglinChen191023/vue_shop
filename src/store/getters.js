export default {
  token: state => state.token || window.localStorage.getItem('token'),
  activePath: state => state.activePath || window.localStorage.getItem('activePath')
}
