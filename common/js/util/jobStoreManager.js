export class JobStoreManager {
  constructor({
    sysId,
	uni,
    historyRecordKey = 'JOB_OPT_HISTORY_RECORD',
    maxHistoryLength = 20
  }) {
    this.SYS_ID = sysId
	this.UNI = uni
    this.JOB_OPT_HISTORY_RECORD = historyRecordKey
    this.JOB_OPT_HISTORY_RECORD_LEN = maxHistoryLength
  }

  async storeOpt(obj, opt='收藏', isStore = true, userToken, historyRecord) {
    let enabled = 0
    if (!isStore) {
      enabled = 1
      opt = '取消收藏'
    }

    const url = `/pages/job/user/user_detail?detailId=${obj.userId}`
    this.writeHistoryRecord(opt, obj.username, obj.headImgPath, url, historyRecord)

    const store = {
      sysId: this.SYS_ID,
      selfId: userToken.userId,
      token: userToken.token,
      userId: obj.userId,
      enabled: enabled
    }
	console.log("传递参数："+JSON.stringify(store))
    try {
      const result = await this.UNI.request({
        url: process.env.UNI_BASE_URL + '/api/job/storeOpt',
        header: { 'content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        method: 'POST',
        data: store
      })

      if (result.data.code === 0) {
        this.UNI.showToast({ title: `${opt}成功`, icon: 'success' })
      } else {
        this.UNI.showToast({ title: `${opt}未成功，请后续重试！`, icon: 'error' })
      }
      return result.data
    } catch (error) {
      console.error('storeOpt error:', error)
      this.UNI.showToast({ title: '操作失败，请检查网络', icon: 'error' })
      throw error
    }
  }

  writeHistoryRecord(opt, username, headImgPath, url, historyRecord) {
    const formattedDate = this.formatDate(new Date())
    const optRecord = {
      title: `${opt}了${username}`,
      time: formattedDate,
      image: headImgPath,
      url: url
    }

    const updatedRecords = this.addToFront(historyRecord, optRecord, this.JOB_OPT_HISTORY_RECORD_LEN)
    this.UNI.setStorage({ key: this.JOB_OPT_HISTORY_RECORD, data: updatedRecords })
    return updatedRecords
  }

  formatDate(date) {
    const pad = n => n.toString().padStart(2, '0')
    return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ` +
           `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  }

  addToFront(list, newItem, maxLength) {
    return [newItem, ...list].slice(0, maxLength)
  }
}

// 使用示例
/*
import { JobStoreManager } from './jobStoreManager.js'

const jobManager = new JobStoreManager({
  sysId: 'your_system_id',
  uni: uni, // 传入uni对象
  historyRecordKey: 'JOB_OPT_HISTORY_RECORD',
  maxHistoryLength: 20
})

// 在Vue组件中使用
await jobManager.storeOpt(
  { userId: '123', username: 'test', headImgPath: 'avatar.jpg' },
  true,
  { userId: 'currentUser', token: 'userToken' },
  [...existingHistoryRecords]
)
*/