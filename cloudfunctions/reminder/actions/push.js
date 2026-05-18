/**
 * 定时推送提醒（由定时触发器调用）
 * @example
 * const res = await wx.cloud.callFunction({
 *   name: 'reminder',
 *   data: { action: 'push' }
 * })
 */
module.exports = async (event, context, { db, cloud }) => {
  // TODO: 查询今日待提醒用户，发送订阅消息
  console.log('执行定时推送任务')
  return { code: 0, message: '推送完成' }
}
