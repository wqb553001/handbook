class socket {
	constructor(url, userId) {
		this.is_open_socket = false 	// 避免重复连接
		this.url = url //地址
		this.data = null
		this.userId = userId
		//心跳检测
		this.timeout = 30000 			// 多少秒执行检测
		this.heartbeatInterval = null 	// 检测服务器端是否还活着
		this.reconnectTimeOut = null 	// 重连之后多久再次重连
        this.is_manually_closed = false // 标记是否人为关闭
        this.is_authenticated = false 	// 认证状态标志
        this.pendingMessages = [] 		// 存储等待发送的消息
		this.messageCallback = null 	// 添加消息回调存储

		try {
			// console.log("开始构建 wss ……")
			return this.socketInit();
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
				// return this.socketTask
			},
		});
		
		this.socketTask.onOpen((res) => {
			// console.log("WebSocket连接正常！");
			this.is_open_socket = true;
            // 发送认证消息
            this.sendAuthMessage();
			
            this.is_manually_closed = false; // 重置人为关闭标志
			// clearTimeout(this.reconnectTimeOut)
			// clearTimeout(this.heartbeatInterval)
			// this.startHeartbeat();
		});
		
		// 注：只有连接正常打开中 ，才能正常收到消息
		this.socketTask.onMessage((res) => {
			console.log("this.socketTask.onMessage.res:"+res.data)
			this.handleMessage(res.data);
		});
		
		// 监听连接失败，这里代码我注释掉的原因是因为如果服务器关闭后，和下面的onclose方法一起发起重连操作，这样会导致重复连接
		this.socketTask.onError((res) => {
			console.log('WebSocket连接打开失败，请检查！', res);
            this.is_open_socket = false;
            this.is_authenticated = false;
			this.reconnect();
		});
		
		// 这里仅是事件监听【如果socket关闭了会执行】
		this.socketTask.onClose(() => {
			console.log("监听关闭事件的发生……")
			this.is_open_socket = false;
            this.is_authenticated = false;
            // 只有非人为关闭才重连
            if (!this.is_manually_closed) {
                this.reconnect();
            }
			// this.reconnect();
		})
	}
	
	// 处理接收到的消息
	handleMessage(data) {
		try {
			const message = JSON.parse(data);
			
			if (message.type === 'pong') {
				console.log("收到心跳响应，状态正常！");
				this.is_authenticated = true;
				
				// 如果是第一次认证成功，则启动心跳
				if (!this.is_open_socket) {
					this.is_open_socket = true;
					clearTimeout(this.reconnectTimeOut);
					clearInterval(this.heartbeatInterval);
					this.startHeartbeat(); // 开始心跳
				}
				
				// 发送所有等待中的消息
				this.sendPendingMessages();
			} else if (message.code === 1) {
				console.log("收到错误消息:", message.content);
				if (message.content === "用户未绑定") {
					console.log("重新发送认证消息");
					this.sendAuthMessage();
				}
			} else {
				// 其他消息交给外部处理
				if (this.messageCallback) {
					this.messageCallback({data: data});
				}
			}
		} catch (e) {
			console.error("解析消息失败", e);
			// 如果解析失败，可能是简单消息，尝试直接传递给回调
			if (this.messageCallback) {
				this.messageCallback({data: data});
			}
		}
	}
	// 发送认证消息
	sendAuthMessage() {
		if (this.socketTask) {
			const message = JSON.stringify({sysId: -1, senderId: this.userId})
			this.socketTask.send({
				data: message,
				success: () => {
					console.log("“认证消息”发送成功:", message);
				},
				fail: (err) => {
					console.log("“认证消息”发送失败:", err);
				}
			});
		} else {
			console.log("WebSocket未连接，“认证消息”无法发送");
		}
	}
	
    // 发送等待中的消息
    sendPendingMessages() {
        while (this.pendingMessages.length > 0) {
            const message = this.pendingMessages.shift();
            this.send(message);
        }
    }

	close() {
		// 标记为人为关闭，避免重连
        // 标记为人为关闭
        this.is_manually_closed = true;
		this.is_open_socket = false; 
        this.is_authenticated = false;
		clearInterval(this.heartbeatInterval);
		clearTimeout(this.reconnectTimeOut);
        this.pendingMessages = [];
		
		if (this.socketTask) {
			this.socketTask.close({
				success: () => {
					console.log("WebSocket已关闭");
				}
			});
		}
	}
	//发送消息
	send(value) {
        // 如果未认证，将消息加入等待队列
        if (!this.is_authenticated) {
            console.log("用户未认证，消息加入等待队列:", value);
            this.pendingMessages.push(value);
            return;
        }
        
        if (this.socketTask && this.is_open_socket) {
            this.socketTask.send({
                data: value,
                success: () => {
                    console.log("消息发送成功:", value);
                },
                fail: (err) => {
                    console.log("消息发送失败:", err);
                }
            });
        } else {
            console.log("WebSocket未连接，无法发送消息");
            this.pendingMessages.push(value);
        }
	}
	//开启心跳检测
	startHeartbeat() {
		this.heartbeatInterval = setInterval(() => {
			console.log("心跳反应……")
			if (this.is_open_socket) {
				// 发送简单的心跳消息，后端应能识别并忽略
				this.send('ping');
			}
			/*this.data = {
				value: "传输内容",
				method: "方法名称"
			}
			console.log(this.data)
			this.send(JSON.stringify(this.data));*/
			
			// if (this.is_open_socket) {
			// 	// 发送认证信息-心跳检测
			// this.sendAuthMessage();
			// }

		}, this.timeout)
	}
	//重新连接
	reconnect() {
		//停止发送心跳
		clearInterval(this.heartbeatInterval)
        clearTimeout(this.reconnectTimeOut)
        
        // 防止重复重连
        if (!this.is_open_socket && !this.is_manually_closed) {
            console.log("尝试重新连接...");
            this.reconnectTimeOut = setTimeout(() => {
                this.socketInit();
            }, 5000) // 改为5秒
        }
	}
	//外部获取消息
	getMessage(callback) {
        // if (this.socketTask) {
        //     this.socketTask.onMessage((res) => {
        //         callback(res)
        //     })
        // }
		this.messageCallback = callback;
	}

}

export default socket 
