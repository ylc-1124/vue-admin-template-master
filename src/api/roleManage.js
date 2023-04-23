import request from '@/utils/request'
// 一个方法对应一个后端接口
export default {
  // 多条件查询用户列表
  getRoleList(searchModel){
    return request({
      url: '/role/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        roleName: searchModel.roleName,
      }
    })
  },
  addRole(role){
    return request({
      url: '/role/add',
      method: 'post',
      data: role
    })
  },
  updateRole(role){
    return request({
      url: '/role/update',
      method: 'put',
      data: role
    })
  },
  getRoleById(id){
    return request({
      url: `/role/${id}`,
      method: 'get'
    })
  },
  saveRole(role){
    if (role.roleId == null || role.roleId == undefined){
      return this.addRole(role)
    } else{
      return this.updateRole(role)
    }
  },
  deleteRoleById(id) {
    return request({
      url: `/role/delete/${id}`,
      method: 'delete'
    })
  },
  getAllRoleList(){
    return request({
      url: '/role/all',
      method: 'get'
    })
  },
}
