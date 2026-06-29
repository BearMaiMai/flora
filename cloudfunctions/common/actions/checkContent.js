const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

/**
 * 内容安全检查（对接微信 msgSecCheck，审核合规必接）
 * @param {String} content - 要检测的文本内容 | content | String | 用户昵称或反馈文本 | 必填
 * @returns {String} data.suggest - 检测结果 | suggest | String | pass=通过,review=疑似,block=违规
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'common',
 *   data: { action: 'checkContent', content: '检测的文本' }
 * })
 * // { code: 0, data: { suggest: 'pass' } }
 */
module.exports = async (event, context) => {
  const { content } = event
  if (!content || !content.trim()) return { code: -1, message: '缺少检测内容' }

  try {
    const res = await cloud.openapi.security.msgSecCheck({
      content: content.trim()
    })
    return { code: 0, data: { suggest: res.result.suggest } }  // pass / review / block
  } catch (err) {
    console.error('[checkContent] 安全检查失败:', err)
    return { code: -1, message: '安全检查服务异常' }
  }
}
