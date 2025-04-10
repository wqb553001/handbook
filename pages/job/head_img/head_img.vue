<template>
  <view class="container">
    <view class="avatar-row">
      <view v-for="(item, index) in avatars" :key="index" class="avatar-container" @click="selectAvatar(index)" >
        <u-avatar :src="item.url" size="120" :class="{'selected': selectedIndex === index}" />
        <u-icon v-if="selectedIndex === index" name="checkmark-circle-fill" color="#06A88B" class="selected-icon" />
      </view>
      
      <view class="avatar-container" >
		<view v-if="customAvatar" @click="selectCustom">
			<u-avatar :src="customAvatar" size="120" :class="{'selected': isCustomSelected}" />
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
export default {
  data() {
    return {
	  userId: 0,
      avatars: [
        { url: '/static/avatars/default1.png' },
        { url: '/static/avatars/default2.png' }
      ],
      selectedIndex: 0,		// 默认选中第一个
      showUploadSheet: false,
	  isCustomSelected: false,
      uploadActions: [
        { name: '从相册选择' },
        { name: '拍照' }
      ],
      customAvatar: '',
    }
  },
  onUnload() {
	uni.$off('headImgCut'); // 移除监听
  },
  onLoad(options) {
	this.userId = options.userId;
	// 监听全局事件（获取选择的地址）
	uni.$on('headImgCut', (data) => {
		console.log("收到全局事件", data); // 添加调试日志
		this.customAvatar = data.avatar;
		this.selectedIndex = -1;
		this.isCustomSelected = true;
		console.log("转化地址：" + this.customAvatar)
	});
  },
  methods: {
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
      this.showUploadSheet = true
    },
    async handleUploadSelect(index) {
      try {
        const sourceType = index === 0 ? ['album'] : ['camera']
        const res = await uni.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: sourceType
        })
        uni.navigateTo({
          url: '/pages/job/head_img/head_img_edit?userId='+this.userId+'&src=' + res.tempFilePaths[0]
        })
      } catch (error) {
        console.log('上传取消:', error)
      }
    },
    async confirmSelection() {
      const selectedAvatar = this.selectedIndex !== -1 
        ? this.avatars[this.selectedIndex].url
        : this.customAvatar;
      // TODO: 保存选中头像逻辑
	    var saveData = {userId: this.userId, headImgPath: selectedAvatar}
		
	  	const result = await uni.request({
	  		// url: this.$config.baseUrl + '/api/job/saveUser',
	  		url: 'http://localhost:18281/api/job/updateUser',
	  		header: { 'Content-Type': 'application/json' },
	  		method: 'POST',
	  		data: JSON.stringify(saveData)
	  	});
	  	console.log("result", JSON.stringify(result))
		if(result.data.code == 0){
			uni.showToast({ title: '头像设置成功' });
			uni.navigateBack(); // 返回上一页
		}else{
			uni.showToast({ title: '未成功设置头像，请后续重试！' });
		}
      
    }
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
