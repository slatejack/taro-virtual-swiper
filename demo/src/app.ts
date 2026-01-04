import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'

import './app.scss'
// 引入组件样式 - Taro 会自动处理 scss 编译
import 'taro-virtual-swiper/style.scss'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')
  })
  return children
}



export default App
