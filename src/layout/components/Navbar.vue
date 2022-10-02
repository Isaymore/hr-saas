<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <div class="app-breadcrumb">
      <span>{{ company }}</span>
      <el-tag type="info" class="breadTag">体验版</el-tag>
    </div>
    <!-- <breadcrumb class="breadcrumb-container" /> -->

    <div class="right-menu">
      <div class="svg-wrapper">
        <svg-icon icon-class="language" />
      </div>
      <div class="svg-wrapper">
        <svg-icon icon-class="fullscreen" />
      </div>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img
            v-imageerror="defaultImg"
            :src="staffPhoto"
            class="user-avatar"
          >
          <span class="name">{{ username }}</span>
          <i class="el-icon-caret-bottom" style="color: #fff" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item> 首页 </el-dropdown-item>
          </router-link>
          <a
            target="_blank"
            href="https://github.com/PanJiaChen/vue-admin-template/"
          >
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    // Breadcrumb,
    Hamburger
  },
  data() {
    return {
      // 不能直接给一个图片路径。因为webpack打包会把图片统一打包到/static/img，导致找不到图片
      // defaultImg: '@/assets/common/head.jpg'
      defaultImg: require('@/assets/common/head.jpg')
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'username', 'company', 'staffPhoto'])
  },
  // 分发获取用户信息的action的方法一：Navbar组件挂载完分发
  // 分发获取用户信息的action的方法二：permission.js中分发
  // mounted() {
  //   // 方法一：this.$store.state.user.userInfo.userId
  //   // 方法二：使用getter，简化数据，要在getters.js声明userId
  //   // 说明：if判断的作用是为了避免重复请求。如果没有if判断，Navbar组件挂载后，
  //   // 会请求一次，切换路由(比如/404路由跳转首页)后，重新创建挂载Navbar组件，再发请求
  //   if (!this.$store.getters.userId) {
  //     // 调用dispatch函数，分发action：user小仓库的getUserInfo
  //     this.$store.dispatch('user/getUserInfo')
  //   }
  // },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push({
        path: '/login'
      })
      // await this.$store.dispatch('user/logout')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.svg-wrapper {
  display: inline-block;
  margin: 0 10px;
}
.app-breadcrumb {
  float: left;
  height: 50px;
  line-height: 50px;
  color: #fff;
  .breadTag {
    margin-left: 20px;
    background-color: rgba(255, 255, 255, 0.5);
    color: #fff;
  }
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  // background: #5182fd;
  background: #409EFF;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    // position: relative;
    float: right;
    height: 100%;
    line-height: 50px;
    color: #fff;

    // .el-icon-search {
    //   position: absolute;
    //   top: 20px;
    //   left: -20px;
    // }
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          margin: 0 10px 5px;
          border-radius: 10px;
          vertical-align: middle;
        }
        .name {
          color: #fff;
          font-size: 14px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 18px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
