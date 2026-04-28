// components/empty-state/empty-state.js - 空状态组件
Component({
  properties: {
    icon: { type: String, value: '📭' },
    text: { type: String, value: '暂无数据' },
    btnText: { type: String, value: '' },
  },
  methods: {
    onBtnTap() {
      this.triggerEvent('action')
    },
  },
})
