/**
数据验证（表单验证）
来自 grace.hcoder.net 
作者 hcoder 深海
*/
export default {
	error:'',
	check : function (data, rules){
		for (let i = 0; i < rules.length; i++) {
		  const rule = rules[i];
		  if (!this.validateField(data, rule)) return false;
		}
		return true;
	}
	
	,validateField : function (data, rule) {
		if (!rule.checkType || !rule.name || !rule.errorMsg) return true;
		
		const value = data[rule.name];
		// 处理数组类型的值（如多选框）
		if (Array.isArray(value) && value.length === 0) {
		  return this.setError(rule.errorMsg);
		}
		
		switch (rule.checkType) {
		  case 'string':
			return this.checkString(value, rule);
		  case 'int':
			return this.checkInteger(value, rule);
		  case 'mobile':
			return this.checkPhone(value, rule);
		  case 'in':
			return this.checkInArray(value, rule);
		  case 'notnull':
			return this.checkRequired(value, rule);
		  case 'array':
			return this.checkArray(value, rule);
		  default:
			return true;
		}
		
	},
	
	
	// 校验方法集
	isNumber : function (checkVal){
		var reg = /^-?[1-9][0-9]?.?[0-9]*$/;
		return reg.test(checkVal);
	},

	checkString(value, rule) {
	  const [min, max] = rule.checkRule.split(',').map(Number);
	  if (value.length < min || value.length > max) {
	    return this.setError(rule.errorMsg);
	  }
	  return true;
	},


	checkInteger(value, rule) {
	  const reg = /^-?\d+$/;
	  if (!reg.test(value)) return this.setError(rule.errorMsg);
	  
	  const [min, max] = rule.checkRule.split(',').map(Number);
	  const numVal = parseInt(value);
	  if (numVal < min || numVal > max) {
	    return this.setError(rule.errorMsg);
	  }
	  return true;
	},
	checkPhone(value, rule) {
	  const reg = /^1[3-9]\d{9}$/;
	  if (!reg.test(value)) return this.setError(rule.errorMsg);
	  return true;
	},
	checkInArray(value, rule) {
	  const allowedValues = rule.checkRule.split(',');
	  if (!allowedValues.includes(value.toString())) {
	    return this.setError(rule.errorMsg);
	  }
	  return true;
	},
	checkRequired(value, rule) {
	  if (!value || (Array.isArray(value) && value.length === 0)) {
	    return this.setError(rule.errorMsg);
	  }
	  return true;
	},
	checkArray(value, rule) {
	  const minLength = parseInt(rule.checkRule);
	  if (!Array.isArray(value) || value.length < minLength) {
	    return this.setError(rule.errorMsg);
	  }
	  return true;
	},
	setError(msg) {
	  this.error = msg;
	  return false;
	}
	
	/*
	
	switch (rule.checkType){
		case 'string':
			var reg = new RegExp('^.{' + rule.checkRule + '}$');
			if(!reg.test(data[rule.name])) {this.error = rule.errorMsg; return false;}
			break;
		case 'int':
			var reg = new RegExp('^(-[1-9]|[1-9])[0-9]{' + rule.checkRule + '}$');
			if(!reg.test(data[rule.name])) {this.error = rule.errorMsg; return false;}
			break;
		case 'between':
			if (!this.isNumber(data[rule.name])){
				this.error = rule.errorMsg;
				return false;
			}
			var minMax = rule.checkRule.split(',');
			minMax[0] = Number(minMax[0]);
			minMax[1] = Number(minMax[1]);
			if (data[rule.name] > minMax[1] || data[rule.name] < minMax[0]) {
				this.error = rule.errorMsg;
				return false;
			}
			break;
		case 'betweenD':
			var reg = /^-?[1-9][0-9]?$/;
			if (!reg.test(data[rule.name])) { this.error = rule.errorMsg; return false; }
			var minMax = rule.checkRule.split(',');
			minMax[0] = Number(minMax[0]);
			minMax[1] = Number(minMax[1]);
			if (data[rule.name] > minMax[1] || data[rule.name] < minMax[0]) {
				this.error = rule.errorMsg;
				return false;
			}
			break;
		case 'betweenF': 
			var reg = /^-?[0-9][0-9]?.+[0-9]+$/;
			if (!reg.test(data[rule.name])){this.error = rule.errorMsg; return false;}
			var minMax = rule.checkRule.split(',');
			minMax[0] = Number(minMax[0]);
			minMax[1] = Number(minMax[1]);
			if (data[rule.name] > minMax[1] || data[rule.name] < minMax[0]) {
				this.error = rule.errorMsg;
				return false;
			}
			break;
		case 'same':
			if (data[rule.name] != rule.checkRule) { this.error = rule.errorMsg; return false;}
			break;
		case 'notsame':
			if (data[rule.name] == rule.checkRule) { this.error = rule.errorMsg; return false; }
			break;
		case 'email':
			var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
			if (!reg.test(data[rule.name])) { this.error = rule.errorMsg; return false; }
			break;
		case 'mobile':
			var reg = /^1[0-9]{10,10}$/;
			if (!reg.test(data[rule.name])) { this.error = rule.errorMsg; return false; }
			break;
		case 'zipcode':
			var reg = /^[0-9]{6}$/;
			if (!reg.test(data[rule.name])) { this.error = rule.errorMsg; return false; }
			break;
		case 'reg':
			var reg = new RegExp(rule.checkRule);
			if (!reg.test(data[rule.name])) { this.error = rule.errorMsg; return false; }
			break;
		case 'in':
			if(rule.checkRule.indexOf(data[rule.name]) == -1){
				this.error = rule.errorMsg; return false;
			}
			break;
		case 'notnull':
			if(data[rule.name] == null || data[rule.name].length < 1){this.error = rule.errorMsg; return false;}
			break;
	}
	return true;
	*/
	
}