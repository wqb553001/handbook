<template>
	<view >
		<!-- <uni-card :is-shadow="false" is-full>
			<text class="uni-h6">uni-forms 组件一般由输入框、选择器、单选框、多选框等控件组成，用以收集、校验、提交数据。</text>
		</uni-card> -->
		

		<view class="uni-padding-wrap uni-common-mt">
		<view class="profile-card">
			<view class="profile-info">
			<!-- <uni-card :is-shadow="false" is-full style="text-align: center; display: block; ">
				
			</uni-card> -->
			<view>
				<text class="uni-h6" style="line-height: 35px;"  :style="fontScaleChange(0.8)">无所事事，难获持久尊重；劳逸结合，过好健康人生</text>
			</view>
			
			<view class="headRight">
				<view class="member-tag">
					<uni-icons type="star" v-for="(item, index) in jobUser.jobUserDO.multiScore" :key="index" :size="18*fontScale" color="#FFD700"></uni-icons>
					<text :style="fontSet">{{score(jobUser.jobUserDO.multiScore)}}</text>
				</view>
			</view>
			</view>
			
			<view class="slider-container">
				<u-slider v-model="fontSizeScale"  activeColor="#FFCC33" backgroundColor="#000000" block-color="#8A6DE9"
				 min="50" max="200" step="10" block-size="20" @changing="onFontSizeChange" show-value> </u-slider>
			</view>
			
			
			<view class="profile-stats">
			    <view class="stat-item">
			        <text class="num" :style="fontSet">1280</text>
					<uni-icons type="hand-up-filled" :size="23*fontScale" color="#FFCC33" ></uni-icons>
			        <text class="label" :style="fontSet">获赞</text>
			    </view>
			    <view class="stat-item">
			        <text class="num" :style="fontSet">128</text>
					<uni-icons type="star-filled"  :size="23*fontScale" color="#FFCC33" ></uni-icons>
			        <text class="label" :style="fontSet">收藏</text>
			    </view>
			    <view class="stat-item">
			        <text class="num" :style="fontSet">59</text>
					<uni-icons type="redo-filled"  :size="23*fontScale" color="#FFCC33" ></uni-icons>
			        <text class="label" :style="fontSet">分享</text>
			    </view>
			</view>
			</view>
			<view class="uni-flex uni-row" style="display: flex;">
				<view class="uni-flex uni-column" style="-webkit-flex: 1; flex: 1; -webkit-justify-content: space-between; justify-content: space-between;">
					<view class="uni-flex" style="display: flex; white-space: nowrap; align-items: center;">
						<view class="text" style="padding: 0 20rpx; display: flex; align-items: center; font-weight: bold; " :style="fontScaleChange(1)" >{{jobUser.jobUserDO.username}}</view>
						<view class="text" style="padding: 0 20rpx; display: flex; align-items: center; vertical-align: middle" :style="fontScaleChange(0.85)" >{{jobUser.jobUserDO.sex==0?'男':jobUser.jobUserDO.sex==1?'女':''}}</view>
						<view class="text" style="padding: 0 20rpx; display: flex; align-items: center; vertical-align: middle" :style="fontScaleChange(0.85)" >{{calculateAge(jobUser.jobUserDO.birth)}} 岁</view>
					</view>
					<view class="text" :style="fontScaleChange(0.85)" style="text-align: left; -webkit-flex: 1; flex: 1; line-height:1.37; margin: 20px 0px 5px 0; ">
						【自带工具】：{{ jobUser.jobUserDO.tools|| '无' }}
					</view>
				</view>
				<view class="text uni-flex" style="width: 200rpx; height: 200rpx; margin-right: 10rpx;" @longpress="longPressEditHeadImage">
					<image :src="jobUser.jobUserDO.headImgPath" style="width: 200rpx; height: 200rpx;"></image>
				</view>
			</view>
		</view>
		
		<view style="width:100%" >
			<view class="text" style="text-align: left; padding-top: 50rpx;  line-height:1.37; margin-left: 10rpx;" :style="fontScaleChange(0.85)" >
				【技能】：{{ jobUser.jobUserDO.allSkills }} 
			</view>
			
			
			<view class="text" style="padding-top: 10rpx; text-align: left;">
				<view style="padding-top: 10rpx;">
					<view style="min-height: 80rpx; line-height:1.37; margin-left: 10rpx; margin-right: 10rpx;" :style="fontScaleChange(0.85)" >
						【简介】：{{ jobUser.jobUserDO.introduction || jobUser.jobUserDO.detail }}
					</view>
					
					<view style="justify-content: space-between; margin-top: 30rpx; ">
						<view style="display: flex; justify-content: space-between; align-items: flex-end">
							<view class="text" style="text-align: left; color: #2E8B57; font-weight: bold;  line-height: 1.37; padding-left: 0; " :style="fontScaleChange(1)"
								@longpress="longPressCopyText(jobUser.jobUserDO.address)">
								<uni-icons type="location" color="#D3D3D3" size="30" />
								{{ jobUser.jobUserDO.address || ' ' }}
							</view>		
							<view v-if="showDistance" style="margin-left: 20rpx; margin-right: 10rpx;">
								<view :style="fontScaleChange(0.85)">
									<text>直线距离：</text>
									<text style="white-space: nowrap;">{{calculateDistance(location.latitude, location.longitude, jobUser.jobUserDO.latitude, jobUser.jobUserDO.longitude)}}</text>
									<text>公里</text>
								 </view>
							</view>
						</view>
						
					</view>
				</view>
			</view>
		</view>
		
		<view v-if="!isMyself && jobUser.jobUserDO.isScore" style="margin-top: 80px;padding: 15px; background-color: #fff;"><!--  v-if="!isMyself && jobUser.jobUserDO.isScore" -->
			<text style="font: inherit; color: #777;" :style="fontScaleChange(1.2)">评分:</text>
			<view class="text" style="text-align: left; -webkit-flex: 1;flex: 1; margin-top: 10px;margin-bottom: 10px;">
				<uni-rate :max="10" v-model="talk.score" />
			</view>
			<text style="font: inherit; color: #777;" :style="fontScaleChange(1.2)">评价(赞赏/建议):</text>
			<uni-easyinput style="margin-top: 10px; " type="textarea" v-model="talk.talk" placeholder="请输入评价内容"
			:placeholderStyle="fontScaleChange(1.2)" :style="fontScaleChange(1.2)" />
			
			<button type="primary" @click="submit">提交</button>
		</view>

	</view>
	
	<uni-card class="detail-uni-card" v-if="jobUser?.moreReturnDOList?.length>0" :is-shadow="false" is-full style="text-align: center; display: block; margin-top: 40rpx; background-color: #f0f8ff;" custom-style="background-color: #f0f8ff;">
		<text class="uni-h1" >详情展示</text>
	</uni-card>
	
	<view  v-for="(more, index) in jobUser.moreReturnDOList" :key="index">
		<view :style="fontScaleChange(1.1)"  class="section-title" >{{more.title}}</view>
		<view :style="fontScaleChange(0.85)" class="section-summary" >{{more.summary}}</view>
		<pc-flow :data="more.images" :limitation="true" :all-images="more.images" @image-click="openPreview(more.images, $event.positionIndex)">
			<template #default="{row, rowIndex}" width="160rpx;" height="160rpx;" >
			</template>
		</pc-flow>
	</view>
	
	<view :style="fontScaleChange(1)" v-html="jobUser.content"></view>
	
	<!-- 垂直排列，略缩图显示大图 -->
<!-- 	<view>
		<uni-list  v-for="(more, index) in jobUser.moreReturnDOList" :key="index">
		    <uni-list-item direction="column" :note="more.summary">
		        <template v-slot:header>
		            <view class="uni-title">{{more.title}}</view>
		            <view class="uni-thumb uni-content list-picture" v-for="(imgs, rowIndex) in more.images" :key="rowIndex" >
						<image :src="imgs" mode="aspectFill" @click="openPreview(more.images, rowIndex, index)"></image>
					</view>
		        </template>
		    </uni-list-item>
		</uni-list>
	</view> -->
	
	<view>
		<!-- 在模板末尾添加预览组件 -->
		<image-preview
		  v-if="previewVisible"
		  ref="imagePreview"
		  :imageUrl="previewList[previewIndex]"
		  :imageList="previewList"
		  :initialIndex="previewIndex"
		  @close="closePreview"
		/>
	</view>
	<view class="am-panel am-panel-default">
	<view style="display: grid;">
		<view v-for="(comment, index) in commentPageList" :key="index" style="box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05); padding: 10px 0;"><!-- v-for="(comment,index) in commentPageList" :key="index"  电话、手机号、QQ、微信 等，方便与您取得联系~-->
			<hr>
			<view style="float: left; display: block; margin-bottom: 15px;">
				<span>&nbsp;&nbsp;</span><span>{{comment.content}}</span>
			</view>
			
			<view style="float: right; display: flex; ">
				<span :class="'want-yes-'+ comment.id">{{comment.agree}}&nbsp;</span><a href="#" title="赞同" @click.prevent.stop="voteComment(comment, 1)"><uni-icons type="hand-up-filled" :size="13*fontScale" color="#FFCC33" >赞同</uni-icons></a>&nbsp;&nbsp;
				<span :class="'want-no-'+ comment.id">{{comment.disagree}}&nbsp;</span><a href="#" title="不赞同" @click.prevent.stop="voteComment(comment, -1)"><uni-icons type="hand-down-filled" :size="13*fontScale" color="#FFCC33" >不赞同</uni-icons></a>&nbsp;
				<label style="font-weight: normal; padding-right: 5px;">{{comment.updateTime}}</label> 
				<view>{{comment.nickname}}</view>
			</view>
		</view>
	</view>
	</view>
	
</template>

<script>
	import { JobStoreManager } from '../../../common/js/util/jobStoreManager.js'
	import ImagePreview from '@/components/image-preview/index.vue';//注意路径是否正确
	
	const SYS_ID = 2025040301
	const JOB_TOKEN = 'JOB_TOKEN'
	const JOB_USER_FONT_SET = "jobUserDetailFontSet"
	const JOB_OPT_HISTORY_RECORD = "JOB_OPT_HISTORY_RECORD";
	const MAP_PICKER_POSITION = "map_Picker_Position"
	const JOB_OPT_HISTORY_RECORD_LEN = 20;
	
	const workerScoreMap = 
		{
			"-5":"",	"-4":"",	"-3":"",		"-2":"",		"-1":"",
			"0":"",		"1":"",		"2":"",			"3":"",			"4":"",			"5":"",
			"6":"",		"7":"",		"8":"劳模",		"9":"工匠",		"10":"",
			"11":"",	"12":"",	"13":"",		"13":"",
		}
		
	export default {
		components: {
			ImagePreview
		},
		data() {
			return {
				detailId: 0,
				userToken: {},
				fontScale: 1.0,
				fontSizeScale: 100,
				jobUser: {
					jobUserDO: {
						userId:0,
						username:"",
						sex:0,
						tools:'',
						headImgPath:'',
						introduction:'',
						allSkills:'',
						address:'', 
					},
					moreReturnDOList:[]
					
				},
				commentPageList: [
				// 	{content:"内容1内容1内容1内容1内容1内容1内容1内容1内容1内容1内容1", agree:2,disagree:1,updateTime:'2025-8-28 23:47:55', nickname:"游客1395"},
				// 	{content:"内容2内容2内容2内容2内容2内容2", agree:4,disagree:2,updateTime:'2025-8-28 23:47:55', nickname:"游客1010"},

				// 	{content:"内容1内容1内容1内容1内容1内容1内容1内容1内容1内容1内容1", agree:2,disagree:1,updateTime:'2025-8-28 23:47:55', nickname:"游客1395"},
				// 	{content:"内容2内容2内容2内容2内容2内容2", agree:4,disagree:2,updateTime:'2025-8-28 23:47:55', nickname:"游客1010"}
				],
				// 位置数据
				location:{
					latitude: "",
					longitude: ""
				},
				showDistance: true,
				
				// 基础表单数据
				talk: {
					userId: 0,
					score: 8,
					talk: ''
				},
				isMyself: false,
				
				// 长按 收藏/取消收藏
				jobManager: null,
				isStore: true,
				readHistoryRecord: true,
				historyRecord: [],
				
				previewVisible: false,     // 控制预览显示
				previewList: [],           // 预览图片列表
				previewIndex: 0,           // 当前预览图片索引
				
			}
		},
		computed: {
		},
		onLoad(e) {
			this.detailId = e.detailId
			const _this = this
			uni.getStorage({
				key: JOB_TOKEN,
				success: function(resp){
					_this.userToken = resp.data
					if(_this.userToken.userId == _this.detailId){
						_this.isMyself = true
					}
					// console.log("缓存取值："+ JSON.stringify(_this.userToken))
				},
				fail:function(){
				},
				complete() {
					_this.getLocalFromStore();	// 读取位置信息
					// 加载用户信息
					_this.getJobUserByUserId(_this.detailId);
				}
			});
			// console.log("参数："+ e.detailId)
			// 监听全局事件（获取选择的地址）
			uni.$on('acceptAddress', (data) => {
			    // console.log("接收地址：" + JSON.stringify(data))
				// this.baseFormData.address = data.title;
				const form = {
					latitude 	: data.location.lat,	// 纬度
					longitude 	: data.location.lng,	// 经度
					province 	: data.province,
					city 		: data.city,
					district 	: data.district,
					address : (data.title && data.title.includes(data.district))? data.title : data.district+data.title
				}
				this.location.latitude	= data.location.lat;
				this.location.longitude	= data.location.lng;
				this.jobUser.jobUserDO.address = form.address
				this.updateUser(form)
			});
		},
		onReady() {
			// 设置自定义表单校验规则，必须在节点渲染完毕后执行
		},
		onShow(){
			this.initGetFontSize(); // 页面重新加载-恢复
		},
		methods: {
			getJobUserByUserId(detailId){
				const _this = this;
				let data = {sysId: SYS_ID, userId: detailId}; // , selfId: this.userToken.userId, token: this.userToken.token
				if(this.userToken?.userId) data.selfId = this.userToken?.userId;
				if(this.userToken?.token) data.token = this.userToken?.token;
				uni.request({
					url: process.env.UNI_BASE_URL+'/api/job/getUserDetail',  // 用户数据
					data: data,
					method: 'POST',
					header: {'content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					success: result => {
						// console.log('user_detail.getUser 返回值' + JSON.stringify(result));
						if (result.statusCode == 200 && result.data.code == 0) {
							const respData = result.data.data;
							// console.log("user_detail.getUser返回值："+JSON.stringify(respData))
							if(respData) {
								// console.log("转化前："+respData.jobUserDO.skills)
								respData.jobUserDO.allSkills = respData.jobUserDO.skillsName || '';
								// respData.allSkills = JSON.parse(respData.skills)
								//   .filter(item => Object.keys(item) != -1)
								//   .map(item => Object.values(item))
								//   .join(',');
								let otherSkills = respData.jobUserDO.otherSkills;
								if(otherSkills){
									const otherSkillsName = Object.values(JSON.parse(otherSkills)).join("，")
									respData.jobUserDO.allSkills += respData.jobUserDO.allSkills ? '；' + otherSkillsName : otherSkillsName;
								}
								respData.jobUserDO.allSkills += "。"
								// console.log("转化后："+respData.jobUserDO.allSkills)
							};
							_this.jobUser = respData;
							// console.log("转化后："+JSON.stringify(respData.moreReturnDOList))
						}
					},
					fail: (result, code) => {
						console.log('fail' + JSON.stringify(result));
					}
				});
			},
			// 读取缓存的位置信息
			getLocalFromStore(){
				const _this = this
				uni.getStorage({
				  key: MAP_PICKER_POSITION,
				  success: function(res) {
					const rLocal = res.data
				    // console.log('获取到的数据为：', rLocal);
					_this.location.latitude	= rLocal.position?.latitude;
					_this.location.longitude= rLocal.position?.longitude;
				    // 在这里对获取到的数据进行处理
				  },
				  fail: function(err) {
				    console.error('获取数据失败：', err);
				    // 在这里处理获取数据失败的情况
				  }
				});
			},
			
			onFontSizeChange(scale) {
				// this.fontSizeScale = e.detail.value;
				this.fontSizeScale = scale;
				const scaleValue = this.fontSizeScale / 100;
				this.fontScale = scaleValue
				
				/* #ifdef MP-WEIXIN */
				this.fontSet = 'font-size :' + 37.5*scaleValue + 'rpx;'
				// console.log("WEIXIN 实时计算样式："+ this.fontSet)
				/* #endif */
				
				/* #ifndef MP-WEIXIN */
				this.fontSet = 'font-size :' + 1*scaleValue + 'rem;'
				// console.log("APP/H5 实时计算样式："+ this.fontSet)
				/* #endif */
				
				var _this = this
				// 字体大小存入缓存记忆
				uni.setStorage({key:JOB_USER_FONT_SET, data: _this.fontSizeScale});
			},
			fontScaleChange(baseFontSize=1){
				var fontSize = baseFontSize * (this.fontSizeScale / 100);
				/* #ifdef MP-WEIXIN */
				return 'font-size :' + 37.5*fontSize + 'rpx !important; fontSize :'+ 37.5*fontSize+ 'rpx !important;'
				// console.log("WEIXIN 实时计算样式："+ this.fontSet)
				/* #endif */
				
				/* #ifndef MP-WEIXIN */
				return 'font-size :' + 1*fontSize + 'rem !important;fontSize :'+ 1*fontSize+ 'rem !important;'
				// console.log("APP/H5 实时计算样式："+ this.fontSet)
				/* #endif */
			},
			calculateAge(birth) {
				// console.log("出生年月：" + birth)
				if(!birth) return;
				const bIndex = birth.indexOf(' 00:00:00');
				if(bIndex>0){birth = birth.substring(0, bIndex)}
				const birthday = new Date(birth);
			    const today = new Date();
			    let age = today.getFullYear() - birthday.getFullYear();
			    const m = today.getMonth() - birthday.getMonth();
			    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
			        age--;
			    }
				// console.log("计算年龄："+age)
			    return age;
			},
			submit() {
				uni.request({
					url: process.env.UNI_BASE_URL+'/api/job/saveScore',  // 数据源的数据是 有序的
					data: {sysId: SYS_ID, selfId: this.userToken.userId, token: this.userToken.token, userId: this.userToken.userId, score: this.talk.score, talk: this.talk.talk, orderId: 0},
					method: 'POST',
					header: {'content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					success: result => {
						// console.log('job/saveScore 返回值' + JSON.stringify(result));
						if (result.statusCode == 200) {
							uni.showToast({title:'感谢评价！'});
							setTimeout(() => {
							  uni.navigateBack(); // 1.5秒后，返回上一页
							}, 1000); // 3000毫秒等于3秒
							
						}
					},
					fail: (result, code) => {
						console.log('fail' + JSON.stringify(result));
					}
				});
			},
			updateUser(form){
				form.sysId 	= SYS_ID;
				form.token 	= this.userToken.token;
				form.selfId = this.userToken.userId;
				form.userId = this.userToken.userId;
				// console.log("提交表单内容："+JSON.stringify(form))
				
				uni.request({
					url: process.env.UNI_BASE_URL+ '/api/job/updateUser',
					header: { 'Content-Type': 'application/json' },
					method: 'POST',
					data: JSON.stringify(form),
					success: result => {
						// console.log('userStream 返回值' + JSON.stringify(result));
						const respData = result.data;
						if (result.statusCode == 200) {
							if(respData.code == 0){
								uni.showToast({ title: '地址更新成功！' });
								return;
							}
							
						}
						// uni.showToast({ title: '地址更新失败！请稍后重试！' , icon: 'error' });
						console.error("user_detail.updateUser 更新地址异常："+ respData.message)
					},
					fail: (result, code) => {
						console.log('fail' + JSON.stringify(result));
					}
				});
				
			},
			
			// 处理图片点击事件
			handleImageClick(event) {
				this.previewList = event.allImages;
				this.previewVisible = true;
				
				this.$nextTick(() => {
					if (this.$refs.imagePreview) {
						this.$refs.imagePreview.currentIndex = event.index;
						this.$refs.imagePreview.showPreview = true;
					}
				});
			},
			// 打开图片预览
			openPreview(images, index) {
			  // console.log("点击了图片：", index, "；图片地址：", JSON.stringify(images))
			  // console.log("预览图片URL:", this.previewList[this.previewIndex])
			  this.previewList = images;
			  this.previewIndex = index;
			  this.previewVisible = true;
			  
			  // 4. 设置预览组件的当前索引
			  this.$nextTick(() => {
				if (this.$refs.imagePreview) {
					// this.$refs.imagePreview.currentIndex = index;
					// 调用组件的内部方法设置索引
					this.$refs.imagePreview.setCurrentIndex(index);
					this.$refs.imagePreview.showPreview = true;
				} else {
					console.error("未找到预览组件实例");
				}
			  });
			},
			// 关闭预览
			closePreview() {
			  this.previewVisible = false;
			},
			blackClick(item){
				// 点击事件  item为{img:'图片地址',sname:'山海恋'}
				console.log("板块信息："+JSON.stringify(item));
			},
			// 根据地理坐标，计算直线距离
			calculateDistance(lat1, lon1, lat2, lon2) {
				// console.log(" lat1:",lat1,";lon1 :", lon1,"; lat2:", lat2,";lon2 :", lon2)
				// 地球半径，单位为公里
				const R = 6371.0;
				if (lat1&&lon1&&lat2&&lon2) {
					// console.log("可以计算距离")
					this.showDistance = true;
				}else{
					// console.log("无法计算距离");
					return 0;
				}
				// if (!lat1 || !lon1 || !lat2 || !lon2) {
				//   console.log("无法计算距离");
				//   this.showDistance = false;
				//   return 0; // 或者返回其他适当的值或抛出异常
				// }
				
				// 将经纬度从度数转换为弧度
				const lat1Rad = this.degToRad(lat1);
				const lon1Rad = this.degToRad(lon1);
				const lat2Rad = this.degToRad(lat2);
				const lon2Rad = this.degToRad(lon2);
				
				// 计算纬度和经度的差值
				const deltaLat = lat2Rad - lat1Rad;
				const deltaLon = lon2Rad - lon1Rad;
				
				// 使用Haversine公式计算距离
				const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
						  Math.cos(lat1Rad) * Math.cos(lat2Rad) *
						  Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
				const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
				
				let distance = R * c; // 距离单位为公里
				// console.log("精确直线距离：", distance)
				// 距离单位为公里，四舍五入保留两位小数
				distance = Math.round(distance * 100) / 100;
				return distance;
			},
			// 辅助函数：将角度转换为弧度
			degToRad(degrees) {
			    return degrees * (Math.PI / 180);
			},
			score(score){
				return workerScoreMap[score]
			},
			// 长按复制
			longPressCopyText(val){
				if(this.isMyself){
					uni.navigateTo({
					  url: "/pages/job/map/map"
					});
					return;
				}
				uni.setClipboardData({
					data: val,
					success() {
						uni.showToast({
							title:'已复制到剪贴板',
							icon:'none',
							position:'top'
						});
					}
				});
			},
			async longPressEditHeadImage(){
				// console.log("selfId:"+this.userToken.userId+"；userId:"+this.detailId)
				
				if(this.isMyself){
					const url = `/pages/job/head_img/head_img?userId=${this.userToken.userId}&afterUrl=/pages/job/user/user_detail?detailId=${this.detailId}&headPath=${this.jobUser.jobUserDO.headImgPath}`;
					uni.navigateTo({ url });
					return ;
				}
				if(!this.userToken?.userId) return ;
				
				if(this.readHistoryRecord){
					const _this = this;
					await uni.getStorage({
						key: JOB_OPT_HISTORY_RECORD,
						success: function(resp){
							_this.historyRecord = resp.data
							// console.log("user_detail 缓存取值："+ JSON.stringify(resp.data));
							// console.log("user_detail 赋值后："+ JSON.stringify(_this.historyRecord));
							if(!_this.jobManager) _this.jobManager = new JobStoreManager({sysId: SYS_ID, historyRecordKey: JOB_OPT_HISTORY_RECORD, maxHistoryLength: JOB_OPT_HISTORY_RECORD_LEN})
							_this.jobManager.storeOpt(_this.jobUser, '收藏', _this.isStore, _this.userToken, [..._this.historyRecord])
						},
						fail:function(){
						}
					});
				}else{
					if(!this.jobManager) this.jobManager = new JobStoreManager({sysId: SYS_ID, historyRecordKey: JOB_OPT_HISTORY_RECORD, maxHistoryLength: JOB_OPT_HISTORY_RECORD_LEN})
					this.jobManager.storeOpt(this.jobUser, '收藏', this.isStore, this.userToken, [...this.historyRecord])
				}
				
				// 已经读取过
				this.readHistoryRecord = false
				// 变更 收藏/取消收藏 标识
				this.isStore?this.isStore=false:this.isStore=true;
				
			},
			initGetFontSize(){
				// console.log("从内存读取，字体设置数据："+ JOB_USER_FONT_SET)
				var _this = this
				uni.getStorage({
					key: JOB_USER_FONT_SET,
					success: function(resp){
						// console.log("key:", JOB_USER_FONT_SET, "返回内存原值：", JSON.stringify(resp))
						_this.fontSizeScale = resp.data
						_this.onFontSizeChange(_this.fontSizeScale); // 初始化设置一次
						// console.log("初始从缓存中取值，设置字体比例：" + _this.fontSizeScale)
					},
					fail:function(){
						// console.log("首次存储，未取得 key:"+JOB_USER_FONT_SET);
					}
				});
			},
			
			
		}
	}
</script>

<style lang="scss">
	.example {
		
	}
	
	::v-deep .uni-easyinput__content-textarea  {
		/* #ifndef MP-WEIXIN */
	    font-size: v-bind('fontScale') rem !important ; /* 使用 v-bind 动态绑定字体大小 */
		/* #endif */
		
		/* #ifdef MP-WEIXIN */
		font-size: calc(v-bind('fontScale') * 37.5 ) px !important ;
		// font-size: 28 px !important ; /* 使用 v-bind 动态绑定字体大小 */
		/* #endif */
	}

	.segmented-control {
		margin-bottom: 15px;
	}

	.button-group {
		margin-top: 15px;
		display: flex;
		justify-content: space-around;
	}

	.form-item {
		display: flex;
		align-items: center;
		flex: 1;
	}

	.button {
		display: flex;
		align-items: center;
		height: 35px;
		line-height: 35px;
		margin-left: 10px;
	}
	
	
	
	.flex-item {
		width: 33.3%;
		height: 200rpx;
		text-align: center;
		line-height: 200rpx;
	}

	.flex-item-V {
		width: 100%;
		height: 150rpx;
		text-align: center;
		line-height: 150rpx;
	}

	.text {
		// margin: 15rpx 15rpx 10rpx 0;
		// padding: 0 20rpx;
		// background-color: #ebebeb;
		// height: 70rpx;
		min-height: 70rpx; // 改为最小高度
		line-height: 1.6;  // 使用无单位值，随字体缩放
		// line-height: 70rpx;
		text-align: center;
		white-space: pre-wrap; // 允许换行
		word-break: break-all; // 防止溢出
		color: #777;
		font-size: 26rpx;
	}

	.desc {
		/* text-indent: 40rpx; */
	}
	.flex-pc {
		display: flex;
		justify-content: center;
	}
	
	// 图片预览
	.main-image {
	  width: 100%;
	  height: 400px;
	  border-radius: 8px;
	  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
	}
	
	/* 添加标题样式 */
	.section-title {
		// font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin: 30rpx 20rpx 5rpx;
		padding-bottom: 10rpx;
		// border-bottom: 1px solid #eee;
	}
	
	/* 添加标题样式 */
	.section-summary {
		// font-size: 32rpx; #777  #333
		font-weight: bold;
		color: #777;
		margin: 10rpx 20rpx 15rpx;
		padding-bottom: 10rpx;
		border-bottom: 1px solid #eee;
	}
	/* 调整图片流样式 */
	.pc_flow {
		margin-bottom: 40rpx;
	}
	
	.profile-info {
		background: linear-gradient(180deg, #ff6043 51%, rgba(255, 96, 67, 0) 99%);
	    position: relative;
	    // padding: 40rpx;
	    padding: 40rpx 10rpx 40rpx 40rpx;
	    // display: flex;
	    align-items: center;
	    z-index: 1;
		width: 100%;
		box-sizing: border-box;
		align-items: flex-start; /* 修改为顶部对齐 */
	.headRight{
		flex: 0 0 50%;
		display: flex;
		position: relative; /* 关键修改：添加定位上下文 */
		flex-direction: row; /* 改为纵向布局 */
		align-items: center; /* 右侧对齐 */
		padding-left: 20rpx; /* 添加间距 */
		box-sizing: border-box;
		margin-top: 16rpx; /* 添加顶部间距 */
		.member-tag {
		  display: flex;
		  flex-wrap: wrap;
		  max-width: 80%;
		  align-items: center;
		  background: rgba(255,255,255,0.2);
		  padding: 4rpx 16rpx;
		  border-radius: 24rpx;
		  // width: fit-content;
		  margin-right: auto; /* 新增：自动占据左侧空间 */
		  gap: 4rpx; /* 图标间距 */
		  text {
			font-size: 24rpx;
			margin-left: 8rpx;
		  }
		}
	}
	}
		
	.profile-stats {
		display: flex;
		padding: 30rpx 0;
		background: #FFFFFF;
	}

	.stat-item {
		flex: 1;
		text-align: center;
		border-right: 1rpx solid #EEEEEE;
	}

	.stat-item:last-child {
		border-right: none;
	}

	.num {
		font-size: 36rpx;
		color: #333333;
		font-weight: bold;
		display: block;
	}

	.label {
		font-size: 24rpx;
		color: #999999;
		margin-top: 6rpx;
		display: block;
	}
	
	.detail-uni-card{
		.uni-card.uni-card--full.uni-card--border{
			background-color: #f0f8ff;
		}
		.uni-h1{
			font-weight: bold;
		}
	}
	
	.am-panel {
	  margin-bottom: 20px;
	  background-color: #fff;
	  border: 1px solid transparent;
	  border-radius: 0;
	  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
	          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
	}
	
	.am-panel-default {
	  border-color: #ddd;
	}
</style>
