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
			  <view> 
				<uni-table border stripe emptyText="暂无更多数据" >
					<uni-tr>
						<uni-th>建议投资金额	</uni-th>
						<uni-th>入手股数		</uni-th>
						<uni-th>原单价		</uni-th>
						<uni-th>涨出+值		</uni-th>
						<uni-th>跌出-值		</uni-th>
						<uni-th>+预收		</uni-th>
						<uni-th>-预收		</uni-th>
						<uni-th>操作			</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, i) in tableUpData" :key="i+1">
						<uni-td>{{ item.calculateAdviseInvestMoney  }}</uni-td>
						<uni-td>{{ item.tradeCount 			        }}</uni-td>
						<uni-td>{{ item.unitPrice 			        }}</uni-td>
						<uni-td>{{ item.upOutUnitPrice 				}}</uni-td>
						<uni-td>{{ item.downOutUnitPrice 			}}</uni-td>
						<uni-td>{{ item.expectIncomeMoney 			}}</uni-td>
						<uni-td>{{ item.expectOutcomeMoney 			}}</uni-td>
						<uni-td style="text-align: center;">
							<view class="uni-group">
								<button @tap="addOne(item)" class="uni-button" size="mini" type="primary">收录</button>
								<button @tap="updateOne(item)" class="uni-button" size="mini" type="warn">更新</button>
							</view>
						</uni-td>
					</uni-tr>
				  </uni-table>					
			 </view>
			</uni-group>
				 
			<uni-group title="做空试算:">
				  <uni-table border stripe emptyText="暂无更多数据" >					
					<uni-tr>
						<uni-th>序号			</uni-th>
						<uni-th>建议做空金额	</uni-th>
						<uni-th>入手股数		</uni-th>
						<uni-th>原单价		</uni-th>
						<uni-th>跌出+值		</uni-th>
						<uni-th>张出-值		</uni-th>
						<uni-th>+预收		</uni-th>
						<uni-th>-预收		</uni-th>
						<uni-th>操作			</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, i) in tableUpData" :key="i+1">
						<uni-td>{{ i + 1    						}}</uni-td>
						<uni-td>{{ item.calculateAdviseInvestMoney  }}</uni-td>
						<uni-td>{{ item.tradeCount 			        }}</uni-td>
						<uni-td>{{ item.unitPrice 			        }}</uni-td>
						<uni-td>{{ item.upOutUnitPrice 				}}</uni-td>
						<uni-td>{{ item.downOutUnitPrice 			}}</uni-td>
						<uni-td>{{ item.expectIncomeMoney 			}}</uni-td>
						<uni-td>{{ item.expectOutcomeMoney 			}}</uni-td>
						<uni-td style="text-align: center;">
							<view class="uni-group">
								<button @tap="addOne(item)" class="uni-button" size="mini" type="primary">收录</button>
							</view>
						</uni-td>
					</uni-tr>
				</uni-table>					
			</uni-group>
			
		</uni-section>
		
		<uni-section title="展示" type="line" style="background-color: #eee;"> 
			<uni-group title="展示做多:">
			  <view> 
				<uni-table border stripe emptyText="暂无更多数据" >
					<uni-tr>
						<uni-th>序号			</uni-th>
						<uni-th>股票编码		</uni-th>
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
					<uni-tr v-for="(item, i) in tableUpShowData" :key="i+1">
						<uni-td>{{ i + 1    						}}</uni-td>
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
								<button @tap="addOne(item)" class="uni-button" size="mini" type="primary">收录</button>
								<!-- <button @tap="delOne(item)" class="uni-button" size="mini" type="warn">删除</button> -->
							</view>
						</uni-td>
					</uni-tr>
				  </uni-table>					
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

		
	</view>
</template>

<script>
	import getdateTime from '@/common/getdateTime.js';
	import tTable from '@/components/t-table/t-table.vue';
	import tTh from '@/components/t-table/t-th.vue';
	import tTr from '@/components/t-table/t-tr.vue';
	import tTd from '@/components/t-table/t-td.vue';
	import { Decimal } from 'decimal.js';
	
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
					//编号	|预期收益比（%）				|建议出手收益比（%）			|正收益%				|负收益%				|投入资金比（%）					|投入资金额				
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
				,tableUpShowData:[]
				,tableDownData:[]
				,tableDownShowData:[]
				,totalAmount:''
				,selectExpectValue:''
				,stockCode:''
				,unitPrice:''
				,range:[]
				,input:''
				
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
					that.tableUpShowData = resp.data
				},
				fail:function(){
					console.log("未取得 key:"+keyStr);
				}
			});
			
			var rangeValue = []
			for (var i = 0; i < that.tableList.length; i++) {
				rangeValue.push({value:that.tableList[i].id, text:that.tableList[i].expect_value})
			}
			that.selectExpectValueRange = rangeValue;
		}
		,onReady() {
		},
		methods: {
			change(e) {
				console.log(e.detail);
			}
			,inputTotalAmountChange(e) {			
				this.calculateInvestMoney();
			}
			,inputStockCodeChange(e){
				this.calculateInvestMoney();
			}
			,selectExpectValueChange(e) {		
				this.calculateInvestMoney();
			}
			,inputUnitPriceChange(e) {		
				this.calculateInvestMoney();
			}
			,calculateInvestMoney(){				
				console.log("选取："+this.selectExpectValue);
				var item = this.calculateItem(this);
				var scheme = [];
				scheme.push(item);
				this.tableUpData = scheme;
				console.log("计算所得："+JSON.stringify(this.tableUpData));
			}
			,calculateItem(that){
				// calculateAdviseInvestMoney :建议投资金额	|tradeCount :入手股数	|expectIncomeMoney :预期收益值
				var item = {}
				that.tableList.forEach((val,index)=>{
					if(val.id === that.selectExpectValue){
						console.log("选取了："+ JSON.stringify(val))
						var totalAmount = (that.totalAmount=="")?0:that.totalAmount;
						var unitPrice = (that.unitPrice=="")?0:that.unitPrice;
						var calculateAdviseInvestMoney = new Decimal(val.advise_invest_ratio).div(new Decimal(100)).mul(new Decimal(totalAmount));
						let tradeCount = parseInt(calculateAdviseInvestMoney / unitPrice) ;
						item = {
							stockCode:that.stockCode, 
							calculateAdviseInvestMoney:calculateAdviseInvestMoney, 
							tradeCount:isNaN(tradeCount)?0:tradeCount, 
							unitPrice:isNaN(unitPrice)?0:unitPrice, 
							upOutUnitPrice:(new Decimal(val.up_radio).div(new Decimal(100)).add(new Decimal(1))).mul(new Decimal(unitPrice)),
							downOutUnitPrice:(new Decimal(val.down_radio).div(new Decimal(100)).add(new Decimal(1))).mul(new Decimal(unitPrice)),
							expectIncomeMoney:parseInt(val.up_radio * calculateAdviseInvestMoney / 100),
							expectOutcomeMoney:parseInt(val.down_radio * calculateAdviseInvestMoney / 100),
						}
					}
				})				
				return item;
			}
			//删除
			,delOne(item) {
				var dataStr = JSON.stringify(item);
				console.log("点击删除"+ dataStr)
				var keyStr = "inStorageStockList"
				uni.getStorage({
					key:keyStr,
					success: function(resp){
						console.log("返回值："+ JSON.stringify(resp.data))
					},
					fail:function(){
						console.log("未取得 key:"+keyStr);						
					}
				});
				
			}
			//收录
			,addOne(item) { 
				/* 【过程】：
				1.补充操作信息；
				2.没有数据则直接添加；
				3.相同‘股票编码’确定替换或是取消更新；
				4.保存到内存中；
				5.展示到表格中
				*/
				var that = this; 
				/** 追加信息 */
				this.appendInfo(this, item);
				
				var itemJson = JSON.stringify(item);
				console.log("点击收录"+ itemJson)
				var keyStr = "inStorageStockList"
				var stockSet = []
				uni.getStorage({
					key:keyStr,
					success: function(resp){
						var respData = resp.data;
						console.log("old返回值："+ JSON.stringify(respData))
						var saveData = []
						if(respData instanceof Array){
							//遍历检查是否存在重复，存在则判断是否替换
							console.log("遍历检查是否存在重复，存在则判断是否替换")
							var flag = false;
							respData.forEach((val,i)=>{
								if(item.stockCode == val.stockCode){
									// 存在重复
									flag = true;
									console.log("存在重复……")
									// 此处，异步执行。暂时未找到办法解决，使其同步执行。
									// 弹窗选取
									uni.showModal({
										title: '提示',
										// 提示文字
										content: '该股票编码已存在,是否覆盖？',
										// 取消按钮的文字自定义
										cancelText: "取消",
										// 确认按钮的文字自定义
										confirmText: "替换",
										//删除字体的颜色
										confirmColor:'red',
										//取消字体的颜色
										cancelColor:'#000000',
										success: function(res) {
											if (res.confirm) {
												// 执行确认后的操作
												// 替换
												console.log("替换："+item.stockCode)
												console.log("替换前："+ JSON.stringify(respData))
												respData.splice(i, 1, item);
												console.log("替换后："+ JSON.stringify(respData))
												// 由于是异步执行，所以，只得补充冗余执行。待后续，解决了 同步执行问题，可省去下部内容
												saveData = respData
												uni.setStorage({
													key:keyStr,
													data:saveData				
												});
												that.tableUpShowData = saveData
											}else {
												// 执行取消后的操作
												console.log("放弃替换，保持原数据："+item.stockCode)
											}
										}
									});
								}
							});
							
							// 添加新数据
							if(!flag){
								// 添加
								console.log("添加："+item.stockCode)
								respData.push(item);
							}
							saveData = respData
							
						}else{
							stockSet.push(item)
							saveData = stockSet
						}
						
						uni.setStorage({
							key:keyStr,
							data:saveData				
						});
						that.tableUpShowData = saveData
						console.log("new更新值："+ JSON.stringify(that.tableUpShowData))
					},
					fail:function(){
						stockSet.push(item);
						uni.setStorage({
							key:keyStr,
							data:stockSet				
						});
						that.tableUpShowData = stockSet
						console.log("首次，则新增！数据："+JSON.stringify(that.tableUpShowData))
					}
				});
			}
			,async showModal(i, item, respData){
				await uni.showModal({
					title: '提示',
					// 提示文字
					content: '该股票编码已存在,是否覆盖？',
					// 取消按钮的文字自定义
					cancelText: "取消",
					// 确认按钮的文字自定义
					confirmText: "替换",
					//删除字体的颜色
					confirmColor:'red',
					//取消字体的颜色
					cancelColor:'#000000',
					success: async function(res) {
						if (res.confirm) {
							// 执行确认后的操作
							// 替换
							console.log("替换："+item.stockCode)
							console.log("替换前："+ JSON.stringify(respData))
							respData.splice(i, 1, item);
							console.log("替换后："+ JSON.stringify(respData))
						}else {
							// 执行取消后的操作
							console.log("放弃替换，保持原数据："+item.stockCode)
						}
					}
				});
			}
			,updateOne(item){
				var that = this;
				that.appendInfo(that, item);
				var keyStr = "inStorageStockList"
				var stockSet = []
				uni.getStorage({
					key:keyStr,
					success: function(resp){
						var rsd = resp.data;
						console.log("old返回值："+ JSON.stringify(rsd))
						var saveData = []
						if(rsd instanceof Array){
							rsd.forEach((val,index)=>{
								if(val.stockCode == item.stockCode){									
									rsd.splice(index, 1, item);
									uni.setStorage({
										key:keyStr,
										data:rsd				
									});
								}
							})
							saveData = rsd
						}else{
							stockSet.push(item)
							uni.setStorage({
								key:keyStr,
								data:stockSet				
							});
							saveData = stockSet
						}
						that.tableUpShowData = saveData;
						console.log("new更新值："+ JSON.stringify(that.tableUpShowData))
					},
					fail:function(){
						stockSet.push(item);
						uni.setStorage({
							key:keyStr,
							data:stockSet				
						});
						console.log("首次，则新增！数据："+JSON.stringify(stockSet))
					}
				});
			}
			,appendInfo(that, item){	/** 追加信息 */
				// 追加‘新增时间’
				var timeStr = getdateTime.dateTimeStr('y-m-d h:i:s')
				that.$set(item,"updateTime",timeStr)
			}
			,edit(item) {
				uni.showToast({
					title: item.name,
					icon: 'none'
				});
			}
			
		},
		
		
		
	}
</script>

<style lang="scss">
	// @import "uview-ui/index.scss";
	// table
	.title {
		font-size: 32upx;
		color: #666;
	}
	.box {
		margin: 20upx;
	}

	button {
		font-size: 24upx;
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
</style>
