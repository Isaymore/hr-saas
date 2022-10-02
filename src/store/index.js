import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import department from './modules/department'
import permission from './modules/permission'

Vue.use(Vuex)

// 创建Store仓库实例
const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    department,
    permission
  },
  getters
})

export default store
