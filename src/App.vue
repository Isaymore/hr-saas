<template>
  <div id="app">
    <!-- App是根组件，是组件的大总管 -->
    <!-- 一级路由的出口，一级路由组件被渲染到这里，这是Vue框架的规定 -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
