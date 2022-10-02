<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置表单 -->
            <el-form
              ref="loginAccountForm"
              :model="loginAccount"
              :rules="rules"
              label-width="120px"
              style="margin-left: 120px; margin-top: 30px"
            >
              <el-form-item prop="username" label="姓名:">
                <el-input
                  v-model="loginAccount.username"
                  style="width: 300px"
                />
              </el-form-item>
              <el-form-item prop="password2" label="密码:">
                <el-input
                  v-model="test"
                  style="width: 300px"
                  type="text"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="updateUserInfoById"
                >更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- 修改data属性：userInfoComponent -->
            <!-- <el-button type="primary" @click=" userInfoComponent = 'el-table' ">动态切换组件</el-button>
            <el-button type="primary" @click=" userInfoComponent = 'user-info' ">动态切换为个人信息组件</el-button> -->
            <!-- 方法一：使用user-info组件 -->
            <!-- <user-info /> -->
            <!-- 方法二：使用动态组件component(vuejs内置的组件)，利用is属性，动态绑定user-info组件 -->
            <component :is="userInfoComponent" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <!-- <job-info /> -->
            <component :is="jobInfoComponent" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserInfoById, updateUserInfoById } from '@/api/employees'
import UserInfo from '@/views/employees/components/UserInfo.vue'
import JobInfo from '@/views/employees/components/JobInfo.vue'
export default {
  name: 'Detail',
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      // test: 888,
      test: undefined,
      userInfoComponent: 'user-info',
      jobInfoComponent: 'job-info',
      userId: this.$route.params.id,
      loginAccount: {
        username: '',
        password2: 888,
        test: 666
      },
      rules: {
        username: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserInfoById()
  },
  methods: {
    async getUserInfoById() {
      const result = await getUserInfoById(this.userId)
      this.loginAccount = result.data
    },
    async updateUserInfoById() {
      try {
        await this.$refs.loginAccountForm.validate()
        // 新密码替换原密码
        // 使用this.userId或this.loginAccount.id
        await updateUserInfoById(this.userId, {
          ...this.loginAccount,
          password: this.loginAccount.password2
        })
        this.$message({
          type: 'success',
          message: '登录账户设置成功'
        })
        this.$router.back()
      } catch (error) {
        console.error(error)
        this.$message({
          type: 'error',
          message: '表单校验失败'
        })
      }
    }
  }
}
</script>

<style>
</style>
