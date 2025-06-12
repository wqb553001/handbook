<template>
    <view class="container">
		<uni-card :is-shadow="false" is-full style="text-align: center; display: block;z-index: 9999; ">
			<view class="uni-h6" >有任何，你觉得好的，优化、改进、改善的建议或意见，都请告知我！</view>
			<text class="uni-h6" >不必非得是专家或学者！不必有多成熟或完美！</text>
		</uni-card>
		
        <uni-forms ref="form" :model="formData" :labelWidth="80">

			<uni-forms-item label="类型">
				<uni-data-select v-model="formData.suggestType" :localdata="suggestRange" >
				</uni-data-select>
			</uni-forms-item>
			<uni-forms-item label="主题">
				<uni-easyinput v-model="formData.subject" placeholder="请输入简述" />
			</uni-forms-item>
            <!-- 意见内容 -->
            <uni-forms-item label="内容" name="content">
                <uni-easyinput type="textarea"  v-model="formData.content" placeholder="方便的话, 请详述您的意见建议" :maxlength="500" />
            </uni-forms-item>

            <!-- 图片上传 -->
			<uni-forms-item label="图片">
			    <uni-file-picker
			        v-model="images"
			        limit="20"  
			        :image-styles="imageStyles"
			        mode="grid"
			        :sourceType="['camera','album']"
					:del-icon="true"
					:auto-upload="false"
					file-mediatype="image"
					@select="handleSelect"
			    ></uni-file-picker>
			</uni-forms-item>
			
            <!-- 联系方式 -->
            <uni-forms-item label="联系方式(自愿)">
                <uni-easyinput
                    v-model="formData.callPhone"
                    placeholder="如果愿意, 请留下(邮箱/QQ/微信/手机号)"
                />
            </uni-forms-item>
			
            <button class="submit-btn" @click="submit">提交</button>
        </uni-forms>
    </view>
</template>

<script>
	import uploadUtils from '@/common/js/util/uploadUtils.js';

const SYS_ID = 2025040301
export default {
	onLoad(options) {
		this.userId = options.userId
	},
    data() {
        return {
			userId: 0,
            formData: {
				sysId: SYS_ID,
                suggestType: '', // 补充缺失的字段
                subject: '',    // 补充缺失的字段
                content: '',
                callPhone: ''
            },
            images: [],
            imageStyles: {
                width: 160,
                height: 160,
				mode: 'aspectFill', 	// 图片填充模式
				background: '#f8f8f8', 	// 加载时的背景色
                border: {
                    color: '#eee',
                    width: 1,
                    style: 'solid'
                }
            },
			suggestRange:[
				{value: 1,text: "咨询"},
				{value: 2,text: "投诉"},
				{value: 3,text: "建议"},
				{value: 4,text: "举报"},
				{value: 5,text: "求助"},
				{value: 6,text: "意见"},
				{value: 7,text: "表扬"}
			],
			showUploadSheet: false,  	// 弹出 选项
			uploadActions: [
				{ index: 0, name: '从相册选择' },
				{ index: 1, name: '拍照' }
			],
        }
    },
    methods: {
        async submit() {
			console.log("点击了提交按钮")
			if(!this.formData.subject && !this.formData.content){
				uni.showToast({
                    title: '提交信息不能为空！',
                    icon: 'none'
                })
				return;
			}
			var contentHtml = `<p> ${this.formData.content} `
			if(this.images){
				const _this = this
				const uploadToken = await uploadUtils.getUploadToken(this.userId);
				// 获取所有图片本地路径
				for (const file of this.images) {
				// this.images.forEach(file => {
					const path = file.url || file.path || file
					console.log("path:"+JSON.stringify(path))
					// const imgPath = await _this.uploadImg(path, uploadToken);
					const imgPath = await uploadUtils.uploadImg(path, uploadToken, 'job/suggest/', this.userId);
					debugger
					if(imgPath){
						contentHtml += (`<img src="`+imgPath+`" alt="" data-href="" style=""/>`);
					}
					debugger
				// });
				}
			}
			contentHtml += `</p>`
			
			this.formData.content = contentHtml
			console.log("提交form:"+JSON.stringify(this.formData))
			this.saveSuggest();
			uni.navigateBack(); // 返回上一页
			return
        },
		
		async getUploadToken(){
			// 2. 获取后端颁发的上传凭证
			const tokenRes = await uni.request({
				url: process.env.UNI_BASE_URL + '/api/uploadBefore',
				method: 'GET',
				data: {
					sysId: SYS_ID,
					key: 'jobUserId='+this.userId
				}
			}).catch(err=>{
				uni.showToast({ title: '未能取得 上传凭证，请联系管理员！', icon: 'none' });
				throw err; // 可选择抛出错误或返回默认值
			});
			console.log("getToken 返回值："+ JSON.stringify(tokenRes))
			return tokenRes.data.upToken;
		},
		
		async uploadImg(imagePath, uploadToken){
			try {
				// 3. 生成唯一文件名（按需）
				const fileName = `job/suggest/${this.userId}_${Date.now()}_${Math.random().toString(36).substr(2)}.jpg`;
				console.log("图片上传-URL: " + process.env.UNI_QINIUP_URL)
				// 4. 执行上传
				const uploadRes = await uni.uploadFile({
				  url: process.env.UNI_QINIUP_URL, // 'http://up-z2.qiniup.com', // 根据存储区域选择上传域名
				  filePath: imagePath,
				  name: 'file',
				  formData: {
					token: uploadToken,
					key: fileName // 非必须，不传时七牛云自动生成文件名
				  }
				});
				console.log("上传成功，返回值："+ JSON.stringify(uploadRes))
				
				// 5. 处理响应结果
				if (uploadRes.statusCode === 200) {
				  const resData = JSON.parse(uploadRes.data);
				  return process.env.UNI_CDN + `${resData.key}`;
				}
				
			} catch (err) {
				uni.showToast({ title: '上传失败，请重新上传！', icon: 'none' });
				console.error('上传错误:', err);
				return null;
				// throw err;
			}
		},
		
		
		async saveSuggest(){
			this.images = []
			this.formData.subject = "【Job】" + this.formData.subject;
			// console.log("提交表单内容："+JSON.stringify(this.formData))
			try {
				const result = await uni.request({
					url: process.env.UNI_BASE_URL+ '/api/save/suggest',
					header: { 'Content-Type': 'application/json' },
					method: 'POST',
					data: JSON.stringify(this.formData)
				});
				// console.log("result", JSON.stringify(result))
				
				if (result.statusCode !== 200) {
				  // console.error('请求失败:', error || result.data);
				  throw new Error('保存失败，请检查网络');
				}
				if (result.data.code != 0) {
				  // console.error('保存失败:', result.data.msg);
				  throw new Error(result.data.msg || '保存失败');
				}
		
				// 明确返回数据给调用处
				return result.data.data;
			} catch (err) {
			    console.error('捕获异常:', err);
			}
			
		},
		
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
		
		// 处理文件选择事件
		handleSelect(e) {
			console.log("选择文件事件:", e);
			// 合并新旧文件（保留完整文件对象）
			this.images = [...this.images, ...e.tempFiles];
			this.$forceUpdate(); // 强制更新视图
		},
		
		
        // // 处理文件选择
        // handleFileSelect(e) {
        //     this.formData.images = e.tempFilePaths
        // },
        // // 处理文件删除
        // handleFileDelete(e) {
        //     this.formData.images.splice(e.index, 1)
        // },
		
		// // 独立拍照逻辑
		// async takePhoto() {
		// 	try {
		// 		const res = await uni.chooseImage({
		// 			count: 20,
		// 			sourceType: ['camera'],
		// 			sizeType: ['compressed']
		// 		});
		// 		this.formData.images = [...this.formData.images, ...res.tempFilePaths];
		// 	} catch (e) {
		// 		console.log('用户取消拍照', e);
		// 	}
		// },
    }
}
</script>

<style>
.container {
    padding: 20px;
}
 
.submit-btn {
    position: fixed;
    bottom: 20px;       /* 距离底部20px */
    left: 20px;         /* 左侧间距 */
    right: 20px;        /* 右侧间距 */
	background-color: #52c41a;
	color: #000000;
    border-radius: 8px;  /* 圆角 */
    padding: 12px 0;     /* 内边距 */
    font-size: 16px;     /* 字号 */
    z-index: 999;        /* 确保按钮在最上层 */
	
	
}
</style>