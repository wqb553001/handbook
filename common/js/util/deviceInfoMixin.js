export default {
  data() {
    return {
      deviceInfo: {},		// 存储设备信息
	  locationInfo: {},		// ip地址获取粗略位置
	  status: 'idle', 		// idle, loading, success, error
	  error: null
    };
  },
  mounted() {
    // 自动获取设备信息（根据需求选择created或mounted）
    this.fetchAllInfo();
    // this.fetchDeviceInfo();
  },
  methods: {
    /**
     * 获取系统设备信息
     * @returns {Promise} 返回设备信息Promise
     */
    async fetchDeviceInfo() {
      try {
        const res = await uni.getSystemInfo();
		
		const response = await uni.request({
		    url: 'https://ipapi.co/json/', // 替换为实际的接口地址
		    method: 'GET'
		});
		
        this.deviceInfo = {
			id:				response.data.ip,
			system:			res.system,
			model:			res.model,
			deviceModel:	res.deviceModel,
			osName:			res.osName,
			osVersion: 		res.osVersion,
			appVersion:		res.appVersion,
			appVersionCode:	res.appVersionCode,
			appLanguage:	res.appLanguage,
			hostLanguage:	res.hostLanguage
		}
		
        console.log('📱 设备信息获取成功:', this.deviceInfo);
        return this.deviceInfo;
      } catch (err) {
        console.error('❌ 设备信息获取失败:', err);
        throw err;
      }
    },
	
	
	// 获取粗略位置信息（基于IP地址）
	async fetchLocationInfo() {
	  try {
		// 使用公共的IP定位API
		// const response = await axios.get('https://ipapi.co/json/');
		const response = await  uni.request({
		    url: 'https://ipapi.co/json/', // 替换为实际的接口地址
		    method: 'GET'
		});
		this.deviceInfo.ip = response.data.ip;
		// this.locationInfo = {
		//   ip: response.data.ip,
		//   city: response.data.city,
		//   region: response.data.region,
		//   country: response.data.country_name,
		//   timezone: response.data.timezone,
		//   org: response.data.org
		// };
		console.log("ip地址："+JSON.stringify(this.deviceInfo))
		return this.locationInfo;
	  } catch (err) {
		this.error = err;
		this.status = 'error';
		throw err;
	  }
	},
	
	// 获取所有信息
	async fetchAllInfo() {
	  this.status = 'loading';
	  this.error = null;
	  
	  try {
		await Promise.all([
		  this.fetchDeviceInfo(),
		  this.fetchLocationInfo()
		]);
		this.status = 'success';
		return this.deviceInfo
	  } catch (err) {
		this.status = 'error';
	  }
	},
    
    /**
     * 检查是否是iOS设备
     * @returns {Boolean}
     */
    isIOS() {
      return this.deviceInfo.platform?.toLowerCase() === 'ios';
    },
    
    /**
     * 检查是否是Android设备
     * @returns {Boolean}
     */
    isAndroid() {
      return this.deviceInfo.platform?.toLowerCase() === 'android';
    },
    
    /**
     * 获取屏幕安全区域
     * @returns {Object} { top, right, bottom, left }
     */
    getSafeArea() {
      return this.deviceInfo.safeArea || {};
    }
  }
};