<template>
	<view class="container">
		
		<uni-card title="人生劝勉" :isFull="true" sub-title="投资有风险" extra="today 你笑了么 (*￣︶￣) !!">
			<text>投资什么？都不抵投资健康！</text>
		</uni-card>
		<uni-card :is-shadow="false" is-full>
			<text class="uni-h6">人生最赚的生活方式：是悠闲！</text>
		</uni-card>
		
		<uni-section title="试算" type="line" style="background-color: #eee;"> 
			<uni-group :style="{ display: 'none' }">
				<uni-card :is-shadow="false" is-full>
					<text class="uni-h2">服务到期，请联系管理员！</text>
				</uni-card>
				<uni-card :is-shadow="false" is-full>
					<text class="uni-h6">联系方式：wangqingbo0829@163.com</text>
				</uni-card>
				<uni-card :is-shadow="false" is-full>
					<button @click="refreshFromStorage" class="popup-success warn-text" style="padding-left:0.5rem; width: 100%;height: 2rem;" size="default" type="primary" >刷新</button>
				</uni-card>
			</uni-group>
			
			<uni-group title="投资信息:" :style="{ display: stock_display }">
				<view>
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
					 <uni-forms-item label="现单价:">
						<uni-easyinput @change="inputUnitPriceNowChange" v-model="unitPriceNow" :inputBorder="true" placeholder="请输入当前单价"></uni-easyinput>
					 </uni-forms-item>
				  </uni-forms>
				  <uni-forms border>
					 <uni-forms-item label="预单价:">
						<uni-easyinput @change="inputunitPricePreChange" v-model="unitPricePre" :inputBorder="true" placeholder="请输入预估单价"></uni-easyinput>
					 </uni-forms-item>
				  </uni-forms>
				
				  <uni-forms border>
					<uni-forms-item label="预估收益率 %">
						<uni-data-select @change="selectExpectValueChange" v-model="selectExpectValue" :localdata="selectExpectValueRange"  :clear="false" ></uni-data-select>
					</uni-forms-item>
				  </uni-forms>
				</view>
			</uni-group>
			
			<view v-if="(unitPricePre-unitPriceNow)>0">
				<uni-group title="做多试算:" id="up_group" >
				  <view> 
					<uni-table border stripe emptyText="暂无更多数据" >
						<uni-tr>
							<uni-th>建议投资金额	</uni-th>
							<uni-th>入手股数		</uni-th>
							<uni-th>原单价		</uni-th>
							<uni-th>涨出+值		</uni-th>
							<uni-th>跌入-值		</uni-th>
							<uni-th>+预收		</uni-th>
							<uni-th>-预收		</uni-th>
							<uni-th>操作			</uni-th>
						</uni-tr>
						<uni-tr v-for="(item, i) in tableUpData" :key="i+1">
							<uni-td>{{ item.calculateAdviseInvestMoney  }}</uni-td>
							<uni-td>{{ item.tradeCount 			        }}</uni-td>
							<uni-td>{{ item.unitPriceNow 			    }}</uni-td>
							<uni-td>{{ item.upOutUnitPrice 				}}</uni-td>
							<uni-td>{{ item.downOutUnitPrice 			}}</uni-td>
							<uni-td>{{ item.expectIncomeMoney 			}}</uni-td>
							<uni-td>{{ item.expectOutcomeMoney 			}}</uni-td>
							<uni-td style="text-align: center;">
								<view class="uni-group" v-if="(unitPricePre-unitPriceNow)>0">
									<button @tap="addOrUpdateOne(item, 'addOne')" class="uni-button" size="mini" type="primary">收录</button>
									<button @tap="addOrUpdateOne(item, 'updateOne')" class="uni-button" size="mini" type="warn">更新</button>
								</view>
							</uni-td>
						</uni-tr>
					  </uni-table>					
				 </view>
				</uni-group>
			</view>
						
			<view v-else-if="(unitPricePre-unitPriceNow)<0">
				<uni-group title="做空试算:" id="down_group" >
				  <uni-table border stripe emptyText="暂无更多数据" >					
					<uni-tr>
						<uni-th>建议做空金额	</uni-th>
						<uni-th>入手股数		</uni-th>
						<uni-th>原单价		</uni-th>
						<uni-th>跌入+值		</uni-th>
						<uni-th>涨出-值		</uni-th>
						<uni-th>+预收		</uni-th>
						<uni-th>-预收		</uni-th>
						<uni-th>操作			</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, i) in tableDownData" :key="i+1">
						<uni-td>{{ item.calculateAdviseInvestMoney  }}</uni-td>
						<uni-td>{{ item.tradeCount 			        }}</uni-td>
						<uni-td>{{ item.unitPriceNow 			    }}</uni-td>
						<uni-td>{{ item.upOutUnitPrice 				}}</uni-td>
						<uni-td>{{ item.downOutUnitPrice 			}}</uni-td>
						<uni-td>{{ item.expectIncomeMoney 			}}</uni-td>
						<uni-td>{{ item.expectOutcomeMoney 			}}</uni-td>
						<uni-td style="text-align: center;">
							<view class="uni-group" v-if="(unitPricePre - unitPriceNow)<0">
								<button @tap="addOrUpdateOne(item, 'addOne')" class="uni-button" size="mini" type="primary">收录</button>
								<button @tap="addOrUpdateOne(item, 'updateOne')" class="uni-button" size="mini" type="warn">更新</button>
							</view>
						</uni-td>
					</uni-tr>
				  </uni-table>					
				</uni-group>
			</view>
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
						<uni-th>跌入-值		</uni-th>
						<uni-th>+预赚		</uni-th>
						<uni-th>-预赔		</uni-th>
						<uni-th>收录时间		</uni-th>
						<uni-th>操作			</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, i) in tableUpShowData" :key="i+1">
						<uni-td>{{ i + 1    						}}</uni-td>
						<uni-td>{{ item.stockCode					}}</uni-td>
						<uni-td>{{ item.calculateAdviseInvestMoney  }}</uni-td>
						<uni-td>{{ item.tradeCount 			        }}</uni-td>
						<uni-td>{{ item.unitPriceNow 			    }}</uni-td>
						<uni-td>{{ item.upOutUnitPrice 				}}</uni-td>
						<uni-td>{{ item.downOutUnitPrice 			}}</uni-td>
						<uni-td>{{ item.expectIncomeMoney 			}}</uni-td>
						<uni-td>{{ item.expectOutcomeMoney 			}}</uni-td>
						<uni-td>{{ item.updateTime 					}}</uni-td>
						<uni-td>
							<view class="uni-group">
								<button @tap="delOne(item, 1)" class="uni-button" size="mini" type="warn">删除</button>
							</view>
						</uni-td>
					</uni-tr>
				  </uni-table>					
			 </view>
			</uni-group>
			<uni-group title="展示做空:">
			  <view> 
				<uni-table border stripe emptyText="暂无更多数据" >
					<uni-tr>
						<uni-th>序号			</uni-th>
						<uni-th>股票编码		</uni-th>
						<uni-th>建议投资金额	</uni-th>
						<uni-th>入手股数		</uni-th>
						<uni-th>原单价		</uni-th>
						<uni-th>跌出+值		</uni-th>
						<uni-th>涨入-值		</uni-th>
						<uni-th>+预赚		</uni-th>
						<uni-th>-预赔		</uni-th>
						<uni-th>收录时间		</uni-th>
						<uni-th>操作			</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, i) in tableDownShowData" :key="i+1">
						<uni-td>{{ i + 1    						}}</uni-td>
						<uni-td>{{ item.stockCode					}}</uni-td>
						<uni-td>{{ item.calculateAdviseInvestMoney  }}</uni-td>
						<uni-td>{{ item.tradeCount 			        }}</uni-td>
						<uni-td>{{ item.unitPriceNow 			    }}</uni-td>
						<uni-td>{{ item.downOutUnitPrice 			}}</uni-td>
						<uni-td>{{ item.upOutUnitPrice 				}}</uni-td>
						<uni-td>{{ item.expectIncomeMoney 			}}</uni-td>
						<uni-td>{{ item.expectOutcomeMoney 			}}</uni-td>
						<uni-td>{{ item.updateTime 					}}</uni-td>
						<uni-td>
							<view class="uni-group">
								<!-- <button @tap="addOne(item)" class="uni-button" size="mini" type="primary">收录</button> -->
								<button @tap="delOne(item, 2)" class="uni-button" size="mini" type="warn">删除</button>
							</view>
						</uni-td>
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
	</view>

	<view>
		<!-- 输入框示例 -->
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog ref="inputClose"  mode="input" title="输入授权码" 
				placeholder="授权码" @confirm="authorizeConfirm"></uni-popup-dialog>
		</uni-popup>
	</view>
	<view>
		<!-- 提示信息弹窗 -->
		<uni-popup ref="message" type="message">
			<uni-popup-message :type="msgType" :message="messageText" :duration="2000"></uni-popup-message>
		</uni-popup>
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
				upTableList: [// 示例金额：10000$
					//编号	|预期收益率（%）				|预期收益上限率			|建议出手收益率（%）			|正收益率%			|负收益率%			|投入资金比（%）					|投入资金额				
					{id: 0,	expect_value: '1~5', 		expect_end: '5',		advise_value: '+3	|-2', 	up_radio: '3',		down_radio: '-2', 	advise_invest_ratio: '10', 		advise_invest_money: '1000' },
					{id: 1,	expect_value: '5~10', 		expect_end: '10',		advise_value: '+8	|-2', 	up_radio: '8',		down_radio: '-2', 	advise_invest_ratio: '20', 		advise_invest_money: '2000' },
					{id: 2,	expect_value: '10~20', 		expect_end: '20',		advise_value: '+14	|-2', 	up_radio: '14',		down_radio: '-2', 	advise_invest_ratio: '20', 		advise_invest_money: '2000' },
					{id: 3,	expect_value: '20~50', 		expect_end: '50',		advise_value: '+35	|-2', 	up_radio: '35',		down_radio: '-2', 	advise_invest_ratio: '15', 		advise_invest_money: '1500' },
					{id: 4,	expect_value: '50~100', 	expect_end: '100',		advise_value: '+60	|-8', 	up_radio: '60',		down_radio: '-8', 	advise_invest_ratio: '10', 		advise_invest_money: '1000' },
					{id: 5,	expect_value: '100~200', 	expect_end: '200',		advise_value: '+120	|-10', 	up_radio: '120',	down_radio: '-10', 	advise_invest_ratio: '10', 		advise_invest_money: '1000' },
					{id: 6,	expect_value: '200~500',	expect_end: '500',		advise_value: '+200	|-50',	up_radio: '200',	down_radio: '-50', 	advise_invest_ratio: '10',		advise_invest_money: '1000'	},
					{id: 7,	expect_value: '>500',		expect_end: '100000',	advise_value: '+300	|-50',	up_radio: '300',	down_radio: '-50', 	advise_invest_ratio: '5',		advise_invest_money: '500'	}
				]
				,
				downTableList: [// 示例金额：10000$
					//编号	|预期收益率（%）				|预期收益上限率			|建议出手收益率（%）			|正收益率%			|负收益率%			|投入资金比（%）					|投入资金额				
					{id: 0,	expect_value: '1~5', 		expect_end: '5',		advise_value: '+3	|-2', 	up_radio: '3',		down_radio: '-2', 	advise_invest_ratio: '10', 		advise_invest_money: '1000' },
					{id: 1,	expect_value: '5~10', 		expect_end: '10',		advise_value: '+8	|-2', 	up_radio: '8',		down_radio: '-2', 	advise_invest_ratio: '20', 		advise_invest_money: '2000' },
					{id: 2,	expect_value: '10~20', 		expect_end: '20',		advise_value: '+14	|-2', 	up_radio: '14',		down_radio: '-2', 	advise_invest_ratio: '20', 		advise_invest_money: '2000' },
					{id: 3,	expect_value: '20~50', 		expect_end: '50',		advise_value: '+35	|-2', 	up_radio: '35',		down_radio: '-2', 	advise_invest_ratio: '15', 		advise_invest_money: '1500' },
					{id: 4,	expect_value: '50~100', 	expect_end: '100',		advise_value: '+60	|-8', 	up_radio: '60',		down_radio: '-8', 	advise_invest_ratio: '10', 		advise_invest_money: '1000' },
					{id: 5,	expect_value: '100~200', 	expect_end: '200',		advise_value: '+120	|-10', 	up_radio: '120',	down_radio: '-10', 	advise_invest_ratio: '10', 		advise_invest_money: '1000' },
					{id: 6,	expect_value: '200~500',	expect_end: '500',		advise_value: '+200	|-50',	up_radio: '200',	down_radio: '-50', 	advise_invest_ratio: '10',		advise_invest_money: '1000'	},
					{id: 7,	expect_value: '>500',		expect_end: '100000',	advise_value: '+300	|-50',	up_radio: '300',	down_radio: '-50', 	advise_invest_ratio: '5',		advise_invest_money: '500'	}
				]
				,value: ''
				,tableUpData:[]
				,tableUpShowData:[]
				,tableDownData:[]
				,tableDownShowData:[]
				,totalAmount:''
				,selectExpectValue:''
				,stockCode:''
				,unitPriceNow:''
				,unitPricePre:''
				,range:[]
				,input:''
				
				
				// ,type: 'center'
				// ,msgType: 'success'
				// ,messageText: '这是一条成功提示'
			};
		}
		,async created(){
			this.stock_display = '';
			// this.stock_display = 'none';
			
			
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
			,inputStockCodeChange(e){
				this.calculateInvestMoney();
			}
			,inputUnitPriceNowChange(e) {
				this.unitPriceChange();
				this.calculateInvestMoney();
			}
			// 预期单价
			,inputunitPricePreChange(e) {
				this.unitPriceChange();
				this.calculateInvestMoney();
			}			
			// 预期收益率 改选
			,selectExpectValueChange(e) {
				this.calculateInvestMoney();
			}
			// 单据变更
			,unitPriceChange(){
				var unitPriceNow = (this.unitPriceNow=="")?0:this.unitPriceNow;			// 当前股票单价
				var unitPricePre = (this.unitPricePre=="")?0:this.unitPricePre;			// 预估股票单价
				var stockRadio = 0;
				var up_down_flag = this.judgeUpOrDown();// 0:无法判断；1:up-做多；2:down-做空
				if(up_down_flag == 1){		// 做多
					stockRadio = this.getStockRadioByUnitPrice(unitPricePre, unitPriceNow, unitPriceNow);
					this.initSelectExpectValueRange(this, this.upTableList)
				}else if(up_down_flag == 2){// 做空
					stockRadio = this.getStockRadioByUnitPrice(unitPricePre, unitPriceNow, unitPricePre);	
					this.initSelectExpectValueRange(this, this.downTableList)					
				}
				console.log("stockRadio："+stockRadio)
				var item = {}
				var min_last = 0;
				var min_id = 0;
				this.upTableList.sort(function(a,b){
					return parseInt(a.expect_end) - parseInt(b.expect_end)		// 顺序
					// return parseInt(b.expect_end) - parseInt(a.expect_end);		// 逆序
				})
				this.upTableList.some((val,index)=>{
					// 判断、折算 收益率
					if((val.expect_end - stockRadio) >=0){
						min_last = val.expect_end;
						min_id = index;
						return true;
					}
				});
				// 内推 选取
				this.selectExpectValue = min_id;
			}
			/** 0:无法判断；1:up-做多；2:down-做空*/
			,judgeUpOrDown(){
				var up_down_flag = 0; // 0:无法判断；1:up-做多；2:down-做空
				var unitPriceNow = (this.unitPriceNow=="")?0:this.unitPriceNow;			// 当前股票单价
				var unitPricePre = (this.unitPricePre=="")?0:this.unitPricePre;			// 预估股票单价
				var stockRadio = 0;
				if(unitPriceNow>0 && unitPricePre>0){
					if(unitPricePre>unitPriceNow){
						// 做多
						up_down_flag = 1;
					}else{
						// 做空
						up_down_flag = 2;				
					}
				}
				return up_down_flag;
			}
			,getStockRadioByUnitPrice(a,b,c){
				return new Decimal(a - b).div(new Decimal(c)).mul(new Decimal(100)).abs().toFixed(4);
			}
			,initSelectExpectValueRange(_this, tableList){
				var rangeValue = []
				for (var i = 0; i < tableList.length; i++) {
					rangeValue.push({value:tableList[i].id, text:tableList[i].expect_value})
				}
				_this.selectExpectValueRange = rangeValue;
			}
			// 试算并展示
			,calculateInvestMoney(){
				var item = this.calculateItem(this);
				var scheme = [];
				scheme.push(item);
				var up_down_flag = this.judgeUpOrDown();// 0:无法判断；1:up-做多；2:down-做空
				if(up_down_flag == 1){
					this.tableUpData = scheme;
				}else if(up_down_flag == 2){
					this.tableDownData = scheme;
				}
				console.log("计算所得："+JSON.stringify(scheme));
			}
			// 试算内容
			,calculateItem(_this){
				// calculateAdviseInvestMoney :建议投资金额	|tradeCount :入手股数	|expectIncomeMoney :预期收益值
				var unitPriceNow = (_this.unitPriceNow=="")?0:_this.unitPriceNow;			// 当前股票单价
				var unitPricePre = (_this.unitPricePre=="")?0:_this.unitPricePre;			// 预估股票单价
				var stockRadio = 0;
				var up_down_flag = this.judgeUpOrDown();// 0:无法判断；1:up-做多；2:down-做空
				if(up_down_flag == 1){		// 做多
					stockRadio = this.getStockRadioByUnitPrice(unitPricePre, unitPriceNow, unitPriceNow);
				}else if(up_down_flag == 2){// 做空
					stockRadio = this.getStockRadioByUnitPrice(unitPricePre, unitPriceNow, unitPricePre);
				}
				var item = {}
				// 预估股票单价 未填写，选取了 预期收益率
				if(_this.selectExpectValue>0||_this.selectExpectValue===0){
					_this.upTableList.some((val,index)=>{
						if(val.id === _this.selectExpectValue){
							console.log("选取了："+ JSON.stringify(val))
							var totalAmount = (_this.totalAmount=="")?0:_this.totalAmount;
							var unitPriceNow = (_this.unitPriceNow=="")?0:_this.unitPriceNow;			// 当前股票单价
							var calculateAdviseInvestMoney = new Decimal(val.advise_invest_ratio).div(new Decimal(100)).mul(new Decimal(totalAmount));
							let tradeCount = parseInt(calculateAdviseInvestMoney / unitPriceNow) ;	// 股数
							var upOutUnitPrice = 0;
							var downOutUnitPrice = 0;
							if(up_down_flag == 1){		// 做多
								upOutUnitPrice = (new Decimal(val.up_radio).div(new Decimal(100)).add(new Decimal(1))).mul(new Decimal(unitPriceNow));
								downOutUnitPrice = (new Decimal(val.down_radio).div(new Decimal(100)).add(new Decimal(1))).mul(new Decimal(unitPriceNow));
							}else if(up_down_flag == 2){// 做空
								upOutUnitPrice = (new Decimal(val.down_radio).div(new Decimal(100)).add(new Decimal(1))).mul(new Decimal(unitPricePre));
								downOutUnitPrice = (new Decimal(val.up_radio).div(new Decimal(100)).add(new Decimal(1))).mul(new Decimal(unitPricePre));
							}
							
							item = {
								stockCode:_this.stockCode, 
								calculateAdviseInvestMoney:calculateAdviseInvestMoney, 
								tradeCount:isNaN(tradeCount)?0:tradeCount, 
								unitPriceNow:isNaN(unitPriceNow)?0:unitPriceNow, 
								unitPricePre:isNaN(unitPricePre)?0:unitPricePre, 
								upOutUnitPrice: upOutUnitPrice,
								downOutUnitPrice: downOutUnitPrice,
								expectIncomeMoney:parseInt(val.up_radio * calculateAdviseInvestMoney / 100),
								expectOutcomeMoney:parseInt(val.down_radio * calculateAdviseInvestMoney / 100),
							}
							return true;
						}						
					});
				}				
				return item;
			}
			,getStockRadio(){
				var unitPriceNow = (this.unitPriceNow=="")?0:this.unitPriceNow;			// 当前股票单价
				var unitPricePre = (this.unitPricePre=="")?0:this.unitPricePre;			// 预估股票单价
				var stockRadio = 0;
				var up_down_flag = this.judgeUpOrDown();// 0:无法判断；1:up-做多；2:down-做空
				if(up_down_flag == 1){		// 做多
					stockRadio = this.getStockRadioByUnitPrice(unitPricePre, unitPriceNow, unitPriceNow);
				}else if(up_down_flag == 2){// 做空
					stockRadio = this.getStockRadioByUnitPrice(unitPricePre, unitPriceNow, unitPricePre);
				}
				return stockRadio;
			}
			// 根据 股票编码 收录或更新 记录
			,addOrUpdateOne(item, addOrUpdate){
				/* 【过程】：
				1.补充操作信息；
				2.没有数据则直接添加；
				3.相同‘股票编码’确定替换或是取消更新；
				4.保存到内存中；
				5.展示到表格中
				*/
				var _this = this;
				if(this.stockCode == ''){
					this.messageToggle('warn', '【股票代码】未填写！')
					return;
				}
				if(this.totalAmount == ''){
					this.messageToggle('warn', '【总金】未填写！')
					return;
				}
				if(this.unitPricePre == ''){
					this.messageToggle('warn', '【预单价】未填写！')
					return;
				}
				if(this.unitPriceNow == ''){
					this.messageToggle('warn', '【现单价】未填写！')
					return;
				}
				/** 追加信息 */
				this.appendInfo(this, item);
				var itemJson = JSON.stringify(item);
				console.log("点击"+addOrUpdate+"【内容】:"+ itemJson)
				if(addOrUpdate=='addOne'){
					console.log("点击了添加")
					if(this.unitPricePre>this.unitPriceNow){
						// 做多
						this.saveData("inStorageUpStockList", "tableUpShowData", item, _this)
					}else{
						// 做空
						this.saveData("inStorageDownStockList", "tableDownShowData", item, _this)
					}	
				}else{
					console.log("点击了更新")
					if(this.unitPricePre>this.unitPriceNow){
						// 做多
						this.updateStockInfo("inStorageUpStockList", "tableUpShowData", item, _this)
					}else{
						// 做空
						this.updateStockInfo("inStorageDownStockList", "tableDownShowData", item, _this)
					}	
				}
			}
			,appendInfo(_this, item){	/** 追加信息 */
				// 追加‘新增时间’
				var timeStr = getdateTime.dateTimeStr('y-m-d h:i:s')
				_this.$set(item,"updateTime",timeStr)
			}
			,saveData(keyStr, table_tag_key, item, _this){
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
							respData.some((val,i)=>{
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
												_this.$set(_this, table_tag_key, saveData);
											}else {
												// 执行取消后的操作
												console.log("放弃替换，保持原数据："+item.stockCode)
											}
										}
									});
									return true;
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
						_this.$set(_this, table_tag_key, saveData);
						console.log("new更新值："+ JSON.stringify(saveData))
					},
					fail:function(){
						stockSet.push(item);
						uni.setStorage({
							key:keyStr,
							data:stockSet				
						});
						_this.$set(_this, table_tag_key, stockSet);
						console.log("首次，则新增！数据："+JSON.stringify(stockSet))
					}
				});
			}
			,updateStockInfo(keyStr, table_tag_key, item, _this){
				var stockSet = []
				uni.getStorage({
					key:keyStr,
					success: function(resp){
						var rsd = resp.data;
						console.log("old返回值："+ JSON.stringify(rsd))
						var saveData = []
						if(rsd instanceof Array){
							var flag = true;
							rsd.some((val,index)=>{
								if(val.stockCode == item.stockCode){									
									rsd.splice(index, 1, item);
									uni.setStorage({
										key:keyStr,
										data:rsd				
									});
									flag = false;
									return true;
								}
							});
							if(flag){
								rsd.push(item)
								uni.setStorage({
									key:keyStr,
									data:rsd				
								});
							}
							saveData = rsd
						}else{
							stockSet.push(item)
							uni.setStorage({
								key:keyStr,
								data:stockSet				
							});
							saveData = stockSet
						}
						_this.$set(_this, table_tag_key, saveData);
						console.log("new更新值："+ JSON.stringify(saveData))
					},
					fail:function(){
						stockSet.push(item);
						uni.setStorage({
							key:keyStr,
							data:stockSet				
						});
						_this.$set(_this, table_tag_key, stockSet);
						console.log("首次，则新增！数据："+JSON.stringify(stockSet))
					}
				});
			}
			,edit(item) {
				uni.showToast({
					title: item.name,
					icon: 'none'
				});
			}
			// 删除(up_down_flag:1:up-做多；2:down-做空)
			,delOne(item, up_down_flag) {
				var _this = this;
				var dataStr = JSON.stringify(item);
				console.log("点击删除"+ dataStr)
				var keyStr = "inStorageUpStockList"
				if(up_down_flag==2){
					keyStr = "inStorageDownStockList"
				}
				// 弹窗选取
				uni.showModal({
					title: '提示',
					// 提示文字
					content: '确定要删除该股票信息？',
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
										respData.some((val,i)=>{
											if(item.stockCode == val.stockCode){
												respData.splice(i, 1);
												uni.setStorage({
													key:keyStr,
													data:respData				
												});
												return true;
											}
										});
									}
									if(up_down_flag==1){
										_this.tableUpShowData = respData;
									}else{
										_this.tableDownShowData = respData;
									}
								},
								fail:function(){
									console.log("未取得 key:"+keyStr);						
								}
							});
						}
					},
				});
				
				
			}
			// 信息提示（2秒后退显）
			,messageToggle(type, messageText) {
				this.type = 'center'
				this.msgType = type
				this.messageText = messageText
				this.$refs.message.open()
			}
			
			,authorizeConfirm(val) {
				uni.showLoading({
					title: '3秒后会关闭'
				})
			
				setTimeout(() => {
					uni.hideLoading()
					console.log(val)
					this.value = val
					// 关闭窗口后，恢复默认内容
					this.$refs.inputDialog.close()
					if(val == "admin"){
						this.removeStockFroStoragem()
					}
				}, 1)
			}
		},
		
		
		
	}
</script>

<style lang="scss">
	// group
	.group_display{
		display:''
	}
	.group_display_none{
		display:'none'
	}
	
	.success-text {
		color: #09bb07;
	}
	.popup-success {
		color: #fff;
		background-color: #e1f3d8;
	}
	.warn-text {
		color: #e6a23c;
	}
	
	// table
	.title {
		font-size: 32upx;
		color: #666;
	}
	.box {
		margin: 20upx;
	}

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
