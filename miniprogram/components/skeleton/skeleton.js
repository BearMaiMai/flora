// components/skeleton/skeleton.js - 骨架屏组件
Component({
  properties: {
    // 预设模板：home / list / garden / detail
    type: { type: String, value: 'home' },
    // 列表模式下的行数
    rows: { type: Number, value: 3 },
    // 是否显示
    loading: { type: Boolean, value: true },
    // 是否显示动画
    animate: { type: Boolean, value: true },
  },
})
