<template>
	<view class="page">
		<!--加载更多、向下 -->
		<uni-load-more v-show="hasHistory" :status="status" :icon-size="16" :content-text="contentText" />
		<!-- <scroll-view class="scroll-view" scroll-y scroll-with-animation :scroll-top="top" @scrolltoupper="loadHistory"> -->
		<scroll-view class="scroll-view" scroll-y scroll-with-animation :scroll-top="top" @scroll="handleScroll" :scroll-into-view="autoScrollId">
			<view style="padding: 30rpx 30rpx 240rpx;">
				<view class="message" :class="[item.userType==0?'self':'friend']" v-for="(item,index) in list" :key="index"
					@click="msgClick(item)" :id="'msg-' + index" >
					<image :src="item.avatar" v-if="item.userType == 1" class="avatar" mode="widthFix"></image>
					<view class="content" v-if="item.messageType === 2">
						<image :src="item.content" mode="widthFix"></image>
					</view>
					<view class="time" v-if="item.messageType === -1" style="margin: auto  auto  15px  auto;" >
						{{ item.content }}
					</view>
					<view class="content" v-else>
						{{ item.content }}
					</view>
					<image :src="item.avatar" v-if="item.userType == 0" class="avatar" mode="widthFix"></image>
				</view>
			</view>
		</scroll-view>

		<view class="tool">
			<!--messageType 类型：0-文本-TEXT;1-语音-VOICE;2-图片-IMAGE;3-视频-VIDEO;4-文件-FILE -->
			<block v-if="messageType === 0">
				
				<!-- #ifdef APP-PLUS || MP-WEIXIN || MP-ALIPAY || MP-TOUTIAO || MP-QQ -->
				<image src="@/static/img/online/voice.png" mode="widthFix" class="left-icon" @click="messageType=1" ></image>
				<!-- #endif --> 
				<!-- #ifndef APP-PLUS || MP-WEIXIN || MP-ALIPAY || MP-TOUTIAO || MP-QQ -->
				<image src="@/static/img/online/text.png" mode="widthFix" class="left-icon" ></image>
				<!-- #endif --> 
				
				<input type="text" v-model="content" class="input" @confirm="send" />
				<uni-icons type="plus" size="34" @click="chooseImage" class="plus-img" ></uni-icons>
				<button mode="widthFix" class="thumb" @click="send" >发送</button>
			</block>
			
			<!-- #ifdef APP-PLUS || MP-WEIXIN || MP-ALIPAY || MP-TOUTIAO || MP-QQ -->
			<block v-else-if="messageType === 1">
				<image src="@/static/img/online/text.png" mode="widthFix" class="left-icon" @click="messageType=0"></image>
				<text class="voice-crl" @touchstart="touchstart" @touchend="touchend">{{ recordStart ? '松开 发送' : '按住 说话' }}</text>
			</block>
			<!-- #endif --> 
			 
		</view>

		<view v-if="recordStart" class="audio-animation">
			<view class="audio-wave">
				<text class="audio-wave-text" v-for="item in 10" :style="{'animation-delay': `${item/10}s`}"></text>
				<view class="text">松开 发送</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import socket from '@/common/js/util/socket.js'
	
	const SYS_ID = 2025040301;
	const JOB_TOKEN = 'JOB_TOKEN';
	const PAGE_LIMIT = 10
	
	// const recorderManager = wx.getRecorderManager()
	// #ifdef APP-PLUS || MP-WEIXIN || MP-ALIPAY || MP-TOUTIAO || MP-QQ
	// 在移动端环境下调用录音方法
	const recorderManager = uni.getRecorderManager();
	// 使用recorderManager进行录音操作
	// #endif
	// item.userType === 'self' == 0   &&  item.userType === 'friend' == 1
	export default {
		data() {
			return {
				userId: 0,
				userToken: null,
				content: '',
				list: [],
				messageType: 0, // 类型：0-文本-TEXT;1-语音-VOICE;2-图片-IMAGE;3-视频-VIDEO;4-文件-FILE
				recordStart: false,
				autoReplied: true,
				
				
				senderId: 0,
				receiverId: 0,
				headImg:{},
				
				top: -1,
				autoScrollId: '',       // 自动滚动锚点
				isLoading: false,       // 加载锁定
				scrollThreshold: 10,    // 触发加载的阈值
				currentScrollTop: 0,    // 当前滚动位置
				prevScrollHeight: 0,    // 上次滚动高度
				
				
				listData: [],
				last_id: '',
				hasHistory: false,
				reload: false,	// 下拉加载更多-false; 上拉刷新-true
				status: 'nomore', // 加载状态  more：下拉加载更多；loading：加载中；nomore：没有更多
				contentText: {
					contentdown: '下拉查看历史记录 ……',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				
				socket: null,
				wsUrl: process.env.UNI_WS_URL,
				isFirstQequest: true,
				is_open_socket: false ,			// 避免重复连接
				timeout : 120000,				// 多少秒执行检测
				heartbeatInterval 	: null,		// 检测服务器端是否还活着
				reconnectTimeOut 	: null,		// 重连之后多久再次重连
				timeBuffer: null,				// 时间
			};
		},
		onLoad(options) {
			// 设置标题栏，放在后面设置
			// uni.setNavigationBarTitle({
			// 	title: options.name
			// })
			this.senderId = options.senderId
			this.receiverId = options.receiverId
			const _this = this
			uni.getStorage({
				key: JOB_TOKEN,
				success: function(resp){
					_this.userToken = resp.data
					_this.userId = _this.userToken.userId;
					// console.log("缓存取值："+ JSON.stringify(_this.userToken))
				},
				fail:function(){
				}
			});
			
			// this._friendAvatar = options.avatar
			// this._selfAvatar = 'https://ask.dcloud.net.cn/uploads/avatar/001/43/07/62_avatar_max.jpg?=1705916918'
			this.list = [];
		},
		onHide() {
			if (this._innerAudioContext) {
				this._innerAudioContext.stop();
			}
		},
		mounted() {
			// console.log("准备构建 websocket: "+ process.env.UNI_WS_URL)
			// this.connectWebSocket();
			if(this.userId != this.senderId && this.userId != this.receiverId){
				uni.showToast({ title: '请重新登录！', icon: 'error' });
				return;
			}
			this.getHeadImg();
			
			console.log("准备构建 websocket: "+ process.env.UNI_WS_URL)
			this.socket = new socket(
				process.env.UNI_WS_URL, this.userId
			);
			console.log("构建了 wss")
			this.watchSocket();
			this.initData();
			this.loadHistory().then(() => {
			  this.$nextTick(() => {
		  	    setTimeout(() => this.scrollToBottom(), 50);
		  	  });
		    });		// 获取，内容列表数据
			
		},
		destroyed() {
		},
		unMounted(){
			
		},
		onUnload() {
			if (this.socketTaskNew) {
				console.log("关闭 socket ")
				this.socketTaskNew.close()
			}
		},
		beforeUnmount(){
			// this.socketTaskNew.close()
		},
		methods: {
			// 修改后的滚动到底部方法
			scrollToBottom() {
				this.$nextTick(() => {
				    this.autoScrollId = `msg-${this.list.length-1}`;
				    this.top = 9999999;
				    // 添加容错机制
				    setTimeout(() => this.top = 9999999, 100);
				});
			},
			getHeadImg(){
				let data = {sysId: SYS_ID, senderId: this.senderId, receiverId: this.receiverId, selfId: this.userToken.userId, token: this.userToken.token}
				console.log('请求参数：' + JSON.stringify(data))
				console.log('Base URL:', process.env.UNI_BASE_URL)
				// console.log('请求参数：' + JSON.stringify(data))
				uni.request({
					url: process.env.UNI_BASE_URL+'/api/job/headImgPath',  // 数据源的数据是 有序的
					data: JSON.stringify(data),
					method: 'POST',
					success: result => {
						console.log('headImgPath 返回值' + JSON.stringify(result));
						if (result.statusCode == 200 && result.data.code == 0) {
							const headImg = result.data.data;
							if(this.userId == this.senderId){
								this._friendAvatar	= 	headImg.receiverHeadImgPath
								this._selfAvatar	=	headImg.senderHeadImgPath
								uni.setNavigationBarTitle({
									title: headImg.receiverUsername
								})
								this.receiverId = headImg.receiverId
							}else{
								this._friendAvatar	= 	headImg.senderHeadImgPath
								this._selfAvatar	=	headImg.receiverHeadImgPath
								uni.setNavigationBarTitle({
									title: headImg.senderUsername
								})
							}
							this.initReply();
						}
					},
					fail: (result, code) => {
						console.log('fail' + JSON.stringify(result));
					},
					complete: (result) =>{
						// console.log('result' + JSON.stringify(result));
					}
				});
			},
			// 新增加载历史记录方法
			async loadHistory() {
				console.log('loadHistory()')
				if (this.isLoading || this.status === 'nomore') return;
				
				this.isLoading = true;
				
				  // 记录加载前状态
				  const query = uni.createSelectorQuery().in(this);
				  const [containerRect] = await new Promise(resolve => {
				    query.select('.scroll-view').boundingClientRect().exec(resolve);
				  });
				  
				  this.prevScrollHeight = containerRect.scrollHeight;
				  const oldScrollTop = this.currentScrollTop;
				
				  try {
				    await this.getList();
				  } finally {
				    this.isLoading = false;
				  }
				
				// // 数据加载完成后，恢复滚动位置（需要考虑到新加载数据的高度）
				// this.$nextTick(() => {
				//   const queryNew = uni.createSelectorQuery().in(this);
				//   queryNew.select('.scroll-view').boundingClientRect(rect => {
				// 	const newScrollHeight = rect.scrollHeight;
				// 	const deltaHeight = newScrollHeight - oldScrollHeight; // 新数据增加的高度
				// 	this.currentScrollTop = oldScrollTop + deltaHeight; // 调整滚动位置
				// 	uni.pageScrollTo({
				// 	  scrollTop: this.currentScrollTop,
				// 	  duration: 0 // 立即滚动到指定位置，避免跳动
				// 	});
				//   }).exec();
				// });
			},
			
			// 获取，内容列表数据
			async getList() {
				console.log('请求 getList()')
				if(this.status == 'nomore') return;
				let data = {sysId: SYS_ID, talkerId: this.userToken.userId, selfId: this.userToken.userId, token: this.userToken.token, enabled: 0}
				console.log('请求参数：' + JSON.stringify(data))
				if (this.last_id) {
					// 说明已有数据，目前处于上拉加载
					this.status = 'loading';
					data.minId = this.last_id;				// 有序取数，下一批数据的指针
					data.time = new Date().getTime() + '';	// 添加请求时间戳，作用：防止 重复取数
					data.limit = PAGE_LIMIT;
				}
				console.log('Base URL:', process.env.UNI_BASE_URL)
				// console.log('请求参数：' + JSON.stringify(data))
				uni.request({
					url: process.env.UNI_BASE_URL+'/api/job/listTalk',  // 数据源的数据是 有序的
					data: JSON.stringify(data),
					method: 'POST',
					success: result => {
						// console.log('userStream 返回值' + JSON.stringify(result));
						if (result.statusCode == 200 && result.data.code == 0) {
							const respData = result.data.data.rows;
							if(respData.length<1){
								this.reload = false;
								this.status = 'nomore';	// 没有更多
								return;
							}
							
							// 1. 记录当前容器状态
							const prevScrollHeight = this.prevScrollHeight;
							const oldScrollTop = this.currentScrollTop;
							
							// 2. 处理数据并插入列表前部
							let listData = this.dataHandle(respData);
				
							// if(this.isFirstQequest){
							// 	timeBuffer = respData[respData.length-1].createTime
							// 	this.list.unshift({
							// 		content: timeBuffer,
							// 		userType: -1, 	// 'self',
							// 		messageType: -1, // 'image',
							// 	})
							// 	this.isFirstQequest = false
							// }
							// this.list = this.reload ? [...listData, ...this.list] : [...this.list, ...listData];
							this.list = this.reload ? this.list : [...listData, ...this.list];
							// this.list = this.reload ? this.list : [...this.list, ...listData];
							// this.list = this.reload ? listData : listData.concat(this.list);
							// this.list = listData.concat(this.list);
							if(respData.length<PAGE_LIMIT) {
								this.reload = false;
								this.status = 'nomore';	// 没有更多
								return;
							};
							// 3. 计算并保持滚动位置
							this.$nextTick(() => {
							  const query = uni.createSelectorQuery().in(this);
							  query.select('.scroll-view').boundingClientRect(res => {
								const newScrollHeight = res.scrollHeight;
								const heightDiff = newScrollHeight - prevScrollHeight;
								
								// 关键公式：新位置 = 原滚动位置 + 新增内容高度
								this.top = oldScrollTop + heightDiff;
								
								// console.log(`滚动位置保持计算:
								//   旧高度: ${prevScrollHeight}
								//   新高度: ${newScrollHeight}
								//   差值: ${heightDiff}
								//   原位置: ${oldScrollTop}
								//   新位置: ${this.top}`);
							  }).exec();
							});
							
							this.last_id = listData[0].id;
							this.reload = false;
							this.status = 'more';		// 下拉加载更多
					
						}
					},
					fail: (result, code) => {
						console.log('fail' + JSON.stringify(result));
					},
					complete: (result) =>{
						// console.log('result' + JSON.stringify(result));
					}
				});
			},
			// 增强滚动事件处理（添加防抖）
			handleScroll(e) {
			 //  clearTimeout(this.scrollTimer);
			 //  this.scrollTimer = setTimeout(() => {
				// this.currentScrollTop = e.detail.scrollTop;
				
				// // 在距离顶部20rpx时触发加载
				// if (this.currentScrollTop <= this.scrollThreshold && 
				// 	!this.isLoading && 
				// 	this.status === 'more') {
				//   this.loadHistory();
				// }
			 //  }, 500);
			  
			    clearTimeout(this.scrollTimer);
			    this.scrollTimer = setTimeout(() => {
			      const newScrollTop = e.detail.scrollTop;
			      this.currentScrollTop = newScrollTop;
			      
			      // 距离顶部50rpx时触发加载（约25px）
			      if (newScrollTop <= this.scrollThreshold && !this.isLoading && this.status === 'more') {
			        console.log('触发历史加载');
			        this.loadHistory();
			      }
			    }, 300); // 防抖时间调整为300ms
			},
			
			dataHandle(items) {
				// var newItems = [];
				var _this = this
				
				let i = items.length-1;
				while (i > -1) {
				  let item = items[i];
				  item = this.judgeObj(item);
				  console.log(`处理元素: ${item.content}: ${item.createTime}`);
				  if(this.isFirstQequest){
					  this.timeBuffer = item.createTime
					  this.list.unshift({
						content: item.createTime,
						userType: -1, 	// 'self',
						messageType: -1, // 'image',
					  })
					  this.isFirstQequest = false
					  // this.judgeObj(item);
					  continue;
				  }
				  console.log(" item.createTime Type:" + typeof item.createTime)
				  // 根据条件添加新元素  Math.round((item.createTime.getTime() - this.timeBuffer.getTime()) / 1000)>300
				  if (this.timeBuffer && this.isOver5Minutes(item.createTime, this.timeBuffer)) {
					this.timeBuffer = item.createTime
					items.splice(i+1, 0, {
				    	content: item.createTime,
				    	userType: -1, 	// 'self',
				    	messageType: -1, // 'image',
				    });
				    // items.push({
				    // 	content: item.createTime,
				    // 	userType: -1, 	// 'self',
				    // 	messageType: -1, // 'image',
				    // }); // 新增元素
				    console.log('新增元素');
				  }
				  
				  i--; // 手动控制索引
				}
				return items;
				// return newItems;
			},
			judgeObj(e){
				// 默认【friend】
				 e.userType = 1;
				 e.avatar 	= this._friendAvatar;
				if(e.senderId == this.userId) {
					// self
					e.userType 	= 0;
					e.avatar	= this._selfAvatar;
				}
				// newItems.unshift(e);
				return e;
			},
			isOver5Minutes(timeStrA, timeStrB) {
			  // 1. 将时间字符串转换为时间戳（毫秒）
			  const timestampA = Date.parse(timeStrA);
			  const timestampB = Date.parse(timeStrB);
			  
			  // 2. 计算差值绝对值（毫秒）
			  const diff = Math.abs(timestampA - timestampB);
			  
			  // 3. 5分钟 = 300,000 毫秒
			  return diff > 300000;
			},
			initData(){
				this.listData 	= [];
				this.last_id 	= '';
				this.status		= 'more'
			},

			send() {
				if(!this.content) return;
				this.list.push({
					content: this.content,
					userType: 0, // 'self',
					avatar: this._selfAvatar
				});
				
				const message = JSON.stringify({sysId: SYS_ID, senderId: this.userId, receiverId: this.receiverId, content: this.content, messageType:0})
				this.socket.send(message)
				console.log("发送了信息："+message)
				this.content = '';
				this.scrollToBottom();
			},
			//接受消息
			watchSocket() {
				this.socket.getMessage(opt => {
					const message = JSON.parse(opt.data); // 解析接收的数据
					console.log("消息接收：", opt);
					console.warn("消息接收：", opt);
					if(message.code != 0){
						uni.showToast({
						  title: message.content,
						  icon: 'none'
						});
						return;
					}
					this.list.push({
						content: message.content,
						userType: 1, // 'friend',
						avatar: this._friendAvatar
					})
					this.scrollToBottom();
				})
			},

			// 初始化回复
			initReply(){
				if(this.autoReplied){
					// 模拟对方回复
					this.list.push({
						content: '欢迎留言！后台会做归档、整理，并全量提交。尽快给您回复！',
						userType: 1, 				// 'friend',
						avatar: this._friendAvatar  	// _friendAvatar
					})
					this.scrollToBottom()
					
					this.autoReplied = false; 	// 不必重复回复
				}
			},

			chooseImage() {
				uni.chooseImage({
					// sourceType: 'album',
					success: (res) => {
						this.list.push({
							content: res.tempFilePaths[0],
							userType: 0, 	// 'self',
							messageType: 2, // 'image',
							avatar: this._selfAvatar
						})
						this.scrollToBottom()
					}
				})
			},
	
			msgClick(data) {
				if (data.messageType === 'voice') {
					if (this._innerAudioContext) {
						this._innerAudioContext.stop()
						this._innerAudioContext.src = data.audioSrc
						this._innerAudioContext.play()
						return
					}
					this.play(data.audioSrc)
				}
			},

			authTips() {
				uni.showModal({
					title: '提示',
					content: '您拒绝了麦克风权限，将导致功能不能正常使用，去设置权限？',
					confirmText: '去设置',
					cancelText: '取消',
					success: (res) => {
						if (res.confirm) {
							uni.openSetting({
								success: (res) => {
									if (res.authSetting['scope.record']) {
										console.log("已授权麦克风");
										this._recordAuth = true
									} else {
										// 未授权
										wx.showModal({
											title: '提示',
											content: '您未授权麦克风，功能将无法使用',
											showCancel: false,
											confirmText: '知道了'
										})
									}
								}
							})
						}
					}
				})
			},

			touchstart() {
				if (!recorderManager) {
				  uni.showToast({
				    title: '录音功能在当前环境下不支持',
				    icon: 'none'
				  });
				  return;
				}
				
				//开始录音
				const _permission = 'scope.record'
				uni.getSetting({
					success: (res) => {
						// 判断是否有相关权限属性
						if (res.authSetting.hasOwnProperty(_permission)) {
							// 属性存在，且为false，用户拒绝过权限
							if (!res.authSetting[_permission]) {
								this.authTips()
							} else {
								// 已授权
								this._recordAuth = true
								// 开始录音
								recorderManager.start()
								recorderManager.onStart(() => {
									this.recordStart = true
								})

								// 错误回调
								recorderManager.onError((res) => {
									console.log('recorder error', res)
									uni.showToast({
										icon: 'none',
										title: '系统出错，请重试'
									})
									this.recordStart = false
								})
							}
						} else {
							// 属性不存在，需要授权
							uni.authorize({
								scope: _permission,
								success: () => {
									// 授权成功
									this._recordAuth = true
								},
								fail: (res) => {
									/**
									 * 104 未授权隐私协议
									 * 用户可能拒绝官方隐私授权弹窗，为了避免过度弹窗打扰用户，开发者再次调用隐私相关接口时，
									 * 若距上次用户拒绝不足10秒，将不再触发弹窗，直接给到开发者用户拒绝隐私授权弹窗的报错
									 */
									if (res.errno == 104) {
										uni.showModal({
											title: '温馨提示',
											content: '您拒绝了隐私协议，请稍后再试',
											confirmText: '知道了',
											showCancel: false,
											success: () => {}
										})
									} else {
										// 用户拒绝授权
										this.authTips()
									}
								}
							})
						}
					}
				})
			},

			touchend() {
				if (!this._recordAuth || !this.recordStart) return
				//停止录音
				recorderManager.stop();
				recorderManager.onStop((res) => {
					console.log('结束录音', res)
					const { duration, tempFilePath } = res
					this.recordStart = false
					const _this = this 
					this.list.push({
						content: `语音 ${Math.round(duration/1000)}''`,
						audioSrc: tempFilePath,
						userType: 0, // 'self',
						avatar: this._selfAvatar,
						messageType: 1 // 'voice'
					})
					this.scrollToBottom()
				})
			},

			//播放声音
			play(src) {
				this._innerAudioContext = wx.createInnerAudioContext()
				this._innerAudioContext.src = src
				this._innerAudioContext.play()
				this._innerAudioContext.onPlay(() => {
					console.log('开始播放')
				})
				this._innerAudioContext.onEnded(() => {
					// 播放完毕，清除音频链接
					console.log('播放完毕');
				})
				this._innerAudioContext.onError((res) => {
					console.log('audio play error', res)
				})
			},
			
		
			// 关闭连接
			closeWebSocket() {
			  if (this.socketTaskNew) {
				this.socketTaskNew.close({
				  success: () => {
					console.log('关闭连接成功')
				  },
				  fail: (err) => {
					console.error('关闭连接失败:', err)
				  }
				})
			  }
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	.scroll-view {
		/* 禁用所有自动滚动行为 */
		overflow-anchor: none !important;  
		-ms-overflow-style: none;  /* IE */
		scroll-behavior: auto !important;
		
		/* #ifdef H5 */
		// height: calc(100vh - 44px);
		// height: calc(100vh - 240rpx) !important;
		height: calc(100vh - 240rpx - constant(safe-area-inset-bottom)) !important;
		height: calc(100vh - 240rpx - env(safe-area-inset-bottom)) !important;
		// height: calc(100vh - 240rpx);
		/* #endif */
		/* #ifndef H5 */
		height: 100vh;
		/* #endif */
		background: #eee;
		box-sizing: border-box;
		-webkit-overflow-scrolling: touch; /* 增加iOS适配 */
	}

	.message {
		display: flex;
		align-items: flex-start;
		margin-bottom: 30rpx;

		.avatar {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			margin-right: 30rpx;
		}

		.content {
			min-height: 80rpx;
			max-width: 60vw;
			box-sizing: border-box;
			font-size: 28rpx;
			line-height: 1.3;
			padding: 20rpx;
			border-radius: 10rpx;
			background: #fff;

			image {
				width: 200rpx;
			}
		}

		&.self {
			justify-content: flex-end;

			.avatar {
				margin: 0 0 0 30rpx;
			}

			.content {
				position: relative;

				&::after {
					position: absolute;
					content: '';
					width: 0;
					height: 0;
					border: 16rpx solid transparent;
					border-left: 16rpx solid #fff;
					right: -28rpx;
					top: 24rpx;
				}
			}
		}

		&.friend {
			.content {
				position: relative;

				&::after {
					position: absolute;
					content: '';
					width: 0;
					height: 0;
					border: 16rpx solid transparent;
					border-right: 16rpx solid #fff;
					left: -28rpx;
					top: 24rpx;
				}
			}
		}
	}

	.tool {
		position: fixed;
		width: 100%;
		min-height: 120rpx;
		left: 0;
		bottom: 0;
		background: #fff;
		display: flex;
		align-items: flex-start;
		box-sizing: border-box;
		padding: 20rpx 24rpx 20rpx 40rpx;
		padding-bottom: calc(20rpx + constant(safe-area-inset-bottom)/2) !important;
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom)/2) !important;
		.left-icon {
			width: 56rpx;
			height: 56rpx;
			margin-right: 10rpx;
		}

		.input,
		.voice-crl {
			background: #eee;
			border-radius: 10rpx;
			height: 70rpx;
			// margin-right: 30rpx;
			flex: 1;
			padding: 0 20rpx;
			box-sizing: border-box;
			font-size: 28rpx;
		}

		.thumb {
			// width: 64rpx;
			text-align: center;        /* 水平居中 */
			display: flex;             /* 以下三行实现垂直居中 */
			align-items: center;
			justify-content: center;
			height: 64rpx;
		}

		.voice-crl {
			text-align: center;
			line-height: 70rpx;
			font-weight: bold;
		}
		
		.plus-img {
			margin: auto; 
			
			/* #ifdef H5 */
			padding-bottom: 7px;
			/* #endif */
		}
	}

	.audio-animation {
		position: fixed;
		// width: 100vw;
		// height: 100vh;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		z-index: 202410;
		display: flex;
		justify-content: center;
		align-items: center;
		
		.text {
			text-align: center;
			font-size: 28rpx;
			color: #333;
			margin-top: 60rpx;
		}

		.audio-wave {
			padding: 50rpx;

			.audio-wave-text {
				background-color: blue;
				width: 7rpx;
				height: 12rpx;
				margin: 0 6rpx;
				border-radius: 5rpx;
				display: inline-block;
				border: none;
				animation: wave 0.25s ease-in-out;
				animation-iteration-count: infinite;
				animation-direction: alternate;
			}

			/*  声波动画  */
			@keyframes wave {
				from {
					transform: scaleY(1);
				}

				to {
					transform: scaleY(4);
				}
			}
		}
	}
	
	.uni-icons{
		
	}
</style>