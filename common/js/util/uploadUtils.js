// common/js/util/uploadUtils.js
const SYS_ID = 2025040301;

export default {
  /**
   * 获取上传凭证
   * @param {number} userId - 用户ID
   * @returns {Promise<string>} 上传凭证
   */
  async getUploadToken(userId) {
    try {
      const tokenRes = await uni.request({
        url: process.env.UNI_BASE_URL + '/api/uploadBefore',
        method: 'GET',
        data: {
          sysId: SYS_ID,
          key: `jobUserId=${userId}`
        }
      });
      return tokenRes.data.upToken;
    } catch (err) {
      uni.showToast({ 
        title: '获取上传凭证失败，请联系管理员！', 
        icon: 'none' 
      });
      throw err;
    }
  },

  /**
   * 通用文件上传方法
   * @param {string} filePath - 文件本地路径
   * @param {string} uploadToken - 上传凭证
   * @param {string} fileType - 文件类型（'image'/'voice'）
   * @param {string} where - 使用位置（'job/suggest/'、'job/voice/'）
   * @param {number} userId - 用户ID
   * @returns {Promise<string|null>} 文件CDN地址
   */
  async _uploadFile(filePath, uploadToken, fileType, where, userId) {
    try {
      // 根据文件类型生成不同路径
      // const prefix = fileType === 'image' ? 'job/suggest/' : 'job/voice/';
      const ext = fileType === 'image' ? 'jpg' : 'mp3';
      
      // 生成唯一文件名
      const fileName = `${where}${userId}_${Date.now()}_${Math.random().toString(36).substr(2)}.${ext}`;

      const uploadRes = await uni.uploadFile({
        url: process.env.UNI_QINIUP_URL,
        filePath: filePath,
        name: 'file',
        formData: {
          token: uploadToken,
          key: fileName
        }
      });

      if (uploadRes.statusCode === 200) {
        const resData = JSON.parse(uploadRes.data);
        return process.env.UNI_CDN + resData.key;
      }
      return null;
    } catch (err) {
      uni.showToast({ 
        title: `${fileType === 'image' ? '图片' : '语音'}上传失败，请重试！`, 
        icon: 'none' 
      });
      console.error(`${fileType} upload error:`, err);
      return null;
    }
  },

  /**
   * 上传图片
   * @param {string} imagePath - 图片本地路径
   * @param {string} uploadToken - 上传凭证
   * @param {string} where - 使用位置（'job/suggest/'、'job/voice/'）
   * @param {number} userId - 用户ID
   * @returns {Promise<string|null>} 图片CDN地址
   */
  async uploadImg(imagePath, uploadToken, where, userId) {
    return this._uploadFile(imagePath, uploadToken, 'image', where, userId);
  },

  /**
   * 上传语音
   * @param {string} voicePath - 语音本地路径
   * @param {string} uploadToken - 上传凭证
   * @param {number} userId - 用户ID
   * @returns {Promise<string|null>} 语音CDN地址
   */
  async uploadVoice(voicePath, uploadToken, where, userId) {
    return this._uploadFile(voicePath, uploadToken, 'voice', where, userId);
  }
};