import { View } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'
import React from 'react'

export default function() {
  const { params } = useRouter()

  console.log('传参', params)

  return (
    <View>
      分包页面
    </View>
  )
}
