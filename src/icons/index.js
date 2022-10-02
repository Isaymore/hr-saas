import Vue from 'vue'
// 导入SvgIcon组件
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

// 将svg目录下的所有.svg后缀的文件，全部引入到项目中
// 项目中使用user.svg，不用加后缀.svg，比如<svg-icon icon-class="user"
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
