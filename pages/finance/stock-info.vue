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
			
			<uni-group title="做多试算:">
			  <button @click="removeStorageInputDialogToggle(1)" class="popup-success warn-text" style="height: 2rem;background-color: #e1f3d8; color: #e6a23c;line-height: 1.8;" size="mini" type="warn">清除</button>
			  <button @click="tableToExcel(1)" class="popup-success warn-text" style="width:40%; height: 2rem;background-color: #e1f3d8; color: #09bb07;line-height: 1.8;" size="mini" type="warn">导	出</button>
			<button @click="refreshFromStorage" class="popup-success button-text success-text" style="width:40%;height: 2rem; background-color: #e1f3d8; color: #09bb07;line-height: 1.8;" size="mini" type="primary" >刷	新</button>
			  <view>
				<uni-table border stripe emptyText="暂无更多数据" >
					<uni-tr>
						<uni-th v-for="headerObj in tableUpDataHeader">{{headerObj.value}}</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, i) in tableUpShowData" >
						<uni-td>{{ i+1    							}}</uni-td>
						<uni-td>{{ item.stockCode					}}</uni-td>
						<uni-td>{{ item.tradeCount 			        }}</uni-td>
						<uni-td>{{ item.unitPriceNow 			    }}</uni-td>
						<uni-td>{{ item.upOutUnitPrice 				}}</uni-td>
						<uni-td>{{ item.downOutUnitPrice 			}}</uni-td>
						<uni-td>{{ item.expectIncomeMoney 			}}</uni-td>
						<uni-td>{{ item.expectOutcomeMoney 			}}</uni-td>
						<uni-td>{{ item.upRadio 			        }}</uni-td>
						<uni-td>{{ item.downRadio 			        }}</uni-td>
						<uni-td>{{ item.calculAdvsIvsMoney  }}</uni-td>
						<uni-td>{{ item.adviseInvestRatio 			}}</uni-td>
						<uni-td>{{ item.updateTime 					}}</uni-td>
					</uni-tr>
				  </uni-table>					
			 </view>
			</uni-group>
				 
			<uni-group title="做空试算:">
			
				<button @click="removeStorageInputDialogToggle(2)" class="popup-success warn-text" style="height: 2rem;background-color: #e1f3d8; color: #e6a23c;line-height: 1.8;" size="mini" type="warn">清除</button>
				<button @click="tableToExcel(2)" class="popup-success warn-text" style="width:40%; height: 2rem;background-color: #e1f3d8; color: #09bb07;line-height: 1.8;" size="mini" type="warn">导	出</button>
				<button @click="refreshFromStorage" class="popup-success button-text success-text" style="width:40%;height: 2rem; background-color: #e1f3d8; color: #09bb07;line-height: 1.8;" size="mini" type="primary" >刷	新</button>
				
				<view> 
				  <uni-table border stripe emptyText="暂无更多数据" >
				  	<uni-tr>
						<uni-th v-for="head in tableDownDataHeader">{{head.value}}</uni-th>
				  	</uni-tr>
				  	<uni-tr v-for="(item, i) in tableDownShowData" :key="i+1">
				  		<uni-td>{{ i + 1    						}}</uni-td>
				  		<uni-td>{{ item.stockCode					}}</uni-td>
				  		<uni-td>{{ item.tradeCount 			        }}</uni-td>
				  		<uni-td>{{ item.unitPriceNow 			    }}</uni-td>
				  		<uni-td>{{ item.downOutUnitPrice 			}}</uni-td>
				  		<uni-td>{{ item.upOutUnitPrice 				}}</uni-td>
				  		<uni-td>{{ item.expectIncomeMoney 			}}</uni-td>
				  		<uni-td>{{ item.expectOutcomeMoney 			}}</uni-td>
						<uni-td>{{ item.upRadio 			        }}</uni-td>
						<uni-td>{{ item.downRadio 			        }}</uni-td>
				  		<uni-td>{{ item.calculAdvsIvsMoney  		}}</uni-td>
						<uni-td>{{ item.adviseInvestRatio 			}}</uni-td>
				  		<uni-td>{{ item.updateTime 					}}</uni-td>
				  	</uni-tr>
				    </uni-table>
			 </view>
			</uni-group>
			
			<uni-group title="参考计算规则" >
				<view class="warp">
					<view class="box">
						<view class="title">示例：10000$</view>
						<t-table @change="change">
							<t-tr>
								<t-th>编号					</t-th>
								<t-th>预期收益值（%）			</t-th>
								<t-th>建议出手收益值（%）		</t-th>
								<t-th>建议投入资金占比（%）	</t-th>
								<t-th>投入资金额				</t-th>
							</t-tr>
							<t-tr v-for="item in upTableList" :key="item.id">
								<t-td>{{ item.id + 1 				}}</t-td>
								<t-td>{{ item.expect_value 			}}</t-td>
								<t-td>{{ item.advise_value 			}}</t-td>
								<t-td>{{ item.advise_invest_ratio 	}}</t-td>
								<t-td>{{ item.advise_invest_money 	}}</t-td>
							</t-tr>
						</t-table>
					</view>
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
		components: {
			tTable
			,tTh
			,tTr
			,tTd
		},
		data() {
			return {
				upTableList: [// 示例金额：10000$
					// 	编号	|预期收益值（%）				|建议出手收益值（%）			|正收益				|负收益				|投入资金占比（%）				|投入资金额				
					{id: 0, expect_value: '1~5', 		advise_value: '+3	|-2', 	up_radio: '3',		down_radio: '-2', 	advise_invest_ratio: '10', 		advise_invest_money: '1000' },
					{id: 1, expect_value: '5~10', 		advise_value: '+8	|-2', 	up_radio: '8',		down_radio: '-2', 	advise_invest_ratio: '20', 		advise_invest_money: '2000' },
					{id: 2, expect_value: '10~20', 		advise_value: '+14	|-2', 	up_radio: '14',		down_radio: '-2', 	advise_invest_ratio: '20', 		advise_invest_money: '2000' },
					{id: 3, expect_value: '20~50', 		advise_value: '+35	|-2', 	up_radio: '35',		down_radio: '-2', 	advise_invest_ratio: '15', 		advise_invest_money: '1500' },
					{id: 4, expect_value: '50~100', 	advise_value: '+60	|-8', 	up_radio: '60',		down_radio: '-8', 	advise_invest_ratio: '10', 		advise_invest_money: '1000' },
					{id: 5, expect_value: '100~200', 	advise_value: '+120	|-10', 	up_radio: '120',	down_radio: '-10', 	advise_invest_ratio: '10', 		advise_invest_money: '1000' },
					{id: 6,	expect_value: '200~500',	advise_value: '+200	|-50',	up_radio: '200',	down_radio: '-50', 	advise_invest_ratio: '10',		advise_invest_money: '1000'	},
					{id: 7,	expect_value: '>500',		advise_value: '+300	|-50',	up_radio: '300',	down_radio: '-50', 	advise_invest_ratio: '5',		advise_invest_money: '500'	}
				]
				,tableUpDataHeader: [// 做多
					 {key:'i',					value:'序号'}
					,{key:'stockCode',			value:'股票代码'}
					,{key:'tradeCount',			value:'股数'}
					,{key:'unitPriceNow',		value:'原单价'}
					,{key:'upOutUnitPrice',		value:'涨出+单价 ↑'}
					,{key:'downOutUnitPrice',	value:'跌出-单价 ↓'}
					,{key:'expectIncomeMoney',	value:'+预赚'}
					,{key:'expectOutcomeMoney',	value:'-预赔'}
					,{key:'upRadio',			value:'+控涨率 ↑'}
					,{key:'downRadio',			value:'-控跌率 ↓'}
					,{key:'calculAdvsIvsMoney',	value:'建议投资金额'}
					,{key:'adviseInvestRatio',	value:'投资占比'}
					,{key:'updateTime',			value:'收录时间'}
				]
				,tableDownDataHeader: [// 做空
					 {key:'i',					value:'序号'}
					,{key:'stockCode',			value:'股票代码'}
					,{key:'tradeCount',			value:'股数'}
					,{key:'unitPriceNow',		value:'原单价'}
					,{key:'downOutUnitPrice',	value:'跌入+单价 ↓'}
					,{key:'upOutUnitPrice',		value:'涨入-单价 ↑'}
					,{key:'expectIncomeMoney',	value:'+预赚'}
					,{key:'expectOutcomeMoney',	value:'-预赔'}
					,{key:'upRadio',			value:'+控跌率 ↓'}
					,{key:'downRadio',			value:'-控涨率 ↑'}
					,{key:'calculAdvsIvsMoney',	value:'建议投资金额'}
					,{key:'adviseInvestRatio',	value:'投资占比'}
					,{key:'updateTime',			value:'收录时间'}
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
</style>
