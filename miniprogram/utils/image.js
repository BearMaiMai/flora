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
  const ext = (filePath.split('.').pop() || 'jpg').toLowerCase()
  const cloudPath = `${cloudDir}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`

  const res = await wx.cloud.uploadFile({
    cloudPath,
    filePath,
  })

  return res.fileID
}

/**
 * 批量上传图片（已是远程 URL 的不重复传）
 * @param {string[]} filePaths
 * @param {string} cloudDir
 * @returns {Promise<string[]>} fileIDs
 */
const uploadImages = async (filePaths, cloudDir = 'images') => {
  const tasks = filePaths.map(p => {
    if (!p) return null
    if (p.startsWith('cloud://') || p.startsWith('http')) return p
    return uploadImage(p, cloudDir)
  })
  return Promise.all(tasks).then(arr => arr.filter(Boolean))
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

/**
 * 把 cloud:// 协议的 fileID 批量转换为 https 临时 URL
 * @param {string[]} fileIDs
 * @returns {Promise<string[]>} 与输入顺序一致的可访问 URL
 */
const toTempFileURLs = async (fileIDs) => {
  if (!Array.isArray(fileIDs) || !fileIDs.length) return []
  const cloudFiles = []
  const indexMap = []
  fileIDs.forEach((id, idx) => {
    if (typeof id === 'string' && id.startsWith('cloud://')) {
      cloudFiles.push(id)
      indexMap.push(idx)
    }
  })
  if (!cloudFiles.length) return [...fileIDs]

  try {
    const res = await wx.cloud.getTempFileURL({ fileList: cloudFiles })
    const urlMap = {}
    if (res && Array.isArray(res.fileList)) {
      res.fileList.forEach(item => {
        if (item.fileID && item.tempFileURL) {
          urlMap[item.fileID] = item.tempFileURL
        }
      })
    }
    return fileIDs.map(id => urlMap[id] || id)
  } catch (err) {
    console.warn('getTempFileURL 失败:', err)
    return [...fileIDs]
  }
}

/**
 * 单个 cloud:// 转 https
 */
const toTempFileURL = async (fileID) => {
  if (!fileID || !fileID.startsWith('cloud://')) return fileID
  const list = await toTempFileURLs([fileID])
  return list[0] || fileID
}

/**
 * 安全图片地址：cloud:// → https，其它原样返回
 */
const safeImageURL = async (url) => toTempFileURL(url)

module.exports = {
  uploadImage,
  uploadImages,
  chooseImages,
  toTempFileURL,
  toTempFileURLs,
  safeImageURL,
}
