export const onComma = (val) => {
	if(!val) return '0';
	val = val.toString().replace(/^0*(\d+)/, '$1').replace(/[^0-9]/g, '');
	return val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const isEmpty = (str) => {
	if( str == "" || str == null || str == undefined || ( str != null && typeof str == "object" && !Object.keys(str).length)) return true;
	else return false ;
}

// 전화번호 대시 추가
export const onAddDashTel = (val) => {
	if (!val) return '';
	val = val.toString();
	val = val.replace(/[^0-9]/g, '')
	
	let tmp = ''
	if( val.length < 4){
		return val;
	} else if(val.length <= 7) {
		tmp += val.substr(0, 3);
		tmp += '-';
		tmp += val.substr(3);
		return tmp;
	} else if(val.length == 8) {
		tmp += val.substr(0, 4);
		tmp += '-';
		tmp += val.substr(4);
		return tmp;
	} else if(val.length < 10) {
		tmp += val.substr(0, 2);
		tmp += '-';
		tmp += val.substr(2, 3);
		tmp += '-';
		tmp += val.substr(5);
		return tmp;
	} else if(val.length < 11) {
		if(val.substr(0, 2) =='02') { //02-1234-5678
			tmp += val.substr(0, 2);
			tmp += '-';
			tmp += val.substr(2, 4);
			tmp += '-';
			tmp += val.substr(6);
			return tmp;
		} else { //010-123-4567
			tmp += val.substr(0, 3);
			tmp += '-';
			tmp += val.substr(3, 3);
			tmp += '-';
			tmp += val.substr(6);
			return tmp;
		}
	} else { //010-1234-5678
		tmp += val.substr(0, 3);
		tmp += '-';
		tmp += val.substr(3, 4);
		tmp += '-';
		tmp += val.substr(7);
		return tmp;
	}
}

// 사업자등록번호 대시 추가
export const onAddDashRegNum = (val) => {
	if (!val) return '';
	val = val.toString();
	val = val.replace(/[^0-9]/g, '')
	
	let tmp = ''
	tmp += val.substr(0, 3);
	tmp += '-';
	tmp += val.substr(3,2);
	
	tmp += '-';
	tmp += val.substr(5,5);
	return tmp;
}
