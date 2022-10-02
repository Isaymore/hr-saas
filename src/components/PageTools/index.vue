<template>
  <el-card class="page-tools">
    <el-row :gutter="10" type="flex" justify="space-between" align="middle">
      <el-col>
        <div v-if="showBefore" class="before">
          <i class="el-icon-info" />
          <!-- 子组件模板定义一个具名插槽before -->
          <slot name="before" />
        </div>
      </el-col>
      <el-col>
        <el-row :gutter="10" type="flex" justify="end">
          <!-- 子组件模板定义一个具名插槽after -->
          <slot name="after" />
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'PageTool',
  props: {
    showBefore: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.page-tools {
  margin: 10px 0;
  .before {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    background-color: rgba(230, 247, 255, 1);
    padding: 0px 10px;
    border-radius: 4px;
    border: 1px solid rgba(145, 213, 255, 1);
    i {
      margin-right: 5px;
      color: #409eff;
    }
  }
}
</style>
