<template>
	<view class="container">
		<view>
			<uni-card title="人生劝勉" :isFull="true" sub-title="投资有风险" extra="today 你笑了么 (*￣︶￣) !!">
				<text>投资什么？都不抵投资健康！</text>
			</uni-card>
			<uni-card :is-shadow="false" is-full>
				<text class="uni-h6">人生最赚的生活方式：是悠闲！</text>
			</uni-card>
		</view>
		<uni-section title="试算" type="line" style="background-color: #eee;"> 
			<view class="button-container">
				<button @click="removeStorageInputDialogToggle(1)" class="button small" type="warn">清除</button>
				<button @click="tableToExcel(1)" class="button large" type="warn">导 出</button>
				<button @click="refreshFromStorage" class="button large" type="primary" >刷	新</button>
			</view>
			
			<view class="table">
			    <view class="tr">
					<view class="th">股票代码</view>
					<view class="th" v-for="headerObj in tableUpDataHeader">{{headerObj.value}}</view>
			    </view>
			    <block v-for="(item, index) in tableUpShowData" :key="index">
			       <view class="tr">
			        <view class="td">{{item.stockCode}}</view>
					<view class="td">{{ index+1    							}}</view>
					<view class="td">{{ item.tradeCount 			        }}</view>
					<view class="td">{{ item.tradeRealCount 			    }}</view>
					<view class="td">{{ item.unitPriceNow 			    	}}</view>
					<view class="td">{{ item.upOutUnitPrice 				}}</view>
					<view class="td">{{ item.downOutUnitPrice 				}}</view>
					<view class="td">{{ item.expectIncomeMoney 				}}</view>
					<view class="td">{{ item.expectIncomeMoneyReal  		}}</view>
					<view class="td">{{ item.expectOutcomeMoney 			}}</view>
					<view class="td">{{ item.expectOutcomeMoneyReal  		}}</view>
					<view class="td">{{ item.upRatio 			        	}}</view>
					<view class="td">{{ item.downRatio 			        	}}</view>
					<view class="td">{{ item.calculAdvsIvsMoney  			}}</view>
					<view class="td">{{ item.calculRealIvsMoney  			}}</view>
					<view class="td">{{ item.adviseInvestRatio 				}}</view>
					<view class="td">{{ item.updateTime 					}}</view>
			       </view>
			    </block>
			</view>
			 
			 
			<uni-group title="做空试算:">
				<view class="button-container">
					<button @click="removeStorageInputDialogToggle(2)" class="button small" type="warn">清除</button>
					<button @click="tableToExcel(2)" class="button large" type="warn">导 出</button>
					<button @click="refreshFromStorage" class="button large" type="primary" >刷	新</button>
				</view>
				<view class="table">
				    <view class="tr">
						<view class="th">股票代码</view>
						<view class="th" v-for="headerObj in tableDownDataHeader">{{headerObj.value}}</view>
				    </view>
				    <block v-for="(item, index) in tableDownShowData" :key="index">
				       <view class="tr">
				        <view class="td">{{item.stockCode}}</view>
						<view class="td">{{ index+1    							}}</view>
						<view class="td">{{ item.tradeCount 			        }}</view>
						<view class="td">{{ item.tradeRealCount 			    }}</view>
						<view class="td">{{ item.unitPriceNow 			    	}}</view>
						<view class="td">{{ item.upOutUnitPrice 				}}</view>
						<view class="td">{{ item.downOutUnitPrice 				}}</view>
						<view class="td">{{ item.expectIncomeMoney 				}}</view>
						<view class="td">{{ item.expectIncomeMoneyReal  		}}</view>
						<view class="td">{{ item.expectOutcomeMoney 			}}</view>
						<view class="td">{{ item.expectOutcomeMoneyReal  		}}</view>
						<view class="td">{{ item.upRatio 			        	}}</view>
						<view class="td">{{ item.downRatio 			        	}}</view>
						<view class="td">{{ item.calculAdvsIvsMoney  			}}</view>
						<view class="td">{{ item.calculRealIvsMoney  			}}</view>
						<view class="td">{{ item.adviseInvestRatio 				}}</view>
						<view class="td">{{ item.updateTime 					}}</view>
				       </view>
				    </block>
				</view>
			 
			</uni-group>
			
			
		</uni-section>
		
		<view>
			<!-- 提示信息弹窗 -->
			<uni-popup ref="message" type="message">
				<uni-popup-message :type="msgType" :message="messageText" :duration="2000"></uni-popup-message>
			</uni-popup>
		</view>
		<view>
			<!-- 输入框示例 -->
			<uni-popup ref="inputDialog" type="dialog">
				<uni-popup-dialog ref="inputClose"  mode="input" title="输入内容" 
					placeholder="请输入管理员密码" @confirm="removeStorageBeforeDialogInputConfirm"></uni-popup-dialog>
			</uni-popup>
		</view>
		
		
	</view>
</template>

<script>
	import tTable from '@/components/t-table/t-table.vue';
	import tTh from '@/components/t-table/t-th.vue';
	import tTr from '@/components/t-table/t-tr.vue';
	import tTd from '@/components/t-table/t-td.vue';
	import { exportExcel } from '@/common/util/excelUtil.js'
	import { formatNumber,formatDateThis,getUnixTime } from "@/common/util/dateUtil.js"
	
	export default {
		components: { tTable ,tTh ,tTr ,tTd },
		data() {
			return {
				tableUpDataHeader: [// 做多
					// {key:'stockCode',				value:'股票代码'}
					{key:'i',						value:'序号'}
					,{key:'tradeCount',				value:'建议股数'}
					,{key:'tradeRealCount',			value:'实际股数'}
					,{key:'unitPriceNow',			value:'原单价'}
					,{key:'upOutUnitPrice',			value:'涨出+单价 ↑'}
					,{key:'downOutUnitPrice',		value:'跌出-单价 ↓'}
					,{key:'expectIncomeMoney',		value:'+预赚'}
					,{key:'expectIncomeMoneyReal',	value:'+实赚'}
					,{key:'expectOutcomeMoney',		value:'-预赔'}
					,{key:'expectOutcomeMoneyReal',	value:'-实赔'}
					,{key:'upRatio',				value:'+控涨率 ↑'}
					,{key:'downRatio',				value:'-控跌率 ↓'}
					,{key:'calculAdvsIvsMoney',		value:'建议投金额'}
					,{key:'calculRealIvsMoney',		value:'实际投金额'}
					,{key:'adviseInvestRatio',		value:'投资占比'}
					,{key:'updateTime',				value:'收录时间'}
				]
				,tableDownDataHeader: [// 做空
					// {key:'stockCode',				value:'股票代码'}
					{key:'i',						value:'序号'}
					,{key:'tradeCount',				value:'建议股数'}
					,{key:'tradeRealCount',			value:'实际股数'}
					,{key:'unitPriceNow',			value:'原单价'}
					,{key:'downOutUnitPrice',		value:'跌入+单价 ↓'}
					,{key:'upOutUnitPrice',			value:'涨入-单价 ↑'}
					,{key:'expectIncomeMoney',		value:'+预赚'}
					,{key:'expectIncomeMoneyReal',	value:'+实赚'}
					,{key:'expectOutcomeMoney',		value:'-预赔'}
					,{key:'expectOutcomeMoneyReal',	value:'-实赔'}
					,{key:'upRatio',				value:'+控跌率 ↓'}
					,{key:'downRatio',				value:'-控涨率 ↑'}
					,{key:'calculAdvsIvsMoney',		value:'建议投金'}
					,{key:'calculRealIvsMoney',		value:'实际投金'}
					,{key:'adviseInvestRatio',		value:'投资占比'}
					,{key:'updateTime',				value:'收录时间'}
				]
				,value: ''
				,tableUpData:[]
				,tableUpShowData:[]
				,tableDownData:[]
				,tableDownShowData:[]
				,totalAmount:''
				,selectExpectValue:''
				,stockCode:''
				,unitPrice:''
				,range:[]
				,input:''
				
				,type: 'center'
				,msgType: 'success'
				,messageText: ''
				,clickRemoveStorageFlag:0
			};
		}
		,async created(){
			var _this = this;
			// 表格数据加载 
			this.loadTableStockList("inStorageUpStockList", "tableUpShowData", _this);
			this.loadTableStockList("inStorageDownStockList", "tableDownShowData", _this);
			
		}
		,onReady() {
		},
		methods: {
			loadTableStockList(key, table_tag_key, _this){
				uni.getStorage({
					key:key,
					success: function(resp){
						console.log("返回值："+ JSON.stringify(resp.data))
						// 更新数据
						_this.$set(_this, table_tag_key, resp.data);
					},
					fail:function(){
						console.log("未取得 key:"+key);
					}
				});
			}
			,change(e) {
				console.log(e.detail);
			}
			,inputTotalAmountChange(e) {			
				this.calculateInvestMoney();
			}
			,selectExpectValueChange(e) {		
				this.calculateInvestMoney();
			}
			,inputUnitPriceChange(e) {		
				this.calculateInvestMoney();
			}
			,calculateInvestMoney(){
				
			}
			//删除
			,delOne(item) {
				console.log("点击删除"+ JSON.stringify(item));
			}
			//更新
			,updateOne(item) {
				console.log("点击更新"+ JSON.stringify(item))
			}
			//清空股票信息 inStorageUpStockList
			,removeStockFromStorage(up_down_flag) {
				var that = this;
				var keyStr = "inStorageUpStockList";
				var up_down_flag_text = '【做多】';
				var up_down_data_name = "tableUpShowData";
				if(up_down_flag == 2){	// 默认操作【做多】，判断为【做空】时，修改
					up_down_flag_text = '【做空】'
					up_down_data_name = "tableDownShowData";
					keyStr = "inStorageDownStockList";
				}
				
				// 弹窗选取
				uni.showModal({
					title: '警示',
					// 提示文字
					content: '确定清空'+up_down_flag_text+'信息？\r\n 危险！清空不可找回，请谨慎操作！',
					// 取消按钮的文字自定义
					cancelText: "取消",
					// 确认按钮的文字自定义
					confirmText: "确定",
					//删除字体的颜色
					confirmColor:'red',
					//取消字体的颜色
					cancelColor:'#000000',
					success: function(res) {
						if (res.confirm) {
							// 执行确认后的操作
							uni.removeStorage({
								key:keyStr
							})
							// 刷空数据
							that.$set(that, up_down_data_name, []);
						}else {
							// 执行取消后的操作
							console.log("放弃清空股票，保持原数据。")
						}
						// 清空缓存数据 标识值：0-默认；1-up-做多；2-down-做空
						this.clickRemoveStorageFlag = 0;		
					}
				});
			}
			// 刷新-读取最新数据
			,refreshFromStorage(e){
				var _this = this;
				// 表格数据加载 
				this.loadTableStockList("inStorageUpStockList", "tableUpShowData", _this);
				this.loadTableStockList("inStorageDownStockList", "tableDownShowData", _this);
			}
			,messageToggle(type, messageText) {
				this.type = 'center'
				this.msgType = type
				this.messageText = messageText
				this.$refs.message.open()
			}
			,removeStorageInputDialogToggle(up_down_flag) {
				var _this = this;
				if(up_down_flag == 1){
					if(_this.tableUpShowData == null||_this.tableUpShowData.length == 0){
						_this.messageToggle('warn', `【做多】股票信息已清空~`);
						return;
					}
				}
				if(up_down_flag == 2){
					if(_this.tableDownShowData == null||_this.tableDownShowData.length == 0){
						_this.messageToggle('warn', `【做空】股票信息已清空~`);
						return;
					}
				}
				// 弹输入框
				this.$refs.inputDialog.open()
				// 清空缓存数据 标识值：0-默认；1-up-做多；2-down-做空
				this.clickRemoveStorageFlag = up_down_flag				
			}
			,removeStorageBeforeDialogInputConfirm(val) {
				var _this = this;
				uni.showLoading({
					title: '3秒后会关闭'
				})

				setTimeout(() => {
					uni.hideLoading()
					console.log("_this.clickRemoveStorageFlag:"+this.clickRemoveStorageFlag)
					// 关闭窗口后，恢复默认内容
					this.$refs.inputDialog.close()
					if(val.toUpperCase() == "ADMIN"){
						this.removeStockFromStorage(this.clickRemoveStorageFlag)
					}else{
						this.messageToggle('warn', '密码输入有误！')
					}
				}, 1)
			}
			,edit(item) {
				uni.showToast({
					title: item.name,
					icon: 'none'
				});
			}
			,confirm(e) {
				console.log(e);
			}
			,inputStockCodeChange(){
				
			}
			,tableToExcel(up_down_flag) {
			  var _this = this;
			  var tableDataHeader = _this.tableUpDataHeader;
			  var tableShowData = _this.tableUpShowData;
			  if(up_down_flag == 2){
			  	tableDataHeader = _this.tableDownDataHeader;
			  	tableShowData = _this.tableDownShowData;
			  }
			  let worksheet = 'sheet1'
			  let headerFun = function(){
					var tdTag = '';
					  tableDataHeader.forEach((v,i)=>{
						  tdTag += ('<td>'+v.value+'</td>');
					  });
					  return tdTag;
				  }
			  let headerStr = '<tr>'+ headerFun() + '</tr>'
			  // let str = '<tr><td>姓名</td><td>电话</td><td>邮箱</td></tr>'
			  //循环遍历，每行加入tr标签，每个单元格加td标签
			  tableShowData.forEach((item,i)=>{
				  headerStr += '<tr>'+'<td>'+(i+1)+'</td>';
				  tableDataHeader.forEach((v,i)=>{
					if(i==0)return;
					headerStr += ('<td>'+item[v.key]+'</td>');
				  });
				  headerStr += '</tr>'
			  });
			  //下载的表格模板数据
			  let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
				xmlns:x="urn:schemas-microsoft-com:office:excel"
				xmlns="http://www.w3.org/TR/REC-html40">
				<head><!--[if gte mso 9]><xml encoding="UTF-8"><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
				<x:Name>${worksheet}</x:Name>
				<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
				</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
				</head><body><table>${headerStr}</table></body></html>`
			  //下载模板
			  exportExcel(template, 'excel')
			}
		},
		
		
	}
</script>

<style lang="scss">
	// @mixin flex {
	// 	/* #ifndef APP-NVUE */
	// 	display: flex;
	// 	/* #endif */
	// 	flex-direction: row;
	// }
		
	// table
	.title {
		font-size: 32upx;
		color: #666;
	}
	.box {
		margin: 20upx;
	}

	.uni-table-th{
		color: #3B424D;
	}
	// 未生效
	// table{table-layout:fixed;}
	// table tr td:first-child,table tr td:first-child{width:20rpx;}
	
	// group
	.uni-wrap {
		flex-direction: column;
		/* #ifdef H5 */
		height: calc(100vh - 44px);
		/* #endif */
		/* #ifndef H5 */
		height: 100vh;
		/* #endif */
		flex: 1;
	}
	
	.scroll {
		flex-direction: column;
		flex: 1;
	}
	
	.example-body {
		padding: 0;
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
	}
	
	// select
	.text {
	  font-size: 12px;
	  color: #666;
	  margin-top: 5px;
	}

	.uni-px-5 {
	  padding-left: 10px;
	  padding-right: 10px;
	}

	.uni-pb-5 {
	  padding-bottom: 10px;
	}
	
	// 刷新按钮
	@mixin flex {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	@mixin height {
		/* #ifndef APP-NVUE */
		height: 100%;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
	}

	.button {
		@include flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		height: 35px;
		margin: 0 5px;
		border-radius: 5px;
	}

	.example-body {
		background-color: #fff;
		padding: 10px 0;
	}

	.button-text {
		color: #fff;
	}

	.popup-content {
		@include flex;
		align-items: center;
		justify-content: center;
		padding: 15px;
		height: 50px;
		background-color: #fff;
	}

	.popup-height {
		@include height;
		width: 200px;
	}

	.text {
		font-size: 12px;
		color: #333;
	}

	.popup-success {
		color: #fff;
		background-color: #e1f3d8;
	}

	.popup-warn {
		color: #fff;
		background-color: #faecd8;
	}

	.popup-error {
		color: #fff;
		background-color: #fde2e2;
	}

	.popup-info {
		color: #fff;
		background-color: #f2f6fc;
	}

	.success-text {
		color: #09bb07;
	}

	.warn-text {
		color: #e6a23c;
	}

	.error-text {
		color: #f56c6c;
	}

	.info-text {
		color: #909399;
	}

	.dialog,
	.share {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}

	.dialog-box {
		padding: 10px;
	}

	.dialog .button,
	.share .button {
		/* #ifndef APP-NVUE */
		width: 100%;
		/* #endif */
		margin: 0;
		margin-top: 10px;
		padding: 3px 0;
		flex: 1;
	}

	.dialog-text {
		font-size: 14px;
		color: #333;
	}
	
	.button-container {
	    display: flex;
	    justify-content: space-between; /* 可选，用于均匀分布按钮间的空间 */
	    width: 100%; /* 确保容器占满整行 */
	}
	
	.button {
		height: 2rem;
		// background-color: #e1f3d8;
		line-height: 1.8;
		text-align: center;
		cursor: pointer;
		border: none;
		border-radius: 4px;
		// transition: background-color 0.3s ease;
		padding: 0 10px; /* 可根据需要调整内边距 */
		
	}
	 
	/* 为不同大小的按钮设置flex值 */
	.small.button {
		flex: 1; /* 第一个按钮占据1份宽度 */
		background-color: #e1f3d8; 
		color: #e6a23c;
	}
	 
	.large.button {
		flex: 2; /* 后两个按钮各自占据2份宽度 */
		background-color: #e1f3d8; 
		color: #09bb07;
	} 
	
	// -----------------------
	// 固定首行首列
	.table-container{
	  width: 100%;
	  height: 70vh;
	  position: absolute;
	}
	/* 下面这里必须要有overflow:auto;,结合上面外部的 position: absolute; 才可以实现首行首列固定 */
	.table{
	  width: 100%;
	  max-height: 70vh;
	  overflow:auto;
	  position: relative;
	}
	.tr {
	      display: flex;
		  min-width: max-content; /* 保留内容宽度基准 */
		  width: 100%;    /* 至少充满容器宽度 */
	  }
	.th,.td {
		flex: 1;  /* 关键：自动分配剩余空间 */
	    /* 对每个单元格设置宽高, 宽同表格一致 */
	    min-width: 150rpx;
		// max-width: 300rpx; /* 添加最大宽度限制 */
	    height: 60rpx;
	    /* 每个格背景设置透明, 滑动的时候就好隐藏 */
	    // background-color: #fff;
	    display: flex;
	    justify-content: center;
	    align-items: center;
		font-size: 14px;
		color: #6a6a6a;
		border-top: 1px solid #e8e8e8; /* 边框 */
		border-right: 1px solid #e8e8e8; /* 右侧边框 */
		border-bottom: 1px solid #e8e8e8; /* 底部边框 */
	}
	.th{
	    /* 设置背景色, 滑动的时候就不会重叠字样了. */
	    background-color: #f4f6ff;
	    text-align: center;
		font-weight: bold;
	}
	 
	/* 表头部分 */
	.tr:first-child {
	    /* 将第一个格设置 sticky, 往上滑则固定住 */
	    position: sticky;
	    top: 0;
	    /* 提升表格的重叠权重, 显示出来, 同时将内容设置为透明, 就实现了固定表头的效果 */
	    z-index: 3;
	    background-color: aqua;
	}
	
	/* 隔行背景色 */
	.tr:nth-child(even) .td {
		background-color: #f8f9fa; /* 偶数行 */
	}
	.tr:nth-child(odd) .td {
		background-color: #ffffff; /* 奇数行 */
	}
	 
	/* 首行第一个单元格进行固定 */
	/* 每行第一个单元格进行固定, 宽度和表格一致对齐 */
	.th:first-child,
	.td:first-child{
	    position: relative;
	    // width: 200rpx;
	 //    left: 0;
		// z-index: 2;
		flex: 0 0 150rpx; /* 固定宽度不参与flex分配 */
	    // background-color: aquamarine;
		// background-color: #f4f6ff !important; /* 覆盖隔行颜色 */
	}
	 
	/* 将滚动条设置隐藏 */
	::-webkit-scrollbar {
	    width: 0;
	    height: 0;
	}
	
	/* 防止列挤压 */
	.th:not(:first-child),
	.td:not(:first-child) {
	  flex-shrink: 0;
	}
	
	
	
</style>
