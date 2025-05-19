class socket {
	constructor(url, userId) {
		// this.socket = null
		this.is_open_socket = false //避免重复连接
		this.url = url //地址
		this.data = null
		this.userId = userId
		//心跳检测
		this.timeout = 120000 //多少秒执行检测
		this.heartbeatInterval = null //检测服务器端是否还活着
		this.reconnectTimeOut = null //重连之后多久再次重连

		try {
			console.log("开始构建 wss ……")
			return this.socketInit()
		} catch (e) {
			console.log('socketInit() error catch:'+JSON.stringify(e));
			this.is_open_socket = false
			console.log("wss reconnect() ……")
			this.reconnect();
		}
	}

	// 进入这个页面的时候创建websocket连接【整个页面随时使用】
	socketInit() {
		this.socket = uni.connectSocket({
			url: this.url,
			success: () => {
			  console.log('WebSocket连接创建成功')
			},
			fail: (err) => {
			  console.error('连接失败:', err)
			}
		})
		// this.socket = uni.connectSocket({
		// 	url: this.url,
		// 	success: () => {
		// 		console.log("WebSocket已创建连接...");
		// 	},
		// 	fail: (err) => {
		// 		console.error('连接失败:', err)
		// 	},
		// 	complete(e) {
		// 		console.log("构建 wss 返回值："+JSON.stringify(e))
		// 	}
		// });
		
		this.socket.onError((err) => {
		  console.error('WebSocket连接错误:', +JSON.stringify(err));
		  this.is_open_socket = false;
		  this.reconnect();
		});
		
		this.socket.onOpen(() => {
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
			this.socket.onMessage((res) => {
				console.log("this.socket.onMessage.res:"+res.data)
			});
		})
		// 这里仅是事件监听【如果socket关闭了会执行】
		this.socket.onClose(() => {
			console.log("已经被关闭了")
			this.is_open_socket = false;
			this.reconnect();
		})
	}
	close() {
		this.socket.close({
			success(){
				console.log("已经被关闭了")
			}
		})
	}
	//发送消息
	send(value) {
		// 注：只有连接正常打开中 ，才能正常成功发送消息
		if(!this.socket){
			console.log("未实例化")
			return;
		}
		this.socket.send({
			data: value,
			async success() {
				console.log("成功发送消息："+value);
			},
		});
	}
	//开启心跳检测
	start() {
		this.register();
		this.heartbeatInterval = setInterval(() => {
			console.log("心跳检测……")
			this.send("ping")
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
		this.socket.onMessage((res) => {
			return callback(res)
		})
	}
	// 注册信息
	register(){
		console.log("开始注册 WebSocket");
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
		this.socket.onMessage((res) => {
			
			console.log("this.socket.onMessage.res:"+res.data)
		});
	}
}

export default socket 
