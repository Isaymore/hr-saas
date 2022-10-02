<template>
  <div class="dashboard-container">
    <div class="app-container">
      <div class="dashboard-text">username:{{ username }} </div>
      <image-upload />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
const myMixin = {
  created() {
    // console.log(666)
  },
  foo() {
    // console.log(777)
  },
  movie: '逃学威龙',
  methods: {
    test() {
      // console.log('Hello world')
    }
  }
}
export default {
  name: 'Dashboard',
  mixins: [myMixin],
  computed: {
    ...mapGetters(['username'])
  },
  created() {
    // console.log(888)
    this.test()
  },
  methods: {
    hello() {
      console.log('Hello Vue')
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
