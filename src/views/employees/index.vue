<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <template v-slot:before>
          <span>总记录数{{ page.total }}条</span>
        </template>
        <template v-slot:after>
          <el-button
            type="warning"
            size="small"
            @click="$router.push({ path: '/import' })"
          >导入excel</el-button>
          <el-button
            type="danger"
            size="small"
            @click="exportExcelData"
          >导出excel</el-button>
          <!-- 方法一：v-if="!checkPermission('add-employees')" 判断用户有没有新增按钮的操作权限，记得取反  推荐方法一 -->
          <!-- 方法二：使用disabled，控制可以点击or置灰不能点击 -->
          <el-button
            :disabled="!checkPermission('add-employees')"
            type="primary"
            size="small"
            class="el-icon-plus"
            @click="addEmployee"
          >新增员工</el-button>
        </template>
      </page-tools>
      <el-card v-loading="loading">
        <el-table :data="employeeList" border style="width: 100%">
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column
            prop="username"
            label="姓名"
            sortable
            width="width"
          />
          <el-table-column
            prop="workNumber"
            label="工号"
            sortable
            width="width"
          />
          <el-table-column prop="mobile" label="手机号" width="180" />
          <el-table-column
            prop="departmentName"
            label="部门"
            sortable
            width="width"
          />
          <el-table-column
            prop="formOfEmployment"
            label="聘用方式"
            :formatter="employmentFormatter"
            width="width"
          />
          <!-- 格式化入职时间 -->
          <!-- 方法一：利用列el-table-column的formatter属性  :formatter="timeFormatter" -->
          <!-- 方法二：利用过滤器formatDate + 作用域插槽 -->
          <!-- 过滤器formatDate在main.js中全局注册 -->
          <el-table-column
            prop="timeOfEntry"
            label="入职时间"
            sortable
            width="width"
          >
            <template v-slot:default="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column
            prop="formOfEmployment"
            label="账户状态"
            width="width"
          >
            <template v-slot:default="{ row }">
              <el-switch :value="row.formOfEmployment === 1" />
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            width="280"
          >
            <template v-slot:default="{ row }">
              <el-button
                type="text"
                size="small"
                @click="$router.push({ path: `/employees/detail/${row.id}` })"
              >查看</el-button>
              <el-button
                type="text"
                size="small"
                @click="editEmployee(row.id)"
              >编辑</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button
                type="text"
                size="small"
                @click="editRole(row.id)"
              >角色</el-button>
              <el-button
                type="text"
                size="small"
                @click="delEmployeeById(row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 方法一：直接给一个div包裹分页器组件，style="text-align:center;margin-top:10px" -->
        <!-- 方法二：使用row组件，实现分页器组件的居中对齐 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="margin-top: 10px"
        >
          <el-pagination
            :current-page="page.page"
            :page-size="page.size"
            :total="page.total"
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </el-card>
      <employee-dialog
        ref="employeeDialog"
        :show-dialog.sync="showDialog"
        @refresh-employee-list="getEmployeeList"
      />
      <assign-role
        ref="assginRole"
        :show-role-dialog.sync="showRoleDialog"
        :user-id="userId"
      />
    </div>
  </div>
</template>

<script>
import { getEmployeeList, delEmployeeById } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import dayjs from 'dayjs'
import { formDate } from '@/utils/formatDate'
import EmployeeDialog from '@/views/employees/components/EmployeeDialog.vue'
import AssignRole from '@/views/employees/components/AssignRole'
export default {
  name: 'Employees',
  components: {
    EmployeeDialog,
    AssignRole
  },
  data() {
    return {
      page: {
        page: 1,
        size: 5,
        total: 0
      },
      employeeList: [],
      loading: false,
      showDialog: false,
      showRoleDialog: false, // 传给AssignRole子组件，显示or隐藏弹层
      userId: '' // 传给AssignRole子组件，用户id，用于查看和修改用户角色
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const result = await getEmployeeList({
        page: this.page.page,
        size: this.page.size
      })
      const { total, rows } = result.data
      this.page.total = total
      this.employeeList = rows
      this.loading = false
    },
    handleCurrentChange(val) {
      this.page.page = val
      this.getEmployeeList()
    },
    employmentFormatter(row, column, cellValue, index) {
      const employmentType = EmployeeEnum.hireType.find(
        (item) => item.id === cellValue
      )
      return employmentType ? employmentType.value : '神秘人士'
    },
    timeFormatter(row, column, cellValue, index) {
      return dayjs(cellValue).format('YYYY-MM-DD')
    },
    async delEmployeeById(id) {
      try {
        await this.$confirm('确定删除该员工么？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
        await delEmployeeById(id)
        this.getEmployeeList()
        this.$message({
          type: 'success',
          message: '删除员工成功'
        })
      } catch (error) {
        console.error('error', error, typeof error)
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    addEmployee() {
      this.showDialog = true
    },
    async editEmployee(id) {
      // console.log('this.$children', this.$children, typeof this.$children)
      await this.$refs.employeeDialog.getUserInfoById(id)
      this.showDialog = true
    },
    exportExcelData() {
      // 员工数据中的key是英文，要想导出的Excel文件的表头是中文，要做映射
      // 另外，后面item[headerMap[k]]要转换成英文key，才可以访问员工对象的属性
      const headerMap = {
        姓名: 'username',
        手机号: 'mobile',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      // 懒加载或者叫按需加载
      import('@/vendor/Export2Excel').then(async(excel) => {
        // 获取所有员工数据，每一个员工数据是一个对象
        const result = await getEmployeeList({
          page: 1,
          size: this.page.total
        })
        const { rows } = result.data
        // 传给export_json_to_excel方法的option对象的data属性
        // 定义formatJson方法，将数组转换成二维数组
        const data = this.formatJson(rows, headerMap)
        // debugger
        excel.export_json_to_excel({
          // header接收中文表头的数组：['姓名', '手机号', ...]
          header: Object.keys(headerMap),
          // data接收一个二维数组: [['星爷', '134...','2022/09/04'],['周董', '134...','2022/09/04']]
          data,
          filename: '员工资料表'
        })
      })
    },

    /** 将数组转化成二维数组
     * @param {Array} rows  对象数组
     * @param {Object} headerMap  对象
     * @returns 二维数组
     */
    formatJson(rows, headerMap) {
      // rows： [{ username: '星爷', mobile: '134...'},{},{}]  => [['星爷','134...'],[],[]]
      // return返回二维数组
      return rows.map((item) => {
        // return返回一维数组
        // Object.keys(headerMap)的给定对象是headerMap，而不是item
        // 因为导出的Excel文件表头是按照我们自己规定的顺序
        return Object.keys(headerMap).map((key) => {
          // 格式化日期时间和直观显示聘用形式
          if (
            headerMap[key] === 'timeOfEntry' ||
            headerMap[key] === 'correctionTime'
          ) {
            // 方法一：使用dayjs格式化日期时间
            // return dayjs(item[headerMap[key]]).format('YYYY/MM//DD')
            // 方法二：使用原生js封装
            return formDate(item[headerMap[key]])
          } else if (headerMap[key] === 'formOfEmployment') {
            // return item[headerMap[key]] === 1 ? '正式' : '非正式'
            // 严谨一点多的写法，注意这里的参数不能写成item
            // 变量访问是采取就近原则，如果写成item, item[header[key]]不是formOfEmployment属性指向的聘用形式
            const obj = EmployeeEnum.hireType.find(
              (element) => element.id === item[headerMap[key]]
            )
            return obj ? obj.value : '神秘人士'
          } else {
            return item[headerMap[key]]
          }
        })
      })
    },
    async editRole(id) {
      this.userId = id
      // props传值是异步的，所以这里使用this.$refs获取子组件实例，调用子组件的实例方法(传入用户id)
      // 另外，因为getUserInfoById是异步方法，复选框的勾选状态会闪烁
      // 解决方案：加await操作符，等待Promise对象
      await this.$refs.assginRole.getUserInfoById(id)
      this.showRoleDialog = true
    }
  }
}
</script>

<style>
</style>
