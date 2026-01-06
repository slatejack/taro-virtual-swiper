import VirtualSwiper from './VirtualSwiper';

// 注意：样式需要用户手动引入
// import 'taro-virtual-swiper/style.css' 或
// import 'taro-virtual-swiper/style.scss'

export type { VirtualSwiperProps, VirtualSwiperItem } from './VirtualSwiper';
export { useDebounce, useThrottle, clamp } from './hooks';
export default VirtualSwiper;
