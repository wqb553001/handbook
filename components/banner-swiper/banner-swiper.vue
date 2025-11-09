<template>
  <view class="banner" v-if="banners.length > 0">
    <view v-if="isVideoPlaying">
      <video 
        id="bannerVideo" 
        :src="currentVideoUrl" 
        style="width: -webkit-fill-available;"
        @error="videoErrorCallback" 
        :danmu-list="danmuList" 
        autoplay 
        enable-danmu 
        danmu-btn 
        controls 
        @play="onVideoPlay" 
        @pause="onVideoPause" 
        @ended="onVideoEnded"
      ></video>
    </view>
    <view v-if="!isVideoPlaying">
      <swiper 
        class="swiper" 
        circular 
        :indicator-dots="swiperConfig.indicatorDots" 
        :autoplay="swiperConfig.autoplay" 
        :interval="swiperConfig.interval" 
        :duration="swiperConfig.duration"
        :current="currentSwiperIndex" 
        @change="onSwiperChange"
      >
        <swiper-item v-for="(banner, index) in banners" :key="index">
          <view @click="handleItemClick(banner, index)">
            <view class="swiper-item uni-bg-red">
              <image 
                v-if="banner.mediumType == 2" 
                :src="banner.url" 
                class="banner-img" 
                style="object-fit: cover"
                mode="aspectFill"
              ></image>
              <view v-if="banner.mediumType == 3" class="video-poster">
                <image 
                  src="https://cdn.xny.world/job/自由职业.png" 
                  class="banner-img" 
                  style="object-fit: cover"
                  mode="aspectFill"
                ></image>
                <view class="play-icon">▶</view>
              </view>
              <view class="banner-title" :style="fontSet + banner.fontColor">
                <rich-text :nodes="banner.title"></rich-text>
              </view>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script>
export default {
  name: 'BannerSwiper',
  props: {
    banners: {
      type: Array,
      default: () => []
    },
    danmuList: {
      type: Array,
      default: () => []
    },
    fontSet: {
      type: String,
      default: ''
    },
    // 轮播图配置对象
    swiperConfig: {
      type: Object,
      default: () => ({
        indicatorDots: true,    // 是否显示指示点
        autoplay: true,         // 是否自动播放
        interval: 6000,         // 自动播放间隔（毫秒）
        duration: 3000          // 滑动动画时长（毫秒）
      })
    }
  },
  data() {
    return {
      // indicatorDots: true,
      // autoplay: true,
      // interval: 6000,
      // duration: 3000,
      currentVideoUrl: '',
      currentSwiperIndex: 0,
      isVideoPlaying: false,
      playingVideoIndex: -1,
      // danmuList: [
      //   {
      //     text: '第 1s 出现的弹幕',
      //     color: '#ff0000',
      //     time: 1
      //   },
      //   {
      //     text: '第 3s 出现的弹幕',
      //     color: '#ff00ff',
      //     time: 3
      //   }
      // ]
    }
  },
  mounted() {
    // 组件挂载后判断第一个banner是否为视频
    if (this.banners.length > 0) {
      this.onVideoJudge(this.banners[0], 0);
    }
  },
  methods: {
    // 处理轮播图项的点击
    handleItemClick(banner, index) {
      console.log("点击执行 handleItemClick(banner, index)，其中 index = " + index);
      this.$emit('item-click', { banner, index });
    },
    
    // 视频播放判断
    onVideoJudge(banner, index) {
      if (banner.mediumType === 3) {
        // 是视频播放
        this.isVideoPlaying = true;
        this.currentVideoUrl = banner.url;
        this.playingVideoIndex = index;
        this.autoplay = false;
		// 暂停轮播图的自动播放
        this.$emit('update-autoplay', false);
        return true;
      }
      // 不是视频播放
      this.isVideoPlaying = false;
      // 恢复轮播
	  this.$emit('update-autoplay', this.swiperConfig.autoplay);
      this.currentSwiperIndex = index;
      return false;
    },
    
    // 视频暂停
    onVideoPause() {
      console.log('视频暂停，索引:', this.playingVideoIndex);
      this.$emit('video-pause', this.playingVideoIndex);
    },
    
    // 视频播放结束
    onVideoEnded() {
      console.log('视频播放结束，索引:', this.playingVideoIndex);
      this.isVideoPlaying = false;
      this.playingVideoIndex = -1;
      // 恢复轮播
      this.$emit('update-autoplay', this.swiperConfig.autoplay);
      this.currentSwiperIndex = this.playingVideoIndex + 1;
      
      this.$emit('video-ended', this.playingVideoIndex);
      
      // 可选：视频播放结束后自动切换到下一张
      setTimeout(() => {
        if (!this.isVideoPlaying) {
          this.nextSwiper();
        }
      }, 500);
    },
    
    // 轮播图切换事件
    onSwiperChange(e) {
      const newIndex = e.detail.current;
      console.log('轮播图切换至:', newIndex);
      this.currentSwiperIndex = newIndex;
      this.onVideoJudge(this.banners[newIndex], newIndex);
      this.$emit('swiper-change', newIndex);
    },
    
    // 视频错误回调
    videoErrorCallback(e) {
      console.error('视频播放错误:', e);
      console.error('具体错误:', e.target.errMsg);
      this.$emit('video-error', e);
      
      uni.showToast({
        title: '视频加载失败，自动播放下一条',
        icon: 'none'
      });
      
      // 视频加载失败时恢复轮播
      this.nextSwiper();
    },
    
    // 切换到下一张轮播图
    nextSwiper() {
      if (this.banners.length > 0) {
        this.currentSwiperIndex = (this.currentSwiperIndex + 1) % this.banners.length;
        this.onVideoJudge(this.banners[this.currentSwiperIndex], this.currentSwiperIndex);
      }
    },
    
    // 视频播放事件
    onVideoPlay() {
      this.$emit('video-play', this.playingVideoIndex);
    }
  },
  watch: {
    // 监听banners变化，当banners更新时重新判断第一个是否为视频
    banners: {
      handler(newBanners) {
        if (newBanners.length > 0) {
          this.onVideoJudge(newBanners[0], 0);
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.banner {
  // height: 360rpx;
  overflow: hidden;
  position: relative;
  background-color: #ccc;
}

.banner-img {
  width: 100%;
}

.banner-title {
  min-height: 54rpx;
  overflow: hidden;
  position: absolute;
  left: 30rpx;
  bottom: 30rpx;
  width: 90%;
  font-size: 32rpx;
  font-weight: 400;
  line-height: 84rpx;
  color: white;
  z-index: 11;
}

.video-poster {
  position: relative;
  width: 100%;
  height: 100%;
}

.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80rpx;
  height: 80rpx;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
}

.fullscreen-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;
  z-index: 9999;
}

.close-video {
  position: absolute;
  top: 60rpx;
  right: 30rpx;
  color: white;
  font-size: 60rpx;
  z-index: 10000;
}
</style>