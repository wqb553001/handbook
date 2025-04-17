<template>
	<view class="uni-content-info">
		<view class='cropper-content'>
			<view v-if="showImage" class="uni-corpper">
				<view class="uni-corpper-content">
					<image class="uni-corpper-content-image" :src="imageSrc" mode="aspectFit" :style="'transform:rotate('+rotateAll + 'deg) rotateY('+rotateY + 'deg) rotateX('+rotateX + 'deg)'" ></image>
					<view class="uni-corpper-crop-box" @touchstart.stop="contentStartMove" @touchmove.stop="contentMoveing" @touchend.stop="contentTouchEnd"
							:style="'left:'+cutL+'rpx;top:'+cutT+'rpx;right:'+cutR+'rpx;bottom:'+cutB+'rpx;borderRadius:50%;' ">
						<view class="uni-cropper-view-box">
							<view class="uni-cropper-dashed-h"></view>
							<view class="uni-cropper-dashed-v"></view>
							<view class="uni-cropper-line-t" data-drag="top" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view>
							<view class="uni-cropper-line-r" data-drag="right" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view>
							<view class="uni-cropper-line-b" data-drag="bottom" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view>
							<view class="uni-cropper-line-l" data-drag="left" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view>
							<view class="uni-cropper-point point-t" data-drag="top" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view>
							<view class="uni-cropper-point point-tr" data-drag="topTight"></view>
							<view class="uni-cropper-point point-r" data-drag="right" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view>
							<view class="uni-cropper-point point-rb" data-drag="rightBottom" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view>
							<view class="uni-cropper-point point-b" data-drag="bottom" @touchstart.stop="dragStart" @touchmove.stop="dragMove" @touchend.stop="dragEnd"></view>
							<view class="uni-cropper-point point-bl" data-drag="bottomLeft"></view>
							<view class="uni-cropper-point point-l" data-drag="left" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view>
							<view class="uni-cropper-point point-lt" data-drag="leftTop"></view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class='cropper-operate'>
<!-- 			<view class="cropper-operate-button cropper-operate-button-upload" @click="getImage">
				<uni-icons type="upload" size="20"></uni-icons>选择
			</view> -->
			<view class="cropper-operate-button cropper-operate-button-reset" @click="refresh">
				<uni-icons type="loop" size="20"></uni-icons>重置
			</view>
			<view class="cropper-operate-button cropper-operate-button-reset" @click="rotateTopButtom">
				<uni-icons type="left" size="20"></uni-icons>侧翻
			</view>
			<view class="cropper-operate-button cropper-operate-button-reset" @click="rotateLeftRight">
				<uni-icons type="top" size="20"></uni-icons>倒置
			</view>
			<view class="cropper-operate-button cropper-operate-button-reset" @click="rotateRightValue(0)">
				<uni-icons type="map-pin-ellipse" size="20"></uni-icons>弃旋
			</view>
			<!-- <view class="cropper-operate-button cropper-operate-button-reset" @click="cutImg">
				<uni-icons type="smallcicle" size="20"></uni-icons>剪切
			</view> -->
			<view style="display: flex;">
				<view class="cropper-operate-button cropper-operate-button-rotate" @click="changeScale(-30)">
					<!-- <uni-icons type="minus" size="20"></uni-icons> -->
					-30
				</view>
				<view class="cropper-operate-button cropper-operate-button-rotate" @click="changeScale(-3)">
					<!-- <uni-icons type="minus" size="20"></uni-icons> -->
					-3
				</view>
				<view class="cropper-operate-button cropper-operate-button-rotate" @click="changeScale(-1)">
					<!-- <uni-icons type="minus" size="20"></uni-icons> -->
					-1
				</view>
				<view class="cropper-operate-button cropper-operate-button-rotate" @click="changeScale(1)">
					<!-- <uni-icons type="plus" size="20"></uni-icons> -->
					+1
				</view>
				<view class="cropper-operate-button cropper-operate-button-rotate" @click="changeScale(3)">
					<!-- <uni-icons type="plus" size="20"></uni-icons> -->
					+3
				</view>
				<view class="cropper-operate-button cropper-operate-button-rotate" @click="changeScale(30)">
					<!-- <uni-icons type="plus" size="20"></uni-icons> -->
					+30
				</view>
			</view>
			
			<view v-if="imageViewSrc">
				<view style="display: block;" class="uni-padding-wrap">
					<slider @changing="durationChange" :value="duration" show-value  min="-180" max="180" />
				</view>
			</view>
		</view>
		<view class='cropper-image' v-if="imageViewSrc">
			<image mode="aspectFit" class='cropper-image-image' :src="imageViewSrc"></image>
		</view>
		<view class='cropper-config'>
			<button class="cropper-config-button" type="warn" @click="saveImageInfo"> 提交 </button>
		</view>
		<canvas class="cropper-canvas" canvas-id="imageCanvas"></canvas>
	</view>
</template>

<script>
	import {requestSync} from "@/common/js/util.js"
  
  // 获取手机信息
	let sysInfo = uni.getSystemInfoSync()
	let SCREEN_WIDTH = sysInfo.screenWidth
	let PAGE_X, // 手按下的x位置
		PAGE_Y, // 手按下y的位置 
		T_PAGE_X, // 手移动的时候x的位置
		T_PAGE_Y, // 手移动的时候Y的位置
		CUT_L, // 初始化拖拽元素的left值
		CUT_T, // 初始化拖拽元素的top值
		CUT_R, // 初始化拖拽元素的
		CUT_B, // 初始化拖拽元素的
		IMG_RATIO, // 图片宽高比例
		IMG_REAL_W, // 图片实际的宽度
		IMG_REAL_H, // 图片实际的高度
		DRAFG_MOVE_RATIO = 1 //移动时候的比例,

	export default {
		name: 'yuanleiImageCut',
		props:{
			avatar:{
				type: String
			}
		},
		data() {
			return {
				userId: 0,
				showImage: false,
				
				imageSrc: "",
				imageViewSrc: "",
				
				// 裁剪框 边距
				cutL: 150,
				cutT: 150,
				cutB: 150,
				cutR: 150,
				
				offsetX: 0, // 水平偏移量（rpx）
				offsetY: 0, // 垂直偏移量（rpx）
				
				rotateX: 0, // 垂直翻转角度
				rotateY: 0, // 水平翻转角度
				rotateAll: 0, // 旋转角度
				
				scaleTate: 1, // 图片缩放率
				rotateAngle: 0,	// 旋转角度
				duration: 0,
				
				// scale: 1,      		// 新增缩放比例
				minScale: 0.5,  	// 最小缩放比例
				maxScale: 3,     	// 最大缩放比例
				
				initialDistance: null,  // 初始双指距离
				initialScale: 1,        // 初始缩放值
			}
		},
		async onLoad(options) {
			this.userId = options.userId
	        // 先转换blob:为base64
	        if (options.src.startsWith('blob:')) {
	          this.imageSrc = await this.blobToBase64(options.src);
	        } else {
	          this.imageSrc = options.src;
	        }
			this.loadImage();
			console.log("接收传递参数：", JSON.stringify(options))
		},
		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady() {
		},
		created() {
			this.imageSrc = this.avatar
			this.loadImage();
		},
		methods: {
			
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
			setData(obj) {
				Object.keys(obj).forEach((key) => {
					this.$set(this.$data, key, obj[key])
				})
			},
			// getImage() {
			// 	uni.chooseImage({
			// 		success: (res)=> {
			// 			this.setData({
			// 				imageSrc: res.tempFilePaths[0],
			// 			})
			// 			this.loadImage()
			// 		},
			// 	})
			// },
			loadImage() {
				uni.getImageInfo({
					src: this.imageSrc,
					success: (res) => {
						IMG_RATIO = res.width / res.height
						let scaleTate = 1;
						if (IMG_RATIO >= 1) {
							IMG_REAL_W = SCREEN_WIDTH
							IMG_REAL_H = SCREEN_WIDTH / IMG_RATIO
							scaleTate = res.width / SCREEN_WIDTH
						} else {
							IMG_REAL_W = SCREEN_WIDTH * IMG_RATIO
							IMG_REAL_H = SCREEN_WIDTH
							scaleTate = res.height / SCREEN_WIDTH
						}
						this.setData({
							showImage: true,
							rotateY: 0,
							rotateX: 0,
							rotateAll: 0,
							scaleTate: scaleTate > 1 ? scaleTate : 1
						})
						
						// #ifdef MP-WEIXIN
						this.setData({
							imageSrc: res.path,
						})
						// #endif
						
						uni.hideLoading()
						this.getImageInfo()
					}
				})
			},
			changeScale(num){
				// let newScale = this.scaleTate + (num/100);
				// newScale = Math.max(this.minScale, Math.min(newScale, this.maxScale));
				// this.setData({ scaleTate: newScale });
				// this.getImageInfo();
				
				let newL = 0
				let newR = 0
				let newT = 0
				let newB = 0
				if(this.cutL - num > 0){
					newL = this.cutL - num
				}
				if(this.cutR - num > 0){
					newR = this.cutR - num
				}
				if(newL + newR >= 750){
					newL = this.cutL
					newR = this.cutR
				}
				
				if(this.cutT - num > 0){
					newT = this.cutT - num
				}
				if(this.cutB - num > 0){
					newB = this.cutB - num
				}
				if(newT + newB >= 750){
					newT = this.cutT
					newB = this.cutB
				}
				
				this.setData({
					cutL: newL,
					cutT: newT,
					cutR: newR,
					cutB: newB
				})
				this.getImageInfo()
			},
			// 旋转按钮
			durationChange(e) {
				console.log('滑动选项 发生变化：' + e.detail.value)
				this.duration = e.detail.value
				this.rotateRightValue(this.duration)
			},
			rotateRightNum(e){
				let num = Number(e.detail.value) // 确保转为数字类型
				if (isNaN(num)) {
				  uni.showToast({ title: '请输入有效数字', icon: 'none' })
				  return
				}
				this.setData({ rotateAngle: num }) // 直接设置角度
				this.rotateValue(num) // 调用旋转方法
				// this.rotateRight(this.rotateAngle);
				// console.log("输入变更值:"+num)
			},
			rotateRightValue(num){
				if (isNaN(num)) {
				  uni.showToast({ title: '请输入有效数字', icon: 'none' })
				  return
				}
				this.setData({ rotateAngle: num }); // 直接设置角度
				this.rotateValue(num); // 调用旋转方法
				this.duration = num;
			},
			  
		    // 工具函数：节流实现
		    _throttle(func, delay) {
			  let lastExec = 0;
			  return function(...args) {
			    const now = Date.now();
			    if (now - lastExec >= delay) {
			  	func.apply(this, args);
			  	lastExec = now;
			    }
			  };
		    },
			rotateRight(num){
				let rotate = (this.rotateAll + num) % 360
				if(rotate < 0){
					rotate += 360
				}
				this.setData({
					rotateAll: rotate,
					rotateAngle: rotate // 同步输入框显示值
				})
				this.getImageInfo()
				
				console.log('向右转：' + rotate, '°')
			},
			rotateValue(num){
				let rotate = (num+360) % 360
				// if(rotate < 0){
				// 	rotate += 360
				// }
				this.setData({
					rotateAll: rotate,
					rotateAngle: rotate // 同步输入框显示值
				})
				this.getImageInfo()
				
				// console.log('向右转：' + rotate, '°')
			},
			refresh(){
				this.setData({
					offsetX: 0,
					offsetY: 0,
					cutL: 150,
					cutT: 150,
					cutR: 150,
					cutB: 150,
					rotateY: 0,
					rotateX: 0,
					rotateAll: 0
				})
				this.getImageInfo()
			},
			rotateTopButtom(){
				this.setData({
					rotateY: 180 - this.rotateY
				})
				this.getImageInfo()
			},
			rotateLeftRight(){
				this.setData({
					rotateX: 180 - this.rotateX
				})
				this.getImageInfo()
			},
			cutImg(){
			},
		
			// 获取图片
			getImageInfo(isCut=false) {
			  try {
				// 将图片写入画布
				let ctx = uni.createCanvasContext('imageCanvas', this);
				// 清除内容
				ctx.clearRect(0, 0, this.rpxToPx(750), this.rpxToPx(750));
				
				let centerX, centerY, radius;
				if(isCut){
					// 新增：创建圆形裁剪路径
					centerX = this.rpxToPx(375) + this.rpxToPx(this.offsetX); 	// 圆心x坐标（750rpx宽度的一半）
					centerY = this.rpxToPx(375) + this.rpxToPx(this.offsetY); 	// 圆心y坐标
					radius  = this.rpxToPx(375 - Math.max(this.cutL, this.cutR));	// 计算圆形半径
					
					// 开始创建裁剪路径
					ctx.beginPath()
					ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
					ctx.closePath()
					ctx.clip() // 应用裁剪路径
				}
				
				// 重置旋转内容
				ctx.setTransform(1, 0, 0, 1, 0, 0)
				// 操作点，旋转，翻转，恢复操作点
				ctx.translate(this.rpxToPx(375), this.rpxToPx(375))
				ctx.rotate(this.rotateAll * Math.PI / 180)
				if(this.rotateY == 180 && this.rotateX == 180){
					ctx.scale(-1, -1)
				}else	if(this.rotateY == 180){
					ctx.scale(-1, 1)
				}else	if(this.rotateX == 180){
					ctx.scale(1, -1)
				}
				ctx.translate(this.rpxToPx(-375), this.rpxToPx(-375))
				// 设置canvas背景色
				// ctx.fillStyle = 'black';
				// ctx.fillRect(0, 0, this.rpxToPx(750), this.rpxToPx(750))
				
				if(isCut){
					// 剪切前-绘制图片（居中 + 偏移补偿）
					ctx.drawImage(
					  this.imageSrc,
					  (this.rpxToPx(750) - IMG_REAL_W) / 2 - this.rpxToPx(this.offsetX),
					  (this.rpxToPx(750) - IMG_REAL_H) / 2 - this.rpxToPx(this.offsetY),
					  IMG_REAL_W,
					  IMG_REAL_H
					);
					  
					//剪切-全尺寸导出
					ctx.draw(true, () => {
					  uni.canvasToTempFilePath({
					    x: centerX - radius,
					    y: centerY - radius,
					    width: radius * 2,
					    height: radius * 2,
					    destWidth: 500, // 设置输出尺寸
					    destHeight: 500,
					    fileType: 'jpg',
					    quality: 0.9,
					    canvasId: 'imageCanvas',
					    success: (res) => {
					      this.setData({ imageViewSrc: res.tempFilePath })
					    }
					  }, this);
					});
				}else{
					// 非剪切-绘制图片（居中）
					ctx.drawImage(this.imageSrc, IMG_RATIO>=1?0:(IMG_REAL_H-IMG_REAL_W)/2, IMG_RATIO<=1?0:(IMG_REAL_W-IMG_REAL_H)/2, IMG_REAL_W, IMG_REAL_H)
					
					ctx.draw(true, () => {
						uni.canvasToTempFilePath({
							x: this.rpxToPx(this.cutL),
							y: this.rpxToPx(this.cutT),
							width: this.rpxToPx(750 - this.cutL - this.cutR),
							height: this.rpxToPx(750 - this.cutT - this.cutB),
							destWidth: this.rpxToPx(750 - this.cutL - this.cutR) * this.scaleTate,
							destHeight: this.rpxToPx(750 - this.cutT - this.cutB) * this.scaleTate,
							quality: 1,
							canvasId: 'imageCanvas',
							success: (res)=> {
								this.setData({
									imageViewSrc: res.tempFilePath
								})
							},
							fail: (err)=> {
								console.log(err)
							}
						}, this);
					});
				}
			  } catch (err) {
			    uni.showToast({ title: '图片处理失败', icon: 'none' });
				throw err;
			  }
			},
			
			// rpx转px
			rpxToPx(i){
				return SCREEN_WIDTH * i / 750
			},
			
			// 拖动时候触发的touchStart事件
			contentStartMove(e) {
				PAGE_X = e.touches[0].pageX
				PAGE_Y = e.touches[0].pageY
			},
			// 拖动时候触发的touchMove事件
			contentMoveing(e) {
				let dragLengthX = (PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
				let dragLengthY = (PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
				// 左移
				if (dragLengthX > 0) {
					if (this.cutL - dragLengthX < 0) dragLengthX = this.cutL
				} else {
					if (this.cutR + dragLengthX < 0) dragLengthX = -this.cutR
				}

				if (dragLengthY > 0) {
					if (this.cutT - dragLengthY < 0) dragLengthY = this.cutT
				} else {
					if (this.cutB + dragLengthY < 0) dragLengthY = -this.cutB
				}
				this.setData({
					cutL: this.cutL - dragLengthX,
					cutT: this.cutT - dragLengthY,
					cutR: this.cutR + dragLengthX,
					cutB: this.cutB + dragLengthY
				})
				
				// 更新偏移量（限制在画布范围内）
				this.offsetX = Math.max(-this.cutL, Math.min(dragLengthX, this.cutR));
				this.offsetY = Math.max(-this.cutT, Math.min(dragLengthY, this.cutB));
				
				PAGE_X = e.touches[0].pageX
				PAGE_Y = e.touches[0].pageY
			},
			contentTouchEnd() {
				this.getImageInfo();
			},
			// 设置大小的时候触发的touchStart事件
			dragStart(e) {
				T_PAGE_X = e.touches[0].pageX
				T_PAGE_Y = e.touches[0].pageY
				CUT_L = this.cutL
				CUT_R = this.cutR
				CUT_B = this.cutB
				CUT_T = this.cutT
			},
			// 设置大小的时候触发的touchMove事件
			dragMove(e) {
				const dragType = e.target.dataset.drag;
				// 计算新的裁剪框大小（保持圆形）
				const newSize = Math.min(
				  750 - this.cutL - this.cutR,
				  750 - this.cutT - this.cutB
				);
				
				// 统一设置四个边距以实现圆形
				this.setData({
				  cutL: (750 - newSize) / 2,
				  cutR: (750 - newSize) / 2,
				  cutT: (750 - newSize) / 2,
				  cutB: (750 - newSize) / 2
				});
				// let dragType = e.target.dataset.drag
				// switch (dragType) {
				// 	case 'right':
				// 		let dragLengthR = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
				// 		if (CUT_R + dragLengthR < 0) dragLengthR = -CUT_R
				// 		this.setData({
				// 			cutR: CUT_R + dragLengthR
				// 		})
				// 		break
				// 	case 'left':
				// 		let dragLengthL = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
				// 		if (CUT_L - dragLengthL < 0) dragLengthL = CUT_L
				// 		if ((CUT_L - dragLengthL) > (SCREEN_WIDTH - this.cutR)) dragLengthL = CUT_L - (SCREEN_WIDTH - this.cutR)
				// 		this.setData({
				// 			cutL: CUT_L - dragLengthL
				// 		})
				// 		break
				// 	case 'top':
				// 		let dragLengthT = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
				// 		if (CUT_T - dragLengthT < 0) dragLengthT = CUT_T
				// 		if ((CUT_T - dragLengthT) > (SCREEN_WIDTH - this.cutB)) dragLengthT = CUT_T - (SCREEN_WIDTH - this.cutB)
				// 		this.setData({
				// 			cutT: CUT_T - dragLengthT
				// 		})
				// 		break
				// 	case 'bottom':
				// 		let dragLengthB = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
				// 		if (CUT_B + dragLengthB < 0) dragLengthB = -CUT_B
				// 		this.setData({
				// 			cutB: CUT_B + dragLengthB
				// 		})
				// 		break
				// 	case 'rightBottom':
				// 		let dragLengthRBX = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
				// 		let dragLengthRBY = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO

				// 		if (CUT_B + dragLengthRBY < 0) dragLengthRBY = -CUT_B
				// 		if (CUT_R + dragLengthRBX < 0) dragLengthRBX = -CUT_R
				// 		let cutB = CUT_B + dragLengthRBY
				// 		let cutR = CUT_R + dragLengthRBX

				// 		this.setData({
				// 			cutB: cutB,
				// 			cutR: cutR
				// 		})
				// 		break
				// 	default:
				// 		break
				// }
			},
			dragEnd(){
				this.getImageInfo();
			},
			async saveImageInfo(){
				try {
					// 1. 裁剪图片
					this.getImageInfo(true);
					
					// 2. 获取后端颁发的上传凭证
					const tokenRes = await uni.request({
						url: process.env.UNI_BASE_URL + '/api/uploadBefore',
						// url: 'http://localhost:18281/api/uploadBefore',
						// url: 'http://xny.world:18281/api/uploadBefore',
						method: 'GET',
						data: {
							sysId: 2025040301,
							key: 'jobUserId='+this.userId
						}
					}).catch(err=>{
						uni.showToast({ title: '未能取得 上传凭证，请联系管理员！', icon: 'none' });
						throw err; // 可选择抛出错误或返回默认值
					});
					// console.log("getToken 返回值："+ JSON.stringify(tokenRes))
					
					// 3. 生成唯一文件名（按需）
					const fileName = `job/${this.userId}_${Date.now()}_${Math.random().toString(36).substr(2)}.jpg`;
					
					// 4. 执行上传
					const uploadRes = await uni.uploadFile({
					  url: process.env.UNI_QINIUP_URL, // 'http://up-z2.qiniup.com', // 根据存储区域选择上传域名
					  filePath: this.imageViewSrc,
					  name: 'file',
					  formData: {
						token: tokenRes.data.upToken,
						key: fileName // 非必须，不传时七牛云自动生成文件名
					  }
					});
					// console.log("上传成功，返回值："+ JSON.stringify(uploadRes))
					
					// 5. 处理响应结果
					if (uploadRes.statusCode === 200) {
					  const resData = JSON.parse(uploadRes.data);
					  this.imageViewSrc = process.env.UNI_CDN + `${resData.key}`;
					  uni.showToast({ title: '上传成功' });
					}
					
					// 6. 返回 最新图片地址 到上一页
					uni.$emit('headImgCut', { avatar: this.imageViewSrc })
					// console.log("保存图片："+this.imageViewSrc)
					
					// 7. 返回上一页
					uni.navigateBack(); // 返回上一页
					// uni.navigateBack({
					//   delta: 1 // 返回的层数，默认为1，即返回上一页
					// });
					
				} catch (err) {
					uni.showToast({ title: '上传失败', icon: 'none' });
					console.error('上传错误:', err);
				}
				return this
			},
			
		},
		onUnload() {
		  // this.clearTimer;
		}
	}
</script>

<style scoped>
	.uni-content-info{
		height: 100%;
		overflow-y: auto;
	}
	
	.cropper-content {
		min-height: 750rpx;
		width: 100%;
	}
	.cropper-operate{
		padding: 5rpx 10rpx;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-around;
		align-content: flex-start;
	}
	.cropper-operate-button{
		margin: 5rpx 10rpx;
		margin-top: 10rpx;
		width: 80rpx;
		padding: 10rpx 0;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 10rpx;
		font-size: 14px;
		border: 3rpx solid gray;
	}
	.cropper-operate-button-upload{
		width: 170rpx;
	}
	.cropper-operate-button-reset{
		width: 110rpx;
	}
	.cropper-operate-button-rotate{
		width: 80rpx;
	}
	.cropper-config {
		position: fixed;
		width: 100%;
		bottom: 10rpx;
		padding: 10rpx;
		display: flex;
		justify-content: space-between;
		z-index: 2;
	}
	.cropper-config-button{
		width: 90%;
	}
	.cropper-image{		
		padding: 10rpx 40rpx;
		margin-bottom: 80rpx;
		/* #ifndef H5 */
		margin-bottom: 120rpx;
		/* #endif */
		display: flex;
		justify-content: center;
	}
	.cropper-image-image{
		
		border-radius: 50%;
		width: 400rpx;
		height: 400rpx;
	}
	
	.cropper-canvas{
		position:absolute;
		width: 750rpx;
		height: 750rpx;
		top: -9999rpx;
		left: -9999rpx;
	}

	.uni-corpper {
		position: relative;
		overflow: hidden !important;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
		-webkit-touch-callout: none;
		box-sizing: border-box;
		width: 750rpx;
		height: 750rpx;
		background: #000;
	}

	.uni-corpper-content {
		position: relative;
		width:750rpx;
		height:750rpx;
		left:0rpx;
		top:0rpx
	}

	.uni-corpper-content-image {
		display: block;
		/* width: 100%; */
		min-width: 0 !important;
		max-width: none !important;
		/* height: 100%; */
		min-height: 0 !important;
		max-height: none !important;
		image-orientation: 0deg !important;
		margin: 0 auto;
		width: 750rpx;
		height: 750rpx;
		
		/* 添加以下样式防止滚动穿透 */
		touch-action: none;
		user-select: none;
	}
	/* 移动图片效果 */
	.uni-cropper-drag-box {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		cursor: move;
		background: rgba(0, 0, 0, 0.6);
		z-index: 1;
	}
	/* 内部的信息 */

	.uni-corpper-crop-box {
		/* 圆形裁剪 */
		border-radius: 50%;
		box-shadow: 0 0 0 1500rpx rgba(0, 0, 0, 0.5); /* 增加蒙版效果 */
		border: 2rpx solid #fff; /* 白色圆形边框 */
		  
		position: absolute;
		background: rgba(255, 255, 255, 0.3);
		z-index: 2;
	}

	.uni-corpper-crop-box .uni-cropper-view-box {
		position: relative;
		display: block;
		width: 100%;
		height: 100%;
		overflow: visible;
		/* outline: 1rpx solid #69f; */  /* 矩形边框的颜色 */
		outline-color: rgba(102, 153, 255, .75)
	}
	/* 横向虚线 */

	.uni-cropper-dashed-h {
		position: absolute;
		top: 33.33333333%;
		left: 0;
		width: 100%;
		height: 33.33333333%;
		border-top: 1rpx dashed rgba(255, 255, 255, 0.5);
		border-bottom: 1rpx dashed rgba(255, 255, 255, 0.5);
	}
	/* 纵向虚线 */

	.uni-cropper-dashed-v {
		position: absolute;
		left: 33.33333333%;
		top: 0;
		width: 33.33333333%;
		height: 100%;
		border-left: 1rpx dashed rgba(255, 255, 255, 0.5);
		border-right: 1rpx dashed rgba(255, 255, 255, 0.5);
	}
	/* 四个方向的线  为了之后的拖动事件*/

	.uni-cropper-line-t {
		position: absolute;
		display: block;
		width: 100%;
		background-color: #69f;
		top: 0;
		left: 0;
		height: 1rpx;
		opacity: 0.1;
		cursor: n-resize;
	}

	.uni-cropper-line-t::before {
		content: '';
		position: absolute;
		top: 50%;
		right: 0rpx;
		width: 100%;
		-webkit-transform: translate3d(0, -50%, 0);
		transform: translate3d(0, -50%, 0);
		bottom: 0;
		height: 41rpx;
		background: transparent;
		z-index: 11;
	}

	.uni-cropper-line-r {
		position: absolute;
		display: block;
		background-color: #69f;
		top: 0;
		right: 0rpx;
		width: 1rpx;
		opacity: 0.1;
		height: 100%;
		cursor: e-resize;
	}

	.uni-cropper-line-r::before {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;
		width: 41rpx;
		-webkit-transform: translate3d(-50%, 0, 0);
		transform: translate3d(-50%, 0, 0);
		bottom: 0;
		height: 100%;
		background: transparent;
		z-index: 11;
	}

	.uni-cropper-line-b {
		position: absolute;
		display: block;
		width: 100%;
		background-color: #69f;
		bottom: 0;
		left: 0;
		height: 1rpx;
		opacity: 0.1;
		cursor: s-resize;
	}

	.uni-cropper-line-b::before {
		content: '';
		position: absolute;
		top: 50%;
		right: 0rpx;
		width: 100%;
		-webkit-transform: translate3d(0, -50%, 0);
		transform: translate3d(0, -50%, 0);
		bottom: 0;
		height: 41rpx;
		background: transparent;
		z-index: 11;
	}

	.uni-cropper-line-l {
		position: absolute;
		display: block;
		background-color: #69f;
		top: 0;
		left: 0;
		width: 1rpx;
		opacity: 0.1;
		height: 100%;
		cursor: w-resize;
	}

	.uni-cropper-line-l::before {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;
		width: 41rpx;
		-webkit-transform: translate3d(-50%, 0, 0);
		transform: translate3d(-50%, 0, 0);
		bottom: 0;
		height: 100%;
		background: transparent;
		z-index: 11;
	}

	.uni-cropper-point {
		width: 5rpx;
		height: 5rpx;
		background-color: #69f;
		opacity: .75;
		position: absolute;
		z-index: 3;
	}

	.point-t {
		top: -3rpx;
		left: 50%;
		margin-left: -3rpx;
		cursor: n-resize;
	}

	.point-tr {
		top: -3rpx;
		left: 100%;
		margin-left: -3rpx;
		cursor: n-resize;
	}

	.point-r {
		top: 50%;
		left: 100%;
		margin-left: -3rpx;
		margin-top: -3rpx;
		cursor: n-resize;
	}

	.point-rb {
		left: 100%;
		top: 100%;
		-webkit-transform: translate3d(-50%, -50%, 0);
		transform: translate3d(-50%, -50%, 0);
		cursor: n-resize;
		width: 36rpx;
		height: 36rpx;
		background-color: #69f;
		position: absolute;
		z-index: 1112;
		opacity: 1;
	}

	.point-b {
		left: 50%;
		top: 100%;
		margin-left: -3rpx;
		margin-top: -3rpx;
		cursor: n-resize;
	}

	.point-bl {
		left: 0%;
		top: 100%;
		margin-left: -3rpx;
		margin-top: -3rpx;
		cursor: n-resize;
	}

	.point-l {
		left: 0%;
		top: 50%;
		margin-left: -3rpx;
		margin-top: -3rpx;
		cursor: n-resize;
	}

	.point-lt {
		left: 0%;
		top: 0%;
		margin-left: -3rpx;
		margin-top: -3rpx;
		cursor: n-resize;
	}
	
	/* 角度尺 */
	.uni-padding-wrap {
	    width:550rpx;
	    padding:0 100rpx;
	}
</style>
