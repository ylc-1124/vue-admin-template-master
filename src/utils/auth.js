import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

//从Cookie中获取存储的Token
export function getToken() {
  return Cookies.get(TokenKey)
}
//将接收到的token 存储在客户端浏览器的Cookies中
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
//删除cookies中的token
export function removeToken() {
  return Cookies.remove(TokenKey)
}
