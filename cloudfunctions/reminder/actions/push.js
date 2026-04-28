// cloudfunctions/reminder/actions/push.js
// 定时触发器调用，推送订阅消息
module.exports = async (event, context, { db, cloud }) => {
  // TODO: 查询今日待提醒用户，发送订阅消息
  console.log('执行定时推送任务')
  return { code: 0, message: '推送完成' }
}
