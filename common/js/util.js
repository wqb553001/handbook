function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function(n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}
var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function(milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function(dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function(number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDate()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};

export const requestSync = {
  post: async (url, data, customHeader = {}) => {
	  /*
	    try {
	      const saveData = { avatar: this.imageViewSrc };
	      const result = await requestSync.post(
	        'http://localhost:18281/api/job/saveUser', 
	        saveData
	      );
	      console.log('用户信息已保存', result);
	      uni.showToast({ title: '保存成功' });
	    } catch (e) {
	      uni.showToast({ title: `保存失败: ${e.message}`, icon: 'none' });
	    }
	  */
    try {
      const defaultHeader = { 'Content-Type': 'application/json' };
      const headers = { ...defaultHeader, ...customHeader };

      const response = await uni.request({
        url,
        method: 'POST',
        header: headers,
        data: JSON.stringify(data)
      });

      // 处理 uni-app 返回值（结构为 [error, result]）
      const [error, result] = response;

      // 网络层错误（如超时、断网）
      if (error || result.statusCode !== 200) {
        const errMsg = error?.errMsg || '请求失败，请检查网络';
        throw new Error(errMsg);
      }

      // 业务逻辑错误（如 code != 0）
      if (result.data.code !== 0) {
        throw new Error(result.data.msg || '业务处理失败');
      }

      // 返回有效数据
      return result.data.data;

    } catch (err) {
      console.error(`请求异常: ${url}`, err);
      throw new Error(err.message || '未知错误'); // 继续抛出错误供外部捕获
    }
  },
  
  // 新增 GET 请求方法
  get: async (url, data = {}, customHeader = {}) => {
	  /*
	    try {
	      const params = { page: 1, size: 10 };
	      const list = await requestSync.get('http://api.com/users', params);
	      console.log('用户列表:', list);
	    } catch (e) {
	      uni.showToast({ title: `加载失败: ${e.message}`, icon: 'none' });
	    }
	  */
    try {
      // 处理 GET 参数：拼接为 URL 查询字符串
      const params = new URLSearchParams(data).toString();
      const fullUrl = params ? `${url}?${params}` : url;

      const response = await uni.request({
        url: fullUrl,
        method: 'GET',
        header: { 
          'Content-Type': 'application/json', // 可选默认值，可被 customHeader 覆盖
          ...customHeader 
        }
      });

      // 处理 uni-app 返回值（结构为 [error, result]）
      const [error, result] = response;

      // 网络层错误（如超时、断网）
      if (error || result.statusCode !== 200) {
        const errMsg = error?.errMsg || `请求失败 (${result.statusCode})`;
        throw new Error(errMsg);
      }

      // 业务逻辑错误（如 code != 0）
      if (result.data?.code !== undefined && result.data.code !== 0) {
        throw new Error(result.data.msg || '业务处理失败');
      }

      // 返回有效数据（兼容无 code 字段的响应）
      return result.data.data ?? result.data;

    } catch (err) {
      console.error(`GET 请求异常: ${url}`, err);
      throw new Error(err.message || '未知错误'); 
    }
  }
};

export {
	formatTime,
	formatLocation,
	dateUtils
}
