/**
 * 定时推送提醒（由定时触发器调用）
 * 本接口由定时触发器自动调用，前端无需主动调用
 * @returns {Array} data - 提醒对象数组（仅用于说明结构）| Array<Object> | - | -
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