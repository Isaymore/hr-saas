<template>
  <upload-excel :on-success="onSuccess" />
</template>

<script>
import { importEmployees } from '@/api/employees'
export default {
  name: 'Import',
  data() {
    return {
      // 新增员工的表单字段是说明需要，当前vue文件没有使用employeeForm
      // employeeForm: {
      //   username: '',
      //   workNumber: '',
      //   mobile: '',
      //   departmentName: '',
      //   timeOfEntry: '',
      //   correctionTime: '',
      //   formOfEmployment: ''
      // }
    }
  },
  methods: {
    async onSuccess({ header, results }) {
      // 将Excel文件的中文表头映射为英文参数
      // 因为后端接口只认识英文参数(对应新增员工的表单字段)
      const employeeMap = {
        姓名: 'username',
        工号: 'workNumber',
        手机号: 'mobile',
        入职日期: 'timeOfEntry',
        转正日期: 'correctionTime'
      }
      // // 方法一：声明员工空数组，接收传递给后端的员工对象
      // const employeeList = []
      // results.forEach((item) => {
      //   // 声明员工对象，整理成后端接口可以识别的英文参数
      //   const employeeObj = {}
      //   Object.keys(item).forEach((key) => {
      //     // 将Excel文件的中文表头映射为英文参数，因为后端接口只认识英文参数
      //     employeeObj[employeeMap[key]] = item[key]
      //   })
      //   // 添加员工对象到员工数组，因为后端接口需要员工数组
      //   employeeList.push(employeeObj)
      // })
      // 方法二：使用数组方法map()，创建一个新数组
      const employeeList = results.map((item) => {
        const employeeObj = {}
        Object.keys(item).forEach((key) => {
          // 将Excel文件的中文表头映射为英文参数，因为后端接口只认识英文参数
          // 因为Excel文件的日期时间，经过UploadExcel/index.vue内部处理
          // item[key]得到的日期时间(入职日期和转正日期)是字符串，但后端接口需要日期时间格式
          // if判断是不是入职日期或转正日期，如果是，转换成日期格式
          if (
            employeeMap[key] === 'timeOfEntry' ||
            employeeMap[key] === 'correctionTime'
          ) {
            // 字符串格式'2019/3/11'的日期时间
            const formatDate = this.formatDate(item[key], '/')
            // 字符串格式转换成日期格式
            employeeObj[employeeMap[key]] = new Date(formatDate)
          } else {
            employeeObj[employeeMap[key]] = item[key]
          }
        })
        return employeeObj
      })
      // console.log('employeeList', employeeList, typeof employeeList)
      // 发请求：批量导入员工
      await importEmployees(employeeList)
      this.$message({
        type: 'success',
        message: '导入员工成功'
      })
      // 导入成功后，返回上一级路由
      this.$router.back()
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      // 这里是兜底逻辑，如果用户不传format为'/'，默认传'/'
      return (
        year + '/' +
        (month < 10 ? '0' + month : month) + '/' + (date < 10 ? '0' + date : date)
      )
    }
  }
}
</script>

<style>
</style>
