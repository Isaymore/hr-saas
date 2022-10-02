<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :before-upload="beforeUpload"
      :http-request="upload"
      :file-list="fileList"
      :limit="limit"
      :class="uploadShowClassObj"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog title="图片预览" :visible.sync="dialogVisible">
      <img :src="dialogImageUrl" alt="" style="width: 100%">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
// 实例化COS对象
new COS({
  SecretId: '',
  SecretKey: ''
})
export default {
  name: 'ImageUpload',
  data() {
    return {
      fileList: [
        {
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }
        // {
        //   name: 'xingye',
        //   url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTEApSnhyGzk6zqDhdPj7cxZmnz78EELjJPQ&usqp=CAU'
        // }
      ],
      dialogImageUrl: '',
      dialogVisible: false,
      limit: 1
    }
  },
  computed: {
    // 计算属性，计算是否添加一个类(显示or隐藏图片上传+号按钮)，需要在style标签中搭配使用display:none
    uploadShowClassObj() {
      return {
        'upload-show': this.fileList.length === this.limit
      }
    }
  },
  methods: {
    handlePictureCardPreview(file) {
      // 先获取图片，再打开弹层，防止闪烁
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove(file, fileList) {
      //  方法一：排除当前删除的图片文件，得到删除后的新文件列表数组
      //   this.fileList = this.fileList.filter((item) => {
      //     return item.uid !== file.uid
      //   })
      //  方法二：参数fileList是删除后的新文件列表数组，直接赋值
      this.fileList = fileList
    },
    handleChange(file, fileList) {
      // file是当前文件状态改变的图片文件，fileList是当前最新的文件列表数组
      // console.log(666)
      // 方法一不生效：尝试使用push，但不能使用push，因为handleChange会被执行2次：添加文件和上传成功
      // 或者添加文件和上传失败
      // if判断当前文件列表是否存在该文件，没有该文件，添加到this.fileList
      // if (!this.fileList.some(item => item.uid === file.uid)) {
      //   console.log(111)
      //   // debugger
      //   this.fileList.push(file)
      //   console.log(222)
      // }
      // 方法二: 使用map方法创建一个新数组，再赋值给this.fileList
      // 图片墙暂时不显示图片？
      // 因为没有指定action上传地址，上传失败，执行失败回调on-change，传入的参数fileList为空（fileList.length为0）
      // 为什么不直接this.fileList = fileList ???
      // this.fileList = fileList.map(item => item)
      // console.log(888)
      // console.log('file', file, typeof file)
      // console.log('fileList', fileList, typeof fileList)
      // console.log(this.fileList)
      // this.fileList = fileList
      // console.log(fileList.length)
    },
    beforeUpload(file) {
      console.log(file)
      const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp']
      const isLt2M = file.size / 1024 / 1024 < 2
      // 这里也可以用includes方法：!imageTypes(file.type)
      if (!imageTypes.some(item => item === file.type)) {
        this.$message({
          type: 'error',
          message: '上传图片只能是 JPG、PNG、GIF、BMP 格式!'
        })
        // 图片格式不对，停止上传
        return false
      }
      if (!isLt2M) {
        this.$message({
          type: 'error',
          message: '上传图片大小不能超过 2MB!'
        })
        // 图片大小不对，停止上传
        return false
      }
      // 最后图片格式和大小都符合，一定要return返回true，才可以继续上传
      return true
    },
    upload(param) {
      // arguments是所有函数都有的默认参数对象，是一个数组
      // console.log(arguments)
    }
  }
}
</script>

<style lang="scss" scoped>
// 深度选择器::v-deep
.upload-show {
  ::v-deep .el-upload--picture-card {
    display: none;
  }
}
</style>
