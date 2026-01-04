import React, { useState, useMemo } from 'react';
import { View, Text, Image } from '@tarojs/components';
import VirtualSwiper, { VirtualSwiperItem } from 'taro-virtual-swiper';
import './index.scss';

interface ImageItem extends VirtualSwiperItem {
  id: number
  url: string
  title: string
}

// 生成大量测试数据
function generateMockData(count: number): ImageItem[] {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8B500', '#00CED1', '#FF69B4', '#32CD32', '#FFD700'
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: index,
    url: `https://picsum.photos/seed/${index}/400/300`,
    title: `图片 ${index + 1}`,
    color: colors[index % colors.length]
  }));
}

export default function Index() {
  const [current, setCurrent] = useState(0);

  // 生成 1000 条测试数据
  const list = useMemo(() => generateMockData(1000), []);

  const handleChange = (index: number, item: ImageItem) => {
    setCurrent(index);
    console.log('切换到:', index, item);
  };

  return (
    <View className="index-page">
      <View className="header">
        <Text className="title">虚拟 Swiper 演示</Text>
        <Text className="subtitle">
          共 {list.length} 项，当前第 {current + 1} 项
        </Text>
      </View>

      <View className="swiper-wrapper">
        <VirtualSwiper
          list={list}
          current={current}
          onChange={handleChange}
          itemWidth={750}
          threshold={0.15}
          duration={300}
          renderItem={(item, index) => (
            <View
              className="swiper-item"
            >
              <Image src={item.url} />
            </View>
          )}
        />
      </View>

      <View className="controls">
        <View
          className="btn"
          onClick={() => setCurrent(Math.max(0, current - 1))}
        >
          上一页
        </View>
        <View
          className="btn"
          onClick={() => setCurrent(Math.min(list.length - 1, current + 1))}
        >
          下一页
        </View>
      </View>

      <View className="controls">
        <View className="btn" onClick={() => setCurrent(0)}>
          第一页
        </View>
        <View className="btn" onClick={() => setCurrent(499)}>
          第 500 页
        </View>
        <View className="btn" onClick={() => setCurrent(999)}>
          最后一页
        </View>
      </View>
    </View>
  );
}
