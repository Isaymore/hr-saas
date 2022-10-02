<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button
            type="primary"
            size="small"
            @click="addPermission(1, '0')"
          >添加页面访问权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <!-- row-key指定行数据的key为权限对象的id -->
      <!-- 使用row-key的目的：如果不加row-key，不知道子节点加到哪个父节点，导致无法渲染显示子节点 -->
      <!-- 另外row-key优化table的渲染 -->
      <el-table :data="permissionList" border row-key="id">
        <el-table-column prop="name" label="名称" />
        <el-table-column align="center" prop="code" label="标识" />
        <el-table-column align="center" prop="description" label="描述" />
        <el-table-column align="center" label="操作">
          <template v-slot:default="{ row }">
            <el-button
              v-if="row.type === 1"
              type="text"
              @click="addPermission(2, row.id)"
            >添加按钮操作权限</el-button>
            <el-button
              type="text"
              @click="editPermission(row.id)"
            >编辑</el-button>
            <el-button
              type="text"
              @click="delPermission(row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增or编辑权限弹层 -->
    <el-dialog
      :title="title"
      :visible.sync="showPermissionDialog"
      center
      @close="btnCancel"
    >
      <el-form
        ref="permissionForm"
        :model="permissionForm"
        :rules="rules"
        label-width="80px"
        style="width: 80%"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="permissionForm.name" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="permissionForm.code" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="permissionForm.description" />
        </el-form-item>

        <el-form-item label="开启">
          <el-switch
            v-model="permissionForm.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
        <!-- <el-form-item label="菜单顺序">
          <el-input v-model="permissionForm.name" />
        </el-form-item>
        <el-form-item label="菜单icon">
          <el-input v-model="permissionForm.name" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="btnCancel">取 消</el-button>
        <el-button type="primary" @click="btnOk">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPermissionList,
  delPermission,
  addPermission,
  getPermissionDetail,
  updatePermission
} from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'Permission',
  data() {
    return {
      permissionList: [],
      showPermissionDialog: false,
      permissionForm: {
        enVisible: '0', // 默认关闭权限
        name: '',
        code: '',
        description: '',
        // 类型(判断是页面访问权限or按钮操作权限)
        // 弹层不需要显示 因为点击添加时，已经传入类型
        type: '',
        pid: '' // 因为是树形结构，需要知道添加到哪个节点
      },
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '权限标识不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    title() {
      return this.permissionForm.id ? '编辑权限' : '新增权限'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      const result = await getPermissionList()
      // this.permissionList = result.data
      // 将数组数据转化成带children的树形数据
      // 一级权限的pid为'0'，二级权限的pid为一级权限的id
      this.permissionList = tranListToTreeData(result.data, '0')
    },
    async delPermission(id) {
      try {
        await this.$confirm('确定删除该权限么？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
        await delPermission(id)
        this.getPermissionList()
        this.$message({
          type: 'success',
          message: '删除权限成功'
        })
      } catch (error) {
        console.error('error', error, typeof error)
        this.$message({
          type: 'warning',
          message: '已取消删除'
        })
      }
    },
    async addPermission(type, id) {
      // 传入的页面访问权限type为1，传入的按钮操作权限type为2
      this.permissionForm.type = type
      // 点击#添加页面访问权限，传入pid为'0'
      // 点击#添加按钮操作权限，传入pid为当前row的id
      this.permissionForm.pid = id
      this.showPermissionDialog = true
    },
    async editPermission(id) {
      const result = await getPermissionDetail(id)
      this.permissionForm = result.data
      this.showPermissionDialog = true
    },
    btnCancel() {
      this.permissionForm = {
        enVisible: '0', // 默认关闭权限
        name: '',
        code: '',
        description: '',
        // 类型(判断是页面访问权限or按钮操作权限)
        // 弹层不需要显示 因为点击添加时，已经传入类型
        type: '',
        pid: '' // 因为是树形结构，需要知道添加到哪个节点
      }
      this.$refs.permissionForm.resetFields()
      this.showPermissionDialog = false
    },
    async btnOk() {
      try {
        await this.$refs.permissionForm.validate()
        if (this.permissionForm.id) {
          await updatePermission(this.permissionForm)
          this.$message({
            type: 'success',
            message: '保存权限成功'
          })
        } else {
          await addPermission(this.permissionForm)
          this.$message({
            type: 'success',
            message: '新增权限成功'
          })
        }
        this.getPermissionList()
        this.showPermissionDialog = false
      } catch (error) {
        console.error('error', error, typeof error)
        this.$message({
          type: 'error',
          message: '表单校验不通过'
        })
      }
    }
  }
}
</script>

<style>
</style>
