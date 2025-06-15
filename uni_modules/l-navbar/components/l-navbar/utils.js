// 验证十进制数字
function number(value) {
	return /^[\+-]?(\d+\.?\d*|\.\d+|\d\.\d+e\+\d+)$/.test(value)
}
// rpx 转换为 px ，传参类型是数字（Number）
function rpxTopx(rpx) {
	let deviceWidth = uni.getSystemInfoSync().windowWidth; //获取设备屏幕宽度
	let px = (deviceWidth / 750) * Number(rpx)
	return Math.floor(px);
}

// 单位判断，无单位增加单位
function checkPxNum(value) {
	let g = /^[\+-]?(\d+\.?\d*|\.\d+|\d\.\d+e\+\d+)+(rpx|px)$/
	if (g.test(value)) return value
	if (number(value)) return value + 'px'
}
// 添加单位 
function addUnit(value, unit = '') {
	if (!unit) unit = 'px'
	// 判断是否为数值
	return number(value) ? `${value}${unit}` : value
}

export default {
	number,
	rpxTopx,
	checkPxNum,
	addUnit
}