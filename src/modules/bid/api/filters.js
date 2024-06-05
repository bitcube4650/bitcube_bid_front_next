const filters = {
    ftBiMode(val){
        if(val == 'A'){ return '지명경쟁입찰'}
        else if(val == 'B'){ return '일반경쟁입찰'}
        else return val;
    },
    ftInsMode(val){
        if(val == '1'){ return '파일등록'}
        else if(val == '2'){ return '직접입력'}
    },
    ftIngTag(val){
        if(val == 'A5'){ return '입찰완료'}
        else if(val == 'A7'){ return '유찰'}
    },
    numberWithCommas(val) {
        if(!val) return '';
        else {
            val = Math.round(val);
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    },
    ftFileFlag(val){
        if(val == '0'){ return '대내용'}
        else if(val == '1'){ return '대외용'}
    },
    ftSuccYn(val){
        if(val == 'Y'){ return '낙찰'}
        else if(val == 'N'){ return ''}
    },
    ftEsmtYn(val){
        if(val == '0'){ return ''}
        else if(val == '1'){ return '공고확인'}
        else if(val == '2'){ return '상세'}
    },
    ftOpenAttSign(val){
        if(val == 'Y'){
            return '[서명 확인]'
        }else if(val == 'N'){
            return '[서명 미확인]'
        }else{
            return '';
        }
    },
    ftBdComp(data, esmtAmt){
        if(data.bdAmt <= 0){
            return '';
        }else{
            let rtn = ((data.bdAmt - (data.bdAmt - esmtAmt)) / data.bdAmt * 100)
            return rtn.toFixed(1) + "%";
        }
    },

    //콤마 표기함수
    ftEsmtAmt(cust){
        if(this.isEmpty(cust.esmtAmt)) return ''
        else {
            let esmtCurr = this.defaultIfEmpty(cust.esmtCurr, '');
            let esmtAmt = cust.esmtAmt;
            return esmtCurr + (esmtCurr != '' ? ' ' : '') + esmtAmt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    },
    //소숫점처리 및 콤마
    ftRoundComma(number){
        if(this.isEmpty(number)) return ''
        else {
            number = Math.round(number);
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    },

    /**************************문자열 관련 Utils**************************/
    //빈 문자열 확인
    isEmpty(str){
        if( str == "" || str == null || str == undefined || ( str != null && typeof str == "object" && !Object.keys(str).length)) return true;
        else return false ;
    },
    //str이 빈값이 아니면 str 리턴 빈값이면 defaultStr 리턴
    defaultIfEmpty(str, defaultStr){
        defaultStr = (this.isEmpty(defaultStr) ? '' : defaultStr);
        return (this.isEmpty(str) ? defaultStr : str);
    },
    //lpad
    lpad(str, padLen, padStr) {
        if (padStr.length > padLen) return str;
        str += ""; // 문자로
        padStr += ""; // 문자로
        while (str.length < padLen) str = padStr + str;
        str = str.length >= padLen ? str.substring(0, padLen) : str;
        return str;
    },
    /**************************문자열 관련 Utils**************************/
    /**************************날짜관련 관련 Utils**************************/
    //현재일자 return
    getCurretDate : function(format){
        format = this.defaultIfEmpty(format, 'yyyy-mm-dd');
        return this.formatDate(new Date(), format);
    },
    //포맷에 맞는 날짜 return
    formatDate(date, format) {
        const map = {
            mm: this.lpad(date.getMonth() + 1, 2, '0'),
            dd: this.lpad(date.getDate(), 2, '0'),
            yy: date.getFullYear().toString().slice(-2),
            yyyy: date.getFullYear().toString()
        }
        return format.replace(/mm|dd|yyyy|yy/gi, matched => map[matched]);
    },
    //날짜(일) 더하기
    strDateAddDay(dateStr, interval){
        const dateParts = dateStr.split('-');
        const sDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        sDate.setDate(sDate.getDate()+interval);
        return this.formatDate(sDate, 'yyyy-mm-dd');
    },
    /**************************날짜관련 관련 Utils**************************/
}

export default filters;