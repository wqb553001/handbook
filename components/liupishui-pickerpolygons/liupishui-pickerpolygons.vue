<template>
	<view class="box-picker_position">
		<view class="map_wp">
			<map id="map_20221212" class="picker-map" scale="18" min-scale="12" @regionchange="handleRegionchange" 
				:latitude="position.latitude" :longitude="position.longitude" show-location='true'  style="width: 100%;"
				:qqmapsdkKey="qqmapsdkKey" :polygons="polygons"></map>
			<view :class="['picker_map_location', animateLocation?'animated':'']"></view>
		</view>
		<view class="list-picker_position">
			<view class="hd">
				<input type="text" v-model="searchKey" class="input_text" placeholder="请输入搜索地点">
				<button class="btn-search" type="default" @click="searchPosition"><view class="picker-search"></view>搜索</button>
			</view>
			<view class="bd">
				<view v-for="(item, index) in searchlist" @click="changeSelectItem(index)" :class="['item', item.useable?'':'disabled']" :key="index">
					<view class="item-l">
						<view class="picker-address"></view>
					</view>
					<view class="item-c">
						<view class="title">{{item.title}}</view>
						<view class="address">{{item.address}}</view>
					</view>
					<view class="item-r">
						<view v-if="item.select" class="picker-checked"></view>
					</view>
				</view>
			</view>
			<view class="ft">
				<button @click="confirmSelect" :class="['btn-selected', canConfirm?'':'disabled']">确定选点</button>
			</view>
		</view>
		
		<view>
			<!-- 提示信息弹窗 -->
			<uni-popup ref="message" type="message">
				<uni-popup-message :type="msg.msgType" :message="msg.messageText" :duration="msg.duration"></uni-popup-message>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	// #ifdef H5
	import '@/common/js/jquery-3.7.1.min.js'
	// #endif
	import { exportExcel,showToast,showLoading,hideLoading } from '@/common/js/util/excelUtil.js'
	var handleRegionchangeTimer;
	const MAP_PICKER_POSITION = "map_Picker_Position"
	export default {
		props:{
			polygons:{  // 划定区域范围
				type:Array,
				default:[]
			},
			qqmapsdkKey:{
				type:String,
				default:''
			},
			base_url:{
				type:String,
				default:''
			},
			sig:{
				type:String,
				default:''
			}
		},
		data() {
			return {
				// canConfirm: false,
				// animateLocation:false,
				// isChangeSelectItem:false,
				mapContext: null,
				canConfirm: true,
				animateLocation:false,
				isChangeSelectItem:false,
				searchKey:'',
				position:{
					latitude:'36.811995',
					longitude:'118.05539'
				},
				allAddr:{
					province:'',
					city:'',
					district:''
				},
				searchlist:[],
				msg:{
					duration :	2000
					,msgType : 'success'
					,messageText :	''
				},
			};
		},
		mounted(){
			if(this.qqmapsdkKey==''){
				uni.showToast({content: "需要腾讯地图开发Key，申请地址：https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/jsSdkOverview"})
				console.error('需要腾讯地图开发Key，申请地址：https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/jsSdkOverview')
				return;
			}
			this.mapContext = uni.createMapContext("map_20221212", this);
			this.getFromStore();
			// let needRegetLocation = true;
			// const map_Picker_Position = uni.getStorageSync(MAP_PICKER_POSITION);
			// if(map_Picker_Position){
			// 	// needRegetLocation = false;
			// 	this.position.latitude	= map_Picker_Position.position.latitude;
			// 	this.position.longitude= map_Picker_Position.position.longitude;
			// 	this.searchlist = map_Picker_Position.searchlist;
			// }
			// if(needRegetLocation){
			// 	this.getLocation();
			// }
		},
		methods:{
			init(){
				this.animateLocation = true;
				// 定时器
				handleRegionchangeTimer = setTimeout(()=>{
					this.renderList();
				}, 400);
			},
			
			renderList(){
				let _this = this;
				this.mapContext.getCenterLocation({
					success:function(rst){
						let keywordSearch = '其它';
						_this.searchFromApi(keywordSearch, 'https://apis.map.qq.com/ws/place/v1/search', rst, _this);
					}
				});
			},
			
			searchPosition(){
				if(this.searchKey.replace(/\s+/,'')==''){
					uni.showToast({
						content:'请输入关键字'
					})
					return;
				}
				// console.log("点击了 【搜索】按钮")
				// this.messageShow("点击了 【搜索】按钮")
				this.searchFromApi(this.searchKey, 'https://apis.map.qq.com/ws/place/v1/suggestion', null, this);
			},
			
			searchFromApi(keywordSearch, searchApi, rst, _this){
				// console.log("searchFromApi 接口：keywordSearch: "+keywordSearch+"；searchApi: "+ searchApi)
				// _this.messageShow("searchFromApi 接口：keywordSearch: "+keywordSearch+"；searchApi: "+ searchApi)
				
				// #ifdef H5
				const params = {keyword: encodeURI(keywordSearch), key: _this.qqmapsdkKey }
				$.ajax({
				  type: 'get',
				  // url: 'https://apis.map.qq.com/ws/place/v1/suggestion?output=jsonp'
				  url: searchApi+'?output=jsonp',
				  async: false,
				  data: params,
				  dataType: 'jsonp',
				  headers: {
					  'Access-Control-Allow-Origin': '*',
					  'Access-Control-Allow-Methods': 'GET,POST',
				  },
				  success: function (result) {
					  _this.handleLocation(searchApi, result, _this);
				  },
				  error: function (xhr, errorType, error) {
					  console.log('xhr', xhr)
					  console.log('errorType', errorType)
					  console.log('error', error)
					  // reject(xhr)
				  },
				  complete: function () { },
				});
				
				// #endif
				
				// #ifndef H5 
				uni.request({
					url: _this.base_url||searchApi, //仅为示例，并非真实接口地址。
					// url: _this.base_url||'https://apis.map.qq.com/ws/place/v1/suggestion', //仅为示例，并非真实接口地址。
					data: {
						keyword:encodeURI(keywordSearch),
						key:_this.qqmapsdkKey
						// ,boundary:'nearby('+rst.latitude+','+rst.longitude+','+200+')'
					},
					header: {},
					success: (res) => {
						// _this.messageShow("searchFromApi().uni.request.success() 正确返回："+ JSON.stringify(res))
						// _this.messageShow("mapContext.getCenterLocation 坐标点："+JSON.stringify(rst))
						_this.handleLocation(searchApi, res.data, _this);
					},
					fail: (res) => {
						console.log("searchFromApi() 异常："+ JSON.stringify(res))
						// _this.messageShow("searchFromApi().uni.request.complete() 异常："+ JSON.stringify(res))
					},
					complete: function (res) {
						// console.log("searchFromApi().complete() 返回："+ JSON.stringify(res))
						// _this.messageShow("searchFromApi().complete() 返回："+ JSON.stringify(res))
					}
				});
				// #endif
			},
			
			handleLocation(searchApi, res, _this){
				// console.log("结果处理 handleLocation() ："+ JSON.stringify(res))
				let isSelect = false;
				if(res.status == 0){
					_this.$data.searchlist = [...res.data];
					console.log("handleLocation() 正常返回："+ JSON.stringify(res.data))
					// _this.messageShow("handleLocation() 正常返回："+ JSON.stringify(res.data.data))
					
					_this.$data.searchlist.useable = false;
					_this.$data.searchlist.select = false;
					for(let i = 0;i<_this.$data.searchlist.length;i++){
						// 单独取出
						_this.$data.searchlist[i].useable = true;
						_this.$data.searchlist[i].select = false;
					}
					setTimeout(()=>{
						_this.animateLocation = false;
					}, 400)
				}
				_this.canConfirm = true;
				if(res.status == 121){
					_this.messageShow("【特此打印】此key每日调用量已达到上限，请求地址："+searchApi)
					// console.log("【特此打印】此key每日调用量已达到上限，请求地址："+searchApi);
					_this.canConfirm = false;
				}
			},
			
			changeSelectItem(index){
				if(this.$data.searchlist[index].useable){
					for(let i = 0;i<this.$data.searchlist.length;i++){
						let temp = {};
						for(var key in this.$data.searchlist[i]){
							temp[key] = this.$data.searchlist[i][key];
						}
						if(i===index){
							temp.select = true;
							this.isChangeSelectItem = true;
							this.position.latitude = temp.location.lat;
							this.position.longitude = temp.location.lng;						
						}else{
							temp.select = false;
						}
						// console.log("changeSelectItem: " + temp)
						this.$set(this.$data.searchlist, i, temp);
					}
				}
			},
			
			handleRegionchange(e){
				// console.log(e);
				this.animateLocation = false;
				if(e.type=='end'){
					if(this.isChangeSelectItem){
						setTimeout(()=>{
							this.isChangeSelectItem = false;
						}, 300)
						return;
					}else{
						this.animateLocation = true;
						if(handleRegionchangeTimer){
							clearTimeout(handleRegionchangeTimer);
						}
						// 定时器
						handleRegionchangeTimer = setTimeout(()=>{
							// this.renderList();
							this.setCenterPosition(e.detail)
						}, 600)
						
					}
				}
			},
			
			setCenterPosition(detail){
				// this.position.latitude = detail.centerLocation.latitude;
				// this.position.longitude = detail.centerLocation.longitude;
				var location = {latitude : detail.centerLocation.latitude, longitude : detail.centerLocation.longitude}
				this.requestApi('https://apis.map.qq.com/ws/geocoder/v1', location, this)
			},
			
			requestApi(searchApi, location, _this){
				// console.log("请求地址："+searchApi)
				// #ifdef H5
				const params = {key: _this.qqmapsdkKey, get_poi:1, location: `${location.latitude},${location.longitude}`, output:'jsonp' }
				$.ajax({
				  type: 'GET',
				  // url: 'https://apis.map.qq.com/ws/place/v1/suggestion?output=jsonp'
				  url: searchApi,
				  async: false,
				  data: params,
				  dataType: 'jsonp',
				  headers: {
					  'Access-Control-Allow-Origin': '*',
					  'Access-Control-Allow-Methods': 'GET,POST',
				  },
				  success: function (result) {
					  // console.log("附近搜索，返回值："+JSON.stringify(result))
					  _this.handleGeo2address(searchApi, result, _this);
				  },
				  error: function (xhr, errorType, error) {
					  console.log('xhr', xhr)
					  console.log('errorType', errorType)
					  console.log('error', error)
					  // reject(xhr)
				  },
				  complete: function () { },
				});
				// #endif
				
				// #ifndef H5 
				uni.request({
					url: _this.base_url||searchApi, //仅为示例，并非真实接口地址。
					// url: _this.base_url||'https://apis.map.qq.com/ws/place/v1/suggestion', //仅为示例，并非真实接口地址。
					data: {
						get_poi: 1,
						key:_this.qqmapsdkKey,
						location: location.latitude+','+location.longitude
					},
					header: {
					},
					success: (res) => {
						_this.handleGeo2address(searchApi, res.data, _this);
					},
					fail: (resp) => {
						console.log("requestApi() 异常："+ JSON.stringify(resp))
					},
					complete: function (res) {
						// console.log("requestApi().complete() 返回："+ JSON.stringify(res))
					}
				});
				// #endif
			},
			handleGeo2address(searchApi, res, _this) {
			  // 清空旧数据
			  _this.$data.searchlist = [];
			
			  // 错误状态处理
			  if (res.status === 121) {
			    console.error("【API调用超限】此key每日调用量已达到上限，请求地址：" + searchApi);
			    _this.messageShow("服务请求超限，请联系管理员");
			    _this.canConfirm = false;
			    return;
			  }
			
			  // 请求失败处理
			  if (res.status !== 0) {
			    console.error("地理编码请求失败:", res.message);
			    _this.messageShow("位置解析失败：" + res.message);
			    _this.canConfirm = false;
			    return;
			  }
			
			  // 成功状态处理
			  try {
			    const {ad_info, pois, formatted_addresses, address_reference} = res.result;
				this.allAddr = {
					province:	ad_info.province,
					city:		ad_info.city,
					district:	ad_info.district,
				}
			    // 基础地址信息处理
			    const baseInfo = {
			      title: 	formatted_addresses.recommend,
			      address: 	formatted_addresses.standard_address,
			      location: res.result.location,
				  province:	ad_info.province,
				  city:		ad_info.city,
				  district:	ad_info.district,
			      useable: 	true,
			      select: 	false
			    };
			
			    // POI列表处理
			    const poiList = (pois || []).map(poi => ({
			      title: 	poi.title || "未知地点",
			      address: 	poi.address || "地址不详",
			      location: {
			        lat: poi.location.lat,
			        lng: poi.location.lng
			      },
				  province:	ad_info.province,
				  city:		ad_info.city,
				  district:	ad_info.district,
			      useable: 	true,
			      select: 	false,
			      _distance: poi._distance || 0  // 保留原始数据字段
			    }));
			    // 合并基础地址和POI列表
			    _this.$data.searchlist = [baseInfo, ...poiList];
				_this.appendList(_this.$data.searchlist, address_reference);
				// console.log("收集数据："+JSON.stringify(_this.$data.searchlist))
			    // 自动选择第一个有效项
			    if (_this.$data.searchlist.length > 0) {
			      _this.$data.searchlist[0].select = true;
			      _this.position.latitude = _this.$data.searchlist[0].location.lat;
			      _this.position.longitude = _this.$data.searchlist[0].location.lng;
			    }
			
			    // 更新地图标记状态
			    setTimeout(() => {
			      _this.animateLocation = false;
			    }, 400);
			
			    // 启用确认按钮
			    _this.canConfirm = true;
				
				_this.saveToStore();
			  } catch (e) {
			    console.error("数据解析异常:", e);
			    _this.messageShow("位置数据解析异常");
			    _this.canConfirm = false;
			  }
			},
			
			explainAddress(searchlist, e){
				var title = e['title']
				if(!title||title=="") return;
				searchlist.push({			      
					title: 		e['title'],
					address: 	e['_dir_desc'],
					location: 	e['location'],
					province:	this.allAddr.province,
					city:		this.allAddr.city,
					district:	this.allAddr.district,
					useable: 	true,
					select: 	false
				});
			},
			
			appendList(searchlist, address_reference){
				if(address_reference.famous_area){
					this.explainAddress(searchlist, address_reference.famous_area)
				}
				if(address_reference.business_area){
					this.explainAddress(searchlist, address_reference.business_area)
				}
				if(address_reference.town){
					this.explainAddress(searchlist, address_reference.town)
				}
				if(address_reference.landmark_l1){
					this.explainAddress(searchlist, address_reference.landmark_l1)
				}
				if(address_reference.landmark_l2){
					this.explainAddress(searchlist, address_reference.landmark_l2)
				}
				if(address_reference.street){
					this.explainAddress(searchlist, address_reference.street)
				}
				if(address_reference.street_number){
					this.explainAddress(searchlist, address_reference.street_number)
				}
				if(address_reference.crossroad){
					this.explainAddress(searchlist, address_reference.crossroad)
				}
				if(address_reference.water){
					this.explainAddress(searchlist, address_reference.water)
				}
				if(address_reference.ocean){
					this.explainAddress(searchlist, address_reference.ocean)
				}
			},
			
			// 判断是否在区域内
			isPointInPolygon(aLat, aLon, pointList){
				return true;
				/* 
				:param aLon: double 经度 
				:param aLat: double 纬度 
				:param pointList: list [{latitude: 22.22, longitude: 113.113}...] 多边形点的顺序需根据顺时针或逆时针，不能乱 
				*/
				var iSum = 0  
				var iCount = pointList.length
				  
				if(iCount < 3) {
					return false 
				}
				//  待判断的点(x, y) 为已知值
				var y = aLat
				var x = aLon
				for(var i = 0; i < iCount; i++) {
					var y1 = pointList[i].latitude
					var x1 = pointList[i].longitude
					if(i == iCount - 1) {
						var y2 = pointList[0].latitude
						var x2 = pointList[0].longitude
					} else {
						var y2 = pointList[i + 1].latitude  
						var x2 = pointList[i + 1].longitude
					}
					// 当前边的 2 个端点分别为 已知值(x1, y1), (x2, y2)
					if (((y >= y1) && (y < y2)) || ((y >= y2) && (y < y1))) {
						//  y 界于 y1 和 y2 之间
						//  假设过待判断点(x, y)的水平直线和当前边的交点为(x_intersect, y_intersect)，有y_intersect = y
						// 则有（2个相似三角形，公用顶角，宽/宽 = 高/高）：|x1 - x2| / |x1 - x_intersect| = |y1 - y2| / |y1 - y|
						if (Math.abs(y1 - y2) > 0) {
							var x_intersect = x1 - ((x1 - x2) * (y1 - y)) / (y1 - y2);  
							if(x_intersect < x) {
								iSum += 1 
							}
						}
					} 
				}
				if(iSum % 2 != 0) { //true就是在
					return true  
				}else { //false就是不在
					return false 
				}  
			},
			
			confirmSelect(){
				const _this = this
				// console.log("点击了‘确认选点’")
				if(this.canConfirm){
					this.searchlist.forEach((val, eIndex)=>{
						if(val.select){
							// val.polygonIndex = [];
							// this.polygons.forEach((polygon,index)=>{
							// 	if(this.isPointInPolygon(val.location.lat, val.location.lng, polygon.points)){
							// 		val.polygonIndex.push(index);
							// 	}
							// })
							// let selectedLocal = JSON.stringify(val);
							// console.log("selected 点："+ selectedLocal)
							// uni.setStorageSync('polygonLocationPicker', selectedLocal);
							_this.$emit('selected', val);
							_this.saveToStore();
						}
					});
				}
			},
			
			getLocation(){
				this.position.latitude = 26.530928;
				this.position.longitude = 106.688244;
				// uni.setStorageSync('mapPickerPosition', JSON.stringify({
				// 	expireTime: new Date().getTime() - 0 + 60*1000,
				// 	position:{// 贵阳市南明区四方河路
				// 		latitude: 26.530928,
				// 		longitude: 106.688244
				// 	}
				// }))
				
				// this.init();
				
				// uni.getLocation({
				// 	cacheTimeout:1,
				// 	accuracy:'best',
				// 	type:'gcj02',
				// 	isHighAccuracy:true,
				// 	success:function(e){
				// 		console.log(e);
				// 		_this.position.latitude = e.latitude;
				// 		_this.position.longitude = e.longitude;
				// 		uni.setStorageSync('mapPickerPosition',JSON.stringify({
				// 			expireTime: new Date().getTime() - 0 + 60*1000,
				// 			position:{
				// 				latitude: e.latitude,
				// 				longitude: e.longitude
				// 			}
				// 		}))
				// 		_this.init();
				// 	},
				// 	fail:function(e){
				// 		console.log(e);
				// 	}
				// });
			},
			// 节点数据，放入缓存
			saveToStore(){
				const poi = {
					position: this.position,
					searchlist: this.searchlist,
					selectIndex: this.selectIndex
				}
				uni.setStorage({
					key: 	MAP_PICKER_POSITION,
					data:	poi
				});
			},
			// 取出缓存，初始化
			getFromStore(){
				const map_Picker_Position = uni.getStorageSync(MAP_PICKER_POSITION);
				if(map_Picker_Position){
					this.position.latitude	= map_Picker_Position.position.latitude;
					this.position.longitude	= map_Picker_Position.position.longitude;
					this.searchlist = map_Picker_Position.searchlist;
				}
			},
			
			showInfo(content){
				uni.showToast({title: content, showCancel: false, confirmText: "确定", icon:'none'})
			},
			
			// 信息提示（默认：2秒后退显）
			messageShow(messageText) {
				this.messageToggle('success', messageText)
			},
			
			messageToggle(msgType, messageText) {
				this.messageToggleTime(msgType, messageText, 2000)
			},
			// 信息提示（duration时间后退显）
			messageToggleTime(msgType, messageText, duration) {
				this.msg.duration = duration
				this.msg.type = 'center'
				this.msg.msgType = msgType
				this.msg.messageText = messageText
				this.$refs.message.open()
			},
		}

	}
</script>

<style scoped lang="scss" rel="stylesheet/scss" >
	@keyframes bounceInDown {
		   from,
		    20%,
		    53%,
		    to {
		      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
		      transform: translate3d(0, 0, 0);
		    }
		  
		    40%,
		    43% {
		      animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
		      transform: translate3d(0, -30rpx, 0) scaleY(1.1);
		    }
		  
		    70% {
		      animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
		      transform: translate3d(0, -15rpx, 0) scaleY(1.05);
		    }
		  
		    80% {
		      transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
		      transform: translate3d(0, 0, 0) scaleY(0.95);
		    }
		  
		    90% {
		      transform: translate3d(0, -4rpx, 0) scaleY(1.02);
		    }
	  }
	
	.box-picker_position{
		// height: 100%;
		overflow: hidden;
		height: 100vh;
		width: 100%;
		background: #fff;
		display: flex;
		flex-flow: column;
		position: relative;
		overflow: hidden;
		box-sizing: border-box;
	}
	.map_wp{
		position: relative;
		// width: 750rpx;
		height: 400rpx;
	}
	.picker_map_location{
		width: 60rpx;
		height: 60rpx;
		background-image: url("data:image/svg+xml,%3Csvg t='1670988557938' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='3498' width='200' height='200'%3E%3Cpath d='M511.968 0c-207.84 0-376.96 169.12-376.96 376.992 0 54.208 11.104 105.984 32.96 153.888 94.24 206.24 274.976 424 328.128 485.824 3.968 4.608 9.792 7.296 15.904 7.296s11.904-2.656 15.904-7.296c53.12-61.824 233.856-279.552 328.128-485.824 21.888-47.904 32.96-99.648 32.96-153.888-0.032-207.872-169.152-376.992-376.992-376.992zM511.968 572.8c-107.968 0-195.808-87.84-195.808-195.808s87.84-195.84 195.808-195.84 195.808 87.84 195.808 195.84c0 107.968-87.84 195.808-195.808 195.808z' fill='%23fa3c23' p-id='3499'%3E%3C/path%3E%3C/svg%3E");
		background-size: cover;
		background-position: center bottom;
		position: absolute;
		left: 50%;
		top: 50%;
		margin-left: -30rpx;
		margin-top: -60rpx;
		z-index: 999;
		transform-origin: center bottom;
	}
	.picker_map_location.animated{
		animation: bounceInDown .6s linear infinite;
	}
	.picker-map{
		width: 750rpx;
		height: 400rpx;
	}
	.list-picker_position{
		// position: absolute;  // 关键点：绝对定位
		// bottom: 0;           // 贴紧底部
		// left: 0;
		// right: 0;
		position: relative;
		flex: 1;
		display: flex;
		flex-flow: column;
		overflow: hidden;
		.hd{
			padding: 20rpx 20rpx 10rpx;
			display: flex;
			.input_text{
				flex: 1;
				box-sizing: border-box;
				background: #f2f2f2;
				border-radius: 6rpx;
				height: 60rpx;
				font-size: 28rpx;
				padding-left: 1em;
			}
		}
		.bd{
			padding: 20rpx;
			box-sizing: border-box;
			flex: 1;
			overflow-y: scroll;
			.item{
				display: flex;
				padding: 15rpx 10rpx;
				border-bottom: 1px solid #ccc;
				line-height: 1.92;
				align-items: stretch;
				.title{
					font-size: 32rpx;
				}
				.address{
					font-size: 24rpx;
					color: #999;
					line-height: 1.5;
				}
			}
			.item-l{
				padding: 10rpx 6rpx 0 0;
			}
			.item-c{
				flex: 1;
			}
			.item-r{
				width: 60rpx;
				display: flex;
				align-items: center;
				align-content: center;
			}
			.item.disabled{
				opacity: .5;
			}
		}
	}
	.btn-search{
		background: #007AFF;
		font-size: 24rpx;
		color: #fff;
		display: flex;
		padding: 0;
		align-items: center;
		justify-content: center;
		width: 120rpx;
	}
	.picker-search{
		background-image: url("data:image/svg+xml,%3Csvg t='1670900132396' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2679' width='200' height='200'%3E%3Cpath d='M685.6 660.336l155.152 155.168a16 16 0 0 1 0 22.624l-11.312 11.328a16 16 0 0 1-22.624 0l-158.528-158.544a289.792 289.792 0 0 1-165.152 51.36C322.336 742.256 192 611.904 192 451.12 192 290.336 322.336 160 483.136 160c160.784 0 291.12 130.336 291.12 291.136 0 82.112-33.984 156.272-88.672 209.2z m-202.464 33.92c134.272 0 243.12-108.848 243.12-243.12C726.256 316.848 617.408 208 483.136 208 348.848 208 240 316.848 240 451.136c0 134.272 108.848 243.12 243.136 243.12z' p-id='2680' fill='%23dbdbdb'%3E%3C/path%3E%3C/svg%3E");			background-size: cover;
		background-size: cover;
		width:36rpx;
		height: 36rpx;
		width: 36rpx;
		display: block;
		margin-right: 5rpx;
	}
	.picker-checked{
		background-image: url("data:image/svg+xml,%3Csvg t='1670909673260' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='3763' width='200' height='200'%3E%3Cpath d='M417.185185 768c-9.481481 0-18.962963-3.792593-26.548148-11.377778l-246.518518-246.518518c-15.17037-15.17037-15.17037-37.925926 0-53.096297 15.17037-15.17037 37.925926-15.17037 53.096296 0L417.185185 676.977778l409.6-409.6c15.17037-15.17037 37.925926-15.17037 53.096296 0 15.17037 15.17037 15.17037 37.925926 0 53.096296l-436.148148 436.148148c-7.585185 7.585185-17.066667 11.377778-26.548148 11.377778z' p-id='3764' fill='%231e63ed'%3E%3C/path%3E%3C/svg%3E");
		background-size: cover;
		width: 46rpx;
		height: 46rpx;
		display: block;
	}
	.picker-address{
		background-image: url("data:image/svg+xml,%3Csvg t='1670910118471' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='4833' width='200' height='200'%3E%3Cpath d='M508.313 1018.666c0 0-379.51-422.921-379.51-632.516 0-209.606 169.914-379.51 379.51-379.51s379.511 169.903 379.51 379.51c0 209.596-379.51 632.516-379.51 632.516zM508.313 55.295c-182.719 0-330.854 150.305-330.854 335.72s330.854 559.534 330.854 559.534 330.854-374.117 330.854-559.534c0-185.415-148.135-335.72-330.854-335.72zM508.312 512.654c-87.336 0-158.129-70.793-158.129-158.129s70.793-158.129 158.129-158.129 158.129 70.793 158.129 158.129c0 87.328-70.793 158.129-158.129 158.129zM508.313 240.185c-64.488 0-116.772 52.285-116.772 116.772s52.285 116.772 116.772 116.772c64.498 0 116.772-52.285 116.772-116.772 0-64.488-52.275-116.772-116.772-116.772z' fill='%23666666' p-id='4834'%3E%3C/path%3E%3C/svg%3E");
		background-size: cover;
		width: 36rpx;
		height: 36rpx;
		display: block;
	}
	.btn-selected{
		background: #007AFF;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 32rpx;
		color: #fff;
		border: none;
		border-radius: 0;
	}
	.btn-selected.disabled{
		background: #f2f2f2;
		color: #ccc;
	}
</style>
