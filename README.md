# taro-virtual-swiper

基于 Taro 的高性能虚拟 Swiper 组件，专为大数据量场景设计。

## 特性

- 🚀 **虚拟渲染** - 无论数据量多大，始终只渲染 3 个 DOM 节点
- 📱 **跨平台** - 支持微信小程序和H5
- 🎯 **手势支持** - 流畅的滑动体验，支持边缘回弹效果
- 🔄 **双模式** - 支持受控和非受控两种使用方式
- 📦 **TypeScript** - 完整的类型定义

## 安装

```bash
npm install taro-virtual-swiper
# 或
yarn add taro-virtual-swiper
```

## 使用

### 基础用法

```tsx
import { VirtualSwiper } from 'taro-virtual-swiper';
import 'taro-virtual-swiper/style.scss'

const data = [
  { id: 1, content: 'Slide 1' },
  { id: 2, content: 'Slide 2' },
  { id: 3, content: 'Slide 3' },
];

function App() {
  return (
    <VirtualSwiper
      data={data}
      renderItem={(item, index) => (
        <View className="slide">{item.content}</View>
      )}
    />
  );
}
```

### 受控模式

```tsx
import { useState } from 'react';
import { VirtualSwiper } from 'taro-virtual-swiper';
import 'taro-virtual-swiper/style.scss'

function App() {
  const [current, setCurrent] = useState(0);

  return (
    <VirtualSwiper
      data={data}
      current={current}
      onChange={(index) => setCurrent(index)}
      renderItem={(item) => <View>{item.content}</View>}
    />
  );
}
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| data | `T[]` | `[]` | 数据源 |
| renderItem | `(item: T, index: number) => ReactNode` | - | 渲染函数 |
| current | `number` | - | 当前索引（受控模式） |
| defaultCurrent | `number` | `0` | 默认索引（非受控模式） |
| onChange | `(index: number) => void` | - | 索引变化回调 |
| duration | `number` | `300` | 动画时长（ms） |
| threshold | `number` | `0.3` | 滑动切换阈值（0-1） |
| className | `string` | - | 自定义类名 |
| style | `CSSProperties` | - | 自定义样式 |

## 工作原理

组件采用虚拟渲染技术，无论数据量多大，始终只渲染当前项、前一项和后一项，最多 3 个 DOM 节点。通过 CSS transform 实现平滑的滑动动画，确保在大数据量场景下依然流畅。

## License

[MIT](./LICENSE)
