<template>
  <el-row :gutter="10" type="flex" align="middle" style="width: 100%">
    <el-col :span="20">
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row :gutter="10">
        <el-col
          :span="12"
        ><span>{{ treeNode.manager }}</span></el-col>
        <el-col :span="12">
          <el-dropdown @command="handleDept">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <!-- el-dropdown-menu子组件使用者，使用具名插槽dropdown -->
            <el-dropdown-menu slot="dropdown">
              <!-- 传给el-dropdown-menu的html结构 -->
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item
                v-if="!isHead"
                command="edit"
              >修改子部门</el-dropdown-item>
              <el-dropdown-item
                v-if="!isHead"
                command="del"
              >删除子部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartmentById } from '@/api/departments'
export default {
  name: 'TreeTool',
  props: {
    // 当前节点的数据对象，利用el-tree组件的作用域插槽传过来的
    // 注意：这里的treeNode也指向组织架构头部的company
    treeNode: {
      type: Object,
      required: true
    },
    // 是否组织架构头部
    isHead: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async handleDept(command) {
      if (command === 'add') {
        // 方法一：子组件tree-tool触发自定义事件add-dept
        // 因为是添加子部门，需要给父组件departments/index.vue传递当前点击的node节点（部门数据）
        this.$emit('add-dept', this.treeNode, 'add')
        // 方法二：使用事件总线-提供数据
        // this.$bus.$emit('add-dept', true)
      } else if (command === 'edit') {
        this.$emit('edit-dept', this.treeNode, 'edit')
      } else {
        this.$confirm('确定删除该组织部门么?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return delDepartmentById(this.treeNode.id)
        }).then(() => {
          // 触发自定义事件del-depts
          // 在departments/index.vue中监听自定义事件del-depts
          this.$emit('del-dept')
          this.$message({
            type: 'success',
            message: '删除部门成功'
          })
        })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    }
  }
}
</script>

<style>
</style>
