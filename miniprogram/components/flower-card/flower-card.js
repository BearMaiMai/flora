// components/flower-card/flower-card.js - 花卉卡片组件
Component({
  properties: {
    flower: { type: Object, value: {} },
  },
  methods: {
    onTap() {
      this.triggerEvent('tap', { id: this.data.flower._id })
    },
  },
})
