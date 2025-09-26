<template>
	<view class="pc_flow">
		<view class="pc_flow_left">
			<view class="pc_flow_content" v-for="(item, index) in dataleft" :key="index" :style="index>0?'margin-top:40rpx;':''" @click="handleImageClick(item, index * 2)">
				<image v-if="index%2==0" class="pc_img_max" :src="getImageUrl(item)" :style="limitation?'height:400rpx;':''"></image>
				<image v-else class="pc_img_min" :src="getImageUrl(item)" :style="limitation?'height:300rpx;':''"></image>
				<slot :row="item" :rowIndex="index*2"></slot>
			</view>
		</view>
		<view class="pc_flow_right">
			<view class="pc_flow_content" v-for="(item, index) in dataright" :key="index" :style="index>0?'margin-top:40rpx;':''" @click="handleImageClick(item, index * 2 + 1)">
				<image v-if="index%2!=0" class="pc_img_max" :src="getImageUrl(item)" :style="limitation?'height:400rpx;':''"></image>
				<image v-else class="pc_img_min" :src="getImageUrl(item)" :style="limitation?'height:300rpx;':''"></image>
				<slot :row="item" :rowIndex="index*2+1"></slot>
			</view>
		</view>
	</view>
</template>
<script>
	export default{
		name:'pc-flow',
		props:{
			data:{
				type:Array,
				default:()=>([])
			},
			field:{
				type:String,
				default:''
			},
			limitation:{
				type:Boolean,
				default:false
			},
			// 新增属性：当前图集的所有图片
			allImages: {
				type: Array,
				default: () => ([])
			}
		},
		data(){
			return{
				dataleft:[],
				dataright:[]
			}
		},
		watch:{
			data:{
				handler(){
					this.dataleft = []
					this.dataright = []
					try{
						let arr = JSON.parse(JSON.stringify(this.data));
						// console.log("接收到的数据为：", arr)
						arr.forEach((item,index)=>{
							if(index%2==0){
								this.dataleft.push(item)
							}else{
								this.dataright.push(item)
							}
						})
					}catch{
						console.error('pc-flow组件数据转换出错,请检查')
					}
				}, deep:true, immediate:true
			}
		},
		methods:{
			contact(item){
				this.$emit('contact',item)
			},
			// 获取图片URL
			getImageUrl(item) {
				return this.field ? item[this.field] : item;
			},
			// 处理图片点击
			handleImageClick(item, positionIndex) {
				console.log("点击了：", JSON.stringify(item))
				const imageUrl = this.getImageUrl(item);
				console.log("imageUrl:", imageUrl)
				console.log("index:", positionIndex)
				this.$emit('image-click', {
					imageUrl,
					positionIndex,
					allImages: this.allImages
				});
			},
			srcHandle(item, field, index){
				console.log("输入参数：item:", item, ";field:", field, "; index:", index)
				let some = field&&item[field]?item[field]:item[index];  // 原值：field&&item[field]?item[field]:''
				console.log("结果：", some)
				return some;
			},
		}
	}
</script>
<style lang="scss" scoped>
	.pc_flow{
		width: calc(100% - 40upx);
		padding: 20upx;
		overflow: hidden;
		display: flex;
		.pc_flow_left,.pc_flow_right{
			width: 50%;
			flex: 1;
			overflow: hidden;
			.pc_img_max, .pc_img_min{
				width: 100%;
				border-radius: 20upx;
				overflow: hidden;
				/* 可以设置一个最大高度，防止图片过长 */
				max-height: 500rpx;
			}
		}
		.pc_flow_right{
			margin-left: 20upx;
		}
	}
</style>
