<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!--  v-model="activeName" @tab-click="handleClick" -->
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="first">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="small"
              style="margin-bottom: 10px"
              @click="addRole"
            >新增角色
            </el-button>
            <el-table v-loading="loading" :data="roleList" border style="width: 100%">
              <el-table-column
                align="center"
                type="index"
                label="序号"
                width="80"
              />
              <el-table-column
                align="center"
                prop="name"
                label="角色名"
                width="100"
              />
              <el-table-column align="center" prop="description" label="描述" />
              <el-table-column align="center" label="操作" width="180">
                <!-- 子组件el-table-column的DOM模板使用slot元素，定义作用域插槽，这里使用作用域插槽 -->
                <template slot-scope="{ row }">
                  <a
                    style="color: #6088fa"
                    @click="assignPermission(row.id)"
                  >分配权限</a>
                  <a
                    style="color: #6088fa; margin: 0 10px"
                    @click="editRole(row.id)"
                  >修改</a>
                  <a @click="delRoleById(row.id)">删除</a>
                  <!-- <span>{{ row }}</span> -->
                  <!-- <span>{{ column }}</span> -->
                  <!-- <span>{{ $index }}</span> -->
                </template>
              </el-table-column>
            </el-table>
            <div style="text-align: center">
              <el-pagination
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                layout="prev, pager, next"
                @current-change="handleCurrentChange"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane label="公司信息" name="second">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地址的更新，将使得公司资料被重新审核，请谨慎修改"
              type="warning"
              show-icon
              :closable="false"
            />
            <div class="companyInfo">
              <!-- 并不是所有的表单都需要绑定model和rules -->
              <!-- 如果表单不需要校验，可以不绑定model和rules -->
              <el-form
                ref="companyForm"
                :model="companyForm"
                label-width="80px"
                size="small"
                disabled
              >
                <el-form-item label="公司名称">
                  <el-input v-model="companyForm.name" />
                </el-form-item>
                <el-form-item label="公司地址">
                  <el-input v-model="companyForm.companyAddress" />
                </el-form-item>
                <el-form-item label="公司电话">
                  <el-input v-model="companyForm.companyPhone" />
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input v-model="companyForm.mailbox" />
                </el-form-item>
                <el-form-item label="备注">
                  <el-input
                    v-model="companyForm.remarks"
                    type="textarea"
                    :rows="2"
                  />
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
        <Dialog ref="roleForm" :show-dialog.sync="showDialog" @refresh-role-list="getRoleList" />
        <el-dialog
          title="分配权限"
          :visible.sync="showPermissionDialog"
          center
        >
          <!-- 使用check-strictly的场景：用户有页面访问权限，但没有按钮操作权限 -->
          <!-- 如果这个属性值为false，用户勾选页面访问权限，也会全部勾选该页面访问权限下所有按钮操作权限 俗称：连锁反应 -->
          <!-- default-checked-keys设置默认选中的节点，必须设置节点的key(node-key)，不设置节点的key(node-key)，不知道选中哪个节点 -->
          <!-- 因为default-checked-keys prop属性绑定的是data属性permIds（指向当前角色的权限id列表），所以节点的key(node-key)只能是权限id -->
          <el-tree
            ref="permissionTree"
            :data="permissionTreeData"
            :props="defaultProps"
            show-checkbox
            check-strictly
            :default-checked-keys="permIds"
            node-key="id"
          />
          <div slot="footer" class="dialog-footer">
            <el-button @click="btnCancel">取 消</el-button>
            <el-button type="primary" @click="btnOk">确 定</el-button>
          </div>
        </el-dialog>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getRoleList, delRoleById, assignPrem, getRoleDetailById } from '@/api/roles'
import { getPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
import { getCompanyInfoById } from '@/api/company'
import Dialog from '@/views/setting/components/Dialog'
import { mapGetters } from 'vuex'
export default {
  name: 'Setting',
  components: {
    Dialog
  },
  data() {
    return {
      activeName: 'first',
      companyForm: {
        // 公司信息的表单数据，可以不写，直接给一个空对象
        // 这里给出具体属性，更加语义化，建议给
        name: '',
        companyAddress: '',
        companyPhone: '',
        mailbox: '',
        remarks: ''
      },
      page: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      roleList: [],
      showDialog: false,
      loading: false,
      showPermissionDialog: false,
      permissionTreeData: [], // 权限的树形数据，带children
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      roleId: '', // 给角色分配权限的角色id
      permIds: [] // 当前角色的权限id列表
    }
  },
  computed: {
    // 辅助方法获取getter.js中的companyId属性，映射为计算属性
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyInfoById()
  },
  methods: {
    async getRoleList() {
      this.loading = true
      const result = await getRoleList({
        page: this.page.page,
        pagesize: this.page.pagesize
      })
      const { total, rows } = result.data
      this.page.total = total
      this.roleList = rows
      this.loading = false
    },
    // 给角色分配权限
    async assignPermission(id) {
      const result = await getPermissionList()
      this.permissionTreeData = tranListToTreeData(result.data, '0')
      // 当前角色id保存到data属性roleId，用于后面btnOk方法内分配权限
      this.roleId = id
      const result2 = await getRoleDetailById(id)
      // 当前角色的权限id列表保存到data属性permIds，data属性permIds绑定给default-checked-keys prop属性
      // data属性permIds权限id列表中有节点的key(node-key)绑定的权限id，会默认选中
      this.permIds = result2.data.permIds
      this.showPermissionDialog = true
    },
    btnCancel() {
      this.showPermissionDialog = false
    },
    async btnOk() {
      // 返回目前被选中的节点的 key 所组成的数组  节点的key(node-key)绑定权限id
      this.permIds = this.$refs.permissionTree.getCheckedKeys()
      await assignPrem({
        id: this.roleId,
        permIds: this.permIds
      })
      this.showPermissionDialog = false
      this.$message({
        type: 'success',
        message: '分配权限成功'
      })
    },
    handleCurrentChange(val) {
      this.page.page = val
      this.getRoleList()
    },
    async getCompanyInfoById() {
      // 辅助方法获取getter.js中的companyId属性，映射为计算属性
      const result = await getCompanyInfoById(this.companyId)
      this.companyForm = result.data
    },
    async delRoleById(id) {
      try {
        // try...catch只能捕捉同步代码抛出的异常，所以这里promise对象前面要加await
        await this.$confirm('确定删除该用户角色么？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await delRoleById(id)
        this.getRoleList()
        this.$message({
          type: 'success',
          message: '删除角色成功'
        })
      } catch (error) {
        console.error('error', error, typeof error)
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    async editRole(id) {
      // 先获取角色详情，再打开对话框，防止表单数据回显，出现闪烁
      await this.$refs.roleForm.getRoleDetailById(id)
      this.showDialog = true
    },
    addRole() {
      this.showDialog = true
    }
  }
}
</script>

<style scoped>
.companyInfo {
  width: 50%;
  margin: 30px auto;
}
</style>
