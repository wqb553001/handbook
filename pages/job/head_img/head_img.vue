<template>
  <view class="container">
    <view class="avatar-row">
      <view v-for="(item, index) in avatars" :key="index" class="avatar-container" @click="selectAvatar(index)" >
        <u-avatar :src="item.url" size="120" :class="{'selected': selectedIndex === index}" />
        <u-icon v-if="selectedIndex === index" name="checkmark-circle-fill" color="#06A88B" class="selected-icon" />
      </view>
      
      <view class="avatar-container" >
		<view v-if="customAvatar" @click="selectCustom">
			<u-avatar :src="imageViewSrc" size="120" :class="{'selected': isCustomSelected}" />
			<!-- <u-avatar size="120" :class="{'selected': isCustomSelected}" >
				<image class="uni-corpper-content-image" :src="imageViewSrc" mode="aspectFit" ></image>
			</u-avatar> -->
			<view style="display: flex;" @click="openUploadOptions">
				<u-icon v-if="isCustomSelected" name="checkmark-circle-fill" color="#06A88B" class="selected-icon" />
				<u-icon name="edit-pen-fill" color="#06A88B" class="edit-icon" />
			</view>
			
		</view>
		<view v-else>
			<view class="custom-avatar" @click="openUploadOptions">
				<text class="plus-icon">+</text>
			</view>
		</view>
      </view>
	  
    </view>

    <u-action-sheet
      :actions="uploadActions"
      :show="showUploadSheet"
      @select="handleUploadSelect"
      @close="showUploadSheet = false"
    />

    <view class="confirm-btn">
      <u-button 
        text="确定" 
        color="#48A48B"
        @click="confirmSelection"
      />
    </view>
  </view>
</template>

<script>
	
const SYS_ID = 2025040301;
const JOB_TOKEN = 'JOB_TOKEN';
const HEAD_IMG_CUT_EVENT = 'headImgCutEvent';
export default {
  data() {
    return {
	  userId: 0,
	  afterUrl: '', 
      avatars: [
        { url: '/static/avatars/default1.png' },
        { url: '/static/avatars/default2.png' }
      ],
      selectedIndex: 0,			// 所选照片索引（-1,0,1）：默认0选中第一张图片；0,1：为预提供图片的索引；-1：为用户自定义图片
      showUploadSheet: false,  	// 弹出 选项
	  isCustomSelected: false,	// 是否选中新上传照片
      uploadActions: [
        { index: 0, name: '从相册选择' },
        { index: 1, name: '拍照' }
      ],
      customAvatar: '',
	  imageViewSrc:	'',
	  timeoutId: null,
    }
  },
  onUnload() {
	uni.$off(HEAD_IMG_CUT_EVENT, this.headImgCutHandler); // 移除监听
	if (this.timeoutId) clearTimeout(this.timeoutId); // 清除定时器
  },
  onLoad(options) {
	const _this = this
	uni.getStorage({
		key: JOB_TOKEN,
		success: function(resp){
			_this.userToken = resp.data
			// console.log("缓存取值："+ JSON.stringify(_this.userToken))
		},
		fail:function(){
		}
	});
	this.userId = options.userId;
	this.afterUrl = options.afterUrl;
	if(options.headPath) this.avatars[0].url = options.headPath;
	console.log("获取参数："+ JSON.stringify(options))
	// 监听全局事件（获取选择的地址）
	uni.$on(HEAD_IMG_CUT_EVENT, this.headImgCutHandler);
  },
  methods: {
	headImgCutHandler(data) {
		console.log("收到全局事件", data);
		this.customAvatar = data.avatar;
		this.selectedIndex = -1;
		this.isCustomSelected = true;
		this.imageViewSrc = data.avatar; // 直接使用临时路径，无需转换
		// this.acceptImg(data.avatar)
	},
    selectAvatar(index) {// 选中 任一预设图片
      this.selectedIndex = index;
	  this.isCustomSelected = false;
    },
	selectCustom(){
      this.selectedIndex = -1;
	  this.isCustomSelected = true;
	},
	edit(){
		uni.showToast({ title: '编辑图片' })
	},
    openUploadOptions() {
      this.showUploadSheet = true;  // 弹出 选项
    },
    async handleUploadSelect(e) {
      try {
		// album：从相册选；camera：拍照
        const sourceType = e.index === 0 ? ['album'] : ['camera']
        const res = await uni.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: sourceType
        });
		const filePath = res.tempFilePaths[0];
        uni.navigateTo({
          url: '/pages/job/head_img/head_img_edit?userId='+this.userId+'&src=' + filePath
        })
      } catch (error) {
        console.log('上传取消:', error)
      }
    },
	
	async acceptImg(imgBlob){
		console.log("转化地址：" + this.customAvatar)
		this.imageViewSrc = await this.blobToBase64(imgBlob)
		console.log("Base64识别地址：" + this.imageViewSrc)
	},
	
    async confirmSelection() {
		if(this.selectedIndex !== -1){
			// 选用预提供头像
			this.updateData(this.avatars[this.selectedIndex].url);
			// 返回上一页
			uni.navigateBack(); // 返回上一页
			return 
		}
		// 使用自定义头像
		await this.uploadImg();
		this.updateData(this.customAvatar)
		// 返回上一页
		uni.navigateBack(); // 返回上一页
    },
	
	async updateData(imgPath){
		// TODO: 保存选中头像逻辑
		var saveData = {sysId: SYS_ID, selfId: this.userToken.userId, token: this.userToken.token, userId: this.userId, headImgPath: imgPath}
		const result = await uni.request({
			url: process.env.UNI_BASE_URL + '/api/job/updateUser',
			header: { 'Content-Type': 'application/json' },
			method: 'POST',
			data: JSON.stringify(saveData)
		});
		// console.log("result", JSON.stringify(result))
		if(result.data.code == 0){
			uni.showToast({ title: '头像设置成功' });
			this.timeoutId = setTimeout(() => {
			  if(!this.afterUrl) uni.navigateBack(); // 返回上一页(默认返回 调用页)
			  // console.log("跳转地址："+this.afterUrl)
			  uni.navigateTo({
				url: `${this.afterUrl}`
			  });
			}, 1000); // 3000毫秒等于3秒
			
		}else{
			uni.showToast({ title: '未成功设置头像，请后续重试！' });
		}
	},
	async uploadImg(){
		try {
			// 2. 获取后端颁发的上传凭证
			const tokenRes = await uni.request({
				url: process.env.UNI_BASE_URL + '/api/uploadBefore',
				method: 'GET',
				data: {
					sysId: SYS_ID,
					key: 'jobUserId='+this.userId
				}
			}).catch(err=>{
				uni.showToast({ title: '未能取得 上传凭证，请联系管理员！', icon: 'none' });
				throw err; // 可选择抛出错误或返回默认值
			});
			console.log("getToken 返回值："+ JSON.stringify(tokenRes))
			
			// 3. 生成唯一文件名（按需）
			const fileName = `job/headImg/${this.userId}_${Date.now()}_${Math.random().toString(36).substr(2)}.jpg`;
			console.log("图片上传-URL: " + process.env.UNI_QINIUP_URL)
			// 4. 执行上传
			const uploadRes = await uni.uploadFile({
			  url: process.env.UNI_QINIUP_URL, // 'http://up-z2.qiniup.com', // 根据存储区域选择上传域名
			  filePath: this.customAvatar,
			  name: 'file',
			  formData: {
				token: tokenRes.data.upToken,
				key: fileName // 非必须，不传时七牛云自动生成文件名
			  }
			});
			console.log("上传成功，返回值："+ JSON.stringify(uploadRes))
			
			// 5. 处理响应结果
			if (uploadRes.statusCode === 200) {
			  const resData = JSON.parse(uploadRes.data);
			  this.customAvatar = process.env.UNI_CDN + `${resData.key}`;
			  uni.showToast({ title: '上传成功' });
			}
			
			console.log("保存图片："+this.customAvatar)
			
		} catch (err) {
			uni.showToast({ title: '上传失败', icon: 'none' });
			console.error('上传错误:', err);
		}
		return this
	},
	// Blob转Base64方法
	async blobToBase64(blobUrl) {
	  const response = await fetch(blobUrl);
	  const blob = await response.blob();
	  return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result);
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	  });
	},
	
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 40rpx;

  .avatar-row {
    display: flex;
    justify-content: space-around;
    margin: 60rpx 0;
  }

  .avatar-container {
    position: relative;
    .selected {
      border: 4rpx solid #06A88B;
      border-radius: 50%;
    }
    .selected-icon {
   //    position: absolute;
   //    right: -10rpx;
   //    top: -10rpx;
	  // left: 50%;
	  // z-index: 2;
	    display: flex;
	    flex-direction: row;
	    justify-content: center;
	    align-items: center;
	    width: 100%;
    }
  }

  .custom-avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    .plus-icon {
      font-size: 48rpx;
      color: #666;
    }
  }

  .confirm-btn {
    position: fixed;
    bottom: 80rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
  }
  
  .edit-icon {
    position: absolute;
    right: -10rpx;
    bottom: -10rpx;
    background: white;
    border-radius: 50%;
    padding: 4rpx;
	z-index: 2;
  }
}
</style>
