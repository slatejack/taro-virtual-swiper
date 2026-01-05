<p align="center">
  <img src="./docs/logo.svg" alt="taro-virtual-swiper" width="120" height="120">
</p>

<h1 align="center">taro-virtual-swiper</h1>

<p align="center">
  基于 Taro 的高性能虚拟 Swiper 组件，专为大数据量场景设计
</p>

<p align="center">
  <a href="#特性">特性</a> •
  <a href="#安装">安装</a> •
  <a href="#使用">使用</a> •
  <a href="#api">API</a> •
  <a href="#工作原理">工作原理</a>
</p>

---

## 特性

- 🚀 **虚拟渲染** - 无论数据量多大，始终只渲染 3 个 DOM 节点
- 📱 **跨平台** - 支持微信小程序和 H5
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
import 'taro-virtual-swiper/style.scss';

const data = [
  { id: 1, title: 'Slide 1' },
  { id: 2, title: 'Slide 2' },
  { id: 3, title: 'Slide 3' },
];

function App() {
  return (
    <VirtualSwiper
      list={data}
      renderItem={(item, index) => (
        <View className="slide">{item.title}</View>
      )}
    />
  );
}
```

### 受控模式

```tsx
import { useState } from 'react';
import { VirtualSwiper } from 'taro-virtual-swiper';
import 'taro-virtual-swiper/style.scss';

function App() {
  const [current, setCurrent] = useState(0);

  return (
    <VirtualSwiper
      list={data}
      current={current}
      onChange={(index, item) => setCurrent(index)}
      renderItem={(item) => <View>{item.title}</View>}
    />
  );
}
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| list | `{id: string\|number, [key: string]: any}[]` | - | 数据源，每项需包含唯一 `id` |
| renderItem | `(item: T, index: number) => ReactNode` | - | 渲染每一项的函数 |
| current | `number` | - | 当前索引（受控模式） |
| defaultCurrent | `number` | `0` | 默认索引（非受控模式） |
| onChange | `(current: number, item: T) => void` | - | 索引变化回调 |
| itemWidth | `number` | `750` | 每项宽度（单位 rpx） |
| threshold | `number` | `0.1` | 切换阈值比例（0-1） |
| damping | `number` | `1` | 阻尼系数 |
| edgeDamping | `number` | `0.3` | 边缘阻尼系数 |
| duration | `number` | `300` | 过渡动画时长（ms） |
| className | `string` | - | 自定义类名 |
| style | `CSSProperties` | - | 自定义样式 |

### 数据项类型

```ts
interface VirtualSwiperItem {
  id: string | number;  // 必须：唯一标识
  [key: string]: any;   // 其他自定义字段
}
```

## 工作原理

组件采用**虚拟渲染**技术，核心思路：

```
数据列表: [1] [2] [3] [4] [5] ... [n]
                  ↓
实际渲染:     [2] [3] [4]
              prev curr next
```

无论数据量多大，始终只渲染：
- **当前项** - 用户正在查看的内容
- **前一项** - 用于向前滑动
- **后一项** - 用于向后滑动

通过 CSS `transform` 实现平滑的滑动动画，确保在大数据量场景下依然流畅。

## License

[MIT](./LICENSE)
