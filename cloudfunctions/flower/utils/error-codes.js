/**
 * 统一错误码定义
 * 错误码范围：
 *   0       - 成功
 *   1000-1999 - 参数错误
 *   2000-2999 - 用户错误
 *   3000-3999 - 数据错误
 *   4000-4999 - 数据库/系统错误
 *   5000-5999 - 未知/其他错误
 */
module.exports = {
  // 成功
  SUCCESS: { code: 0, message: '成功' },

  // 参数错误 (1000-1999)
  PARAM_ERROR: { code: 1001, message: '参数错误', data: null },
  MISSING_PARAM: { code: 1002, message: '缺少必填参数', data: null },
  INVALID_PARAM: { code: 1003, message: '参数格式不正确', data: null },
  INVALID_ID: { code: 1004, message: 'ID格式不正确', data: null },

  // 用户错误 (2000-2999)
  USER_NOT_FOUND: { code: 2001, message: '用户不存在', data: null },
  USER_NOT_LOGIN: { code: 2002, message: '用户未登录', data: null },

  // 数据错误 (3000-3999)
  DATA_NOT_FOUND: { code: 3001, message: '数据不存在', data: null },
  DATA_ALREADY_EXISTS: { code: 3002, message: '数据已存在', data: null },
  NO_SEARCH_RESULT: { code: 3003, message: '未找到符合条件的数据', data: null },

  // 数据库/系统错误 (4000-4999)
  DB_ERROR: { code: 4001, message: '数据库访问出错', data: null },
  DB_WRITE_ERROR: { code: 4002, message: '数据写入失败', data: null },

  // 未知/其他错误 (5000-5999)
  UNKNOWN_ACTION: { code: 5001, message: '未知操作', data: null },
  UNKNOWN_ERROR: { code: 5002, message: '未知错误', data: null },
}
