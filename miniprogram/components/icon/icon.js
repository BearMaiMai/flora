/**
 * components/icon/icon.js - 统一图标组件
 * 支持三种渲染模式：
 * - 文件路径: 以 '/' 开头的 SVG 文件路径，通过 <image> 组件渲染
 * - 直接 src: 外部直接传入图片路径
 * - Emoji 文本: 直接以 text 显示彩色 emoji
 *
 * 用法:
 *   <icon name="water" size="md" bg="water" />              // Emoji 模式
 *   <icon name="search" size="sm" tint="primary" />         // SVG + 主题色
 *   <icon name="flower" size="xl" />                        // 花卉 SVG（彩色原样）
 *   <icon src="/images/icons/flower/a-018-rose.svg" size="lg" />  // 直接路径
 */
const { ICONS } = require('../../constants/icons')

/**
 * 判断是否为文件路径
 */
function isFilePath(str) {
  return typeof str === 'string' && str.charAt(0) === '/'
}

/**
 * 判断是否为彩色花卉图标（不需要上色）
 */
function isColorfulIcon(path) {
  return typeof path === 'string' && path.indexOf('/flower/') !== -1
}

Component({
  properties: {
    /** 图标名称，对应 constants/icons.js 中的 key */
    name: {
      type: String,
      value: '',
    },
    /** 直接传入图片路径 */
    src: {
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
    /** 自定义颜色（仅 emoji 文本模式生效） */
    color: {
      type: String,
      value: '',
    },
    /** 
     * 色调：为纯黑 SVG 图标上色
     * 预设: primary(绿) / grey / white
     * 设为 'none' 表示不上色（彩色图标默认不上色）
     */
    tint: {
      type: String,
      value: '',
    },
  },

  observers: {
    'name, src, emoji, tint': function (name, src, emoji, tint) {
      // 优先级：src > name > emoji
      let imgPath = ''
      if (src) {
        imgPath = src
      } else if (name) {
        const iconValue = ICONS[name] || name
        if (isFilePath(iconValue)) {
          imgPath = iconValue
        } else {
          this.setData({
            mode: 'text',
            imgSrc: '',
            displayIcon: iconValue,
            tintCls: '',
          })
          return
        }
      } else if (emoji) {
        this.setData({
          mode: 'text',
          imgSrc: '',
          displayIcon: emoji,
          tintCls: '',
        })
        return
      }

      if (imgPath) {
        // 确定是否需要上色
        let tintCls = ''
        if (tint === 'none' || isColorfulIcon(imgPath)) {
          tintCls = '' // 彩色图标不上色
        } else if (tint === 'primary' || tint === 'green') {
          tintCls = 'icon-tint-primary'
        } else if (tint === 'grey' || tint === 'gray') {
          tintCls = 'icon-tint-grey'
        } else if (tint === 'white') {
          tintCls = 'icon-tint-white'
        } else if (!isColorfulIcon(imgPath)) {
          // 默认给 common 图标加绿色色调
          tintCls = 'icon-tint-primary'
        }

        this.setData({
          mode: 'image',
          imgSrc: imgPath,
          displayIcon: '',
          tintCls,
        })
      } else {
        this.setData({
          mode: 'text',
          imgSrc: '',
          displayIcon: emoji || '',
          tintCls: '',
        })
      }
    },
    'size': function (size) {
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
        if (!circle) cls += ' icon-circle'
      }
      this.setData({ wrapCls: cls })
    },
  },

  data: {
    mode: 'text',    // 'image' | 'text'
    displayIcon: '',
    imgSrc: '',
    sizeCls: 'icon-size-md',
    customSize: '',
    wrapCls: '',
    tintCls: '',
  },
})
