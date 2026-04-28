/**
 * storage.js - 本地缓存封装
 */

const PREFIX = 'flora_'

const set = (key, value) => {
  try {
    wx.setStorageSync(PREFIX + key, value)
  } catch (err) {
    console.error('缓存写入失败:', err)
  }
}

const get = (key, defaultValue = null) => {
  try {
    const value = wx.getStorageSync(PREFIX + key)
    return value !== '' && value !== undefined ? value : defaultValue
  } catch (err) {
    console.error('缓存读取失败:', err)
    return defaultValue
  }
}

const remove = (key) => {
  try {
    wx.removeStorageSync(PREFIX + key)
  } catch (err) {
    console.error('缓存删除失败:', err)
  }
}

const clear = () => {
  try {
    wx.clearStorageSync()
  } catch (err) {
    console.error('缓存清除失败:', err)
  }
}

module.exports = { set, get, remove, clear }
