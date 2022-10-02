<template>
  <div>
    <el-dialog :title="title" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules">
        <el-form-item label="角色名" prop="name" :label-width="formLabelWidth">
          <el-input
            v-model="roleForm.name"
            autocomplete="off"
            style="width: 80%"
          />
        </el-form-item>
        <el-form-item
          label="角色描述"
          prop="description"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="roleForm.description"
            autocomplete="off"
            style="width: 80%"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="btnCancel">取 消</el-button>
        <el-button type="primary" @click="btnOk">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addRole, getRoleDetailById, updateRoleById } from '@/api/roles'
import { mapGetters } from 'vuex'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roleForm: {
        name: '',
        description: ''
      },
      formLabelWidth: '120px',
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    title() {
      return this.roleForm.id ? '编辑角色' : '新增角色'
    },
    ...mapGetters(['companyId'])
  },
  methods: {
    btnOk() {
      this.$refs.roleForm.validate(async(valid) => {
        if (valid) {
          if (this.roleForm.id) {
            await updateRoleById(this.roleForm.id, { ...this.roleForm, companyId: this.companyId })
            this.$message({
              type: 'success',
              message: '保存角色成功'
            })
          } else {
            await addRole({
              name: this.roleForm.name,
              description: this.roleForm.description
            })
            this.$message({
              type: 'success',
              message: '新增角色成功'
            })
          }
        }
      })
      this.$emit('refresh-role-list')
      this.$emit('update:show-dialog', false)
    },
    btnCancel() {
      this.$emit('update:show-dialog', false)
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$refs.roleForm.resetFields()
    },
    async getRoleDetailById(id) {
      const result = await getRoleDetailById(id)
      this.roleForm = result.data
    }
  }
}
</script>

<style>
</style>
