export class JobStoreManager {
  constructor({
    sysId,
    historyRecordKey = "JOB_OPT_HISTORY_RECORD",
    maxHistoryLength = 20
  }) {
    this.SYS_ID = sysId
    this.JOB_OPT_HISTORY_RECORD = historyRecordKey
    this.JOB_OPT_HISTORY_RECORD_LEN = maxHistoryLength
  }

  async storeOpt(obj, opt='收藏', isStore = true, userToken) {
	// console.log("操作1："+opt)
    let enabled = 0
    if (!isStore) {
      enabled = 1
      opt = '取消收藏'
    }
    const url = `/pages/job/user/user_detail?detailId=${obj.userId}`
    this.writeHistoryRecord(opt, obj.username, obj.headImgPath, url)

    const store = {
      sysId: this.SYS_ID,
      selfId: userToken.userId,
      token: userToken.token,
      userId: obj.userId,
      enabled: enabled
    }
	// console.log("传递参数："+JSON.stringify(store))
    try {
      const result = await uni.request({
        url: process.env.UNI_BASE_URL + '/api/job/storeOpt',
        header: { 'content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        method: 'POST',
        data: store
      })

      if (result.data.code === 0) {
        uni.showToast({ title: `${opt}成功`, icon: 'success' })
      } 
	  // else {
   //      uni.showToast({ title: `${opt}未成功，请后续重试！`, icon: 'error' })
   //    }
      return result.data
    } catch (error) {
      console.error('storeOpt error:', error)
      uni.showToast({ title: '操作失败，请检查网络', icon: 'error', duration: 10000 })
      throw error
    }
  }

  writeHistoryRecord(opt, username, headImgPath, url) {
	// console.log("操作2："+opt)
    const formattedDate = this.formatDate(new Date())
    const optRecord = {
      title: `${opt}了  ${username}`,
      time: formattedDate,
      image: headImgPath,
      url: url
    }
    this.addToFront(optRecord);
    return
  }

  formatDate(date) {
    const pad = n => n.toString().padStart(2, '0')
    return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ` +
           `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  }

  addToFront(optRecord) {
	// console.log("取旧记录，附新对象"+JSON.stringify(optRecord))
	const _this = this
	let list = []
	uni.getStorage({
		key: this.JOB_OPT_HISTORY_RECORD,
		success: function(resp){
			if(resp.data){
				// console.log("最终历史记录1："+JSON.stringify(resp.data))
				if(!(resp.data instanceof Array)) {
					uni.removeStorage({key: _this.JOB_OPT_HISTORY_RECORD});
					// console.log("移除空对象")
					uni.setStorage({ key: _this.JOB_OPT_HISTORY_RECORD, data: [optRecord]})
					return 
				}
				list = [optRecord, ...resp.data].slice(0, _this.JOB_OPT_HISTORY_RECORD_LEN);
				
				// console.log("最新集合："+JSON.stringify(list))
				uni.setStorage({ key: _this.JOB_OPT_HISTORY_RECORD, data: list})
				// debugger  // historyRecords.slice(0, maxLength)
				return 
			}else{
				uni.setStorage({ key: _this.JOB_OPT_HISTORY_RECORD, data: [optRecord]})
			}
			
		},
		fail:function(){
			uni.setStorage({ key: _this.JOB_OPT_HISTORY_RECORD, data: [optRecord]})
		}
	});
  }
  
}

// 使用示例
/*
import { JobStoreManager } from './jobStoreManager.js'

const jobManager = new JobStoreManager({
  sysId: 'your_system_id',
  historyRecordKey: "JOB_OPT_HISTORY_RECORD",
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