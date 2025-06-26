// msgUtil.js
const SYS_ID = 2025040301;

const SuggestUtil = {
  /**
   * 处理浮动按钮点击事件（显示反馈模态框）
   * @param {Object} userToken - 用户令牌对象
   */
  fabClick(userToken) {
    uni.showModal({
      title: '建议、意见、想法',
      height: 2000,
      content: '',
      editable: true,
      confirmText: '反馈',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          if (!res.content) return;
          this.sendMessage(res.content, userToken);
          uni.showToast({
            title: '非常感谢！祝好！(*￣︶￣*)',
            icon: 'success',
            position: 'center'
          });
        } else if (res.cancel) {
          uni.showToast({
            title: '期待您的反馈！！(*￣︶￣*)',
            icon: 'success',
            position: 'center'
          });
        }
      }
    });
  },
  
  
  async syncFabClick(userToken) {
	  return new Promise((resolve, reject) => {
		uni.showModal({
		  title: '建议、意见、想法',
		  height: 2000,
		  content: '',
		  editable: true,
		  confirmText: '反馈',
		  cancelText: '取消',
		  success: (res) => {
			if (res.confirm) {
			  if (!res.content) return resolve();
			  this.sendMessage(res.content, userToken);
			  uni.showToast({
				title: '非常感谢！祝好！(*￣︶￣*)',
				icon: 'success',
				position: 'center'
			  });
				setTimeout(() => {
				  resolve(); // 可以返回一个对象表示成功发送反馈
				}, 2000);
			} else if (res.cancel) {
			  uni.showToast({
				title: '期待您的反馈！！(*￣︶￣*)',
				icon: 'success',
				position: 'center'
			  });
				setTimeout(() => {
				  resolve(); // 可以返回一个对象表示成功发送反馈
				}, 2000);
			}
			return {}
		  }
		});
	  });
  },

  /**
   * 发送反馈消息到服务器
   * @param {string} content - 反馈内容
   * @param {Object} userToken - 用户令牌对象
   */
  sendMessage(content, userToken) {
    const params = {
      sysId: SYS_ID,
      callPhone: userToken?.userId || 'unknown',
      subject: 'job 反馈',
      suggestType: 3, // 类型(1-咨询;2-投诉;3-建议(默认);4-举报;5-求助;6-意见;7-表扬)
      email: 'wangqingbo0829@163.com',
      content: content
    };

    uni.request({
      url: process.env.UNI_BASE_URL + `/api/save/suggest`,
      data: JSON.stringify(params),
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      success: (result) => {
        if (result.statusCode === 200) {
          console.log('反馈提交成功');
        }
      },
      fail: (error) => {
        console.error('反馈提交失败', error);
        uni.showToast({
          title: '反馈提交失败',
          icon: 'error',
          position: 'center'
        });
      }
    });
  }
};

export default SuggestUtil;