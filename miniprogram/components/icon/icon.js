/**
 * components/icon/icon.js - 统一图标组件
 * 用法: <icon name="water" size="md" bg="water" />
 */
const { ICONS } = require('../../constants/icons')

Component({
  properties: {
    /** 图标名称，对应 constants/icons.js 中的 key */
    name: {
      type: String,
      value: '',
    },
    /** 直接传入 emoji（兼容旧写法，优先级低于 name） */
    emoji: {
      type: String,
      value: '',
    },
    /** 尺寸：xs / sm / md / lg / xl 或自定义值如 '60rpx' */
    size: {
      type: String,
      value: 'md',
    },
    /** 背景色预设名称，对应 CSS 变量色系 */
    bg: {
      type: String,
      value: '',
    },
    /** 是否显示圆形背景 */
    circle: {
      type: Boolean,
      value: false,
    },
    /** 自定义颜色（仅对非 Emoji 字符有效） */
    color: {
      type: String,
      value: '',
    },
  },

  observers: {
    'name, emoji': function (name, emoji) {
      const icon = name ? (ICONS[name] || name) : (emoji || '')
      this.setData({ displayIcon: icon })
    },
    'size': function (size) {
      // 预设尺寸映射
      const sizeMap = {
        xs: 'icon-size-xs',
        sm: 'icon-size-sm',
        md: 'icon-size-md',
        lg: 'icon-size-lg',
        xl: 'icon-size-xl',
      }
      const cls = sizeMap[size] || ''
      const customSize = sizeMap[size] ? '' : size
      this.setData({ sizeCls: cls, customSize })
    },
    'bg, circle': function (bg, circle) {
      const bgMap = {
        water: 'icon-bg-water',
        sun: 'icon-bg-sun',
        soil: 'icon-bg-soil',
        temp: 'icon-bg-temp',
        fertilizer: 'icon-bg-fertilizer',
        humidity: 'icon-bg-humidity',
        primary: 'icon-bg-primary',
        orange: 'icon-bg-orange',
        blue: 'icon-bg-blue',
        pink: 'icon-bg-pink',
        purple: 'icon-bg-purple',
        red: 'icon-bg-red',
        yellow: 'icon-bg-yellow',
        cyan: 'icon-bg-cyan',
        brown: 'icon-bg-brown',
      }
      let cls = circle ? 'icon-circle' : ''
      if (bg && bgMap[bg]) {
        cls += (cls ? ' ' : '') + bgMap[bg]
        // 有背景色时自动开启 circle
        if (!circle) cls += ' icon-circle'
      }
      this.setData({ wrapCls: cls })
    },
  },

  data: {
    displayIcon: '',
    sizeCls: 'icon-size-md',
    customSize: '',
    wrapCls: '',
  },
})
