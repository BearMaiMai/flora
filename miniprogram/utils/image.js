/**
 * image.js - 图片处理工具
 */

/**
 * 上传图片到云存储
 * @param {string} filePath - 本地文件路径
 * @param {string} cloudDir - 云存储目录
 * @returns {Promise<string>} fileID
 */
const uploadImage = async (filePath, cloudDir = 'images') => {
  const ext = filePath.split('.').pop()
  const cloudPath = `${cloudDir}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`

  const res = await wx.cloud.uploadFile({
    cloudPath,
    filePath,
  })

  return res.fileID
}

/**
 * 批量上传图片
 * @param {string[]} filePaths
 * @param {string} cloudDir
 * @returns {Promise<string[]>} fileIDs
 */
const uploadImages = async (filePaths, cloudDir = 'images') => {
  const tasks = filePaths.map(path => uploadImage(path, cloudDir))
  return Promise.all(tasks)
}

/**
 * 选择图片
 * @param {number} count - 最多选择数量
 * @returns {Promise<string[]>} 临时文件路径
 */
const chooseImages = (count = 9) => {
  return new Promise((resolve, reject) => {
    wx.chooseMedia({
      count,
      mediaType: ['image'],
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => resolve(res.tempFiles.map(f => f.tempFilePath)),
      fail: reject,
    })
  })
}

module.exports = { uploadImage, uploadImages, chooseImages }
