/**
 * UniApp 跨平台文本转语音模块
 * 支持 H5、小程序、App 平台
 */

class TextToSpeech {
  constructor(options = {}) {
    this.options = {
      lang: 'zh_CN', // 语言
      rate: 1.0,     // 语速 0.1-10
      pitch: 1.0,    // 音调 0-2
      volume: 1.0,   // 音量 0-1
      ...options
    };

    this.isSpeaking = false;
    this.isPaused = false;
    this.currentAudio = null;
    this.platform = 'h5';
    this.innerAudioContext = null;
    
    this.init();
  }

  /**
   * 初始化语音模块
   */
  init() {
    // 检测平台
    if (typeof uni !== 'undefined') {
      const systemInfo = uni.getSystemInfoSync();
      this.platform = systemInfo.platform;
    }

    // 初始化平台特定的设置
    switch (this.platform) {
      case 'mp-weixin':
        this.initWechat();
        break;
      case 'app':
        this.initApp();
        break;
      case 'h5':
      default:
        this.initH5();
        break;
    }
  }

  /**
   * 初始化微信小程序平台
   */
  initWechat() {
    // 微信小程序需要引入插件
    try {
      this.plugin = requirePlugin("WechatSI");
      console.log('微信同声传译插件加载成功');
    } catch (error) {
      console.error('微信同声传译插件加载失败:', error);
    }
    
    // 设置音频选项
    if (this.canIUseWxAudio()) {
      uni.setInnerAudioOption({
        obeyMuteSwitch: false // 允许音频播放即使设备静音
      });
    }
  }

  /**
   * 初始化App平台
   */
  initApp() {
    // App平台可以使用原生API或Web Speech API
    this.innerAudioContext = uni.createInnerAudioContext();
    this.innerAudioContext.obeyMuteSwitch = false;
  }

  /**
   * 初始化H5平台
   */
  initH5() {
    // H5平台使用Web Speech API
    if (!('speechSynthesis' in window)) {
      console.warn('当前浏览器不支持Web Speech API');
    }
  }

  /**
   * 文本转语音
   * @param {string} text - 要转换的文本
   * @param {object} options - 可选参数，覆盖默认设置
   * @returns {Promise}
   */
  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!text || text.trim() === '') {
        reject(new Error('文本内容不能为空'));
        return;
      }

      const speakOptions = { ...this.options, ...options };

      // 停止当前播放
      this.stop();

      switch (this.platform) {
        case 'mp-weixin':
          this.speakWechat(text, speakOptions, resolve, reject);
          break;
        case 'app':
          this.speakApp(text, speakOptions, resolve, reject);
          break;
        case 'h5':
        default:
          this.speakH5(text, speakOptions, resolve, reject);
          break;
      }
    });
  }

  /**
   * 微信小程序语音合成
   */
  speakWechat(text, options, resolve, reject) {
    if (!this.plugin) {
      reject(new Error('微信同声传译插件未加载'));
      return;
    }

    this.plugin.textToSpeech({
      lang: options.lang,
      tts: true,
      content: text,
      success: (res) => {
        console.log("成功生成语音文件:", res.filename);
        this.playAudioFile(res.filename, options, resolve, reject);
      },
      fail: (err) => {
        console.error("文本转语音失败:", err);
        reject(err);
      }
    });
  }

  /**
   * App平台语音合成
   */
  speakApp(text, options, resolve, reject) {
    // App平台可以使用原生TTS或Web Speech API
    // 这里使用Web Speech API作为备选
    if ('speechSynthesis' in window) {
      this.speakH5(text, options, resolve, reject);
    } else {
      // 如果原生TTS不可用，可以使用第三方服务
      reject(new Error('App平台暂不支持语音合成'));
    }
  }

  /**
   * H5平台语音合成
   */
  speakH5(text, options, resolve, reject) {
    if (!('speechSynthesis' in window)) {
      reject(new Error('当前浏览器不支持语音合成'));
      return;
    }

    // 停止当前语音
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // 设置语音参数
    utterance.rate = Math.max(0.1, Math.min(10, options.rate));
    utterance.pitch = Math.max(0, Math.min(2, options.pitch));
    utterance.volume = Math.max(0, Math.min(1, options.volume));
    
    // 尝试选择中文语音
    const voices = window.speechSynthesis.getVoices();
    const chineseVoice = voices.find(voice => 
      voice.lang.includes('zh') || voice.lang.includes('CN'));
    if (chineseVoice) {
      utterance.voice = chineseVoice;
    }

    // 事件监听
    utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
      console.log('开始朗读');
    };
    
    utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      console.log('朗读完成');
      resolve();
    };
    
    utterance.onerror = (event) => {
      this.isSpeaking = false;
      this.isPaused = false;
      console.error('朗读出错:', event.error);
      reject(new Error(`朗读出错: ${event.error}`));
    };
    
    utterance.onpause = () => {
      this.isPaused = true;
      console.log('朗读暂停');
    };
    
    utterance.onresume = () => {
      this.isPaused = false;
      console.log('朗读继续');
    };

    this.currentAudio = utterance;
    window.speechSynthesis.speak(utterance);
  }

  /**
   * 播放音频文件（小程序和App平台使用）
   */
  playAudioFile(filename, options, resolve, reject) {
    if (!this.innerAudioContext) {
      this.innerAudioContext = uni.createInnerAudioContext();
      this.innerAudioContext.obeyMuteSwitch = false;
    }

    this.innerAudioContext.src = filename;
    this.innerAudioContext.volume = Math.max(0, Math.min(1, options.volume));
    
    this.innerAudioContext.play();
    this.isSpeaking = true;

    this.innerAudioContext.onPlay(() => {
      console.log('开始播放音频');
    });

    this.innerAudioContext.onEnded(() => {
      console.log('音频播放完成');
      this.isSpeaking = false;
      this.innerAudioContext.destroy();
      this.innerAudioContext = null;
      resolve();
    });

    this.innerAudioContext.onError((err) => {
      console.error('音频播放失败:', err);
      this.isSpeaking = false;
      this.innerAudioContext.destroy();
      this.innerAudioContext = null;
      reject(err);
    });
  }

  /**
   * 暂停播放
   */
  pause() {
    switch (this.platform) {
      case 'mp-weixin':
      case 'app':
        if (this.innerAudioContext && this.isSpeaking) {
          this.innerAudioContext.pause();
          this.isPaused = true;
        }
        break;
      case 'h5':
      default:
        if (window.speechSynthesis && this.isSpeaking) {
          window.speechSynthesis.pause();
          this.isPaused = true;
        }
        break;
    }
  }

  /**
   * 继续播放
   */
  resume() {
    switch (this.platform) {
      case 'mp-weixin':
      case 'app':
        if (this.innerAudioContext && this.isPaused) {
          this.innerAudioContext.play();
          this.isPaused = false;
        }
        break;
      case 'h5':
      default:
        if (window.speechSynthesis && this.isPaused) {
          window.speechSynthesis.resume();
          this.isPaused = false;
        }
        break;
    }
  }

  /**
   * 停止播放
   */
  stop() {
    switch (this.platform) {
      case 'mp-weixin':
      case 'app':
        if (this.innerAudioContext) {
          this.innerAudioContext.stop();
          this.innerAudioContext.destroy();
          this.innerAudioContext = null;
        }
        break;
      case 'h5':
      default:
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        break;
    }
    
    this.isSpeaking = false;
    this.isPaused = false;
  }

  /**
   * 设置语音参数
   * @param {object} options - 语音参数
   */
  setOptions(options) {
    this.options = { ...this.options, ...options };
  }

  /**
   * 获取当前平台
   */
  getPlatform() {
    return this.platform;
  }

  /**
   * 获取播放状态
   */
  getStatus() {
    return {
      isSpeaking: this.isSpeaking,
      isPaused: this.isPaused,
      platform: this.platform
    };
  }

  /**
   * 检查微信音频支持
   */
  canIUseWxAudio() {
    if (this.platform !== 'mp-weixin') return true;
    
    const version = uni.getSystemInfoSync().SDKVersion;
    if (this.compareVersion(version, '2.3.0') < 0) {
      uni.showModal({
        title: '提示',
        content: '当前微信版本过低，手机开启静音模式下可能会导致播放音频失败。',
        showCancel: false
      });
      return false;
    }
    return true;
  }

  /**
   * 比较版本号
   */
  compareVersion(v1, v2) {
    const v1Parts = v1.split('.').map(Number);
    const v2Parts = v2.split('.').map(Number);
    const len = Math.max(v1Parts.length, v2Parts.length);

    while (v1Parts.length < len) v1Parts.push(0);
    while (v2Parts.length < len) v2Parts.push(0);

    for (let i = 0; i < len; i++) {
      if (v1Parts[i] > v2Parts[i]) return 1;
      if (v1Parts[i] < v2Parts[i]) return -1;
    }
    return 0;
  }

  /**
   * 销毁实例
   */
  destroy() {
    this.stop();
    if (this.innerAudioContext) {
      this.innerAudioContext.destroy();
      this.innerAudioContext = null;
    }
  }
}

// 创建默认实例
const defaultTTS = new TextToSpeech();

// 导出默认实例和类
export default defaultTTS;
export { TextToSpeech };