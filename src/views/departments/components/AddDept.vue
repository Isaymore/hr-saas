<template>
  <div>
    <!-- 父组件给子组件el-dialog绑定或监听自定义事件close，btnCancel是事件回调 -->
    <!-- 关闭对话框(点击关闭、取消、确定按钮或弹窗外空白区域都生效)，子组件el-dialog内部触发自定义事件close -->
    <el-dialog :title="title" :visible="showDialog" @close="btnCancel">
      <el-form
        ref="deptForm"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input
            v-model="formData.name"
            style="width: 80%"
            placeholder="1-50个字符"
          />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input
            v-model="formData.code"
            style="width: 80%"
            placeholder="1-50个字符"
          />
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <!-- 部门负责人下拉框获得焦点时，触发自定义事件focus -->
          <el-select
            v-model="formData.manager"
            style="width: 80%"
            placeholder="请选择"
            @focus="getUserSimpleList"
          >
            <el-option
              v-for="user in userSimpleList"
              :key="user.id"
              :label="user.username"
              :value="user.username"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input
            v-model="formData.introduce"
            style="width: 80%"
            type="textarea"
            :rows="3"
            placeholder="1-300个字符"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="btnCancel">取消</el-button>
        <el-button type="primary" @click="btnOk">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDepartments,
  addDepartment,
  getDepartmentDetailById,
  updateDepartmentById
} from '@/api/departments'
import { reqUserSimpleList } from '@/api/employees'
export default {
  name: 'AddDept',
  props: {
    //  方法一：子组件接收父组件departments/index.vue传过来的showDialog prop属性
    //  控制新增子部门的对话框组件的显示or隐藏
    showDialog: {
      type: Boolean,
      default: false
    },
    // 子组件接收父组件departments/index.vue传过来的treeNode prop属性，该prop指向data属性:node
    // 当前节点的数据对象，记录当前点击的node节点
    treeNode: {
      type: Object,
      default: null
    }
    // 方法一：title显示新增or编辑部门
    // 子组件接收父组件departments/index.vue传过来的title prop属性
    // title: {
    //   type: String,
    //   required: true
    // }
  },
  data() {
    // 自定义校验函数：校验model字段name，传给rules对象的校验字段name的validator
    // 部门名称不能和同级别的重复
    const checkNameRepeat = async(rule, value, callback) => {
      // 获取最新的组织架构数据，因为有可能其他用户修改了
      const result = await getDepartments()
      // 解构赋值，depts是所有的部门数据
      const { depts } = result.data
      // 校验重复规则，同时支持新增和编辑模式
      let isRepeat = false
      if (this.formData.id) {
        // 表单数据有id，说明是编辑模式
        // 首先找出同级部门，并且排除自身（不排除自身，保存一定会提示部门名称重复）
        // 比如编辑部门张三 => 除了我之外，同级部门下不能有叫张三的
        // this.formData.id或this.treeNode.id都可以,建议统一使用一个
        const newArr = depts.filter((item) => {
          if (item.pid === this.formData.pid && item.id !== this.formData.id) {
            return true
          } else {
            return false
          }
        })
        isRepeat = newArr.some((item) => item.name === value)
      } else {
        // 没有id，新增模式
        const newArr = depts.filter((item) => {
          // 目的：找到当前点击的node节点下，所有同级别的部门数据
          // 遍历depts数组，如果某一元素的pid等于当前点击的node节点的id
          // 说明该元素是子级部门，当前点击的node节点是父级部门
          // 组织架构头部的company对象如果没有传入id，this.treeNode.id是undefined
          // 传入id为'',得到pid为''的一级部门数据
          return item.pid === this.treeNode.id
        })
        isRepeat = newArr.some((item) => {
          return item.name === value
        })
      }
      // 不管是新增or编辑模式，都要判断部门名称
      if (isRepeat) {
        callback(new Error(`同级部门下已经有${value}的部门了`))
      } else {
        callback()
      }
    }
    // 自定义校验函数：校验model字段code，传给rules对象的校验字段code的validator
    // 整个组织架构的部门编码唯一
    const checkCodeRepeat = async(rule, value, callback) => {
      const result = await getDepartments()
      const { depts } = result.data
      // 校验重复规则，同时支持新增和编辑模式
      let isRepeat = false
      if (this.formData.id) {
        // 表单数据有id，说明是编辑模式
        // 首先排除自身（不排除自身，保存一定会提示部门编码重复）
        const newArr = depts.filter((item) => item.id !== this.formData.id)
        isRepeat = newArr.some((item) => item.code === value)
      } else {
        // 没有id，新增模式
        isRepeat = depts.some((item) => {
          // 遍历数组depts，判断数组中是不是至少有1个元素的code等于表单输入值value
          return item.code === value
        })
      }
      console.log(isRepeat)
      // 不管是新增or编辑模式，都要判断部门代码
      if (isRepeat) {
        callback(new Error(`组织架构中已经有部门使用${value}编码`))
      } else {
        callback()
      }
    }
    return {
      //   showDialog: false,
      // 声明表单数据
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门负责人
        introduce: '' // 部门介绍
        // 方法一：先声明父级部门id为''，通过this.treeNode.id获得父级部门id
        // pid: ''
      },
      // 声明表单验证规则
      rules: {
        // 部门名称
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门名称长度在1-50个字符',
            trigger: 'blur'
          },
          // 自定义校验函数checkNameRepeat
          { validator: checkNameRepeat, trigger: 'blur' }
        ],
        // 部门编码
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门编码长度在1-50个字符',
            trigger: 'blur'
          },
          { validator: checkCodeRepeat, trigger: 'blur' }
        ],
        // 部门负责人
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        // 部门介绍
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 300,
            message: '部门介绍长度在1-300个字符',
            trigger: 'blur'
          }
        ]
      },
      userSimpleList: []
      // dialogVisible: this.showDialog
    }
  },
  //   mounted() {
  //     // 方法二：使用事件总线-接收数据
  //     this.$bus.$on('add-dept', (showDialog) => {
  //       console.log(showDialog)
  //       this.showDialog = showDialog
  //     })
  //   },
  // 解绑当前AddDept组件绑定或监听的自定义事件add-dept
  //   beforeDestroy() {
  //     this.$bus.$off('add-dept')
  //   }
  // 方法二：利用计算属性，title显示新增or编辑部门
  computed: {
    title() {
      // 表单数据有id，说明是编辑模式
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    // 方法一：AddDept组件created创建完，不管有没有打开部门负责人下拉框都会发请求，浪费网络带宽
    // 而且获取的员工数据可能不是最新的，因为别人修改或新增部门负责人了
    // 方法二优化：部门负责人下拉框获得焦点时，触发自定义事件input，才发请求
    // 不但节约网络带宽，而且实时获取最新的员工简单列表数据
    async getUserSimpleList() {
      const result = await reqUserSimpleList()
      this.userSimpleList = result.data
    },
    // 对整个表单进行校验，检验成功后提交，发请求：新增子部门
    btnOk() {
      // this.$refs获取Form表单组件实例，前提是Form表单组件绑定ref属性
      this.$refs.deptForm.validate(async(valid) => {
        if (valid) {
          // 如果表单数据有id，说明是编辑模式
          if (this.formData.id) {
            await updateDepartmentById(this.formData.id, this.formData)
            this.$message({
              type: 'success',
              message: '保存部门成功'
            })
          } else {
            // 方法一：先声明父级部门id为''，通过this.treeNode.id获得当前点击的父级部门id
            // this.formData.pid = this.treeNode.id
            // 方法二：使用展开运算符，浅拷贝，对象合并，对象获得新属性pid，pid指向当前点击的父级部门id
            await addDepartment({ ...this.formData, pid: this.treeNode.id })
            this.$message({
              type: 'success',
              message: '新增部门成功'
            })
          }
          // 不管是新增or编辑模式，都需要执行该函数后面的代码
          // 触发自定义事件add-dept，重新拉取组织架构
          this.$emit('add-dept')
          // 方法一：点击确定，关闭新增部门的对话框组件
          // 触发自定义事件change-dialog，给父组件传递数据：false
          // this.$emit('change-dialog', false)
          // 方法二：使用属性修饰符.sync  update:固定写法 (update: prop属性名, 传递的数据)
          this.$emit('update:show-dialog', false)
          // 清空重置新增部门的表单数据，下一次打开新增弹层，没有上一次的脏数据
          // 这里的代码可以删掉，因为点击#确定关闭dialog，触发自定义事件close
          // close的事件回调是btnCancel，btnCancel方法内部已经清空重置表单数据和调用resetFields实例方法
          // this.formData = {
          //   name: '',
          //   code: '',
          //   manager: '',
          //   introduce: ''
          // }
        } else {
          console.log('error submit!')
          return false
        }
      })
    },
    btnCancel() {
      // 点击取消，关闭新增子子部门的对话框组件
      this.$emit('update:show-dialog', false)
      // 方法一：直接清空重置formData表单数据
      // 清空重置新增部门的表单数据，但不能移除校验结果
      // 注意：场景：根据表单数据的id判断是新增or编辑
      // resetFields 只能重置新增部门的表单数据，非表单数据（比如编辑模式的id）不能重置
      // 所以这里要强制清空重置，如果不清空id，一直是编辑模式
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 方法二：调用Form组件的实例方法resetFields
      // 清空重置新增部门的表单数据，将所有字段值重置为初始值并移除校验结果
      this.$refs.deptForm.resetFields()
    },
    // 点击修改部门，回显部门详情
    // 为什么不在tree-tool组件发请求获取部门详情，因为部门表单数据是存放在add-dept组件
    // 方法一：直接传入this.treeNode.id，但可能存在bug
    // 因为父组件中editDept方法先设置treeNode，传递treeNode prop，再调用此方法。
    // props传值是异步的，treeNode prop是父组件传过来的
    // treeNode prop传递过程中，this.treeNode.id是undefined
    // 方法二：声明参数id，调用此方法传入id
    // 该id是tree-tool组件传过来的当前点击的node节点的id
    async getDepartmentDetailById(id) {
      const result = await getDepartmentDetailById(id)
      this.formData = result.data
    }
  }
}
</script>

<style>
</style>
