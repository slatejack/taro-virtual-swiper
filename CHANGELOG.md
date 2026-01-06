# Changelog

All notable changes to this project will be documented in this file.

## [1.0.2] - 2026-01-06

### ✨ 新增

- 新增 `style.scss` 导出入口，支持直接引入 SCSS 源文件进行样式定制

---

## [1.0.1] - 2026-01-06

### 🔧 维护

- 更新版本号至 1.0.1
- 修复 `package.json` 文件末尾缺少换行符的问题

---

## [1.0.0] - 2026-01-06

### 🎉 首次发布

`taro-virtual-swiper` 是一个基于 Taro 的高性能虚拟轮播组件，专为大数据量场景设计。

### ✨ 核心特性

- **虚拟渲染** - 无论数据量多大，始终只渲染 2-3 个 DOM 节点，优化页面性能
- **跨平台支持** - 同时支持微信小程序和 H5 平台
- **流畅手势** - 原生触摸体验，支持快速滑动检测
- **双模式** - 支持受控模式和非受控模式，灵活适配不同场景
- **TypeScript** - 完整的类型定义，提供良好的开发体验
- **边缘回弹** - 首尾项滑动时的阻尼回弹效果

### 📋 API

- `list` - 数据源（需包含唯一 `id`）
- `renderItem` - 渲染函数
- `current` - 当前索引（受控模式）
- `defaultCurrent` - 默认索引（非受控模式）
- `onChange` - 切换回调
- `itemWidth` - 每项宽度（rpx）
- `threshold` - 切换阈值比例
- `damping` - 阻尼系数
- `edgeDamping` - 边缘阻尼系数
- `duration` - 动画时长（ms）
