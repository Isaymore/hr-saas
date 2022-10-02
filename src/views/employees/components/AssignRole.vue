<template>
  <div>
    <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
      <!-- v-model双向绑定roleIds数组：当前用户拥有的角色id列表，v-model收集表单数据 -->
      <el-checkbox-group v-model="roleIds">
        <!-- 多少个角色对应多少个复选框，所以需要v-for遍历 -->
        <!-- label属性值跟roleIds数组中的元素值相对应 -->
        <!-- 如果指定某个复选框的label属性值，等于roleIds数组中某个元素值，则选中该复选框 -->
        <!-- 手动选中某个复选框，e.target.checked为true，将label prop属性指向的role.id push压入数组roleIds -->
        <el-checkbox v-for="role in roleList" :key="role.id" :label="role.id">
          {{ role.name }}
        </el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="btnCancel">取 消</el-button>
        <el-button type="primary" @click="btnOk">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList } from '@/api/roles'
import { getUserInfoById, assignRoles } from '@/api/employees'
export default {
  name: 'AssignRole',
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 用户id，传入assignRoles请求的id参数
    userId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 所有角色列表
      roleList: [],
      // 当前用户拥有的角色id列表
      roleIds: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      // 角色数目一般不会太多，这里默认请求20条
      const result = await getRoleList({
        page: 1,
        pagesize: 5
      })
      const { rows } = result.data
      this.roleList = rows
    },
    // 获取当前用户的角色id列表
    async getUserInfoById(id) {
      const result = await getUserInfoById(id)
      const { roleIds } = result.data
      this.roleIds = roleIds
    },
    btnCancel() {
      // 清空角色id数组，不清空，会占用内存
      this.roleIds = []
      this.$emit('update:show-role-dialog', false)
    },
    async btnOk() {
      await assignRoles({
        id: this.userId,
        roleIds: this.roleIds
      })
      this.$emit('update:show-role-dialog', false)
    }
  }
}
</script>

<style>
</style>
