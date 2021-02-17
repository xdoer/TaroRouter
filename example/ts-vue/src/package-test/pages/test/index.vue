<template>
  <view class="index">
    <text>{{ msg }}</text>
  </view>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const msg = ref('分包页面')
    return {
      msg,
    }
  },
}
</script>
