<template>
  <view class="container">
    <!-- 使用 uview 图片裁剪组件 -->
    <u-image-cropper
      v-show="imageLoaded"
      ref="uCropper"
      :src="imageSrc"
      :width="cropWidth"
      :height="cropHeight"
      :mode="cropMode"
      @ready="handleReady"
      @cropper="handleCropper"
      class="editor"
    ></u-image-cropper>

    <!-- 加载状态提示 -->
    <u-loading v-if="!imageLoaded" mode="circle" :show="true"></u-loading>

    <!-- 操作工具栏 -->
    <view class="toolbar">
      <u-button 
        @click="rotate(-90)" 
        text="左旋转"
        :disabled="!cropperReady"
      ></u-button>
      <u-button 
        @click="rotate(90)" 
        text="右旋转"
        :disabled="!cropperReady"
      ></u-button>
      <u-button 
        @click="save" 
        text="保存" 
        color="#48A48B"
        :disabled="!cropperReady"
      ></u-button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
		
	  // 修改尺寸单位为px（重要！）
      cropWidth: 300,      // 裁剪框宽度（单位px）
      cropHeight: 300,     // 裁剪框高度
      imageSrc: '',
      imageLoaded: false,
      cropperReady: false,
      cropMode: 'square',  // 裁剪形状：square/circle
      croppedImage: null
    }
  },
  async onLoad(options) {
	  try {
	        // 显示加载状态
	        uni.showLoading({ title: '加载中...', mask: true });
	  
	        // 先转换blob:为base64
	        if (options.src.startsWith('blob:')) {
	          this.imageSrc = await this.blobToBase64(options.src);
	        } else {
	          this.imageSrc = options.src;
	        }
	  
	        // 增加加载延迟测试
	        await new Promise(resolve => setTimeout(resolve, 100));
	        
	        await this.preloadImage(this.imageSrc);
	        this.imageLoaded = true;
	    } catch (e) {
	      this.handleError(e);
	    } finally {
	      uni.hideLoading();
	    }
	  
    // try {
    //   this.imageSrc = options.src;
    //   await this.preloadImage(options.src);
    //   this.imageLoaded = true;
    // } catch (e) {
    //   this.handleError(e);
    // }
	
	    // try {
	    //   // 先转换blob:为base64
	    //   if (options.src.startsWith('blob:')) {
	    //     this.imageSrc = await this.blobToBase64(options.src);
	    //   } else {
	    //     this.imageSrc = options.src;
	    //   }
	      
	    //   await this.preloadImage(this.imageSrc);
	    //   this.imageLoaded = true;
	    // } catch (e) {
	    //   this.handleError(e);
	    // }
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
	  
	  async preloadImage(src) {
	    try {
	      let mimeType = '';
	      
	      // 处理 Blob URL
	      if (src.startsWith('blob:')) {
	        const response = await fetch(src);
	        const blob = await response.blob();
	        mimeType = blob.type;
	        
	        // 验证二进制文件头（更可靠）
	        const buffer = await blob.slice(0, 4).arrayBuffer();
	        const uint8Array = new Uint8Array(buffer);
	        
	        // JPEG 文件头: FF D8 FF
	        // PNG 文件头: 89 50 4E 47
	        const isJPEG = uint8Array[0] === 0xFF && uint8Array[1] === 0xD8;
	        const isPNG = uint8Array[0] === 0x89 && uint8Array[1] === 0x50;
	        
	        if (!isJPEG && !isPNG) {
	          throw { code: 'UNSUPPORTED_FORMAT', message: '实际文件内容非JPG/PNG' };
	        }
	      } 
  
		 //  // 增加blob:协议转换处理
		 //  if (src.startsWith('blob:')) {
			// const response = await fetch(src);
			// const blob = await response.blob();
			// // 转换为base64格式
			// const reader = new FileReader();
			// const base64 = await new Promise((resolve, reject) => {
			//   reader.onload = () => resolve(reader.result);
			//   reader.onerror = reject;
			//   reader.readAsDataURL(blob);
			// });
			// this.imageSrc = base64; // 更新为base64格式
			// src = base64; // 后续校验使用新src
		 //  }
				  
	      // 处理普通 URL 或 Data URL
	      else {
	        mimeType = this.getMimeTypeFromSrc(src);
	      }
	  
	      // 统一验证 MIME 类型
	      const allowedTypes = ['image/jpeg', 'image/png'];
	      if (!allowedTypes.includes(mimeType)) {
	        throw { code: 'UNSUPPORTED_FORMAT', message: `不支持的类型: ${mimeType}` };
	      }
	  
	      // 验证图片可加载性
	      return new Promise((resolve, reject) => {
	        const img = new Image();
	        img.onload = resolve;
	        img.onerror = () => reject({ code: 'PRELOAD_FAILED', message: '图片加载失败' });
	        img.src = src;
	      });
	    } catch (e) {
	      throw e;
	    }
	  },
	  
	  // 从 URL 或 Data URL 中提取 MIME 类型
	  getMimeTypeFromSrc(src) {
	    if (src.startsWith('data:')) {
	      return src.split(';')[0].split(':')[1];
	    }
	    const ext = src.split('.').pop().toLowerCase();
	    const typeMap = {
	      jpg: 'image/jpeg',
	      jpeg: 'image/jpeg',
	      png: 'image/png'
	    };
	    return typeMap[ext] || 'unknown';
	  },
	  
    // // 图片预加载验证
    // async preloadImage(src) {
    //   return new Promise((resolve, reject) => {
    //     const img = new Image();
    //     img.onload = () => {
    //       const validTypes = ['image/jpeg', 'image/png'];
    //       if (!validTypes.includes(this.getImageType(src))) {
    //         reject({ code: 'UNSUPPORTED_FORMAT', message: '仅支持JPG/PNG格式' });
    //       }
    //       resolve();
    //     };
    //     img.onerror = () => reject({ code: 'PRELOAD_FAILED', message: '图片加载失败' });
    //     img.src = src;
    //   });
    // },

    // 获取图片类型
    getImageType(src) {
      if (src.startsWith('data:')) {
        return src.split(';')[0].split(':')[1];
      }
      const ext = src.split('.').pop().toLowerCase();
      return `image/${ext === 'jpg' ? 'jpeg' : ext}`;
    },

    // 裁剪器准备就绪
    handleReady() {
	  console.log('裁剪器已就绪，当前图片:', this.imageSrc);
      this.cropperReady = true;
      // 设置默认裁剪区域
      this.$refs.uCropper.setRectangle({
        x: 50,
        y: 50,
        width: 200,
        height: 200
      });
    },

    // 旋转操作
    rotate(degrees) {
      if (!this.cropperReady) return;
      this.$refs.uCropper.rotate(degrees);
    },

    // 保存裁剪结果
    async save() {
      try {
        const res = await this.$refs.uCropper.getCroppedImage({
          quality: 0.8,
          format: 'jpg'
        });
        
        // 返回上一页并传递结果
        const pages = getCurrentPages();
        const prevPage = pages[pages.length - 2];
        prevPage.$vm.customAvatar = res.tempFilePath;
        uni.navigateBack();
      } catch (e) {
        this.handleError(e);
      }
    },

    // 统一错误处理
    // handleError(e) {
    //   const errorMap = {
    //     'PRELOAD_FAILED': '图片加载失败，请检查文件',
    //     'UNSUPPORTED_FORMAT': '仅支持JPG/PNG格式',
    //     'CROPPER_NOT_READY': '裁剪器未初始化完成'
    //   };
      
    //   uni.showToast({
    //     title: errorMap[e.code] || `操作失败：${e.message}`,
    //     icon: 'none'
    //   });

    //   if (e.code === 'UNSUPPORTED_FORMAT') {
    //     setTimeout(() => uni.navigateBack(), 1500);
    //   }
    // },
	
	
	handleError(e) {
	  const errorMap = {
	    'PRELOAD_FAILED': '图片加载失败，请检查文件是否损坏',
	    'UNSUPPORTED_FORMAT': `文件格式不支持，请上传 JPG/PNG 图片 (错误详情: ${e.message})`,
	    'CROPPER_NOT_READY': '编辑器初始化中，请稍候'
	  };
	
	  uni.showToast({
	    title: errorMap[e.code] || `未知错误: ${e.message}`,
	    icon: 'none',
	    duration: 3000
	  });
	
	  // 非阻塞性错误不自动返回
	  if (e.code === 'UNSUPPORTED_FORMAT') {
	    uni.showModal({
	      title: '格式错误',
	      content: '是否重新选择图片？',
	      success: (res) => {
	        if (res.confirm) {
	          uni.chooseImage({
	            success: (res) => {
	              this.imageSrc = res.tempFilePaths[0];
	              this.retryLoad();
	            }
	          });
	        } else {
	          uni.navigateBack();
	        }
	      }
	    });
	  }
	},
	
	// 重新加载图片
	retryLoad() {
	  this.imageLoaded = false;
	  this.cropperReady = false;
	  this.preloadImage(this.imageSrc)
	    .then(() => {
	      this.imageLoaded = true;
	    })
	    .catch(this.handleError);
	},
	
  }
}
</script>

<style lang="scss" scoped>
	.container {
	  /* 确保容器可见 */
	  position: relative;
	  height: 100vh;
	  background: white;
	
	  .editor {
	    /* 明确尺寸 */
	    width: 100% !important;
	    height: 70vh !important;
	    background: transparent !important;
	  }
	
	  .u-loading {
	    position: absolute;
	    top: 40%;
	    left: 50%;
	    transform: translate(-50%, -50%);
	    z-index: 999;
	  }
	}
	
	
	// .container {
	//   // 增加绝对定位确保容器尺寸 
	//   position: relative;
	//   height: 100vh;
	  
	//   .editor {
	//     // 明确尺寸 
	//     width: 100vw;
	//     height: 70vh;
	//   }
	  
	//   // 修改加载提示样式 
	//   .u-loading {
	//     position: absolute;
	//     top: 40%;
	//     left: 50%;
	//     transform: translate(-50%, -50%);
	//   }
	// }
	
// .container {
//   padding: 20rpx;
//   height: 100vh;
//   display: flex;
//   flex-direction: column;

//   .editor {
//     flex: 1;
//     background: #f5f5f5;
//   }

//   .toolbar {
//     padding: 20rpx 0;
//     display: flex;
//     justify-content: space-around;
//     background: #fff;
//     box-shadow: 0 -2rpx 12rpx rgba(0,0,0,0.1);
//   }
// }

// /* 适配不同屏幕尺寸 */
// @media (min-width: 768px) {
//   .container {
//     max-width: 500px;
//     margin: 0 auto;
//   }
// }


</style>

<!--
<template>
  <view class="container">
    <uni-cropper
      ref="cropper"
      :image="imageSrc"
      :disable-rotate="false"
      @ready="handleReady"
      @error="handleCropperError"
      class="editor"
    />
    
    <view v-if="!cropperReady" class="loading-mask">
      <uni-icons type="spinner-cycle" size="30" color="#4cd964" class="loading-icon"></uni-icons>
      <text class="loading-text">编辑器初始化中...</text>
    </view>

    <view class="toolbar">
      <button 
        :disabled="!cropperReady" 
        @click="rotate(-90)"
        class="btn-rotate"
      >左旋转</button>
      
      <button 
        :disabled="!cropperReady" 
        @click="rotate(90)"
        class="btn-rotate"
      >右旋转</button>
      
      <button 
        :disabled="!cropperReady" 
        @click="save"
        class="btn-save"
      >保存</button>
    </view>
  </view>
</template>

<script>
// 修正后的导入语句
import uniCropper from '@dcloudio/uni-ui/lib/uni-cropper/uni-cropper.vue';
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue';

export default {
  components: { uniCropper, uniIcons },
  data() {
    return {
      imageSrc: '',
      cropperReady: false, // 控制按钮可操作状态
      initFailed: false    // 标记初始化是否失败
    };
  },
  methods: {
    // Cropper 准备就绪回调
    handleReady() {
      console.log('Cropper API 已就绪:', this.$refs.cropper);
      this.cropperReady = true; // 启用操作按钮
      
      // 可选：初始化默认裁剪区域
      this.$refs.cropper.setCropRect({
        x: 50, 
        y: 50,
        width: 200,
        height: 200
      });
    },
    
    // Cropper 初始化失败回调
    handleCropperError(err) {
      console.error('Cropper 初始化失败:', err);
      this.initFailed = true;
      uni.showToast({
        title: '编辑器启动失败，请重试',
        icon: 'none',
        duration: 2000
      });
    },
    
    // 旋转操作
    rotate(degrees) {
      if (!this.cropperReady) return;
      
      // 调用 uni-cropper 的旋转方法
      this.$refs.cropper.rotate(degrees);
      
      // 可选：限制旋转角度范围（0-360）
      const currentRotate = this.$refs.cropper.getRotate();
      const newRotate = (currentRotate + degrees + 360) % 360;
      this.$refs.cropper.setRotate(newRotate);
    },
    
    // 保存操作
    save() {
      if (!this.cropperReady) return;
      
      this.$refs.cropper.getCroppedImage({
        quality: 0.8, // 图片质量
        format: 'jpg', // 输出格式
        success: (res) => {
          console.log('裁剪结果:', res.tempFilePath);
          // 传递结果到上一页
          const pages = getCurrentPages();
          const prevPage = pages[pages.length - 2];
          prevPage.$vm.avatarPath = res.tempFilePath;
          uni.navigateBack();
        },
        fail: (err) => {
          uni.showToast({
            title: `保存失败: ${err.errMsg}`,
            icon: 'none'
          });
        }
      });
    }
  }
}
</script>

<style scoped>
/* 加载遮罩层 */
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.loading-icon {
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-text {
  margin-top: 10px;
  color: #666;
  font-size: 14px;
}

/* 操作栏样式 */
.toolbar {
  position: fixed;
  bottom: 30px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  padding: 0 20px;
}

.btn-rotate {
  width: 120px;
  background-color: #f0f0f0;
}

.btn-save {
  width: 120px;
  background-color: #4cd964;
  color: white;
}

/* 禁用按钮样式 */
button[disabled] {
  opacity: 0.5;
  filter: grayscale(50%);
}
</style>
-->

<!-- 
<template>
  <view class="container">
    <uni-cropper
      ref="cropper"
      :image="imageSrc"
      @ready="handleReady"
      class="editor"
    />
    <view class="toolbar">
      <button @click="rotate(-90)">左旋转</button>
      <button @click="rotate(90)">右旋转</button>
      <button @click="save">保存</button>
    </view>
  </view>
</template>

<script>
import uniCropper from '@dcloudio/uni-ui/lib/uni-cropper/uni-cropper.vue';

export default {
  components: { uniCropper },
  data() {
    return {
      imageSrc: '',
    };
  },
  async onLoad(options) {
    this.imageSrc = options.src; 
  },
  methods: {
    handleReady() {
      // Cropper 就绪后启用操作按钮
    },
    rotate(degrees) {
      this.$refs.cropper.rotate(degrees);
    },
    save() {
      this.$refs.cropper.getCroppedImage({
        success: (res) => {
          console.log('裁剪结果:', res.tempFilePath);
        }
      });
    }
  }
}
</script>
-->


<!-- 
<template>
    <view class="container">
      <image v-if="!imageLoaded" :src="imageSrc" @load="handleImageLoad" class="preview-image" />
      <cropper
        v-show="imageLoaded"
        ref="cropper"
        :src="imageSrc"
        :stencil-props="{
          aspectRatio: 1,
          handlers: {}
        }"
        :options="{
          viewMode: 1,
          autoCrop: true,
          autoCropArea: 1,
          dragMode: 'move'
        }"
        @ready="handleReady"
        @change="handleChange"
        class="editor"
      />
      <view class="toolbar">
        <u-button @click="rotate(-90)" text="左旋转"></u-button>
        <u-button @click="rotate(90)" text="右旋转"></u-button>
        <u-button @click="save" text="保存" color="#48A48B"></u-button>
      </view>
    </view>
  </template>
  
  <script>
  import Cropper from 'vue-cropperjs'
  export default {
    components: {
      VueCropper: Cropper
    },
    data() {
      return {
        imageSrc: '',
        croppedImage: null,
        imageLoaded: false,
        cropperReady: false
      }
    },
    async onLoad(options) {
        try {
			await this.preloadImage(options.src);
			this.imageSrc = options.src;

			// 确保 Cropper 组件挂载
			await new Promise((resolve) => {
			  const checkCropper = () => {
				if (this.$refs.cropper) {
				  console.log('Cropper 实例方法:', Object.keys(this.$refs.cropper));
				  resolve();
				} else {
				  setTimeout(checkCropper, 50);
				}
			  };
			  checkCropper();
			});

			await this.$nextTick(); // 关键：等待组件渲染完成

			// 调用 replace 前检查方法存在性
			if (typeof this.$refs.cropper.replace !== 'function') {
			  throw { 
				code: 'CROPPER_API_ERROR', 
				message: 'Cropper API 未正确初始化' 
			  };
			}

			await this.$refs.cropper.replace(options.src);
          
		  // await this.$refs.cropper.replace(options.src)
		  //   .catch(e => {
		  //     // 明确捕获 replace 方法不存在的情况
		  //     if (e instanceof TypeError) {
		  //       throw { 
		  //         code: 'CROPPER_API_ERROR', 
		  //         message: 'Cropper API 未正确初始化' 
		  //       };
		  //     } else {
		  //       throw { code: 'REPLACE_FAILED', message: e.message };
		  //     }
		  //   });
		  
          await new Promise(resolve => {
            if (this.cropperReady) resolve();
            this.$once('cropper-ready', resolve);
          });
    
          this.imageLoaded = true;
        } catch (e) {
          // 统一错误格式处理
          const errorCode = e.code || 'UNKNOWN_ERROR';
          const errorMsgMap = {
            'PRELOAD_FAILED': '图片加载失败，请检查格式（仅支持JPG/PNG）',
            'REPLACE_FAILED': '图片替换失败，请检查文件完整性',
            'INIT_TIMEOUT': '编辑器初始化超时，请重试',
            'UNSUPPORTED_FORMAT': '不支持的图片格式',
            'CROPPER_NOT_READY': '编辑器未初始化完成',
            'UNKNOWN_ERROR': `操作失败，错误码：${errorCode}`
          };
          console.error('完整错误对象:', e); // 输出完整错误对象
		  uni.showToast({ 
			title: errorMsgMap[errorCode] || `未知错误: ${e.message}`,
			icon: 'none'
		  });
          // setTimeout(() => uni.navigateBack(), 1500);
		    // 仅严重错误关闭页面
		    if (errorCode === 'CROPPER_API_ERROR') {
		      setTimeout(() => uni.navigateBack(), 1500);
		    }
        }
      },
    
      methods: {
        async preloadImage(src) {
          try {
            if (src.startsWith('blob:')) {
              const response = await fetch(src);
              const blob = await response.blob();
              const supportedTypes = ['image/jpeg', 'image/png'];
              if (!supportedTypes.includes(blob.type)) {
                throw { code: 'UNSUPPORTED_FORMAT', message: 'Unsupported format' }; // 携带错误码
              }
            } else {
              const ext = src.split('.').pop().toLowerCase();
              if (!['jpg', 'jpeg', 'png'].includes(ext)) {
                throw { code: 'UNSUPPORTED_FORMAT', message: 'Unsupported format' };
              }
            }
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.onload = resolve;
              img.onerror = () => reject({ code: 'PRELOAD_FAILED', message: 'Preload failed' });
              img.src = src;
            });
          } catch (e) {
            throw e; // 保持错误对象结构
          }
        },
      handleReady() {
        this.cropperReady = true
      },
      rotate(degrees) {
        if (!this.$refs.cropper) {
          uni.showToast({ title: '编辑器未准备好', icon: 'none' })
          return
        }
        this.$refs.cropper.rotate(degrees)
      },
      handleChange({ canvas }) {
        if (!canvas) {
          uni.showToast({ title: '画布未初始化', icon: 'none' });
          setTimeout(() => uni.navigateBack(), 1500);
          return
        }
        this.croppedImage = canvas.toDataURL('image/jpeg', 0.8)
      },
      save() {
        if (!this.$refs.cropper) {
          uni.showToast({ title: '编辑器未准备好', icon: 'none' })
          return
        }
        const pages = getCurrentPages()
        const prevPage = pages[pages.length - 2]
        prevPage.$vm.customAvatar = this.croppedImage
        uni.navigateBack()
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .container {
    padding: 20rpx;
    .editor {
      width: 100%;
      height: 70vh;
      background: #f5f5f5;
    }
    .toolbar {
      position: fixed;
      bottom: 40rpx;
      width: 100%;
      display: flex;
      justify-content: space-around;
    }
  }
  </style>
-->


<!-- <template>
    <view class="container">
      <image-editor
        v-if="imageSrc"
        ref="cropper"
        :src="imageSrc"
        :stencil-props="{
          aspectRatio: 1,
          handlers: {}
        }"
        :options="{
          viewMode: 1,
          autoCrop: true,
          autoCropArea: 1,
          dragMode: 'move'
        }"
        @ready="handleReady"
        @change="handleChange"
        class="editor"
      />
      <view class="toolbar">
        <u-button @click="rotate(-90)" text="左旋转"></u-button>
        <u-button @click="rotate(90)" text="右旋转"></u-button>
        <u-button @click="save" text="保存" color="#48A48B"></u-button>
      </view>
    </view>
  </template>
  
  <script>
  import Cropper from 'vue-cropperjs'
  
  export default {
    components: {
      'image-editor': Cropper
    },
    data() {
      return {
        imageSrc: '',
        croppedImage: null,
        imageLoaded: false,
        cropperReady: false
      }
    },
    async onLoad(options) {
      this.imageSrc = options.src
      try {
        // 等待cropper准备就绪
        await new Promise((resolve, reject) => {
          this.cropperReady ? resolve() : 
          this.$once('cropper-ready', resolve)
          setTimeout(() => reject(new Error('编辑器初始化超时')), 5000)
        })

        // 执行图片替换
        await this.$refs.cropper.replace(options.src)
        this.imageLoaded = true
      } catch (e) {
        console.error('初始化错误:', e)
        uni.showToast({ 
          title: e.message.includes('图片') ? '图片加载失败' : '编辑器初始化失败',
          icon: 'none'
        })
        setTimeout(() => uni.navigateBack(), 1500)
      }
    },
    methods: {
      handleReady() {
        this.cropperReady = true
        this.$emit('cropper-ready')
      },
      rotate(degrees) {
        if (!this.$refs.cropper) {
          uni.showToast({ title: '编辑器未准备好', icon: 'none' })
          return
        }
        this.$refs.cropper.rotate(degrees)
      },
      handleChange({ canvas }) {
        if (!canvas) {
          console.error('Canvas未初始化')
          return
        }
        this.croppedImage = canvas.toDataURL('image/jpeg', 0.8)
      },
      save() {
        if (!this.$refs.cropper) {
          uni.showToast({ title: '编辑器未准备好', icon: 'none' })
          return
        }
        const pages = getCurrentPages()
        const prevPage = pages[pages.length - 2]
        prevPage.$vm.customAvatar = this.croppedImage
        uni.navigateBack()
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .container {
    padding: 20rpx;
    .editor {
      width: 100%;
      height: 70vh;
      background: #f5f5f5;
    }
    .toolbar {
      position: fixed;
      bottom: 40rpx;
      width: 100%;
      display: flex;
      justify-content: space-around;
    }
  }
  </style> -->