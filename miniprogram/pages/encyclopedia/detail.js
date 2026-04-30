// pages/encyclopedia/detail.js - 花卉详情页
Page({
  data: {
    loading: false,
    flower: {
      _id: 'f1',
      name: '绿萝',
      alias: '黄金葛、魔鬼藤',
      category: '观叶植物',
      difficulty: 1,
      coverImage: '',
      description: '绿萝是最受欢迎的室内观叶植物之一，原产于东南亚热带雨林。它不仅能美化环境，还被NASA列为最佳空气净化植物之一，可有效去除甲醛、苯等有害气体。',
      flowerLanguage: '坚韧善良、守望幸福',
      careGuide: {
        water: '春夏季保持土壤微湿，每3-5天浇水一次；秋冬季减少浇水，土壤干透再浇',
        light: '喜散射光，忌强光直射。可放在明亮的室内，北面窗台尤佳',
        soil: '疏松透气的腐叶土，可用泥炭土:珍珠岩 = 7:3 配制',
        temperature: '最适温度 15-25°C，低于 10°C 会停止生长，5°C 以下可能冻伤',
        fertilizer: '生长季每月施一次稀薄液肥，冬季停止施肥',
        humidity: '喜湿润环境，经常向叶面喷水，特别是夏季和冬季暖气房内',
      },
      tips: [
        '发黄的叶子及时剪掉，促进新叶生长',
        '水培绿萝每周换水一次，保持水质清洁',
        '可以用啤酒稀释后擦拭叶面，让叶片更有光泽',
      ],
    },
    isFavorite: false,
  },

  onLoad(options) {
    // 模拟数据已直接写入，后续接入 service 替换
    if (options.id) {
      wx.setNavigationBarTitle({ title: this.data.flower.name })
    }
  },

  onToggleFavorite() {
    const isFavorite = !this.data.isFavorite
    this.setData({ isFavorite })
    wx.showToast({
      title: isFavorite ? '已收藏' : '已取消收藏',
      icon: 'success',
    })
  },

  onAddToGarden() {
    wx.showToast({ title: '已添加到花园', icon: 'success' })
    setTimeout(() => {
      wx.switchTab({ url: '/pages/garden/index' })
    }, 1500)
  },

  onShareAppMessage() {
    const { flower } = this.data
    return {
      title: flower ? `来看看「${flower.name}」的养护方法` : '养花呀 - 花卉百科',
      path: `/pages/encyclopedia/detail?id=${flower?._id || ''}`,
    }
  },
})
