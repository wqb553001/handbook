<template>
	<view class="container">
		
		<uni-card title="人生劝勉" :isFull="true" sub-title="投资有风险" extra="今年你笑了么">
			<text>投资什么都不抵投资健康！</text>
		</uni-card>
		<uni-card :is-shadow="false" is-full>
			<text class="uni-h6">人生最赚的生活方式是悠闲！</text>
		</uni-card>
		<uni-section title="试算" type="line" style="background-color: #eee;"> 
			<uni-group title="投资信息:">
				<view>
				  <uni-forms-item label="预估收益比 %">
					<uni-data-select @change="selectExpectValueChange" v-model="selectExpectValue" :localdata="selectExpectValueRange"  :clear="false" ></uni-data-select>
				  </uni-forms-item>
				  <uni-forms border>
					<uni-forms-item label="总金:">
						<uni-easyinput @change="inputTotalAmountChange" v-model="totalAmount" :inputBorder="true" placeholder="请输入账户总金" ></uni-easyinput>
					</uni-forms-item>
				  </uni-forms>
				  <uni-forms border>
					 <uni-forms-item label="股票代码:">
						<uni-easyinput @change="inputStockCodeChange" v-model="stockCode" :inputBorder="true" placeholder="请输入股票代码"></uni-easyinput>
					 </uni-forms-item>
				  </uni-forms>
				  <uni-forms border>
					 <uni-forms-item label="单价:">
						<uni-easyinput @change="inputUnitPriceChange" v-model="unitPrice" :inputBorder="true" placeholder="请输入预购单价"></uni-easyinput>
					 </uni-forms-item>
				  </uni-forms>
				</view>
			</uni-group>
			<uni-group title="做多试算:">
			  <button @click="refreshFromStorage" class="popup-success button-text success-text" style="padding-left:0.5rem; width: 40%;height: 2rem;" size="mini" type="primary" >刷新</button>
			  <button @click="removeStockFroStoragem" class="popup-success warn-text" style="margin-left:0.5rem; width: 40%;height: 2rem;" size="mini" type="primary">清空股票信息</button>
			  <view>
				<uni-table border stripe emptyText="暂无更多数据" >
					<uni-tr>
						<uni-th>序号			</uni-th>
						<uni-th>股票代码		</uni-th>
						<uni-th>建议投资金额	</uni-th>
						<uni-th>入手股数		</uni-th>
						<uni-th>原单价		</uni-th>
						<uni-th>涨出+值		</uni-th>
						<uni-th>跌出-值		</uni-th>
						<uni-th>+预收		</uni-th>
						<uni-th>-预收		</uni-th>
						<uni-th>收录时间		</uni-th>
						<uni-th>操作			</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, i) in tableUpData" >
						<uni-td>{{ i+1    							}}</uni-td>
						<uni-td>{{ item.stockCode					}}</uni-td>
						<uni-td>{{ item.calculateAdviseInvestMoney  }}</uni-td>
						<uni-td>{{ item.tradeCount 			        }}</uni-td>
						<uni-td>{{ item.unitPrice 			        }}</uni-td>
						<uni-td>{{ item.upOutUnitPrice 				}}</uni-td>
						<uni-td>{{ item.downOutUnitPrice 			}}</uni-td>
						<uni-td>{{ item.expectIncomeMoney 			}}</uni-td>
						<uni-td>{{ item.expectOutcomeMoney 			}}</uni-td>
						<uni-td>{{ item.updateTime 					}}</uni-td>
						<uni-td>
							<view class="uni-group">
								<button @tap="updateOne(item)" class="uni-button popup-success warn-text" size="mini" type="primary">清空</button>
								<button @tap="delOne(item)" class="uni-button" size="mini" type="warn">删除</button>
							</view>
						</uni-td>
					</uni-tr>
				  </uni-table>					
			 </view>
			</uni-group>
				 
			<uni-group title="做空试算:">
			 <view> 
				  <t-table>
					<t-tr>
						<t-th>建议投资金额	</t-th>
						<t-th>入手股数		</t-th>
						<t-th>跌出+值		</t-th>
						<t-th>涨出-值		</t-th>
						<t-th>+预收			</t-th>
						<t-th>-预收			</t-th>
					</t-tr>
					<t-tr v-for="item in tableDownData" >
						<t-td>{{ item.calculateAdviseInvestMoney    }}</t-td>
						<t-td>{{ item.tradeCount 			        }}</t-td>
						<t-td>{{ item.expectIncomeMoney 			}}</t-td>
						<t-td>{{ item.expectOutcomeMoney 			}}</t-td>
					</t-tr>
				  </t-table>					
			 </view>
			</uni-group>
			
			<uni-group title="参考计算规则" >
				<view class="warp">
					<view class="box">
						<view class="title">示例：10000$
						</view>
						<t-table @change="change">
							<t-tr>
								<t-th>编号					</t-th>
								<t-th>预期收益值（%）			</t-th>
								<t-th>建议出手收益值（%）		</t-th>
								<t-th>建议投入资金占比（%）	</t-th>
								<t-th>投入资金额				</t-th>
							</t-tr>
							<t-tr v-for="item in tableList" :key="item.id">
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
		
		<uni-section title="卡片分组" type="line" height="1300 rpx;">
			
			<uni-group title="card 模式" mode="card" height="500 rpx;">
				<view> 分组内容 </view>
				<view>
				  <uni-section title="预期收益值" type="line">
				    <uni-data-select
				        v-model="value"
				        :localdata="range"
				        @change="change"
				        :clear="false"
				    ></uni-data-select>
				    </uni-section>
					<uni-section title="去除空格" subTitle="使用 trim 属性 ,可以控制返回内容的空格 " type="line" padding>
						<text class="uni-subtitle">输入内容：{{ '"'+value+'"' }}</text>
						<uni-easyinput class="uni-mt-5" trim="all" v-model="value" placeholder="请输入内容" @input="input"></uni-easyinput>
					</uni-section>
				</view>
				<view>
					<uni-table border stripe emptyText="暂无更多数据" >
						<!-- 表头行 -->
						<uni-tr>
							<uni-th align="center">日期</uni-th>
							<uni-th align="center">姓名</uni-th>
							<uni-th align="left">地址</uni-th>
						</uni-tr>
						<!-- 表格数据行 -->
						<uni-tr>
							<uni-td>2020-10-20</uni-td>
							<uni-td>Jeson</uni-td>
							<uni-td>北京市海淀区</uni-td>
						</uni-tr>
						<uni-tr>
							<uni-td>2020-10-21</uni-td>
							<uni-td>HanMeiMei</uni-td>
							<uni-td>北京市海淀区</uni-td>
						</uni-tr>
						<uni-tr>
							<uni-td>2020-10-22</uni-td>
							<uni-td>LiLei</uni-td>
							<uni-td>北京市海淀区</uni-td>
						</uni-tr>
						<uni-tr>
							<uni-td>2020-10-23</uni-td>
							<uni-td>Danner</uni-td>
							<uni-td>北京市海淀区</uni-td>
						</uni-tr>
					</uni-table>
				
				 </view>
			</uni-group>
		
			<uni-group mode="card">
				<view>分组1</view>
				<view>分组1</view>
				<view>分组1</view>
				<view>分组1</view>
			</uni-group>
		</uni-section>

		
		<view>
			<!-- 提示信息弹窗 -->
			<uni-popup ref="message" type="message">
				<uni-popup-message :type="msgType" :message="messageText" :duration="2000"></uni-popup-message>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import tTable from '@/components/t-table/t-table.vue';
	import tTh from '@/components/t-table/t-th.vue';
	import tTr from '@/components/t-table/t-tr.vue';
	import tTd from '@/components/t-table/t-td.vue';
	
	export default {
		components: {
			tTable
			,tTh
			,tTr
			,tTd
		},
		data() {
			return {
				tableList: [// 示例金额：10000$
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
				,value: ''
				,tableUpData:[]
				,tableDownData:[]
				,totalAmount:''
				,selectExpectValue:''
				,stockCode:''
				,unitPrice:''
				,range:[]
				,input:''
				
				,type: 'center'
				,msgType: 'success'
				,messageText: '这是一条成功提示'
				
			};
		}
		,async created(){
			var that = this;
			// 表格数据加载 
			// this.refreshFromStorage();
			// uni.clearStorage()
			var keyStr = "inStorageStockList";
			uni.getStorage({
				key:keyStr,
				success: function(resp){
					console.log("返回值："+ JSON.stringify(resp.data))
					that.tableUpData = resp.data
					// that.tableUpData = Object.assign(that.tableUpData,resp.data);
				},
				fail:function(){
					console.log("未取得 key:"+keyStr);
				}
			});
			
			// 下拉选
			var rangeValue = []
			for (var i = 0; i < this.tableList.length; i++) {
				rangeValue.push({value:this.tableList[i].id, text:this.tableList[i].expect_value})
			}
			this.selectExpectValueRange = rangeValue;
		}
		,onReady() {
			var keyStr = "inStorageStockList";
			uni.getStorage({
				key:keyStr,
				success: function(resp){
					console.log("返回值："+ JSON.stringify(resp.data))
					this.tableUpData = JSON.parse(JSON.stringify(resp.data))
					// this.tableUpData = Object.assign(this.tableUpData,resp.data);
					console.log("赋值："+ JSON.stringify(this.tableUpData))
				},
				fail:function(){
					console.log("未取得 key:"+keyStr);
				}
			});
		},
		methods: {
			change(e) {
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
			//清空股票信息 inStorageStockList
			,removeStockFroStoragem(e) {
				var that = this;
				if(that.tableUpData==null||that.tableUpData.length == 0){
					that.messageToggle('warn');
				}else{
					var keyStr = "inStorageStockList";
					// 弹窗选取
					uni.showModal({
						title: '警示',
						// 提示文字
						content: '确定清空股票信息？',
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
								that.tableUpData = [];
							}else {
								// 执行取消后的操作
								console.log("放弃清空股票，保持原数据。")
							}
						}
					});
				}
			}
			// 刷新-读取最新数据
			,refreshFromStorage(e){
				var that = this;
				var keyStr = "inStorageStockList";
				uni.getStorage({
					key:keyStr,
					success: function(resp){
						console.log("返回值："+ JSON.stringify(resp.data))
						that.tableUpData = resp.data
						console.log("返回值："+ JSON.stringify(that.tableUpData))
					},
					fail:function(){
						console.log("未取得 key:"+keyStr);
					}
				});
			}
			,messageToggle(type) {
				this.type = 'center'
				this.msgType = type
				this.messageText = `股票信息已清空~`
				// this.offset: window.screen.height / 2
				this.$refs.message.open()
			}
			,edit(item) {
				uni.showToast({
					title: item.name,
					icon: 'none'
				});
			}
			,open(){
				this.$refs.calendar.open();
			}
			,confirm(e) {
				console.log(e);
			}
			,inputStockCodeChange(){
				
			}
		}
	}
</script>

<style lang="scss">
	@mixin flex {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}
		
	// table
	.title {
		font-size: 32upx;
		color: #666;
	}
	.box {
		margin: 20upx;
	}

	// .button {
	// 	font-size: 24upx;
	// }
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

	.box {
		@include flex;
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
		font-size: 12px;
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
