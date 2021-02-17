<template>
  <view class="index" @click="goSubPage">
    <text>{{ msg }}</text>
  </view>
</template>

<script>
import { ref } from 'vue'
import { routerService } from '../../service/routerService'
import './index.css'

export default {
  setup() {
    const msg = ref('主包页面-点击跳转到分包页面')
    return {
      msg,
    }
  },

  methods: {
    goSubPage() {
      routerService.toTest({ id: 1 })
    },
  },
}
</script>
