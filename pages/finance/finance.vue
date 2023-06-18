<template>
	<view class="container">
		
		<uni-card title="基础卡片" :isFull="true" sub-title="副标题" extra="额外信息">
			<text>这是一个通栏卡片 ，通栏没有外边距，左右会贴合父元素。</text>
		</uni-card>
		<uni-card :is-shadow="false" is-full>
			<text class="uni-h6">分组组件可用于将组件分组，添加间隔，以产生明显的区块。</text>
		</uni-card>
		
		<uni-section title="试算" type="line" style="background-color: #eee;">
			<uni-group margin-top="20">
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
					 <uni-forms-item label="单价:">
					 	<uni-easyinput @change="inputUnitPriceChange" v-model="unitPrice" :inputBorder="true" placeholder="请输入预购单价"></uni-easyinput>
					 </uni-forms-item>
				  </uni-forms>
				  
				  <!-- <view class="button-sp-area">
					  <button @click="calculateInvestMoney" type="default" plain="true">试算</button>
				  </view> -->
				
				  <view> 
					  <t-table  title="自动试算:">
						<t-tr>
							<t-th>建议投资金额		</t-th>
							<t-th>入手股数			</t-th>
							<t-th>预期收益值（正）	</t-th>
							<t-th>预期收益值（负）	</t-th>
						</t-tr>
						<t-tr v-for="item in tableData" >
							<t-td>{{ item.calculateAdviseInvestMoney    }}</t-td>
							<t-td>{{ item.tradeCount 			        }}</t-td>
							<t-td>{{ item.expectIncomeMoney 			}}</t-td>
							<t-td>{{ item.expectOutcomeMoney 			}}</t-td>
						</t-tr>
					  </t-table>					
				 </view>
				 
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
				,tableData:[]
				,totalAmount:''
				,selectExpectValue:''
				,unitPrice:''
				,range:[]
				,input:''
				
			};
		}
		,async created(){
			var rangeValue = []
			for (var i = 0; i < this.tableList.length; i++) {
				rangeValue.push({value:this.tableList[i].id, text:this.tableList[i].expect_value})
			}
			this.selectExpectValueRange = rangeValue;
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
			,selectExpectValueChange(e) {		
				this.calculateInvestMoney();
			}
			,inputUnitPriceChange(e) {		
				this.calculateInvestMoney();
			}
			,calculateInvestMoney(){
				// calculateAdviseInvestMoney :建议投资金额	|tradeCount :入手股数	|expectIncomeMoney :预期收益值
				console.log("选取："+this.selectExpectValue);
				var scheme = [];
				this.tableList.forEach((val,index)=>{
					if(val.id === this.selectExpectValue){
						console.log("选取了："+ JSON.stringify(val))
						console.log("建议出手收益值（%）:"+ val.advise_value);
						var calculateAdviseInvestMoney = val.advise_invest_ratio / 100 * this.totalAmount;
						console.log("建议投资金额:"+ calculateAdviseInvestMoney);
						console.log("投资单价:"+ this.unitPrice);
						let tradeCount = parseInt(calculateAdviseInvestMoney / this.unitPrice) ;
						var expectIncomeMoney = parseInt(val.up_radio * calculateAdviseInvestMoney / 100);
						var expectOutcomeMoney = parseInt(val.down_radio * calculateAdviseInvestMoney / 100);
						scheme.push({
							calculateAdviseInvestMoney:calculateAdviseInvestMoney, 
							tradeCount:isNaN(tradeCount)?0:tradeCount, 
							expectIncomeMoney:expectIncomeMoney,
							expectOutcomeMoney:expectOutcomeMoney,
							});
					}
				})
				this.tableData = scheme
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
		}
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
