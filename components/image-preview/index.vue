<!-- src/components/image-preview/index.vue -->
<template>
  <view class="container">
    <!-- 图片展示区域 -->
    <image 
      :src="imageUrl" 
      mode="aspectFit" 
      @click="handleImageClick"
      class="preview-image"
    />
    
    <!-- 预览模态框 -->
    <view 
      v-if="showPreview" 
      class="preview-modal"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <!-- 返回按钮 -->
      <view class="back-button" @click="closePreview">
        <text class="back-icon">×</text>
      </view>
      
      <!-- 预览图片 -->
      <image 
        :src="currentImage" 
        :style="{
          transform: `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`,
          transition: isScaling || isDragging ? 'none' : 'all 0.3s ease'
        }"
        mode="aspectFit"
        class="full-image"
      />
      
      <!-- 上一张/下一张按钮 -->
	  <view v-if="imageList && imageList.length > 1" class="navigation-buttons">
	    <view 
	      class="nav-button prev" 
	      @click="showPreviousImage"
	      :class="{ disabled: currentIndex === 0 }"
	    >
	      <text class="nav-icon">←</text>
	    </view>
	    <view class="page-indicator">
	      {{currentIndex + 1}} / {{imageList.length}}
	    </view>
	    <view 
	      class="nav-button next" 
	      @click="showNextImage"
	      :class="{ disabled: currentIndex === imageList.length - 1 }"
	    >
	      <text class="nav-icon">→</text>
	    </view>
	  </view>
	  
    </view>
  </view>
</template>

<script>
import { 
  handleTouchStart, 
  handleTouchMove, 
  handleTouchEnd, 
  resetState 
} from './preview-utils';

export default {
  props: {
    imageUrl: {
      type: String,
      required: false
    },
    imageList: {
      type: Array,
      default: null
    },
    initialIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      showPreview: false,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
      isScaling: false,
      isDragging: false,
      lastX: 0,
      lastY: 0,
      initialDistance: 0,
      initialScale: 1,
      currentIndex: this.initialIndex
    };
  },
  mounted() {
    console.log("ImagePreview 已挂载，当前索引:", this.currentIndex)
    // this.showPreview = true;
  },
  computed: {
    currentImage() {
      if (this.imageList && this.imageList.length > 0) {
        return this.imageList[this.currentIndex];
      }
      return this.imageUrl;
    }
  },
  methods: {

	// 添加这个方法允许外部设置当前索引
	setCurrentIndex(index) {
		this.currentIndex = index;
		resetState(this);
	},
    handleImageClick() {
      this.showPreview = true;
      if (this.imageList) {
        this.currentIndex = this.imageList.indexOf(this.imageUrl);
      }
    },
    // 打开预览
    openPreview() {
      this.showPreview = true;
    },
    closePreview() {
      this.showPreview = false;
      resetState(this);
    },
    onTouchStart(e) {
      handleTouchStart(e, this);
    },
    onTouchMove(e) {
      handleTouchMove(e, this);
    },
    onTouchEnd() {
      handleTouchEnd(this);
    },
	//显示预览图片
    showPreviousImage() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        resetState(this);
      }
    },
    showNextImage() {
      if (this.currentIndex < this.imageList.length - 1) {
        this.currentIndex++;
        resetState(this);
      }
    }
  }
};
</script>

<style>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-image {
  /* width: 100%; */
 width: 300px;
  height: 100%;
  object-fit: cover;
}

.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.full-image {
 width: 100%;
  height: 80%;
  touch-action: none;
}

.back-button {
  position: absolute;
  top: 40px;
  right: 40px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.back-icon {
	margin-top: -15%;
  color: white;
  font-size: 30px;
  line-height: 1;
}

.navigation-buttons {
  position: absolute;
  bottom: 40px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.nav-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-icon {
  color: white;
  font-size: 24px;
  line-height: 1;
}

.page-indicator {
  min-width: 80px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  margin: 0 10px;
  padding: 0 15px;
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
</style>