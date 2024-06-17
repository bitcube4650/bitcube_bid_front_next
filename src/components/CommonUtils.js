export const onComma = (val) => {
	if(!val) return '0';
	val = val.toString().replace(/^0*(\d+)/, '$1').replace(/[^0-9]/g, '');
	return val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**************************문자열 관련 Utils**************************/
export const isEmpty = (str) => {
	if( str == "" || str == null || str == undefined || ( str != null && typeof str == "object" && !Object.keys(str).length)) return true;
	else return false ;
}

//str이 빈값이 아니면 str 리턴 빈값이면 defaultStr 리턴
export const defaultIfEmpty = (str, defaultStr) => {
	defaultStr = (isEmpty(defaultStr) ? '' : defaultStr);
	return (isEmpty(str) ? defaultStr : str);
}

//lpad
export const lpad = (str, padLen, padStr) => {
	if (padStr.length > padLen) return str;
	str += ""; // 문자로
	padStr += ""; // 문자로
	while (str.length < padLen) str = padStr + str;
	str = str.length >= padLen ? str.substring(0, padLen) : str;
	return str;
}
/**************************문자열 관련 Utils**************************/

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

/**************************날짜관련 관련 Utils**************************/
export const getCurretDate = (val) => {
	val = defaultIfEmpty(val, 'yyyy-mm-dd');
	return formatDate(new Date(), val);
}

//포맷에 맞는 날짜 return
export const formatDate = (date, format) => {
	const map = {
		mm: lpad(date.getMonth() + 1, 2, '0'),
		dd: lpad(date.getDate(), 2, '0'),
		yy: date.getFullYear().toString().slice(-2),
		yyyy: date.getFullYear().toString()
	}
	return format.replace(/mm|dd|yyyy|yy/gi, matched => map[matched]);
}

//날짜(일) 더하기
export const strDateAddDay = (dateStr, interval) => {
	const dateParts = dateStr.split('-');
	const sDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
	sDate.setDate(sDate.getDate()+interval);
	return formatDate(sDate, 'yyyy-mm-dd');
}