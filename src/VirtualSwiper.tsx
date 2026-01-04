import React, { useState, useRef, useCallback, useEffect, useMemo, ReactNode } from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';

export interface VirtualSwiperItem {
  id: string | number
  [key: string]: any
}

export interface VirtualSwiperProps<T extends VirtualSwiperItem> {
  /** 数据列表 */
  list: T[]
  /** 当前索引 */
  current?: number
  /** 默认索引 */
  defaultCurrent?: number
  /** 每项宽度，单位 rpx，默认 750 */
  itemWidth?: number
  /** 切换阈值比例，默认 0.1 (10%) */
  threshold?: number
  /** 阻尼系数，默认 1 */
  damping?: number
  /** 边缘阻尼系数，默认 0.3 */
  edgeDamping?: number
  /** 过渡动画时长，单位 ms，默认 300 */
  duration?: number
  /** 切换回调 */
  onChange?: (current: number, item: T) => void
  /** 渲染每一项 */
  renderItem: (item: T, index: number) => ReactNode
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: React.CSSProperties
}

/**
 * 获取需要渲染的项
 * 核心优化：只渲染当前项、前一项、后一项
 */
function getRenderItems<T extends VirtualSwiperItem>(
  current: number,
  list: T[]
): { items: (T & { originalIndex: number })[]; minIndex: number } {
  if (list.length === 0) {
    return { items: [], minIndex: 0 };
  }

  const minIndex = Math.max(0, current - 1);
  const maxIndex = Math.min(list.length - 1, current + 1);

  const items = list.slice(minIndex, maxIndex + 1).map((item, idx) => ({
    ...item,
    originalIndex: minIndex + idx
  }));

  return { items, minIndex };
}

/**
 * 虚拟 Swiper 组件
 * 通过按需渲染实现高性能轮播，无论数据量多大，始终只渲染 2-3 个 DOM 节点
 */
function VirtualSwiper<T extends VirtualSwiperItem>(props: VirtualSwiperProps<T>) {
  const {
    list,
    current: controlledCurrent,
    defaultCurrent = 0,
    itemWidth = 750,
    threshold = 0.1,
    damping = 1,
    edgeDamping = 0.3,
    duration = 300,
    onChange,
    renderItem,
    className = '',
    style
  } = props;

  // 是否受控模式
  const isControlled = controlledCurrent !== undefined;

  // 当前索引
  const [internalCurrent, setInternalCurrent] = useState(defaultCurrent);
  const currentIndex = isControlled ? controlledCurrent : internalCurrent;

  // 拖拽偏移量
  const [translateX, setTranslateX] = useState(0);

  // 是否正在拖拽
  const [isDragging, setIsDragging] = useState(false);

  // 是否初始化中（避免初始动画闪烁）
  const [initializing, setInitializing] = useState(true);

  // 触摸起始位置
  const touchStartRef = useRef({ x: 0, y: 0 });

  // 触摸起始时间
  const touchStartTimeRef = useRef(0);

  // 当前偏移量
  const currentTranslateRef = useRef(0);

  // 是否为水平滑动
  const isHorizontalRef = useRef<boolean | null>(null);

  // 获取系统信息
  const [windowWidth, setWindowWidth] = useState(375);

  useEffect(() => {
    const systemInfo = Taro.getSystemInfoSync();
    setWindowWidth(systemInfo.windowWidth);
  }, []);

  // 计算实际像素宽度
  const itemWidthPx = useMemo(() => {
    return (itemWidth / 750) * windowWidth;
  }, [itemWidth, windowWidth]);

  // 初始化完成后启用动画
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitializing(false);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // 获取渲染项
  const { items: renderItems, minIndex } = useMemo(
    () => getRenderItems(currentIndex, list),
    [currentIndex, list]
  );

  // 占位宽度（用于定位）
  const placeholderWidth = useMemo(() => {
    return minIndex * itemWidthPx;
  }, [minIndex, itemWidthPx]);

  // 处理触摸开始
  const handleTouchStart = useCallback((e: any) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    touchStartTimeRef.current = Date.now();
    currentTranslateRef.current = translateX;
    isHorizontalRef.current = null;
    setIsDragging(true);
  }, [translateX]);

  // 处理触摸移动
  const handleTouchMove = useCallback((e: any) => {
    if (!isDragging) {
      return;
    }
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    // 判断滑动方向（只判断一次）
    if (isHorizontalRef.current === null) {
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 5) {
        isHorizontalRef.current = true;
      } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 5) {
        isHorizontalRef.current = false;
      }
    }

    // 非水平滑动，不处理
    if (isHorizontalRef.current === false) {
      return;
    }

    // 计算阻尼
    let currentDamping = damping;
    const isAtStart = currentIndex === 0 && deltaX > 0;
    const isAtEnd = currentIndex === list.length - 1 && deltaX < 0;

    // 边缘回弹效果
    if (isAtStart || isAtEnd) {
      currentDamping = edgeDamping;
    }

    const newTranslateX = currentTranslateRef.current + deltaX * currentDamping;
    setTranslateX(newTranslateX);
  }, [isDragging, currentIndex, list.length, damping, edgeDamping]);

  // 处理触摸结束
  const handleTouchEnd = useCallback(() => {
    if (!isDragging) {
      return;
    }
    setIsDragging(false);

    // 非水平滑动，重置
    if (isHorizontalRef.current === false) {
      setTranslateX(0);
      return;
    }

    const touchDuration = Date.now() - touchStartTimeRef.current;
    const thresholdPx = itemWidthPx * threshold;

    // 快速滑动检测
    const isQuickSwipe = touchDuration < 300 && Math.abs(translateX) > 30;

    let newIndex = currentIndex;

    if (translateX < -thresholdPx || (isQuickSwipe && translateX < 0)) {
      // 向左滑，下一页
      newIndex = Math.min(currentIndex + 1, list.length - 1);
    } else if (translateX > thresholdPx || (isQuickSwipe && translateX > 0)) {
      // 向右滑，上一页
      newIndex = Math.max(currentIndex - 1, 0);
    }

    // 重置偏移
    setTranslateX(0);

    // 更新索引
    if (newIndex !== currentIndex) {
      if (!isControlled) {
        setInternalCurrent(newIndex);
      }
      onChange?.(newIndex, list[newIndex]);
    }
  }, [isDragging, translateX, itemWidthPx, threshold, currentIndex, list, isControlled, onChange]);

  // 计算容器偏移
  const containerTranslateX = useMemo(() => {
    // 当前项在渲染列表中的位置
    const currentInRenderIndex = currentIndex - minIndex;
    // 基础偏移 = 占位宽度 + 当前项之前的渲染项宽度
    const baseOffset = -(placeholderWidth + currentInRenderIndex * itemWidthPx);
    return baseOffset + translateX;
  }, [placeholderWidth, currentIndex, minIndex, itemWidthPx, translateX]);

  // 动态样式
  const containerStyle: React.CSSProperties = useMemo(() => ({
    transform: `translateX(${containerTranslateX}px)`,
    transition: isDragging || initializing ? 'none' : `transform ${duration}ms ease-out`
  }), [containerTranslateX, duration, initializing, isDragging]);

  return (
    <View
      className={`virtual-swiper ${className}`}
      style={style}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <View className="virtual-swiper__container" style={containerStyle}>
        {/* 占位元素 */}
        <View
          className="virtual-swiper__placeholder"
          style={{ width: `${placeholderWidth}px` }}
        />

        {/* 渲染项 */}
        {renderItems.map((item) => (
          <View
            key={item.id}
            className="virtual-swiper__item"
            style={{ width: `${itemWidthPx}px` }}
          >
            {renderItem(item, item.originalIndex)}
          </View>
        ))}
      </View>
    </View>
  );
}

export default VirtualSwiper;
