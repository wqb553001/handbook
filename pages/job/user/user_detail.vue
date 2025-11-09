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
				
				<!-- <banner-swiper 
				    :banners="banners" 
				    :font-set="fontSet"
				    @item-click="handleBannerClick"
				    @swiper-change="onBannerSwiperChange"
				    @video-play="onBannerVideoPlay"
				    @video-pause="onBannerVideoPause"
				    @video-ended="onBannerVideoEnded"
				    @video-error="onBannerVideoError"
				  ></banner-swiper> -->
				<banner-swiper :banners="banners" :font-set="fontSet" ></banner-swiper>
				
				<view class="slider-container">
					<u-slider v-model="fontSizeScale"  activeColor="#FFCC33" backgroundColor="#000000" block-color="#8A6DE9"
					 min="50" max="200" step="10" block-size="20" @changing="onFontSizeChange" @change="onFontSizeChange" show-value> </u-slider>
				</view>
				
				
				<view class="profile-stats">
					<view class="stat-item" @click="opt(1, !storeTypeLike)">
						<text class="num" :style="fontSet" style="color: #ed1941;">{{jobUser.activityDO.likeNum||1280}}</text>
						<uni-icons type="hand-up-filled" :size="23*fontScale" :color="storeTypeLike?'#FFCC33':'#808080'" ></uni-icons>
						<text class="label" :style="fontSet">{{storeTypeLike?"已":""}}点赞</text>
					</view>
					<view class="stat-item" @click="opt(0, !storeTypeStore)">
						<text class="num" :style="fontSet" style="color: #ed1941;">{{jobUser.activityDO.storeNum||128}}</text>
						<uni-icons type="star-filled"  :size="23*fontScale" :color="storeTypeStore?'#FFCC33':'#808080'" ></uni-icons>
						<text class="label" :style="fontSet">{{storeTypeStore?"已":""}}收藏</text>
					</view>
					<view class="stat-item" @click="shareToWeChat">
						<text class="num" :style="fontSet" style="color: #ed1941;">{{jobUser.activityDO.shareNum||59}}</text>
						<uni-icons type="redo-filled"  :size="23*fontScale" color="#FFCC33" ></uni-icons>
						<text class="label" :style="fontSet">分享</text>
						<!-- <button class="share-btn"  open-type="share" data-source="button">分享给好友</button> -->
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
									<text style="white-space: nowrap;">{{ cachedDistance }}</text>
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

	
		<view v-if="jobUser.jobUserDO.level>0">
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
		</view>
		<view v-if="jobUser.jobUserDO.level>0"><!-- #5ECCBBB3; #ff4d4f-->
			<floating-menu
			  :menu-items="menuList"
			  icon-text="版本切换"
			  icon="＋"
			  color="#5ECCBBB3"
			  position="left-bottom"
			  menu-direction="up"
			  @select="onMenuSelect"
			/>
		</view>
		<view style="float: right; margin-bottom: 50px; padding-bottom: 50px;">
			<view v-if="jobUser.jobUserDO.userId != this.userToken?.userId" 
				class="text" style="display: flex; font-weight: bold; color: #2E8B57;" 
				@click="makePhoneCall(jobUser.jobUserDO.userId)" :style="fontScaleChange(1)" >立即联系
				<u-icon name="chat" :color="headTipColor(jobUser.jobUserDO.workStatus)"  size="36rpx" />
			</view>
			<view v-else :style="fontScaleChange(1)" style="margin-right: 10rpx;"><uni-icons type="contact" size="34" color="#FFCC33"></uni-icons></view>
			
		</view>

		<!-- 分享菜单 -->
		<uni-popup ref="sharePopup" type="bottom" background-color="#fff">
			<view class="share-popup">
				<!-- <view class="share-title">
					<text :style="fontScaleChange(1)">分享到</text>
				</view> -->
				<!-- <scroll-view scroll-x class="share-scroll noScorll"> -->
				<!-- <view class="share-options"> -->
					<button class="share-option uni-share-button" open-type="share">
						<view class="share-icon">
							<uni-icons type="weixin" size="50" color="#07C160"></uni-icons>
						</view>
						<text class="share-label" :style="fontScaleChange(1)">微信好友</text>
					</button>
					<!-- <view class="share-item share-option" @click="shareToTimeline">
						<view class="share-icon">
							<uni-icons type="pyq" size="50" color="#07C160"></uni-icons>
						</view>
						<text class="share-label" :style="fontScaleChange(0.8)">朋友圈</text>
					</view> -->
				<!-- </view> -->
				<!-- </scroll-view> -->
				<!-- <view class="share-item share-cancel" @click="closeShareMenu">
					<text :style="fontScaleChange(1)">取消</text>
				</view> -->
			</view>
		</uni-popup>
	</view>
	
<!-- 	<uni-fab ref="fab" :pattern="fab.pattern" :content="fab.content" 
		:horizontal="fab.horizontal" :vertical="fab.vertical"
		:direction="fab.direction" @trigger="trigger" 
		@fabClick="fabClick" /> -->
</template>

<script>
	import { JobStoreManager } from '../../../common/js/util/jobStoreManager.js'
	import ImagePreview from '@/components/image-preview/index.vue';//注意路径是否正确
	import FloatingMenu from '@/components/floating-menu/floating-menu.vue';
	import share from '@/components/job-share/share.vue';
	import BannerSwiper from '@/components/banner-swiper/banner-swiper.vue';
	
	const SYS_ID = 2025040301
	const JOB_TOKEN = 'JOB_TOKEN'
	const JOB_USER_FONT_SET = "jobUserDetailFontSet"
	const JOB_OPT_HISTORY_RECORD = "JOB_OPT_HISTORY_RECORD";
	const JOB_OPT_HISTORY_RECORD_LEN = 20;
	const MAP_PICKER_POSITION = "map_Picker_Position"
	
	const workerScoreMap = 
		{
			"-5":"",	"-4":"",	"-3":"",		"-2":"",		"-1":"",
			"0":"",		"1":"",		"2":"",			"3":"",			"4":"",			"5":"",
			"6":"",		"7":"",		"8":"劳模",		"9":"工匠",		"10":"",
			"11":"",	"12":"",	"13":"",		"13":"",
		}
		
	export default {
		components: { ImagePreview, FloatingMenu, BannerSwiper },
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
						isPlus:false
					},
					moreReturnDOList:[],
					activityDO: {
						likeNum:	0,
						storeNum:	0,
						shareNum:	0,
					}
					
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
				hasComputedDistance: false, // 标记是否已经计算过距离
				distance: 0,
				hasLocation: false,
				hasUserInfo: false,
				
				// 基础表单数据
				talk: {
					userId: 0,
					score: 8,
					talk: ''
				},
				isMyself: false,
				
				previewVisible: false,     // 控制预览显示
				previewList: [],           // 预览图片列表
				previewIndex: 0,           // 当前预览图片索引
				menuList: [
					{ label: '下一版本', icon: 'am-icon-arrow-down', 	iconText: '📝', key: 'nextLevel',	display: false },
					{ label: '×', 		icon: 'am-icon-check-circle-o', iconText: '🔗', key: 'delete', 		display: true,	menuBtnStyle: 'font-size:80rpx; color:red;',	tooltip:'删除版本'},
					{ label: '√', 		icon: 'am-icon-check-circle-o', iconText: '🔗', key: 'used',	 	display: false,	menuBtnStyle: 'font-size:70rpx;',				tooltip:'启用版本'},
					{ label: '上一版本', icon: 'am-icon-arrow-up', 		iconText: '⚙️', key: 'preLevel',	display: false }
				],
				oldLevel:null,
				defaultShareImage: '/static/img/向劳动者致敬.jpg',
				compressedImage: '', // 存储压缩后的图片路径
				
				// 浮动按钮
				fab:{
					title: 'uni-fab',
					horizontal: 'right',
					vertical: 'bottom',
					direction: 'vertical',// vertical   horizontal
					pattern: {
						color: '#7A7E83',
						backgroundColor: '#fff',
						selectedColor: '#007AFF',
						buttonColor: '#007AFF',
						iconColor: '#fff'
					},
					content: [
						{
							text: '立即联系',
							active: false
						}
					],
					is_color_type: false,
				},
				
				// 长按 收藏/取消收藏
				jobManager: null,
				readHistoryRecord: true,
				historyRecord: [],
				
				storeTypeLike: false,
				storeTypeStore: false,
				
				banners: [{
					mediumType: 2,
					url: '',
					titile: '',
					fontColor: '',
					noticeShow: false
				},{
					mediumType: 2,
					url: '',
					titile: '',
					fontColor: '',
					noticeShow: false
				}],
				
				// 轮播图配置对象
				swiperConfig: {
					indicatorDots: true,    // 是否显示指示点
					autoplay: true,         // 是否自动播放
					interval: 6000,         // 自动播放间隔（毫秒）
					duration: 3000          // 滑动动画时长（毫秒）
				},
				
				currentVideoUrl: '',
				currentSwiperIndex: 2, // 当前轮播图索引
				isVideoPlaying: false, // 是否有视频正在播放
				playingVideoIndex: -1, // 正在播放的视频索引
				videoContexts: [], // 视频上下文对象数组
				danmuList: [{
						text: '第 1s 出现的弹幕',
						color: '#ff0000',
						time: 1
					},
					{
						text: '第 3s 出现的弹幕',
						color: '#ff00ff',
						time: 3
					}
				],
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
					_this.getBanner();	// 获取，标题展示数据
					_this.getLocalFromStore();	// 读取位置信息
					// 加载用户信息
					_this.getJobUserByUserId(_this.detailId);
				}
			});
			// console.log("参数："+ e.detailId)
			// 监听全局事件（获取选择的地址）
			uni.$on('acceptAddress', (data) => {
			    console.log("接收地址：" + JSON.stringify(data))
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
		// 小程序端分享给好友（与onLoad同级）
		onShareAppMessage(res) {
		  return {
			type: 0, // 分享类型，0：图文；1：纯文字；2：纯图片；
		    title: this.jobUser.jobUserDO.username || '用户分享',
		    path: `pages/job/user/user_detail?detailId=${this.detailId}`,
			desc: this.jobUser.jobUserDO.allSkills || '这是一个很棒的用户',
			// summary: this.jobUser.jobUserDO.allSkills || '这是一个很棒的用户',
		    imageUrl: this.getCompressedImage(), // 同步获取
		    success: (res) => {
			  // 可以在这里记录分享统计
			  this.recordShareAction();
		      uni.showToast({
		        title: "分享成功",
		        icon: "success",
		      });
		    },
		    fail: (err) => {
		      console.error("分享给朋友失败:", err);
		    },
		  }
		},
		
		// 微信小程序分享到朋友圈
		onShareTimeline() {
			return {
				title: this.jobUser.jobUserDO.username || '用户分享',
				imageUrl: this.jobUser.jobUserDO.headImgPath || '',
				query: `detailId=${this.detailId}`
			};
		},
		// #ifdef APP-PLUS
		// 监听APP导航栏按钮
		// app端分享
		onNavigationBarButtonTap(e) {
			if (e.type === 'share') {
				this.$refs.share.showHandler()
			}
		},
		// #endif
		methods: {
			// 获取，标题展示数据
			getBanner() {
				let data = {sysId: SYS_ID, showWhere: 1, selfId: this.userToken.userId, token: this.userToken.token, level: 0};
				if(this.userToken?.level) data.level = this.userToken.level;	// 存在就覆盖
				uni.request({
					url: process.env.UNI_BASE_URL+'/api/job/getBanner',
					data: JSON.stringify(data),
					method: 'POST',
					success: data => {
						// console.log("getBanner() 返回值："+JSON.stringify(data))
						if (data.statusCode == 200 && data.data.code == 0) {
							this.banners = data.data.data;
							// this.onVideoJudge(this.banners[0], 0);
						}
						// uni.stopPullDownRefresh();
					},
					fail: (data, code) => {
						console.log('fail' + JSON.stringify(data));
					}
				});
			},
			
			// // 处理轮播图项的点击
			// handleItemClick(banner, index) {
			//   console.log("点击执行 handleItemClick(banner, index)，其中 index = "+index)
			// },
			// // 视频播放结束
			// onVideoJudge(banner, index) {
			//   if (banner.mediumType === 3) {
			// 	// 是视频播放
			// 	this.isVideoPlaying = true;
			// 	// 点击的是视频项
			// 	this.currentVideoUrl = banner.url;
			// 	this.playingVideoIndex = index;
			// 	// 暂停轮播图的自动播放
			// 	this.autoplay = false;
			// 	return true;
			//   }
			//   // 不是视频播放
			//   this.isVideoPlaying = false;
			//   // 恢复轮播
			//   this.autoplay = true;
			//   // 轮播下一张
			//   this.currentSwiperIndex = index;
			//   return false;
			// },
			
			// // 视频暂停
			// onVideoPause() {
			// 	console.log('视频暂停，索引:', this.playingVideoIndex);
			// 	// this.isVideoPlaying = false;
			// 	// this.playingVideoIndex = -1;
				
			// 	// // 恢复轮播
			// 	// this.autoplay = true;
			// },
			
			// // 视频播放结束
			// onVideoEnded() {
			// 	console.log('视频播放结束，索引:', this.playingVideoIndex);
			// 	this.isVideoPlaying = false;
			// 	this.playingVideoIndex = -1;
			// 	// 恢复轮播
			// 	this.autoplay = true;
			// 	// 轮播下一张
			// 	this.currentSwiperIndex = this.playingVideoIndex+1;
				
			// 	// 可选：视频播放结束后自动切换到下一张
			// 	setTimeout(() => {
			// 		if (!this.isVideoPlaying) {
			// 			this.nextSwiper();
			// 		}
			// 	}, 500);
			// },
			// // 轮播图切换事件
			// onSwiperChange(e) {
			// 	const newIndex = e.detail.current;
			// 	console.log('轮播图切换至:', newIndex);
			// 	this.currentSwiperIndex = newIndex;
			// 	this.onVideoJudge(this.banners[newIndex], newIndex);
			// },
			// // 视频错误回调
			// videoErrorCallback(e) {
			// 	console.error('视频播放错误:', e);
			// 	console.error('具体错误:', e.target.errMsg);
			// 	uni.showToast({
			// 		title: '视频加载失败，自动播放下一条',
			// 		icon: 'none'
			// 	});
			// 	// 视频加载失败时恢复轮播
			// 	this.nextSwiper();
			// },
			// 压缩图片 - 修改为同步获取
			getCompressedImage() {
				// 如果有缓存的压缩图片，直接返回
				if (this.compressedImage) {
					return this.compressedImage;
				}
				// 否则返回原始图片（在onLoad中预先压缩）
				return this.jobUser.jobUserDO.headImgPath || '';
			},
			// 预先压缩图片（在页面加载时调用）
			async preCompressImage() {
				try {
					const compressedPath = await this.compress();
					this.compressedImage = compressedPath;
				} catch (error) {
					console.error('图片压缩失败:', error);
					this.compressedImage = this.jobUser.jobUserDO.headImgPath || '';
				}
			},
				
			// 显示分享菜单
			shareToWeChat() {
				this.$refs.sharePopup.open();
			},
			
			// 关闭分享菜单
			closeShareMenu() {
				this.$refs.sharePopup.close();
			},
			// 分享到朋友圈
			shareToTimeline() {
				this.closeShareMenu();
				// 在微信小程序中，朋友圈分享需要通过右上角菜单实现
				// 这里我们只能提示用户操作
				uni.showModal({
					title: '分享到朋友圈',
					content: '请点击右上角菜单，选择"分享到朋友圈"',
					showCancel: false,
					confirmText: '知道了'
				});
			},
			// 记录分享行为（可选）
			recordShareAction() {
				// 这里可以调用API记录用户的分享行为
				// 例如：统计分享次数、记录分享用户等
				console.log('2记录分享行为，用户ID:', this.detailId);
				
				// 示例：调用后端API记录分享
				uni.request({
					url: process.env.UNI_BASE_URL + '/api/job/plusActivity',
					method: 'POST',
					data: {
						userId: this.detailId,
						shareType: 'wechat'
					},
					success: (res) => {
						console.log('分享记录成功');
					}
				});
			},
			
			// 更新菜单显示状态的方法
			updateMenuDisplay() {
			  if (this.jobUser.moreReturnDOList && this.jobUser.moreReturnDOList.length > 0) {
			    const more = this.jobUser.moreReturnDOList[0];
			    
			    this.menuList = this.menuList.map(item => {
			      let display = true;
			      
			      switch (item.key) {
			        case 'nextLevel': // 下一版本
			          display = more.nextLevel >= 1;
			          break;
			        case 'preLevel': // 上一版本
			          display = more.preLevel >= 1;
			          break;
			        case 'used': // 启用版本
			          display = more.level != this.oldLevel;
			          break;
			        case 'delete': // 删除版本
			          display = true; // 始终显示
			          break;
			      }
			      
			      return { ...item, display };
			    });
			  }
			},
			onMenuSelect({ item }) {
			  // uni.showToast({ title: `点击了：${item.label}(${item.key})`, icon: 'none' });
			  // 【idx】3：上一版本；2：启用版本；1：删除版本；0：下一版本。
			  switch (item.key) {
			    case 'nextLevel': // 下一版本
			      this.getJobUserByLevel(this.jobUser.moreReturnDOList[0].nextLevel);
			      break;
			    case 'preLevel': // 上一版本
			      this.getJobUserByLevel(this.jobUser.moreReturnDOList[0].preLevel);
			      break;
			    case 'used': // 启用版本
			      this.enableVersion();
			      break;
			    case 'delete': // 删除版本
					uni.showModal({
						title: '提示',
						content: `确定删除当前版本？`,
						confirmText: '确定',
						cancelText: '退出',
						success: (res) => {
							if (res.confirm) {
								this.removeByUserIdAndLevel();
							}
						}
					});
			      
			      break;
			  }
			},
		
			// 启用版本的方法
			enableVersion() {
			  const form = {
			    moreLevel: this.jobUser.moreReturnDOList[0].level
			  };
			  
			  if (this.oldLevel == this.jobUser.moreReturnDOList[0].level) {
			    uni.showToast({
			      title: '当前版本，已启用！',
			      icon: 'success',
			      position: 'top'
			    });
			    return;
			  }
			  
			  this.updateUser(form);
			  uni.showToast({
			    title: '已启用成功！',
			    icon: 'success',
			    position: 'top'
			  });
			},
			
			getJobUserByLevel(level){
				const _this = this;
				let data = {sysId: SYS_ID, userId: this.jobUser.jobUserDO.userId, level: level, enabled: 0}; // , selfId: this.userToken.userId, token: this.userToken.token
				if(this.userToken?.userId) data.selfId = this.userToken?.userId;
				if(this.userToken?.token) data.token = this.userToken?.token;
				console.log("user_detail.getJobUserByLevel(level) 参数："+JSON.stringify(data))
				uni.request({
					url: process.env.UNI_BASE_URL+'/api/job/getUserMore',  // 板块更多信息
					data: JSON.stringify(data),
					method: 'POST',
					header: { 'Content-Type': 'application/json' },
					success: result => {
						// console.log('user_detail.getUser 返回值' + JSON.stringify(result));
						if (result.statusCode == 200 && result.data.code == 0) {
							const respData = result.data.data;
							// console.log("user_detail.getUser返回值："+JSON.stringify(respData))
							if(respData) {
								// console.log("转化前："+respData.jobUserDO.skills)
								_this.jobUser.moreReturnDOList = respData.moreReturnDOList;
								_this.jobUser.content = respData.content
								// console.log("转化后："+respData.jobUserDO.allSkills)
							};
							// console.log("转化后："+JSON.stringify(respData.moreReturnDOList))
						}
						// 更新菜单显示状态
						_this.updateMenuDisplay();
					},
					fail: (result, code) => {
						console.log('fail' + JSON.stringify(result));
					}
				});
			},
			
			removeByUserIdAndLevel(){
				const params = {userId: 	this.jobUser.jobUserDO.userId,
								preLevel: 	this.jobUser.moreReturnDOList[0].preLevel,
								level:		this.jobUser.moreReturnDOList[0].level,
								nextLevel:	this.jobUser.moreReturnDOList[0].nextLevel
								}
				// console.log("removeByUserIdAndLevel() 参数："+JSON.stringify(params))
				uni.request({
					url: process.env.UNI_BASE_URL + '/api/job/removeUserMore',
					// header: { 'Content-Type': 'application/json' },
					method: 'GET',
					data: params,
					success() {
						uni.showToast({ title: `修改成功！` });
					},
					fail() {
						uni.showToast({ title: '更新失败，请稍后重试！', icon: 'none' });
					}
				});
			},
			
			getJobUserByUserId(detailId){
				const _this = this;
				let data = {sysId: SYS_ID, userId: detailId}; // , selfId: this.userToken.userId, token: this.userToken.token
				// , level: this.jobUser.jobUserDO.moreLeve
				if(this.userToken?.userId) data.selfId = this.userToken?.userId;
				if(this.userToken?.token) data.token = this.userToken?.token;
				uni.request({
					url: process.env.UNI_BASE_URL+'/api/job/getUserDetail',  // 用户数据
					data: data,
					method: 'POST',
					header: {'content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					success: result => {
						console.log('user_detail.getUser 返回值' + JSON.stringify(result));
						if (result.statusCode == 200 && result.data.code == 0) {
							const respData = result.data.data;
							// console.log("user_detail.getUser返回值："+JSON.stringify(respData))
							if(respData) {
								_this.jobUser = respData;
								// 展示活动
								_this.storeTypeLike = _this.jobUser.like
								_this.storeTypeStore = _this.jobUser.store
								_this.hasUserInfo = true;
								// 重置距离缓存，因为位置可能变化了
								_this.getCachedDistance();
								// console.log("转化前："+respData.jobUserDO.skills)
								respData.jobUserDO.allSkills = respData.jobUserDO.skillsName || '';
								// respData.allSkills = JSON.parse(respData.skills)
								//   .filter(item => Object.keys(item) != -1)
								//   .map(item => Object.values(item))
								//   .join(',');
								let otherSkills = respData.jobUserDO.otherSkills;
								if(otherSkills){
									try{
										const otherSkillsName = Object.values(JSON.parse(otherSkills)).join("，")
										respData.jobUserDO.allSkills += respData.jobUserDO.allSkills ? '；' + otherSkillsName : otherSkillsName;
									}catch (error){
										respData.jobUserDO.allSkills += ('；' + otherSkills)
									}
									
								}
								respData.jobUserDO.allSkills += "。"
								// console.log("转化后："+respData.jobUserDO.allSkills)
								// 预压缩分享图片
								_this.preCompressImage();
							};
							// _this.jobUser = respData;
							_this.oldLevel = _this.jobUser.jobUserDO.moreLevel;
							// console.log("转化后："+JSON.stringify(respData.moreReturnDOList))
						}
						// 更新菜单显示状态
						_this.updateMenuDisplay();
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
					_this.hasLocation = true;
				    // 重置距离缓存，因为位置可能变化了
					_this.getCachedDistance();
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
								uni.showToast({ title: '更新成功！' });
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
			// storeType类型：0-收藏；1-点赞；2-分享
			opt(type, isPlus){
				console.log("点击前 ：this.storeTypeLike："+ this.storeTypeLike+ "；this.storeTypeStore："+this.storeTypeStore)
				console.log("点击了："+(type==1?"点赞":type==0?"收藏":"分享")+"type："+type+" isPlus:"+isPlus);
				this.jobUser.jobUserDO.isPlus = isPlus
				switch(type){
					case 0:	// 收藏
						this.jobUser.activityDO.storeNum +=(1*(isPlus?1:-1));
						this.jobUser.jobUserDO.opt = '收藏';
						this.jobUser.jobUserDO.storeType = 0;// storeType类型：0-收藏；1-点赞；2-分享
						this.storeOpt(this.jobUser.jobUserDO);
						this.storeTypeStore?this.storeTypeStore=false:this.storeTypeStore=true;
						break;
					case 1: // 点赞
						this.jobUser.activityDO.likeNum +=(1*(isPlus?1:-1));
						this.jobUser.jobUserDO.opt = '点赞';
						this.jobUser.jobUserDO.storeType = 1;// storeType类型：0-收藏；1-点赞；2-分享
						this.storeOpt(this.jobUser.jobUserDO);
						this.storeTypeLike?this.storeTypeLike=false:this.storeTypeLike=true;
						break;
					case 2:	// 分享
						this.jobUser.activityDO.shareNum +=(1*(isPlus?1:-1));
						break;
				}
				console.log("点击后 ：this.storeTypeLike："+ this.storeTypeLike+ "；this.storeTypeStore："+this.storeTypeStore)
			},
			storeOpt(obj){
				if(!this.jobManager) this.jobManager = new JobStoreManager({sysId: SYS_ID, historyRecordKey: JOB_OPT_HISTORY_RECORD, maxHistoryLength: JOB_OPT_HISTORY_RECORD_LEN})
				this.jobManager.storeOpt(obj, this.userToken)
			},
			blackClick(item){
				// 点击事件  item为{img:'图片地址',sname:'山海恋'}
				console.log("板块信息："+JSON.stringify(item));
			},
			getCachedDistance(){
				// 如果已经计算过距离，直接返回缓存值
				// console.log("当前 getCachedDistance()：this.hasComputedDistance = " + this.hasComputedDistance)
				if (this.hasComputedDistance) {
					return this.cachedDistance;
				}
				if(!this.hasLocation || !this.hasUserInfo) {
					// console.log("无法计算距离");
					return 0;
				}
				
				const { latitude: latLocal, longitude: lonLocal } = this.location;
				const { latitude: latUser, longitude: lonUser } = this.jobUser.jobUserDO;
				// 如果坐标数据不全，返回0
				if (!latLocal || !lonLocal || !latUser || !lonUser) {
					this.showDistance = false;
					return 0;
				}
				// 计算距离并缓存
				this.cachedDistance = this.calculateDistance(latLocal, lonLocal, latUser, lonUser);
				this.hasComputedDistance = true;
				console.log("计算 calculateDistance() 后：this.hasComputedDistance："+ this.hasComputedDistance)
				return this.cachedDistance;
			},
			// 根据地理坐标，计算直线距离
			calculateDistance(latLocal, lonLocal, latUser, lonUser) {
				console.log("latLocal:",latLocal,";lonLocal :", lonLocal,"; latUser:", latUser,";lonUser :", lonUser)
				// 地球半径，单位为公里
				const R = 6371.0;
				if (!latLocal || !lonLocal || !latUser || !lonUser) {
				  console.log("无法计算距离 latLocal:",latLocal,";lonLocal :", lonLocal,"; latUser:", latUser,";lonUser :", lonUser);
				  this.showDistance = false;
				  return 0; // 或者返回其他适当的值或抛出异常
				}
				// 将经纬度从度数转换为弧度
				const lat1Rad = this.degToRad(latLocal);
				const lon1Rad = this.degToRad(lonLocal);
				const lat2Rad = this.degToRad(latUser);
				const lon2Rad = this.degToRad(lonUser);
				
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
				this.showDistance = true;
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
			// 长按头像
			longPressEditHeadImage(){
				if(this.isMyself){
					// 修改头像
					const url = `/pages/job/head_img/head_img?userId=${this.userToken.userId}&afterUrl=/pages/job/user/user_detail?detailId=${this.detailId}&headPath=${this.jobUser.jobUserDO.headImgPath}`;
					uni.navigateTo({ url });
					return ;
				}
				if(!this.userToken?.userId) return ;
				// 收藏该用户
				this.opt(0, !this.storeTypeStore);
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
			
			// 压缩图片逻辑优化
			async compress() {
				console.log('开始压缩');
				let img = this.jobUser.jobUserDO.headImgPath;
				if (!img) {
					console.log('没有头像图片');
					return '';
				}
				
				// 如果是网络图片，先下载
				if (img.startsWith("http")) {
					try {
						img = await this.downFiled(img);
					} catch (error) {
						console.error('下载图片失败:', error);
						return this.jobUser.jobUserDO.headImgPath;
					}
				}
				
				try {
					const fileInfo = await uni.getFileInfo({ filePath: img });
					console.log('图片大小:', fileInfo.size, '字节');
					
					if (fileInfo.size > 20 * 1024) {
						console.log('图片超过20KB，需要压缩');
						const compressedPath = await this.compressImage(img);
						return compressedPath;
					} else {
						console.log('图片大小未超过20KB，无需压缩');
						return img;
					}
				} catch (error) {
					console.error('获取文件信息失败:', error);
					return img;
				}
			},
			
			compressImage(img) {
				return new Promise((resolve, reject) => {
					uni.compressImage({
						src: img,
						quality: 60, // 降低质量到60，确保小于20KB
						success: (res) => {
							console.log('压缩后的图片路径:', res.tempFilePath);
							// 检查压缩后的大小
							uni.getFileInfo({
								filePath: res.tempFilePath,
								success: (fileRes) => {
									console.log('压缩后图片大小:', fileRes.size, '字节');
									if (fileRes.size > 20 * 1024) {
										// 如果还是太大，继续压缩
										console.log('压缩后仍然超过20KB，继续压缩');
										this.compressImageWithLowerQuality(img, 40)
											.then(resolve)
											.catch(reject);
									} else {
										resolve(res.tempFilePath);
									}
								},
								fail: () => {
									resolve(res.tempFilePath);
								}
							});
						},
						fail: (err) => {
							console.error('图片压缩失败:', err);
							reject(err);
						}
					});
				});
			},
			
			// 更低质量的压缩
			compressImageWithLowerQuality(img, quality) {
				return new Promise((resolve, reject) => {
					uni.compressImage({
						src: img,
						quality: quality,
						success: (res) => {
							console.log(`质量${quality}%压缩后的图片路径:`, res.tempFilePath);
							resolve(res.tempFilePath);
						},
						fail: (err) => {
							console.error('二次压缩失败:', err);
							reject(err);
						}
					});
				});
			},
			
			downFiled(url) {
				return new Promise((resolve, reject) => {
					uni.downloadFile({
						url,
						success: (res) => {
							if (res.statusCode === 200) {
								console.log("下载完成", res.tempFilePath);
								resolve(res.tempFilePath);
							} else {
								reject(new Error('下载失败'));
							}
						},
						fail: (err) => {
							reject(err);
						}
					});
				});
			},
			
			// 打电话 => 发信息
			makePhoneCall: function (receiverId) {
				if(!this.userToken?.userId){
					uni.showToast({ title: '先登录，才能有效联系对方！', icon: 'none' });
					return;
				}
				
				uni.navigateTo({
					url:`/pages/job/online/message?senderId=${this.userToken.userId}&receiverId=${receiverId}`
				})
				return;
				
				uni.showModal({
					title: '提示',
					content: '不允许骚扰对方，本次通话会被记录，可能会录音，若被举报，会降低本人的信誉值，请正常开展！',
					confirmText: '同意',
					cancelText: '退出',
					success: (res) => {
						if (res.confirm) {
							let data = {sysId: SYS_ID, selfId: this.userToken.userId, token: this.userToken.token, receiverId: receiverId, userId: receiverId}
							
							uni.request({
								url: process.env.UNI_BASE_URL+'/api/job/userMobile',  // 获取手机号
								data: JSON.stringify(data),
								method: 'POST',
								success: result => {
									// console.log('userMobile 返回值' + JSON.stringify(result));
									if (result.statusCode == 200 && result.data.code == 0) {
										const respData = result.data.data;
										uni.makePhoneCall({
											phoneNumber: respData,
											success: () => {
												// data.username = _this.username;
												uni.request({
													url: process.env.UNI_BASE_URL+'/api/job/recordCallMobile',  // 数据源的数据是 有序的
													data: JSON.stringify(data),
													method: 'POST',
													success: result => {
														console.log("完成记录。")
													},
												});
												console.log("成功拨打电话:"+respData)
											}
										});
									}
								},
								fail: (result, code) => {
									console.log('fail' + JSON.stringify(result));
								},
								complete: (result) =>{
									// console.log('result' + JSON.stringify(result));
								},
							});
						}
					}
				});
				
				
				
			},
			
			headTipColor(workStatus){
				if(workStatus==0) return '#62ed0d';		// 开放接单中
				if(workStatus==10) return '#ed1941';	// 工作中 #ff6043  #ffe600
				if(workStatus==20) return '#D3D3D3';	// 休假中 #deab8a  #D3D3D3
			},
			trigger(e){
				this.makePhoneCall(this.receiverId)
			},
			fabClick(){
				
			},
		}
	}
</script>

<style lang="scss">
	$mxg-text-color-grey: #808080;
	
	.example {
		
	}
	
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
	
	/* 分享弹窗样式 */
	.share-popup {
		background: #fff;
		border-radius: 20rpx 20rpx 0 0;
		padding: 40rpx 0 0;
	}
	
	.share-title {
		text-align: center;
		padding: 20rpx 0;
		font-weight: bold;
		color: #333;
		border-bottom: 1rpx solid #f0f0f0;
	}
	
	.share-options {
		display: flex;
		justify-content: space-around;
		padding: 40rpx 0;
	}
	
	.share-option {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.share-icon {
		width: 100rpx;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 20rpx;
	}
	
	.share-label {
		color: #666;
	}
	
	.share-cancel {
		text-align: center;
		padding: 30rpx 0;
		background: #f8f8f8;
		color: #333;
		font-weight: bold;
		border-top: 1rpx solid #f0f0f0;
	}
	
	
	.share-body {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 100;
	
		.share-cancel {
			background-color: #FFF;
			text-align: center;
			width: 100%;
			padding: 25rpx 0;
		}
	
		.share-scroll {
			background-color: #f7f7f7;
			width: 100%;
			height: 200rpx;
			display: flex;
			white-space: nowrap;
			padding-top: 45rpx;
	
			.share-item {
				display: inline-flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				width: 25%;
			}
	
			view {
				color: $mxg-text-color-grey;
				font-size: 25rpx;
				padding: 10rpx;
			}
	
			image {
				height: 60rpx;
				width: 60rpx;
			}
		}
	}
	
	deo-poster {
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
