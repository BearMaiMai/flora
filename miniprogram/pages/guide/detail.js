// pages/guide/detail.js - 种植指南详情页
const guideService = require('../../services/guide')
const { formatDate } = require('../../utils/util')

Page({
  data: { loading: true, guide: null },

  onLoad(options) {
    const id = options && options.id
    if (!id) {
      this.setData({ loading: false })
      wx.showToast({ title: '缺少文章ID', icon: 'none' })
      return
    }
    this.loadDetail(id)
  },

  async loadDetail(id) {
    this.setData({ loading: true })
    try {
      const res = await guideService.getDetail(id)
      const guide = res && res.data
      if (!guide || !guide._id) {
        wx.showToast({ title: '文章不存在', icon: 'none' })
        return
      }
      wx.setNavigationBarTitle({ title: guide.title || '种植指南' })
      const formattedContent = this.formatMarkdown(guide.content || '')
      this.setData({
        guide: {
          ...guide,
          content: formattedContent,
          createdAt: formatDate(guide.createdAt, 'YYYY-MM-DD'),
        },
      })
    } catch (err) {
      console.error('[guide/detail] 异常:', err)
      wx.showToast({ title: err.message || '加载失败', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },

  /**
   * 简易 Markdown → HTML 转换（带行内样式，rich-text 渲染友好）
   * 数据库里的 content 是 Markdown 格式
   */
  formatMarkdown(md) {
    if (!md) return ''
    const escapeHtml = (s) => String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    let html = escapeHtml(md)

    // 标题（H1/H2/H3）带行内样式
    html = html.replace(/^### (.+)$/gm, '<h3 class="art-h3">$1</h3>')
    html = html.replace(/^## (.+)$/gm, '<h2 class="art-h2">$1</h2>')
    html = html.replace(/^# (.+)$/gm, '<h1 class="art-h1">$1</h1>')

    // 加粗
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="art-strong">$1</strong>')

    // 无序列表
    html = html.replace(/(?:^- (.+)\n?)+/gm, (m) => {
      const items = m.trim().split('\n').map(l => '<li class="art-li">' + l.replace(/^- /, '') + '</li>').join('')
      return '<ul class="art-ul">' + items + '</ul>'
    })

    // 表格（简单支持 | 列1 | 列2 | 这种格式）
    const lines = html.split('\n')
    const out = []
    let tableRows = []
    let inTable = false
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line.startsWith('|') && line.endsWith('|') && line.length > 2) {
        // 跳过分隔行 |---|---|---|
        if (/^\|[\s\-:|]+\|$/.test(line)) continue
        const cells = line.slice(1, -1).split('|').map(c => c.trim())
        const isHeader = !inTable && tableRows.length === 0
        const tag = isHeader ? 'th' : 'td'
        tableRows.push('<tr>' + cells.map(c => `<${tag} class="art-${tag}">${c}</${tag}>`).join('') + '</tr>')
        inTable = true
      } else {
        if (inTable && tableRows.length) {
          out.push('<table class="art-table">' + tableRows.join('') + '</table>')
          tableRows = []
          inTable = false
        }
        out.push(line)
      }
    }
    if (inTable && tableRows.length) {
      out.push('<table class="art-table">' + tableRows.join('') + '</table>')
    }
    html = out.join('\n')

    // 段落（双换行 → </p><p>）
    html = html.replace(/\n\n+/g, '</p><p class="art-p">')
    html = '<p class="art-p">' + html + '</p>'

    // 单换行 → <br>
    html = html.replace(/\n/g, '<br>')

    return html
  },
})