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
		
			<button @click="refreshFromStorage" class="button large" style="float: right; margin: 0 10px 50px 0; background-color: #09bb07;" type="primary" >刷新规则</button>
			<uni-group :style="{ display: 'none' }">
				<uni-card :is-shadow="false" is-full>
					<text class="uni-h2">服务到期，请联系管理员！</text>
				</uni-card>
				<uni-card :is-shadow="false" is-full>
					<text class="uni-h6">联系方式：wangqingbo0829@163.com</text>
				</uni-card>
				<uni-card :is-shadow="false" is-full>
					<button @click="change" class="popup-success warn-text" style="padding-left:0.5rem; width: 100%;height: 2rem;" size="default" type="primary" >刷新</button>
				</uni-card>
			</uni-group>
			
			<uni-group title="投资信息:" :style="{ display: stock_display }">
				<view>
				  <uni-forms border>
					<uni-forms-item label="账户总金:" labelWidth="100px">
						<uni-easyinput @change="inputTotalAmountChange" v-model="totalAmount" :inputBorder="true" placeholder="请输入账户总金" ></uni-easyinput>
					</uni-forms-item>
				  </uni-forms>
				  <uni-forms border>
					 <uni-forms-item label="股票代码:" labelWidth="100px">
						<uni-easyinput @change="inputStockCodeChange" v-model="stockCode" :inputBorder="true" placeholder="请输入股票代码"></uni-easyinput>
					 </uni-forms-item>
				  </uni-forms>
				  
				  <uni-forms border>
					 <uni-forms-item label="当前单价:" labelWidth="100px">
						<uni-easyinput @change="inputUnitPriceNowChange" v-model="unitPriceNow" :inputBorder="true" placeholder="请输入当前单价"></uni-easyinput>
					 </uni-forms-item>
				  </uni-forms>
				  <uni-forms border>
					 <uni-forms-item label="预估单价:" labelWidth="100px">
						<uni-easyinput @change="inputUnitPricePreChange" v-model="unitPricePre" :inputBorder="true" placeholder="请输入预估单价"></uni-easyinput>
					 </uni-forms-item>
				  </uni-forms>
				
				  <uni-forms border>
					<uni-forms-item label="预估收益率%:" labelWidth="100px">
						<uni-data-select :style="{ pointerEvents: 'none', backgroundColor:'#FAFAFA' }" v-model="selectExpectValue" :localdata="selectExpectValueRange"  :clear="false" ></uni-data-select>
					</uni-forms-item>
				  </uni-forms>
				  <uni-forms border>
					 <uni-forms-item label="实际股数:" labelWidth="100px">
						<uni-easyinput @change="inputTradeRealCountChange" v-model="tradeRealCount" :inputBorder="true" placeholder="请输入实际股数"></uni-easyinput>
					 </uni-forms-item>
				  </uni-forms>
				</view>
			</uni-group>
			
			<view v-if="(unitPricePre.replace(/,/g, '')-unitPriceNow.replace(/,/g, ''))>0">
				<uni-group title="做多试算:" id="up_group" >
					
				 <view class="table">
				     <view class="tr">
				 		<view class="th">股票代码	</view>
				 		<view class="th">建议投金额	</view>
				 		<view class="th">实际投金额	</view>
				 		<view class="th">建议股数	</view>
				 		<view class="th">实际股数	</view>
				 		<view class="th">◎原单价		</view>
				 		<view class="th">涨出-单价 ↑	</view>
				 		<view class="th">跌出+单价 ↓	</view>
				 		<view class="th">+○预赚		</view>
				 		<view class="th">+●实赚		</view>
				 		<view class="th">-○预赔		</view>
				 		<view class="th">-●实赔		</view>
				 		<view class="th">操作		</view>
				     </view>
					 <view v-if="tableUpData.length>0" v-for="(item, index) in tableUpData" :key="index+1">
						 <block>
						    <view class="tr">
								<view class="td">{{item.stockCode}}</view>
								<view class="td">{{ item.calculAdvsIvsMoney  		}}</view>
								<view class="td">{{ item.calculRealIvsMoney  		}}</view>
								<view class="td">{{ item.tradeCount 			    }}</view>
								<view class="td">{{ item.tradeRealCount 			}}</view>
								<view class="td">{{ item.unitPriceNow 			    }}</view>
								<view class="td"> <span :style="fontColor.up" 	> {{ item.upOutUnitPrice 			}} </span> </view>
								<view class="td"> <span :style="fontColor.down" > {{ item.downOutUnitPrice 			}} </span> </view>
								<view class="td"> <span :style="fontColor.up"   > {{ item.expectIncomeMoney 		}} </span> </view>
								<view class="td"> <span :style="fontColor.up"   > {{ item.expectIncomeMoneyReal 	}} </span> </view>
								<view class="td"> <span :style="fontColor.down" > {{ item.expectOutcomeMoney 		}} </span> </view>
								<view class="td"> <span :style="fontColor.down" > {{ item.expectOutcomeMoneyReal 	}} </span> </view>
								<view class="td">
									<view class="uni-group">
										<button @tap="addOrUpdateOne(item, 'addOne')" class="uni-button" style="background-color: #e1f3d8; color: #09bb07;" size="mini" type="primary" v-if="isNewStockCode">新收</button>
										<button @tap="addOrUpdateOne(item, 'updateOne')" class="uni-button" style="background-color: #e1f3d8; color: #e6a23c;" size="mini" type="warn" v-if="isNewStockCode==false">更新</button>
									</view>
								</view>
						    </view>
						 </block>
					 </view>
				     
				 </view>
				 
				</uni-group>
			</view>
						
			<view v-else-if="(unitPricePre.replace(/,/g, '')-unitPriceNow.replace(/,/g, ''))<0">
				<uni-group title="做空试算:" id="down_group" >
					<view class="table">
					    <view class="tr">
							<view class="th">股票代码	</view>
							<view class="th">建议投金额	</view>
							<view class="th">实际投金额	</view>
							<view class="th">建议股数	</view>
							<view class="th">实际股数	</view>
							<view class="th">◎原单价		</view>
							<view class="th">跌入+单价 ↓	</view>
							<view class="th">涨入-单价 ↑	</view>
							<view class="th">+○预赚		</view>
							<view class="th">+●实赚		</view>
							<view class="th">-○预赔		</view>
							<view class="th">-●实赔		</view>
							<view class="th">操作		</view>
					    </view>
					    <block v-if="tableDownData.length>0" v-for="(item, index) in tableDownData" :key="index+1">
					       <view class="tr">
					        <view class="td">{{item.stockCode}}</view>
							<view class="td">{{ item.calculAdvsIvsMoney  		}}</view>
							<view class="td">{{ item.calculRealIvsMoney  		}}</view>
							<view class="td">{{ item.tradeCount 			    }}</view>
							<view class="td">{{ item.tradeRealCount 			}}</view>
							<view class="td">{{ item.unitPriceNow 			    }}</view>
							<view class="td"> <span :style="fontColor.up" >		{{ item.downOutUnitPrice 		}}</span> </view>
							<view class="td"> <span :style="fontColor.down" >	{{ item.upOutUnitPrice 			}}</span> </view>
							<view class="td"> <span :style="fontColor.up" > 	{{ item.expectIncomeMoney 		}}</span> </view>
							<view class="td"> <span :style="fontColor.up" > 	{{ item.expectIncomeMoneyReal 	}}</span> </view>
							<view class="td"> <span :style="fontColor.down" >	{{ item.expectOutcomeMoney 		}}</span> </view>
							<view class="td"> <span :style="fontColor.down" >	{{ item.expectOutcomeMoneyReal 	}}</span> </view>
							<view class="td">
								<view class="uni-group">
									<button @tap="addOrUpdateOne(item, 'addOne')" class="uni-button" style="background-color: #e1f3d8; color: #09bb07;" size="mini" type="primary" v-if="isNewStockCode">新收</button>
									<button @tap="addOrUpdateOne(item, 'updateOne')" class="uni-button" style="background-color: #e1f3d8; color: #e6a23c;" size="mini" type="warn" v-if="isNewStockCode==false">更新</button>
								</view>
							</view>
					       </view>
					    </block>
					</view>
					
				</uni-group>
			</view>
		</uni-section>
		
		<uni-section title="展示(万位分隔)" type="line" style="background-color: #eee;"> 
			<uni-group title="展示做多:">
				<view class="table">
					<view class="tr">
						<view class="th">股票代码</view>
						<view class="th" v-for="headerObj in tableUpDataHeader" :key="headerObj.key">{{headerObj.value}}</view>
						<view class="th" style="min-width: 200rpx;">操作</view>
					</view>
					<block v-if="tableUpShowData.length>0" v-for="(item, index) in tableUpShowData" :key="index+1">
					   <view class="tr">
						<view class="td">{{item.stockCode}}</view>
						<view class="td">{{ index+1    							}}</view>
						<view class="td">{{ item.calculAdvsIvsMoney  			}}</view>
						<view class="td">{{ item.calculRealIvsMoney  			}}</view>
						<view class="td">{{ item.tradeCount 			        }}</view>
						<view class="td">{{ item.tradeRealCount 			    }}</view>
						<view class="td">{{ item.unitPriceNow 			    	}}</view>
						<view class="td">{{ item.unitPricePre 			    	}}</view>
						<view class="td"> <span :style="fontColor.up" 	> {{ item.upOutUnitPrice 				}}</span> </view>
						<view class="td"> <span :style="fontColor.down" > {{ item.downOutUnitPrice 				}}</span> </view>
						<view class="td"> <span :style="fontColor.up" 	> {{ item.expectIncomeMoney 			}}</span> </view>
						<view class="td"> <span :style="fontColor.up" 	> {{ item.expectIncomeMoneyReal  		}}</span> </view>
						<view class="td"> <span :style="fontColor.down" > {{ item.expectOutcomeMoney 			}}</span> </view>
						<view class="td"> <span :style="fontColor.down" > {{ item.expectOutcomeMoneyReal  		}}</span> </view>
						<view class="td">{{ item.updateTime  					}}</view>
						<view class="td" style="min-width: 200rpx;">
							<view >
								<button @tap="edit(item, 1)" class="uni-button" size="mini" type="primary">改</button>
								<button @tap="delOne(item, 1)" class="uni-button" size="mini" type="warn">删</button>
							</view>
						</view>
					   </view>
					</block>
				</view>
				
			</uni-group>
			<uni-group title="展示做空:">
				<view class="table">
					<view class="tr">
						<view class="th">股票代码</view>
						<view class="th" v-for="headerObj in tableDownDataHeader" :key="headerObj.key">{{headerObj.value}}</view>
						<view class="th" style="min-width: 200rpx;">操作</view>
					</view>
					<block v-if="tableDownShowData.length>0" v-for="(item, index) in tableDownShowData" :key="index+1">
					   <view class="tr">
						<view class="td">{{item.stockCode}}</view>
						<view class="td">{{ index+1    							}}</view>
						<view class="td">{{ item.calculAdvsIvsMoney  			}}</view>
						<view class="td">{{ item.calculRealIvsMoney  			}}</view>
						<view class="td">{{ item.tradeCount 			        }}</view>
						<view class="td">{{ item.tradeRealCount 			    }}</view>
						<view class="td">{{ item.unitPriceNow 			    	}}</view>
						<view class="td">{{ item.unitPricePre 			    	}}</view>
						<view class="td"> <span :style="fontColor.up" 	> {{ item.downOutUnitPrice 				}}</span> </view>
						<view class="td"> <span :style="fontColor.down" > {{ item.upOutUnitPrice 				}}</span> </view>
						<view class="td"> <span :style="fontColor.up" 	> {{ item.expectIncomeMoney 			}}</span> </view>
						<view class="td"> <span :style="fontColor.up" 	> {{ item.expectIncomeMoneyReal  		}}</span> </view>
						<view class="td"> <span :style="fontColor.down" > {{ item.expectOutcomeMoney 			}}</span> </view>
						<view class="td"> <span :style="fontColor.down" > {{ item.expectOutcomeMoneyReal  		}}</span> </view>
						<view class="td">{{ item.updateTime  					}}</view>
						<view class="td" style="min-width: 200rpx;">
							<view >
								<button @tap="edit(item, 2)" class="uni-button" size="mini" type="primary">改</button>
								<button @tap="delOne(item, 2)" class="uni-button" size="mini" type="warn">删</button>
							</view>
						</view>
					   </view>
					</block>
				</view>
			  
			</uni-group>
			
		</uni-section>
		
		<uni-section title="预设计算规则" type="line" style="background-color: #eee;">
			<uni-group title="做多规则:" >
				<uni-table border stripe emptyText="暂无更多数据">
					<uni-tr>
						<uni-th style="width: 60px;" align="center">编号					</uni-th>
						<uni-th style="min-width: 60px;" align="center">预期收益值（%）		</uni-th>
						<uni-th style="min-width: 80px;" align="center">建议出手收益值（%）	</uni-th>
						<uni-th style="min-width: 30px;" align="center">投入占比				</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in tableUpRuleData" :key="item.id+index+1">
						<uni-td style="padding: 0px 4px; text-align: center;">{{ index + 1    			}}</uni-td>
						<uni-td style="padding: 0px 4px; text-align: center;">{{ item.expectValue 		}}</uni-td>
						<uni-td style="padding: 0px 4px; text-align: center;">
							<span :style="fontColor.up">＋{{ item.upRatio}}</span><span style="font-size: 25px; font-weight: bold;">|</span><span :style="fontColor.down" >－{{item.downRatio}}</span>
						</uni-td>
						<uni-td style="padding: 0px 4px; text-align: center;">{{ item.adviseInvestRatio }}</uni-td>
					</uni-tr>
				  </uni-table>					
			</uni-group>
			
			<uni-group title="做空规则:" >
				<uni-table border stripe emptyText="暂无更多数据">
					<uni-tr>
						<uni-th style="width: 60px;" align="center">编号					</uni-th>
						<uni-th style="min-width: 60px;" align="center">预期收益值（%）		</uni-th>
						<uni-th style="min-width: 80px;" align="center">建议出手收益值（%）	</uni-th>
						<uni-th style="min-width: 30px;" align="center">投入占比				</uni-th>
					</uni-tr>
					<uni-tr v-for="(item, index) in tableDownRuleData" :key="item.id+index+1">
						<uni-td style="padding: 0px 4px; text-align: center;">{{ index + 1    			}}</uni-td>
						<uni-td style="padding: 0px 4px; text-align: center;">{{ item.expectValue 		}}</uni-td>
						<uni-td style="padding: 0px 4px; text-align: center;">
							<span :style="fontColor.up">－{{ item.upRatio}}</span><span style="font-size: 25px; font-weight: bold;">|</span><span :style="fontColor.down" >＋{{item.downRatio}}</span>
						</uni-td>
						<uni-td style="padding: 0px 4px; text-align: center;">{{ item.adviseInvestRatio }}</uni-td>
					</uni-tr>
				  </uni-table>					
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
			<uni-popup-message :type="msgType" :message="messageText" :duration="duration"></uni-popup-message>
		</uni-popup>
	</view>
	
</template>

<script>
	import getdateTime from '@/common/getdateTime.js';
	// import tTable from '@/components/t-table/t-table.vue';
	// import tTh from '@/components/t-table/t-th.vue';
	// import tTr from '@/components/t-table/t-tr.vue';
	// import tTd from '@/components/t-table/t-td.vue';
	import { Decimal } from 'decimal.js';
	import { formatMoney } from '@/common/js/util/formatMoney.js'
	import { jsonString } from '../../uni_modules/uview-plus/libs/function/test';
	
	export default {
		components: {
			// tTable, tTh, tTr, tTd
		},
		mounted(){
			// 规则数据-异步加载
			this.loadTableRuleList("inStorageUpRuleDataList", "tableUpRuleData", 1, this);
			this.loadTableRuleList("inStorageDownRuleDataList", "tableDownRuleData", 2, this);
		},
		data() {
			return {
				tableUpRuleData: []
				,tableUpRuleDataInit: [// 示例金额：10000$
					//编号	|预期收益率（%）				|预期收益上限率			|建议出手收益率（%）			|正收益率%			|负收益率%			|投入资金比（%）					|投入资金额
					{id: 0,	expectValue: '0~5', 		expectEnd: '5',			adviseValue: '+3	|-2', 	upRatio: '3',		downRatio: '2', 	adviseInvestRatio: '10', 		adviseInvestMoney: '1000' },
					{id: 1,	expectValue: '5~10', 		expectEnd: '10',		adviseValue: '+8	|-2', 	upRatio: '8',		downRatio: '2', 	adviseInvestRatio: '20', 		adviseInvestMoney: '2000' },
					{id: 2,	expectValue: '10~20', 		expectEnd: '20',		adviseValue: '+14	|-2', 	upRatio: '14',		downRatio: '2', 	adviseInvestRatio: '20', 		adviseInvestMoney: '2000' },
					{id: 3,	expectValue: '20~50', 		expectEnd: '50',		adviseValue: '+35	|-2', 	upRatio: '35',		downRatio: '2', 	adviseInvestRatio: '15', 		adviseInvestMoney: '1500' },
					{id: 4,	expectValue: '50~100', 		expectEnd: '100',		adviseValue: '+60	|-8', 	upRatio: '60',		downRatio: '8', 	adviseInvestRatio: '10', 		adviseInvestMoney: '1000' },
					{id: 5,	expectValue: '100~200', 	expectEnd: '200',		adviseValue: '+120	|-10', 	upRatio: '120',		downRatio: '10', 	adviseInvestRatio: '10', 		adviseInvestMoney: '1000' },
					{id: 6,	expectValue: '200~500',		expectEnd: '500',		adviseValue: '+200	|-50',	upRatio: '200',		downRatio: '50', 	adviseInvestRatio: '10',		adviseInvestMoney: '1000' },
					{id: 7,	expectValue: '500~100000',	expectEnd: '100000',	adviseValue: '+300	|-50',	upRatio: '300',		downRatio: '50', 	adviseInvestRatio: '5',			adviseInvestMoney: '500'  }
				]
				,tableDownRuleData: []
				,tableDownRuleDataInit: [// 示例金额：10000$
					//编号	|预期收益率（%）				|预期收益上限率			|建议出手收益率（%）			|正收益率%			|负收益率%			|投入资金比（%）					|投入资金额
					{id: 0,	expectValue: '0~5', 		expectEnd: '5',			adviseValue: '-3	|+2', 	upRatio: '3',		downRatio: '2', 	adviseInvestRatio: '10', 		adviseInvestMoney: '1000' },
					{id: 1,	expectValue: '5~10', 		expectEnd: '10',		adviseValue: '-8	|+2', 	upRatio: '8',		downRatio: '2', 	adviseInvestRatio: '20', 		adviseInvestMoney: '2000' },
					{id: 2,	expectValue: '10~20', 		expectEnd: '20',		adviseValue: '-14	|+2', 	upRatio: '14',		downRatio: '2', 	adviseInvestRatio: '20', 		adviseInvestMoney: '2000' },
					{id: 3,	expectValue: '20~50', 		expectEnd: '50',		adviseValue: '-35	|+2', 	upRatio: '35',		downRatio: '2', 	adviseInvestRatio: '15', 		adviseInvestMoney: '1500' },
					{id: 4,	expectValue: '50~100', 		expectEnd: '100',		adviseValue: '-60	|+8', 	upRatio: '60',		downRatio: '8', 	adviseInvestRatio: '10', 		adviseInvestMoney: '1000' },
				]
				,upRuleData:[]
				,value: ''
				,duration :	2000
				,type :	'center'
				,msgType :	'msgType'
				,messageText :	''
				,selectExpectValueRange:[]
				,tableUpData:[]
				,tableUpShowData:[]
				,tableDownData:[]
				,tableDownShowData:[]
				,totalAmount:''
				,selectExpectValue:''
				,stockCode:''
				,unitPriceNow:''
				,unitPricePre:''
				,tradeRealCount:''
				,range:[]
				,input:''
				,isNewStockCode: true
				,tableUpDataHeader: [// 做多
					// {key:'stockCode',				value:'股票代码'}
					{key:'i',						value:'序号'}
					,{key:'calculAdvsIvsMoney',		value:'建议投金额'}
					,{key:'calculRealIvsMoney',		value:'实际投金额'}
					,{key:'tradeCount',				value:'建议股数'}
					,{key:'tradeRealCount',			value:'实际股数'}
					,{key:'unitPriceNow',			value:'◎原单价'}
					,{key:'unitPricePre',			value:'↑ 预单价'}
					,{key:'upOutUnitPrice',			value:'涨出+单价 ↑'}
					,{key:'downOutUnitPrice',		value:'跌出-单价 ↓'}
					,{key:'expectIncomeMoney',		value:'+○预赚'}
					,{key:'expectIncomeMoneyReal',	value:'+●实赚'}
					,{key:'expectOutcomeMoney',		value:'-○预赔'}
					,{key:'expectOutcomeMoneyReal',	value:'-●实赔'}
					,{key:'updateTime',				value:'收录时间'}
					// ,{key:'upRatio',				value:'+控涨率 ↑'}
					// ,{key:'downRatio',				value:'-控跌率 ↓'}
					// ,{key:'adviseInvestRatio',		value:'投资占比'}
					// ,{key:'opt',					value:'操作'}
				]
				,tableDownDataHeader: [// 做空
					// {key:'stockCode',				value:'股票代码'}
					{key:'i',						value:'序号'}
					,{key:'calculAdvsIvsMoney',		value:'建议投金'}
					,{key:'calculRealIvsMoney',		value:'实际投金'}
					,{key:'tradeCount',				value:'建议股数'}
					,{key:'tradeRealCount',			value:'实际股数'}
					,{key:'unitPriceNow',			value:'◎原单价'}
					,{key:'unitPricePre',			value:'↓ 预单价'}
					,{key:'downOutUnitPrice',		value:'跌入+单价 ↓'}
					,{key:'upOutUnitPrice',			value:'涨入-单价 ↑'}
					,{key:'expectIncomeMoney',		value:'+○预赚'}
					,{key:'expectIncomeMoneyReal',	value:'+●实赚'}
					,{key:'expectOutcomeMoney',		value:'-○预赔'}
					,{key:'expectOutcomeMoneyReal',	value:'-●实赔'}
					,{key:'updateTime',				value:'收录时间'}
					// ,{key:'upRatio',				value:'+控跌率 ↓'}
					// ,{key:'downRatio',				value:'-控涨率 ↑'}
					// ,{key:'adviseInvestRatio',		value:'投资占比'}
					// ,{key:'opt',					value:'操作'}
				]
				,fontColor: {
					up: 	"color: red; ",
					down: 	"color: green; "
				}
			};
		}
		,async created(){
			this.stock_display = '';
			// this.stock_display = 'none';
			// 股票数据-同步加载
			this.loadTableStockList("inStorageUpStockList", "tableUpShowData", this);
			this.loadTableStockList("inStorageDownStockList", "tableDownShowData", this);
		}
		,onReady() {
		},
		methods: {
			loadTableStockList(key, table_tag_key, _this){
				uni.getStorage({
					key:key,
					success: function(resp){
						// // console.log("返回值："+ JSON.stringify(resp.data))
						// 更新对象 的指定属性，或追加属性
						_this.$set(_this, table_tag_key, resp.data);
					},
					fail:function(){
						// console.log("未取得 key:"+key);
					}
				});
			}
			,loadTableRuleList(strKey, table_tag_key, up_down, _this){
				uni.getStorage({
					key:strKey,
					success: function(resp){
						var respData = resp.data
						// console.log("返回值："+ JSON.stringify(respData))
						if(respData.length > 0){
							// 更新对象 的指定属性，或追加属性
							_this.$set(_this, table_tag_key, respData);
							return;
						}
						_this.initData(up_down, _this);
					},
					fail:function(){
						// console.log("未取得 key:"+strKey);
						_this.initData(up_down, _this);
					}
				});
			}
			,initData(up_down, _this){
				if(up_down==1){
					_this.tableUpRuleData = _this.tableUpRuleDataInit
					
				}else{
					_this.tableDownRuleData = _this.tableDownRuleDataInit
				}
			}
			,refreshFromStorage(){
				// 规则数据-异步加载
				this.loadTableRuleList("inStorageUpRuleDataList", "tableUpRuleData", 1, this);
				this.loadTableRuleList("inStorageDownRuleDataList", "tableDownRuleData", 2, this);
				this.freshFontColor()
			}
			,change(e) {
				// console.log(e.detail);
			}
			,inputTotalAmountChange(e) {			
				this.calculateInvestMoney(false);
			}
			// 股票代码-变更
			,inputStockCodeChange(e){
				this.freshNewStockFlag();
				this.calculateInvestMoney(false);
			}
			// 现单价
			,inputUnitPriceNowChange(e) {
				this.freshNewStockFlag();
				this.unitPriceChange();
				this.calculateInvestMoney(false);
			}
			// 预单价
			,inputUnitPricePreChange(e) {
				this.freshNewStockFlag();
				this.unitPriceChange();
				this.calculateInvestMoney(false);
			}
			// 预期收益率 改选
			,selectExpectValueChange(e) {
				this.calculateInvestMoney(false);
			}
			// 实际股数
			,inputTradeRealCountChange(e) {
				this.unitPriceChange();
				this.calculateInvestMoney(true);
			}
			,freshNewStockFlag(){
				var _this = this;
				uni.getStorage({
					key: _this.judgeUpOrDown() + "-" + _this.stockCode,
					success: function(resp){
						// console.log("返回值："+ JSON.stringify(resp.data))
						_this.isNewStockCode = false
						// _this.$set(_this, table_tag_key, resp.data);
					},
					fail:function(){
						// console.log("未取得 key:"+_this.judgeUpOrDown() + "-" + _this.stockCode);
						_this.isNewStockCode = true
					}
				});
			}
			// 单价变更
			,unitPriceChange(){
				var unitPriceNow = (this.unitPriceNow=="")?0:this.unitPriceNow.replace(/,/g, "");			// 当前股票单价
				var unitPricePre = (this.unitPricePre=="")?0:this.unitPricePre.replace(/,/g, "");			// 预估股票单价
				var stockRatio = 0;
				var up_down_flag = this.isUpBoolean();	// true:up-做多；false:down-做空
				if(up_down_flag){		// 做多
					stockRatio = this.getStockUpRatioByUnitPrice(unitPriceNow, unitPricePre);
					this.initSelectExpectValueRange(this, this.tableUpRuleData)
				}else{// 做空
					stockRatio = this.getStockDownRatioByUnitPrice(unitPriceNow, unitPricePre);	
					this.initSelectExpectValueRange(this, this.tableDownRuleData)					
				}
				// console.log("stockRatio："+stockRatio)
				var item = {}
				var min_last = 0;
				var min_id = 0;
				this.tableUpRuleData.sort(function(a,b){
					return parseInt(a.expectEnd) - parseInt(b.expectEnd)		// 顺序
					// return parseInt(b.expectEnd) - parseInt(a.expectEnd);		// 逆序
				})
				this.tableUpRuleData.some((val,index)=>{
					// 判断、折算 收益率
					if((val.expectEnd - stockRatio) >=0){
						min_last = val.expectEnd;
						min_id = index;
						return true;
					}
				});
				// 内推 选取
				this.selectExpectValue = min_id;
			}
			,initSelectExpectValueRange(_this, tableList){
				var rangeValue = []
				for (var i = 0; i < tableList.length; i++) {
					rangeValue.push({value:i, text:tableList[i].expectValue})
				}
				_this.selectExpectValueRange = rangeValue;
			}
			// 试算并展示
			,calculateInvestMoney(isTradeRealCountChange){
				var item = this.calculateItem(isTradeRealCountChange, this);
				var scheme = [];
				scheme.push(item);
				if(this.isUpBoolean()){	// true:up-做多；false:down-做空
					this.tableUpData = scheme;
				}else {
					this.tableDownData = scheme;
				}
				this.tradeRealCount = item.tradeRealCount
				// console.log("计算所得："+JSON.stringify(this.tableUpData));
			}
			// 试算内容
			,calculateItem(isTradeRealCountChange, _this){
				// calculAdvsIvsMoney :建议投资金额	|tradeCount :入手股数	|expectIncomeMoney :预期收益值
				var totalAmount = (_this.totalAmount=="")?0:_this.totalAmount;
				var unitPriceNow = (_this.unitPriceNow=="")?0:_this.unitPriceNow.replace(/,/g, "");			// 当前股票单价
				var unitPricePre = (_this.unitPricePre=="")?0:_this.unitPricePre.replace(/,/g, "");			// 预估股票单价
				var stockRatio = 0;
				var tableList = [];
				var up_down_flag = this.isUpBoolean();	// true:up-做多；false:down-做空
				if(up_down_flag){		// 做多
					tableList = _this.tableUpRuleData;
					stockRatio = this.getStockUpRatioByUnitPrice(unitPriceNow, unitPricePre);
				}else{// 做空
					tableList = _this.tableDownRuleData;
					stockRatio = this.getStockDownRatioByUnitPrice(unitPriceNow, unitPricePre);
				}
				
				var item = {}
				// 预期收益率
				if(_this.selectExpectValue>0||_this.selectExpectValue===0){
					tableList.some((val,index)=>{
						if(index === _this.selectExpectValue){
							// console.log("选取了："+ JSON.stringify(val))
							var ratio	= val.upRatio;
							var downRatio = 0;
							var isRatioChange = false
							// 谁小取谁
							if((ratio - stockRatio)>0){
								ratio = stockRatio;
							}
							if(up_down_flag){		// 做多
								downRatio = val.downRatio
							}else{						// 做空
								downRatio = val.upRatio
							}
							ratio = _this.decimalLocal(ratio)
							// 建议投资金额 = 投入资金占 * 总金
							var calculAdvsIvsMoney = (new Decimal(val.adviseInvestRatio).div(new Decimal(100)).mul(new Decimal(totalAmount))).toFixed(4);
							// 股数
							var tradeCount = parseInt(calculAdvsIvsMoney / unitPriceNow) ;
							calculAdvsIvsMoney = _this.formatNumberWithSeparator(tradeCount * unitPriceNow);
							
							var calculRealIvsMoney = calculAdvsIvsMoney; 
							var tradeRealCount = tradeCount
							// 实际股数
							if(isTradeRealCountChange) {
								tradeRealCount = _this.tradeRealCount;
								calculRealIvsMoney = _this.formatNumberWithSeparator(_this.tradeRealCount * unitPriceNow)
							}
							
							var upOutUnitPrice = 0;
							var downOutUnitPrice = 0;
							var expectIncomeMoney = 0;
							var expectIncomeMoneyReal = 0;
							var expectOutcomeMoney = 0;
							var expectOutcomeMoneyReal = 0;
							if(up_down_flag){		// 做多
								// 上涨卖出价 = （上涨界限 ÷ 100 + 1）× 做多购入价
								// upOutUnitPrice = _this.formatNumberWithSeparator((new Decimal(ratio).div(new Decimal(100)).add(new Decimal(1))).mul(new Decimal(unitPriceNow)));
								upOutUnitPrice = _this.formatNumberWithSeparator((ratio/100+1) * unitPriceNow);
								// 下跌卖出价 = （下跌界限 × （-1）÷ 100 + 1） × 购入价 = 购入价 × (1 - 下跌界限/100) 
								// downOutUnitPrice = _this.formatNumberWithSeparator((new Decimal(val.downRatio).mul(new Decimal(-1)).div(new Decimal(100)).add(new Decimal(1))).mul(new Decimal(unitPriceNow)));
								downOutUnitPrice = _this.formatNumberWithSeparator(((val.downRatio*-1)/100+1) * unitPriceNow);
								// 上涨赚取 = （上涨卖出价 - 做多购入价）× 推荐交易数量
								// expectIncomeMoney = _this.formatNumberWithSeparator(new Decimal(upOutUnitPrice).sub(new Decimal(unitPriceNow)).mul(new Decimal(tradeCount)));
								expectIncomeMoney = _this.formatNumberWithSeparator((upOutUnitPrice.replace(/,/g, "") - unitPriceNow) * tradeCount);
								// 实赚 = （上涨卖出价 - 做多购入价）× 实际交易数量
								// expectIncomeMoneyReal = _this.formatNumberWithSeparator(new Decimal(upOutUnitPrice).sub(new Decimal(unitPriceNow)).mul(new Decimal(tradeRealCount)));
								expectIncomeMoneyReal = _this.formatNumberWithSeparator((upOutUnitPrice.replace(/,/g, "") - unitPriceNow) * tradeRealCount);
								// 下跌赔付 = （下跌卖出价 - 做多购入价）× 推荐交易数量
								// expectOutcomeMoney = _this.formatNumberWithSeparator(new Decimal(downOutUnitPrice).sub(new Decimal(unitPriceNow)).mul(new Decimal(tradeCount)));
								expectOutcomeMoney = _this.formatNumberWithSeparator((downOutUnitPrice.replace(/,/g, "") - unitPriceNow) * tradeCount);
								// 实赔 = (下跌卖出价 - 做多购入价) × 实际交易数量
								// expectOutcomeMoneyReal = _this.formatNumberWithSeparator(new Decimal(downOutUnitPrice).sub(new Decimal(unitPriceNow)).mul(new Decimal(tradeRealCount)));
								expectOutcomeMoneyReal = _this.formatNumberWithSeparator((downOutUnitPrice.replace(/,/g, "") - unitPriceNow) * tradeRealCount);
							}else{// 做空
								// 上涨购入价 = （1 +上涨界限 ÷ 100）× 做空卖出价
								// upOutUnitPrice = _this.formatNumberWithSeparator(new Decimal(1).add(new Decimal(val.downRatio).div(new Decimal(100))).mul(new Decimal(unitPriceNow)));
								upOutUnitPrice = _this.formatNumberWithSeparator((1 + val.downRatio/100) * unitPriceNow);
								// 下跌购入价 = 做空卖出价 ÷（下跌界限 ÷ 100 + 1）
								// downOutUnitPrice = _this.formatNumberWithSeparator(new Decimal(unitPriceNow).div(new Decimal(ratio).div(new Decimal(100)).add(new Decimal(1))));
								downOutUnitPrice = _this.formatNumberWithSeparator(unitPriceNow / (ratio/100 + 1));
								// 下跌赚取 = （做空卖出价 - 下跌购入价）× 推荐交易数量
								// expectIncomeMoney = _this.formatNumberWithSeparator(new Decimal(unitPriceNow).sub(new Decimal(downOutUnitPrice)).mul(new Decimal(tradeCount)));
								expectIncomeMoney = _this.formatNumberWithSeparator((unitPriceNow - downOutUnitPrice.replace(/,/g, "")) * tradeCount);
								// 实赚 = （做空卖出价 - 下跌购入价）× 实际交易数量
								// expectIncomeMoneyReal =  _this.formatNumberWithSeparator(new Decimal(unitPriceNow).sub(new Decimal(downOutUnitPrice)).mul(new Decimal(tradeRealCount)));
								expectIncomeMoneyReal =  _this.formatNumberWithSeparator((unitPriceNow - downOutUnitPrice.replace(/,/g, "")) * tradeRealCount);
								// 上涨赔付 = (做空卖出价 - 上涨购入价) × 推荐交易数量
								// expectOutcomeMoney = _this.formatNumberWithSeparator(new Decimal(unitPriceNow).sub(new Decimal(upOutUnitPrice)).mul(new Decimal(tradeCount)));
								expectOutcomeMoney = _this.formatNumberWithSeparator((unitPriceNow - upOutUnitPrice.replace(/,/g, "")) * tradeCount);
								// 实赔 = (做空卖出价 - 上涨购入价) × 实际交易数量
								// expectOutcomeMoneyReal = _this.formatNumberWithSeparator(new Decimal(unitPriceNow).sub(new Decimal(upOutUnitPrice)).mul(new Decimal(tradeRealCount)));
								expectOutcomeMoneyReal = _this.formatNumberWithSeparator((unitPriceNow - upOutUnitPrice.replace(/,/g, "")) * tradeRealCount);
							}
							item = {
								stockCode:	_this.stockCode, 
								calculAdvsIvsMoney:	calculAdvsIvsMoney, 
								calculRealIvsMoney: calculRealIvsMoney,
								tradeCount:		isNaN(tradeCount)?0:_this.formatNumberWithSeparator(tradeCount), 
								tradeRealCount:	isNaN(tradeRealCount)?0:_this.formatNumberWithSeparator(tradeRealCount), 
								unitPriceNow:	isNaN(unitPriceNow)?0:_this.formatNumberWithSeparator(unitPriceNow), 
								unitPricePre:	isNaN(unitPricePre)?0:_this.formatNumberWithSeparator(unitPricePre), 
								upOutUnitPrice: 		upOutUnitPrice,
								downOutUnitPrice: 		downOutUnitPrice,
								expectIncomeMoney:		expectIncomeMoney,
								expectIncomeMoneyReal:	expectIncomeMoneyReal,
								expectOutcomeMoney:		expectOutcomeMoney,
								expectOutcomeMoneyReal:	expectOutcomeMoneyReal,
								upRatio:				ratio,
								downRatio:				downRatio,
								adviseInvestRatio:		val.adviseInvestRatio,
							}
							// console.log("计算收录："+JSON.stringify(item))
							return true;
						}						
					});
				}				
				return item;
			}
			,getStockUpRatioByUnitPrice(now, will){
				// (will - now)/now × 100 【例】5——>7: (7-5)/5 × 100 = 40%
				return this.getStockRatioByUnitPrice(will, now, now);
			}
			,getStockDownRatioByUnitPrice(now, will){
				// (now - will)/now × 100 【例】50——>5: (50-5)/50 × 100 = 90%
				return this.getStockRatioByUnitPrice(now, will, now);
			}
			,getStockRatioByUnitPrice(a, b, c){
				// |(a - b) / c × 100|
				return new Decimal(a - b).div(new Decimal(c)).mul(new Decimal(100)).abs().toFixed();
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
				// console.log("点击"+addOrUpdate+"【内容】:"+ itemJson)
				if(addOrUpdate=='addOne'){
					// console.log("点击了添加")
					if(this.isUpBoolean()){
						// 做多
						// console.log("添加做多")
						this.saveData("inStorageUpStockList", "tableUpShowData", item, 1, _this)
					}else{
						// 做空
						// console.log("添加做空")
						this.saveData("inStorageDownStockList", "tableDownShowData", item, 2, _this)
					}	
				}else{
					// console.log("点击了更新")
					if(this.isUpBoolean()){
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
				var timeStr = getdateTime.dateTimeStr('y-m-d')
				// var timeStr = getdateTime.dateTimeStr('y-m-d h:i:s')
				_this.$set(item, "updateTime", timeStr)
			}
			,saveData(keyStr, table_tag_key, item, up_down, _this){
				var stockSet = []
				uni.getStorage({
					key:keyStr,
					success: function(resp){
						var respData = resp.data;
						// console.log("old返回值："+ JSON.stringify(respData))
						var saveData = []
						if(Array.isArray(respData)){
							//遍历检查是否存在重复，存在则判断是否替换
							// console.log("遍历检查是否存在重复，存在则判断是否替换")
							var flag = false;
							respData.some((val,i)=>{
								if(item.stockCode == val.stockCode){
									// 存在重复
									flag = true;
									// console.log("存在重复……")
									// 此处，异步执行。暂时未找到办法解决，使其同步执行。
									// 弹窗选取
									uni.showModal({
										title: '提示',
										// 提示文字
										content: '该【股票编码】已存在,是否覆盖？',
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
												// console.log("替换："+item.stockCode)
												// console.log("替换前："+ JSON.stringify(respData))
												respData.splice(i, 1, item);
												// console.log("替换后："+ JSON.stringify(respData))
												// 由于是异步执行，所以，只得补充冗余执行。待后续，解决了 同步执行问题，可省去下部内容
												saveData = respData
												uni.setStorage({
													key:keyStr,
													data:saveData				
												});
												_this.$set(_this, table_tag_key, saveData);
											}else {
												// 执行取消后的操作
												// console.log("放弃替换，保持原数据："+item.stockCode)
											}
										}
									});
									return true;
								}
							});
							
							// 添加新数据
							if(!flag){
								// 添加
								// console.log("添加："+item.stockCode)
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
						_this.isNewStockCode = false
						// console.log("new更新值："+ JSON.stringify(saveData))
					},
					fail:function(){
						stockSet.push(item);
						uni.setStorage({
							key:keyStr,
							data:stockSet				
						});
						_this.$set(_this, table_tag_key, stockSet);
						// console.log("首次，则新增！数据："+JSON.stringify(stockSet))
					}
				});
				// 单独存一份 股票代码
				uni.setStorage({
					key:up_down +"-"+ item.stockCode,
					data:true				
				});
				
			}
			,updateStockInfo(keyStr, table_tag_key, item, _this){
				var stockSet = []
				uni.getStorage({
					key:keyStr,
					success: function(resp){
						var rsd = resp.data;
						// console.log("old返回值："+ JSON.stringify(rsd))
						var saveData = []
						if(Array.isArray(rsd)){
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
						// console.log("new更新值："+ JSON.stringify(saveData))
					},
					fail:function(){
						stockSet.push(item);
						uni.setStorage({
							key:keyStr,
							data:stockSet				
						});
						_this.$set(_this, table_tag_key, stockSet);
						// console.log("首次，则新增！数据："+JSON.stringify(stockSet))
					}
				});
			}
			/** 0:无法判断；1:up-做多；2:down-做空*/
			,judgeUpOrDown(){
				var up_down_flag = 1; // 1:up-做多；2:down-做空（默认做多）
				var unitPriceNow = (this.unitPriceNow=="")?0:this.unitPriceNow.replace(/,/g, "");			// 当前股票单价
				var unitPricePre = (this.unitPricePre=="")?0:this.unitPricePre.replace(/,/g, "");			// 预估股票单价
				if(unitPriceNow>0 && unitPricePre>0){
					if((unitPricePre-unitPriceNow)<0){
						// 做空
						up_down_flag = 2;				
					}
				}
				return up_down_flag;
			}
			,isUpBoolean(){// true:up-做多；false:down-做空
				var unitPriceNow = (this.unitPriceNow=="")?0:this.unitPriceNow.replace(/,/g, "");			// 当前股票单价
				var unitPricePre = (this.unitPricePre=="")?0:this.unitPricePre.replace(/,/g, "");			// 预估股票单价
				if(unitPriceNow>0 && unitPricePre>0){
					if((unitPricePre-unitPriceNow)<0){
						// 做空
						return false;
					}
				}
				return true;
			}
			,edit(item, up_down_flag) {
				this.stockCode = item.stockCode
				this.unitPriceNow = item.unitPriceNow
				this.unitPricePre = item.unitPricePre
				this.selectExpectValue = item.selectExpectValue
				this.tradeRealCount = item.tradeRealCount
				// 总金 * 占比 / 100 = 建议投资金额  ==>  总金 = 建议投资金额 / 占比 × 100 
				this.totalAmount = this.decimalLocal((item.calculAdvsIvsMoney).replace(/,/g, "") / item.adviseInvestRatio * 100)
				this.isNewStockCode = false
				// this.calculateInvestMoney(true)  // 试算并展示
				this.inputTradeRealCountChange(this)
			}
			// 删除(up_down_flag:1:up-做多；2:down-做空)
			,delOne(item, up_down_flag) {
				var _this = this;
				var dataStr = JSON.stringify(item);
				// console.log("点击删除"+ dataStr)
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
									// console.log("old返回值："+ JSON.stringify(respData));
									if(Array.isArray(respData)){
										//遍历检查是否存在重复，存在则判断是否替换
										// console.log("遍历检查是否存在重复，存在则判断是否替换")
										var flag = false;
										respData.some((val,i)=>{
											if(item.stockCode == val.stockCode){
												respData.splice(i, 1);
												uni.setStorage({
													key:keyStr,
													data:respData				
												});
												setTimeout(uni.removeStorage({
													key:up_down_flag + "-" + item.stockCode
												}), 2000);
												return true;
											}
										})
									}
									if(up_down_flag==1){
										_this.tableUpShowData = respData;
									}else{
										_this.tableDownShowData = respData;
									}
								},
								fail:function(){
									// console.log("未取得 key:"+keyStr);						
								}
							});
						}
					},
				});
				
				
			}
			// 信息提示（默认：2秒后退显）
			,messageToggle(type, messageText) {
				this.messageToggleTime(type, messageText, 2000)
			}
			// 信息提示（duration时间后退显）
			,messageToggleTime(type, messageText, duration) {
				this.duration = duration
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
					// console.log(val)
					this.value = val
					// 关闭窗口后，恢复默认内容
					this.$refs.inputDialog.close()
					if(val == "admin"){
						this.removeStockFroStoragem()
					}
				}, 1)
			}
			,decimalLocal(num) { // 有小数，超过4位则四舍五入；只有整数，则只保留整数。
				// 检查输入是否为整数
				if (Number.isInteger(num)) {
					// 如果是整数，直接返回
					return num;
				} else {
					// 如果有小数，则四舍五入保留4位小数
					return Math.round(num * 10000) / 10000;
				}
			}
			,formatNumberWithSeparator(number) {
				// 检查输入是否为整数
				if (!Number.isInteger(number)) {
					// 如果有小数，则四舍五入保留4位小数
					number = Math.round(number * 10000) / 10000;
				}
				// 如果是整数，直接使用
			    let numStr = number.toString();
			    let [integerPart, decimalPart] = numStr.split('.');
			    
			    // 处理整数部分：每四位加一个逗号，
			    integerPart = integerPart.replace(/(\d)(?=(\d{4})+(?!\d))/g, '$1,');
			    
			    // 如果有小数部分，拼接回去
			    if (decimalPart) {
			        return `${integerPart}.${decimalPart}`;
			    } else {
			        return integerPart;
			    }
			}
			,freshFontColor(){
				var _this = this
				uni.getStorage({
					key: 'fontColor',
					success: function(resp){
						// console.log("key: fontColor; 返回值："+ JSON.stringify(resp))
						_this.fontColor = resp.data
					},
					fail:function(){
						// console.log("未取得 key:fontColor");
						_this.fontColor = {
							up: 	"color: red; ",
							down: 	"color: green; "
						}
					}
				});
			}
		},
		
		
		
	}
</script>

<style lang="scss">
	@import '../../components/table/table.scss';  // 组件私有样式
	
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
