<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 组织架构头部 -->
        <!-- 父组件给子组件tree-tool绑定或监听自定义事件add-dept -->
        <tree-tool :tree-node="company" :is-head="true" @add-dept="addDept" />
        <!-- 组织架构内容区域-树形结构 -->
        <el-tree :data="departments" :props="defaultProps" default-expand-all>
          <!-- 传入插槽内容，有几个树节点，就循环传入几次插槽内容 -->
          <!-- 在插槽内容(指的是el-tree组件的开始标签和结束标签之间的内容)的最外层标签上，使用作用域插槽 -->
          <!-- 解构得到的data是当前节点的数据对象 -->
          <!-- 父组件将tree-node prop属性指向的data对象，传递给子组件tree-tool -->
          <!-- 父组件监听子组件tree-tool的自定义事件add-dept -->
          <tree-tool
            slot-scope="{ data }"
            :tree-node="data"
            @del-dept="getDepartments"
            @add-dept="addDept"
            @edit-dept="editDept"
          />
        </el-tree>
      </el-card>
    </div>
    <!-- 新增部门的对话框组件 -->
    <!-- 父组件给子组件add-dept传递showDialog和treeNode prop属性 -->
    <!-- 这里的自定义事件add-dept和tree-tool的add-adept只是同名，但没有关联，因为组件实例不同，监听的事件不同 -->
    <!-- 关闭新增弹层方法一：父组件绑定或监听子组件add-dept的自定义事件change-dialog：@change-dialog="test" -->
    <!-- 关闭新增弹层方法二：使用属性修饰符.sync-->
    <add-dept
      ref="addDept"
      :show-dialog.sync="showDialog"
      :tree-node="node"
      :title="title"
      @add-dept="getDepartments"
    />
  </div>
</template>

<script>
import TreeTool from '@/views/departments/components/TreeTool'
import AddDept from '@/views/departments/components/AddDept'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'

export default {
  name: 'Departments',
  components: {
    TreeTool,
    AddDept
  },
  data() {
    return {
      company: {
        name: '',
        manager: ''
      },
      // data数组绑定给树形组件的自定义属性data
      // data可改名，这里改成departments更加语义化
      // data数组嵌套节点对象
      departments: [],
      defaultProps: {
        // children指定子树为节点对象的某个属性值
        children: 'children',
        // label指定节点标签为节点对象的某个属性值
        label: 'name'
      },
      // 声明变量：控制新增子部门的对话框组件的显示or隐藏，通过prop传递给子组件
      showDialog: false,
      // 当前节点的数据对象，记录当前点击的node节点
      node: null,
      // 区分tree-tool组件点击新增or编辑部门
      type: null,
      // 控制区域加载的显示or隐藏
      loading: false
    }
  },
  computed: {
    title() {
      return this.type === 'add' ? '新增部门' : '编辑部门'
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      // 开启区域加载
      this.loading = true
      const result = await getDepartments()
      // 先解构赋值，整理参数，因为tree-tool组件需要传入一个name属性和manger属性的对象
      const { companyName, depts } = result.data
      // 手动传入manager是因为后台返回的data外层数据没有manager字段
      // 手动传入id：因为将treeNode prop属性指向的company传给子组件TreeTool.vue
      // 如果没有传入id，组织架构头部使用的TreeTool.vue点击添加子部门，触发自定义事件add-dept，传给departments/index.vue的treeNode没有id
      // departments/index.vue传给add-dept.vue的treeNode也没有id，this.treeNode.id是undefined
      this.company = { name: companyName, manager: '负责人', id: '' }
      // 将数组数据转化成树形数据
      this.departments = tranListToTreeData(depts, '')
      // 关闭区域加载
      this.loading = false
    },
    addDept(node, type) {
      // 显示新增or编辑部门的对话框组件
      this.showDialog = true
      // node参数接收TreeTool.vue传过来的当前节点的数据对象
      this.node = node
      // 区分tree-tool组件点击新增or编辑部门
      this.type = type
    },
    editDept(node, type) {
      console.log('node', node, typeof node)
      // node参数接收TreeTool.vue传过来的当前节点的数据对象
      this.node = node
      // 区分tree-tool组件点击新增or编辑部门
      this.type = type
      // this.$refs获取add-dept子组件实例，调用add-dept子组件的实例方法 -- 解决偶现bug：部门的表单数据不回显。
      this.$refs.addDept.getDepartmentDetailById(node.id)
      // 显示编辑部门的对话框组件
      this.showDialog = true
    }
  }
}
</script>
<style scoped>
.tree-card {
  margin: 0 20px;
  padding: 20px 140px;
  font-size: 14px;
}
</style>
