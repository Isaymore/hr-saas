<template>
  <div>
    <el-dialog :title="title" :visible="showDialog" center @close="btnCancel">
      <el-form
        ref="employeeForm"
        :model="employeeForm"
        :rules="rules"
        label-width="120px"
        style="width: 80%"
      >
        <el-form-item label="姓名" prop="username">
          <el-input
            v-model="employeeForm.username"
            placeholder="请输入姓名"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="工号" prop="workNumber">
          <el-input
            v-model="employeeForm.workNumber"
            placeholder="请输入工号"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input
            v-model="employeeForm.mobile"
            placeholder="请输入手机号"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="部门" prop="departmentName">
          <el-input
            v-model="employeeForm.departmentName"
            placeholder="请输入部门"
            autocomplete="off"
            @focus="getDepartments"
          />
          <el-tree
            v-if="showTree"
            v-loading="loading"
            :data="treeDeptsList"
            :props="defaultProps"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </el-form-item>
        <el-form-item label="入职时间">
          <el-date-picker
            v-model="employeeForm.timeOfEntry"
            type="date"
            placeholder="请选择日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="转正时间">
          <el-date-picker
            v-model="employeeForm.correctionTime"
            type="date"
            placeholder="请选择日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="聘用方式">
          <el-select
            v-model="employeeForm.formOfEmployment"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="option in employmentType"
              :key="option.id"
              :label="option.value"
              :value="option.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="btnCancel">取 消</el-button>
        <el-button type="primary" size="small" @click="btnOk">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addEmployee,
  updateEmployeeById,
  getUserInfoById
} from '@/api/employees'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import EmployeeEnum from '@/api/constant/employees'
export default {
  name: 'EmployeeDialog',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      employeeForm: {
        username: '',
        workNumber: '',
        mobile: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: '',
        formOfEmployment: ''
      },
      rules: {
        username: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
          { min: 2, max: 4, message: '员工姓名为2-4个字符', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern:
              /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [
          { required: true, message: '入职时间不能为空', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ]
      },
      // 部门的树形数据
      treeDeptsList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      showTree: false,
      loading: false
    }
  },
  computed: {
    employmentType() {
      return EmployeeEnum.hireType
    },
    title() {
      return this.employeeForm.id ? '编辑员工' : '新增员工'
    }
  },
  methods: {
    btnCancel() {
      this.employeeForm = {}
      // 用户点击部门输入框，触发显示树形组件，但没有点击选择部门
      // 关闭弹层，也要重置showTree为false
      this.showTree = false
      this.$refs.employeeForm.resetFields()
      this.$emit('update:show-dialog', false)
    },
    async btnOk() {
      // 方法一：
      // this.$refs.employeeForm.validate(async(valid) => {
      //   if (valid) {
      //     if (this.employeeForm.id) {
      //       await updateEmployeeById(this.employeeForm.id, this.employeeForm)
      //       this.$message({
      //         type: 'success',
      //         message: '保存员工成功'
      //       })
      //     } else {
      //       await addEmployee(this.employeeForm)
      //       this.$message({
      //         type: 'success',
      //         message: '新建员工成功'
      //       })
      //     }
      //     this.$emit('refresh-employee-list')
      //     this.$emit('update:show-dialog', false)
      //   } else {
      //     console.error('表单校验不通过')
      //     this.$message({
      //       type: 'error',
      //       message: '表单校验不通过'
      //     })
      //     return false
      //   }
      // })
      // 方法二：try...catch
      try {
        await this.$refs.employeeForm.validate()
        if (this.employeeForm.id) {
          await updateEmployeeById(this.employeeForm.id, this.employeeForm)
          this.$message({
            type: 'success',
            message: '保存员工成功'
          })
        } else {
          await addEmployee(this.employeeForm)
          this.$message({
            type: 'success',
            message: '新建员工成功'
          })
        }
        // 方法一触发自定义事件：this.$emit('refresh-employee-list') -- 推荐
        // 方法二：通过this.$parent获取父组件实例，调用父组件的实例方法
        this.$parent.getEmployeeList()
        // 方法一触发自定义事件：this.$emit('update:show-dialog', false) --推荐
        // this.$emit('update:show-dialog', false)
        // 方法二：通过this.$parent获取父组件实例，访问父组件的data属性
        this.$parent.showDialog = false
      } catch (error) {
        console.error('error', error, typeof error)
        this.$message({
          type: 'error',
          message: '表单校验不通过'
        })
      }
    },
    async getDepartments() {
      this.showTree = true
      this.loading = true
      const result = await getDepartments()
      const { depts } = result.data
      this.treeDeptsList = tranListToTreeData(depts, '')
      this.loading = false
    },
    handleNodeClick(data) {
      this.employeeForm.departmentName = data.name
      this.showTree = false
    },
    async getUserInfoById(id) {
      const result = await getUserInfoById(id)
      this.employeeForm = result.data
    }
  }
}
</script>

<style>
</style>
