const nodemailer = require('nodemailer')

// 163 邮箱 SMTP 配置
const MAIL_CONFIG = {
  host: 'smtp.163.com',
  port: 465,
  secure: true,
  auth: {
    user: 'flowers_and_plant@163.com',
    pass: 'LAxwKMJ6Jdfr2jFn'  // 163 授权码，非邮箱密码
  }
}

/**
 * 用户意见反馈（存数据库 + 发邮件通知）
 * @param {String} content - 反馈内容 | content | String | 希望增加XX植物的养护指南 | 必填
 * @param {String} [contact] - 联系方式 | contact | String | user@example.com | 可选
 * @returns {String} data._id - 反馈记录ID | _id | String | fb-abc123
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'user',
 *   data: { action: 'feedback', content: '希望增加XX植物的养护指南', contact: 'user@example.com' }
 * })
 */
module.exports = async (event, context, { db, cloud }) => {
  const openid = cloud.getWXContext().OPENID
  const { content, contact } = event
  if (!content || !content.trim()) return { code: -1, message: '反馈内容不能为空' }

  // 1. 存入数据库
  const res = await db.collection('feedbacks').add({
    data: {
      _openid: openid,
      content: content.trim(),
      contact: contact || '',
      status: 'pending',
      createdAt: db.serverDate()
    }
  })

  // 2. 发邮件通知（异步，不阻塞返回）
  try {
    const transporter = nodemailer.createTransport(MAIL_CONFIG)
    await transporter.sendMail({
      from: 'flowers_and_plant@163.com',
      to: 'flowers_and_plant@163.com',
      subject: `[养花呀反馈] ${content.trim().substring(0, 30)}`,
      text: `反馈内容：\n${content.trim()}\n\n联系方式：${contact || '未填写'}\n\n反馈ID：${res._id}`
    })
    console.log('[feedback] 邮件已发送')
  } catch (mailErr) {
    console.error('[feedback] 邮件发送失败:', mailErr.message)
    // 不发邮件不影响反馈提交成功
  }

  return { code: 0, data: { _id: res._id } }
}
