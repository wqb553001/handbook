<template>
  <view class="container">
    <view class="controls">
      <button @click="playPayment">播放到账语音</button>
      <button @click="pause" :disabled="!isSpeaking">暂停</button>
      <button @click="resume" :disabled="!isPaused">继续</button>
      <button @click="stop">停止</button>
    </view>
    
    <view class="settings">
      <text>语速: {{ rate }}</text>
      <slider :value="rate" min="0.5" max="2" step="0.1" @change="onRateChange" />
      
      <text>音量: {{ volume }}</text>
      <slider :value="volume" min="0" max="1" step="0.1" @change="onVolumeChange" />
    </view>
  </view>
</template>

<script>
import textToSpeech from '@/utils/textToSpeech.js';

export default {
  data() {
    return {
      isSpeaking: false,
      isPaused: false,
      rate: 1.0,
      volume: 1.0
    };
  },
  
  methods: {
    playPayment() {
      const amount = '20';
      const text = `支付宝到账${amount}元`;
      
      textToSpeech.speak(text, {
        rate: this.rate,
        volume: this.volume
      }).then(() => {
        this.isSpeaking = false;
        this.isPaused = false;
      }).catch(err => {
        console.error('播放失败:', err);
        uni.showToast({
          title: '播放失败',
          icon: 'none'
        });
      });
      
      this.isSpeaking = true;
    },
    
    pause() {
      textToSpeech.pause();
      this.isPaused = true;
    },
    
    resume() {
      textToSpeech.resume();
      this.isPaused = false;
    },
    
    stop() {
      textToSpeech.stop();
      this.isSpeaking = false;
      this.isPaused = false;
    },
    
    onRateChange(e) {
      this.rate = e.detail.value;
      textToSpeech.setOptions({ rate: this.rate });
    },
    
    onVolumeChange(e) {
      this.volume = e.detail.value;
      textToSpeech.setOptions({ volume: this.volume });
    }
  },
  
  onLoad() {
    // 监听状态变化
    setInterval(() => {
      const status = textToSpeech.getStatus();
      this.isSpeaking = status.isSpeaking;
      this.isPaused = status.isPaused;
    }, 100);
  }
};
</script>