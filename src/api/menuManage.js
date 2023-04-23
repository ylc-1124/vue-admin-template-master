import request from '@/utils/request'
// 一个方法对应一个后端接口
export default {
  getAllMenu(){
    return request({
      url: '/menu',
      method: 'get'
    })
  },
}
