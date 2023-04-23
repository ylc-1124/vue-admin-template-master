<template>
  <div>
    <!--  搜索栏-->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input v-model="searchModel.roleName" placeholder="角色名" clearable></el-input>
          <el-button @click="getRoleList" type="primary" round icon="el-icon-search">查询</el-button>
        </el-col>
        <el-col :span="4" align="right">
          <el-button @click="openEditUI(null)" type="success" icon="el-icon-plus" circle></el-button>
        </el-col>
      </el-row>
    </el-card>
    <!--  结果列表-->
    <el-card>
      <el-table
        :data="roleList"
        stripe
        style="width: 100%"
      >
        <el-table-column
          label="#"
          width="80"
        >
          <template slot-scope="scope">
            <!--        编号计算公式 (pageNo - 1) * pageSize + index + 1 -->
            {{ (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="roleId"
          label="角色ID"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="260"
        >
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述"
        >
<!--          不写width就会把剩余的宽度给它-->
        </el-table-column>
        <el-table-column
          label="操作"
          width="180"
        >
          <template slot-scope="scope">
            <el-button @click="openEditUI(scope.row.roleId)" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="deleteRole(scope.row)" type="danger" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--  分页组件-->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchModel.pageNo"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="searchModel.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!--    角色信息编辑对话框-->
    <el-dialog @close="clearForm" :title="title" :visible.sync="dialogFormVisible">
      <el-form ref="roleFormRef" :model="roleForm" :rules="rules">
        <el-form-item label="角色名" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="roleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth">
          <el-input v-model="roleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限设置" prop="menuIdList" :label-width="formLabelWidth">
          <el-tree :data="menuList" :props="menuProps" ref="menuRef"
                   node-key="menuId" default-expand-all show-checkbox style="width: 85%"></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入api
import roleApi from '@/api/roleManage'
import menuApi from '@/api/menuManage'

export default {
  name: 'Role',
  data() {
    return {
      menuList:[],
      menuProps:{ //树形控件的映射关系
        children: 'children',
        label: 'title'
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 2, max: 22, message: '长度在 2 到 22 个字符', trigger: 'blur' }
        ]
      },
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      roleList: [],
      total: 0,
      title: ' ',
      dialogFormVisible: false,
      roleForm: {},
      formLabelWidth: '130px',
    }
  },
  methods: {
    getAllMenu(){
      menuApi.getAllMenu().then(
        response =>{
          this.menuList = response.data
        }
      )
    },
    deleteRole(role) {
      this.$confirm(`您确认删除用户${role.roleName}？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        roleApi.deleteRoleById(role.roleId).then(
          response =>{
            this.$message({
              type: 'success',
              message: response.msg
            });
            this.getRoleList()
          }
        )
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    saveRole() {
      // 触发表单验证
      this.$refs.roleFormRef.validate((valid) => {
        if (valid) {
          let checkedKeys = this.$refs.menuRef.getCheckedKeys()
          let halfCheckedKeys = this.$refs.menuRef.getHalfCheckedKeys()
          this.roleForm.menuIdList = checkedKeys.concat(halfCheckedKeys)
          // 验证通过，提交请求给后台
          roleApi.saveRole(this.roleForm).then(
            response => {
              // 成功提示
              this.$message({
                message: response.msg,
                type: 'success'
              })
              // 关闭对话框
              this.dialogFormVisible = false
              // 刷新数据
              this.getRoleList()
            }
          )
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    clearForm() {
      this.roleForm = {}
      this.$refs.roleFormRef.clearValidate()
      this.$refs.menuRef.setCheckedKeys([])
    },
    handleSizeChange(pageSize) {// pageSize修改的回调
      this.searchModel.pageSize = pageSize
      this.getRoleList()
    },
    handleCurrentChange(pageNo) {// pageNo修改的回调
      this.searchModel.pageNo = pageNo
      this.getRoleList()
    },
    // 更新页面数据
    getRoleList() {
      roleApi.getRoleList(this.searchModel).then(
        // response是后端返回的result对象
        response => {
          console.log(response)
          this.roleList = response.data.rows
          this.total = response.data.total
        }
      )
    },
    openEditUI(id) {
      if (id == null) {
        //添加操作
        this.title = '添加角色'
      } else {
        //修改操作
        this.title = '修改角色'
        //根据id查询用户信息
        roleApi.getRoleById(id).then(
          response => {
            this.roleForm = response.data
            this.$refs.menuRef.setCheckedKeys(response.data.menuIdList)
          }
        )
      }
      this.dialogFormVisible = true
    }
  },
  mounted() {
    // 组件创建时候就查询用户列表
    this.getRoleList()
    this.getAllMenu()
  }
}
</script>

<style scoped>
/*使条件框在一行展示*/
#search .el-input {
  width: 200px;
  margin-right: 10px;
}

.el-dialog .el-input {
  width: 85%;
}

</style>
