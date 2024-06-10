const filters = {
	// 법인번호 대시 추가
	onAddDashRPresJuminNum(val){
		if (!val) return '';
		val = val.toString();
		val = val.replace(/[^0-9]/g, '')
		
		let tmp = ''
		tmp += val.substr(0, 6);
		tmp += '-';
		tmp += val.substr(6,7);
		return tmp;
	},
	onSetCustStatusStr(val){
		if(val == 'Y'){
			return '정상'
		}else if(val == 'D'){
			return '삭제'
		}else{
			return '미승인';
		}
	}
}

export default filters;