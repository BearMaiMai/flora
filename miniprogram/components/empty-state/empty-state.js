// components/empty-state/empty-state.js - 空状态组件
Component({
  properties: {
    icon: { type: String, value: '📭' },
    title: { type: String, value: '' },
    desc: { type: String, value: '暂无数据' },
    btnText: { type: String, value: '' },
    iconColor: { type: String, value: '' },
    iconName: { type: String, value: '' },
  },
  methods: {
    onBtnTap() {
      this.triggerEvent('action')
    },
  },
})
