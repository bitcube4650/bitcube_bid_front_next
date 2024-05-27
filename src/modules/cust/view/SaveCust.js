import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import SaveCustInfo from '../components/SaveCustInfo';
import axios from 'axios';

const SaveCust = () => {
	const params = useParams();
	const navigate = useNavigate();
	
	const custCode = params.custCode		// 수정 대상 업체 코드
	let [custInfo, setCustInfo] = useState({});

	let isEdit = false;
	if(custCode != null && custCode != '' && custCode != undefined) isEdit = true;
	
	// 자식 컴포넌트에서 입력한 input 데이터 data에 셋팅
	const onChangeData = (name, value) => {
		if(name === 'capital')	value = onComma(value)
		if(name === 'tel')		value = onAddHpNumber(value)
		if(name === 'fax')		value = onAddHpNumber(value)
		if(name === 'userTel')	value = onAddHpNumber(value)
		if(name === 'userHp')	value = onAddHpNumber(value)

		setCustInfo(current => ({
			...current,
			[name] : value
		}))
	}

	// 취소
	const onMove = () => {
		{!isEdit
			?	navigate('/company/partner/management')					// 업체 등록시업체 관리 리스트로 이동
			:	navigate(`/company/partner/management/${custCode}`)		// 업체 수정시 업체 상세 리스트로 이동
		}
	};

	// 업체 상세 정보 조회
	const onInit = useCallback(async() => {
			const response = await axios.post('/api/v1/cust/management/'+custCode, {})
			const result = response.data;
			setCustInfo(result.data);

			// 사업자등록번호
			onChangeData('regnum1',		result.data.regnum.substring(0,3));
			onChangeData('regnum2',		result.data.regnum.substring(3,5));
			onChangeData('regnum3',		result.data.regnum.substring(5,10));

			// 법인번호
			onChangeData('presJuminNo1',	result.data.presJuminNo.substring(0,6));
			onChangeData('presJuminNo2',	result.data.presJuminNo.substring(6,13));
			
			onChangeData('capital',		onComma(result.data.capital));			// 자본금
			onChangeData('tel',			onAddHpNumber(result.data.tel));		// 대표전화
			onChangeData('fax',			onAddHpNumber(result.data.fax));		// 팩스번호
			onChangeData('userTel',		onAddHpNumber(result.data.userTel));	// 관리자 유선전화
			onChangeData('userHp',		onAddHpNumber(result.data.userHp));		// 관리자 휴대폰
	}, [custCode])

	const onComma = (val) => {
		if(!val) return '0';
		val = val.toString().replace(/^0*(\d+)/, '$1').replace(/[^0-9]/g, '');
		return val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	const onAddHpNumber = (val) => {
		//전화번호 입력 시 대시 입력
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

	const onSave = async() => {

		var formData = new FormData();

		formData.append('regnumFile', custInfo.regnumFile);
		formData.append('bFile', custInfo.bfile);
		formData.append('data', new Blob([JSON.stringify(custInfo)], { type: 'application/json' }));

		const response = await axios.post('/api/v1/cust/save', formData)
		
		if(response.status != '200'){
			alert(response.data.message);
			return;
		} else {
			let msg = '';
			{!isEdit ? msg = '가입되었습니다.' : msg = '수정되었습니다.'}
			alert(msg)
			navigate('/company/partner/management')
		}
	}

	useEffect(() => {
		if(isEdit) {
			onInit();
		}
	}, [onInit])

	return (
		<div class="conRight">
			{/* conHeader */}
			<div className="conHeader">
				<ul className="conHeaderCate">
					<li>업체정보</li>
					<li>업체{ isEdit ? '수정' : '등록' }</li>
				</ul>
			</div>
			{/* // conHeader */}
			{/* contents */}
			<div className="contents">
				<div className="formWidth">
					{!isEdit &&
					<div className="conTopBox">
						<ul className="dList">
							<li><div>등록이 완료되면 업체 관리자에게 이메일로 등록 되었음을 알려드립니다.</div></li>
							<li><div>회원가입 <span className="star">*</span> 부분은 필수 입력 정보 입니다.</div></li>
						</ul>
					</div>
					}
				</div>
				<SaveCustInfo isEdit={isEdit} custInfo={custInfo} onChangeData={onChangeData}/>
				
				<div class="text-center mt50">
					<a class="btnStyle btnOutline" title="취소" onClick={onMove}>취소</a>
					<a class="btnStyle btnPrimary" title={!isEdit ? '회원가입 신청' : '저장' } onClick={onSave}>{!isEdit ? '회원가입 신청' : '저장' }</a>
				</div>
			</div>
			{/* // contents */}
		</div>
	)
}

export default SaveCust
