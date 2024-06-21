export const onComma = (val: number | string | null | undefined): string => {
	if(!val) return '0';
	val = val.toString().replace(/^0*(\d+)/, '$1').replace(/[^0-9]/g, '');
	return val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**************************문자열 관련 Utils**************************/
export const isEmpty = (str: string | null | undefined): boolean => {
	if( str == "" || str == null || str == undefined || ( str != null && typeof str == "object" && !Object.keys(str).length)) return true;
	else return false ;
}

//str이 빈값이 아니면 str 리턴 빈값이면 defaultStr 리턴
export const defaultIfEmpty = (str: string | null | undefined, defaultStr: string): string => {
	defaultStr = (isEmpty(defaultStr) ? '' : defaultStr);

	if(str === null || str === undefined || str === "") {
		return defaultStr;
	} else {
		return str;
	}
}

//lpad
export const lpad = (str: number | string, padLen: number, padStr: number | string): string => {
	str = str.toString(); // 문자로
	padStr = padStr.toString(); // 문자로

	if (padStr.length > padLen) return str;
	while (str.length < padLen) str = padStr + str;
	str = str.length >= padLen ? str.substring(0, padLen) : str;
	return str;
}
/**************************문자열 관련 Utils**************************/

// 전화번호 대시 추가
export const onAddDashTel = (val: number | string | null | undefined): string => {
	if (!val) return '';
	val = val.toString();
	val = val.replace(/[^0-9]/g, '')
	
	let tmp = ''
	if( val.length < 4){
		return val;
	} else if(val.length <= 7) {
		tmp += val.substring(0, 3);
		tmp += '-';
		tmp += val.substring(3, val.length);
		return tmp;
	} else if(val.length == 8) {
		tmp += val.substring(0, 4);
		tmp += '-';
		tmp += val.substring(4, val.length);
		return tmp;
	} else if(val.length < 10) {
		tmp += val.substring(0, 2);
		tmp += '-';
		tmp += val.substring(2, 5);
		tmp += '-';
		tmp += val.substring(5, val.length);
		return tmp;
	} else if(val.length < 11) {
		if(val.substring(0, 2) =='02') { //02-1234-5678
			tmp += val.substring(0, 2);
			tmp += '-';
			tmp += val.substring(2, 6);
			tmp += '-';
			tmp += val.substring(6, val.length);
			return tmp;
		} else { //010-123-4567
			tmp += val.substring(0, 3);
			tmp += '-';
			tmp += val.substring(3, 6);
			tmp += '-';
			tmp += val.substring(6, val.length);
			return tmp;
		}
	} else { //010-1234-5678
		tmp += val.substring(0, 3);
		tmp += '-';
		tmp += val.substring(3, 7);
		tmp += '-';
		tmp += val.substring(7, val.length);
		return tmp;
	}
}

// 사업자등록번호 대시 추가
export const onAddDashRegNum = (val: number | string | null | undefined): string => {
	if (!val) return '';
	val = val.toString();
	val = val.replace(/[^0-9]/g, '')
	
	let tmp = ''
	tmp += val.substring(0, 3);
	tmp += '-';
	tmp += val.substring(3,5);
	
	tmp += '-';
	tmp += val.substring(5,val.length);
	return tmp;
}

/**************************날짜관련 관련 Utils**************************/
export const getCurretDate = (val: string): string => {
	val = defaultIfEmpty(val, 'yyyy-mm-dd');
	return formatDate(new Date(), val);
}

//포맷에 맞는 날짜 return
export const formatDate = (date: Date, format: string): string => {
	const map: { [key: string]: string } = {
		mm: lpad(date.getMonth() + 1, 2, '0'),
		dd: lpad(date.getDate(), 2, '0'),
		yy: date.getFullYear().toString().slice(-2),
		yyyy: date.getFullYear().toString()
	}
	return format.replace(/mm|dd|yyyy|yy/gi, matched => map[matched]);
}

//날짜(일) 더하기
export const strDateAddDay = (dateStr: string, interval: number): string => {
	const dateParts = dateStr.split('-').map(part => parseInt(part, 10));
	const sDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
	sDate.setDate(sDate.getDate()+interval);
	return formatDate(sDate, 'yyyy-mm-dd');
}