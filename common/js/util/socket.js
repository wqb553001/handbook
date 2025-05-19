class socket {
	constructor(url, userId) {
		this.is_open_socket = false //避免重复连接
		this.url = url //地址
		this.data = null
		this.userId = userId
		//心跳检测
		this.timeout = 120000 //多少秒执行检测
		this.heartbeatInterval = null //检测服务器端是否还活着
		this.reconnectTimeOut = null //重连之后多久再次重连

		try {
			console.log("开始构建 ws ……")
			return this.socketInit()
		} catch (e) {
			console.log('catch');
			this.is_open_socket = false
			this.reconnect();
		}
	}

	// 进入这个页面的时候创建websocket连接【整个页面随时使用】
	socketInit() {
		this.socketTask = uni.connectSocket({
			url: this.url,
			success: () => {
				console.log("正准备建立websocket中...");
				// 返回实例
				return this.socketTask
			},
			complete(e) {
				console.log("构建 ws 返回值："+JSON.stringify(e))
			}
		});
		this.socketTask.onOpen((res) => {
			console.log("WebSocket连接正常！");
			// 发送认证信息
			this.send(JSON.stringify({
				sysId: -1,  // 新增认证类型
				senderId: this.userId
			}));
			clearTimeout(this.reconnectTimeOut)
			clearTimeout(this.heartbeatInterval)
			this.is_open_socket = true;
			this.start();
			// 注：只有连接正常打开中 ，才能正常收到消息
			this.socketTask.onMessage((res) => {
				
				console.log("this.socketTask.onMessage.res:"+res.data)
			});
		})
		// 监听连接失败，这里代码我注释掉的原因是因为如果服务器关闭后，和下面的onclose方法一起发起重连操作，这样会导致重复连接
		// uni.onSocketError((res) => {
		// 	console.log('WebSocket连接打开失败，请检查！');
		// 	this.is_open_socket = false;
		// 	this.reconnect();
		// });
		// 这里仅是事件监听【如果socket关闭了会执行】
		this.socketTask.onClose(() => {
			console.log("已经被关闭了")
			this.is_open_socket = false;
			this.reconnect();
		})
	}
	close() {
		this.socketTask.close({
			success(){
				console.log("已经被关闭了")
			}
		})
	}
	//发送消息
	send(value) {
		// 注：只有连接正常打开中 ，才能正常成功发送消息
		this.socketTask.send({
			data: value,
			async success() {
				console.log("成功发送消息："+value);
			},
		});
	}
	//开启心跳检测
	start() {
		this.heartbeatInterval = setInterval(() => {
			/*this.data = {
				value: "传输内容",
				method: "方法名称"
			}
			console.log(this.data)
			this.send(JSON.stringify(this.data));*/
			
			// 发送认证信息-心跳检测
			this.send(JSON.stringify({
				sysId: -1,  // 新增认证类型
				senderId: this.userId
			}));
		}, this.timeout)
	}
	//重新连接
	reconnect() {
		//停止发送心跳
		clearInterval(this.heartbeatInterval)
		//如果不是人为关闭的话，进行重连
		if (!this.is_open_socket) {
			this.reconnectTimeOut = setTimeout(() => {
				this.socketInit();
			}, 120000)
		}
	}
	//外部获取消息
	getMessage(callback) {
		this.socketTask.onMessage((res) => {
			return callback(res)
		})
	}

}

export default socket 
