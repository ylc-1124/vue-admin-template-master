import request from '@/utils/request'
// 一个方法对应一个后端接口
export default {
  // 多条件查询用户列表
  getUserList(searchModel){
    return request({
      url: '/user/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        username: searchModel.username,
        phone: searchModel.phone
      }
    })
  },
  addUser(user){
    return request({
      url: '/user/add',
      method: 'post',
      data: user
    })
  },
  updateUser(user){
    return request({
      url: '/user/update',
      method: 'put',
      data: user
    })
  },
  getUserById(id){
    return request({
      // url: '/user/'+ id,
      url: `/user/${id}`,
      method: 'get'
    })
  },
  saveUser(user){
    if (user.id == null || user.id == undefined){
      return this.addUser(user)
    } else{
      return this.updateUser(user)
    }
  },
  deleteUserById(id) {
    return request({
      url: `/user/delete/${id}`,
      method: 'delete'
    })
  }
}
