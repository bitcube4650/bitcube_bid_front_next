import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import SaveCustInfo from '../components/SaveCustInfo';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as CommonUtils from 'components/CommonUtils';

const SaveCust = () => {
	const params = useParams();
	const navigate = useNavigate();

	const [selCust, setSelCust] = useState({		// 선택된 업체(타 계열사 선택)
		custCode : params?.custCode || '',
		url : '/api/v1/cust/management/'
	});

	let [custInfo, setCustInfo] = useState({
		idCheck : false
	});

	let isEdit = false;
	if(selCust?.custCode != '') isEdit = true;
	
	// 자식 컴포넌트에서 입력한 input 데이터 data에 셋팅
	const onChangeData = (type, name, value) => {
		if(type == 'selCust') {
			setSelCust(current => ({
				...current,
				[name] : value
			}))
		} else {
			setCustInfo(current => ({
				...current,
				[name] : value
			}))
		}
	}

	// 취소
	const onMove = () => {
		{(params?.custCode || '') === ''
			?	navigate('/company/partner/management')					// 업체 등록시업체 관리 리스트로 이동
			:	navigate(`/company/partner/management/${selCust.custCode}`)		// 업체 수정시 업체 상세 리스트로 이동
		}
	};

	// 업체 상세 정보 조회
	const onInit = useCallback(async() => {
		const response = await axios.post(selCust.url+selCust.custCode, {})
		const result = response.data;
		setCustInfo(result.data);

		// 사업자등록번호
		onChangeData('custInfo',	'regnum1',		!CommonUtils.isEmpty(result.data.regnum) ? result.data.regnum.substring(0,3) : '')
		onChangeData('custInfo',	'regnum2',		!CommonUtils.isEmpty(result.data.regnum) ? result.data.regnum.substring(3,5) : '')
		onChangeData('custInfo',	'regnum3',		!CommonUtils.isEmpty(result.data.regnum) ? result.data.regnum.substring(5,10) : '')

		// 법인번호
		onChangeData('custInfo',	'presJuminNo1',	!CommonUtils.isEmpty(result.data.presJuminNo) ? result.data.regnum.substring(0,6) : '')
		onChangeData('custInfo',	'presJuminNo2',	!CommonUtils.isEmpty(result.data.presJuminNo) ? result.data.regnum.substring(6,13) : '')
	})

	const onValidation = () => {
		// 등록인 경우에만 체크
		// if(!isEdit){
		// 	if(CommonUtils.isEmpty(custInfo.custType1)){
		// 		Swal.fire('', '업체유형 1을 선택해주세요.', 'warning')
		// 		return false;
		// 	}
		// }

		if(CommonUtils.isEmpty(custInfo.custName)){
			Swal.fire('', '회사명을 입력해주세요.', 'warning')
			return false;
		}
		
		if(CommonUtils.isEmpty(custInfo.presName)){
			Swal.fire('', '대표자명을 입력해주세요.', 'warning')
			return false;
		}
		
		if(CommonUtils.isEmpty(custInfo.regnum1) || CommonUtils.isEmpty(custInfo.regnum2) || CommonUtils.isEmpty(custInfo.regnum3)){
			Swal.fire('', '사업자등록번호를 입력해주세요.', 'warning')
			return false;
		} else {
			if(custInfo.regnum1.length != 3){
				Swal.fire('', '사업자등록번호를 정확히 입력해주세요.', 'warning')
				return false;
			}
			if(custInfo.regnum2.length != 2){
				Swal.fire('', '사업자등록번호를 정확히 입력해주세요.', 'warning')
				return false;
			}
			if(custInfo.regnum3.length != 5){
				Swal.fire('', '사업자등록번호를 정확히 입력해주세요.', 'warning')
				return false;
			}
		}

		if(!CommonUtils.isEmpty(custInfo.presJuminNo1) || !CommonUtils.isEmpty(custInfo.presJuminNo2)){
			if(custInfo.presJuminNo1.length != 6){
				Swal.fire('', '법인번호를 정확히 입력해주세요.', 'warning')
				return false;
			}
			if(custInfo.presJuminNo2.length != 7){
				Swal.fire('', '법인번호를 정확히 입력해주세요.', 'warning')
				return false;
			}
		}

		if(CommonUtils.isEmpty(custInfo.capital)){
			Swal.fire('', '자본금을 입력해주세요.', 'warning')
			return false;
		}

		if(CommonUtils.isEmpty(custInfo.foundYear)){
			Swal.fire('', '설립년도를 입력해주세요.', 'warning')
			return false;
		}

		if(CommonUtils.isEmpty(CommonUtils.onAddDashTel(custInfo.tel))){
			Swal.fire('', '대표전화를 입력해주세요.', 'warning')
			return false;
		}

		// if(CommonUtils.isEmpty(custInfo.zipcode) || CommonUtils.isEmpty(custInfo.addr) || CommonUtils.isEmpty(custInfo.addrDetail)){
		// 	Swal.fire('', '회사주소를 입력해주세요.', 'warning')
		// 	return false;
		// }

		if(CommonUtils.isEmpty(custInfo.regnumFileName)){
			Swal.fire('', '사업자등록증을 첨부해주세요.', 'warning')
			return false;
		}

		if(CommonUtils.isEmpty(custInfo.userName)){
			Swal.fire('', '관리자 이름을 입력해주세요.', 'warning')
			return false;
		}

		if(CommonUtils.isEmpty(custInfo.userEmail)){
			Swal.fire('', '관리자 메일주소를 입력해주세요.', 'warning')
			return false;
		} else {
			const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
			if (!emailRegex.test(custInfo.userEmail)) {
				Swal.fire('', '입력한 이메일 형식이 올바르지 않습니다.', 'warning');
				return false;
			}
		}

		// 등록인 경우에만 체크
		if(!isEdit){
			if(CommonUtils.isEmpty(custInfo.userId)){
				Swal.fire('', '관리자 아이디를 입력해주세요.', 'warning')
				return false;
			}
	
			if(CommonUtils.isEmpty(custInfo.idCheck) || custInfo.idCheck === false){
				Swal.fire('', '관리자 아이디 중복 체크 해주세요', 'warning')
				return false;
			}
	
			if(CommonUtils.isEmpty(custInfo.userPwd)){
				Swal.fire('', '관리자 비밀번호를 입력해주세요.', 'warning')
				return false;
			} else {
				const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
				if (!pwdRegex.test(custInfo.userPwd)) {
					Swal.fire({ type: "warning", text: "비밀번호는 최소 8자 이상, 숫자와 특수문자를 포함해야 합니다." });
					return false;
				}
			}
	
			if(custInfo.userPwdConfirm != custInfo.userPwd){
				Swal.fire('', '관리자 비밀번호와 동일하게 입력해주세요.', 'warning')
				return false;
			}
		}

		if(CommonUtils.isEmpty(custInfo.userHp)){
			Swal.fire('', '관리자 휴대폰 번호를 입력해주세요.', 'warning')
			return false;
		} else {
			const phoneNumberRegex = /^\d{3}-\d{3,4}-\d{4}$/;
			if (!phoneNumberRegex.test(CommonUtils.onAddDashTel(custInfo.userHp))) {
				Swal.fire('', '휴대폰번호 형식에 맞게 입력해주세요.', 'warning');
				return false;
			}
		}

		if(CommonUtils.isEmpty(custInfo.userTel)){
			Swal.fire('', '관리자 유선전화를 입력해주세요.', 'warning')
			return false;
		} else {
			const telNumberRegex = /^\d{2,3}-\d{3,4}-\d{4}$/;
			if (!telNumberRegex.test(CommonUtils.onAddDashTel(custInfo.userTel))) {
				Swal.fire('', '유선전화 형식에 맞게 입력해주세요.', 'warning');
				return false;
			}
		}
	}

	const onSave = () => {
		if(onValidation() === false) return;		// 유효성 검사

		Swal.fire({
			title: "",
			text : `${!isEdit ? '회원가입' : '저장'} 처리하시겠습니까?`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#004B9E",
			confirmButtonText: `${!isEdit ? '회원가입' : '저장'}`,
			cancelButtonColor: "#b70b2e",
			cancelButtonText : '취소',
		}).then((result) => {
			if (result.isConfirmed) {
				onSaveCallBack();
			}
		})
	}

	const onSaveCallBack = async() => {
		try {
			let formData = new FormData();
			formData.append('regnumFile', custInfo.regnumFile != null && custInfo.regnumFileName != '' ? custInfo.regnumFile : null);
			formData.append('bFile',  custInfo.bfile != null && custInfo.bfileName != '' ? custInfo.bfile : null);
			formData.append('data', new Blob([JSON.stringify(custInfo)], { type: 'application/json' }));

			const response = await axios.post('/api/v1/cust/save', formData, {
				headers : 'multipart/form-data'
			})
			
			let result = response.data;
			if(result.code != 'ERROR'){
				Swal.fire('', `${!isEdit ? '가입되었습니다.' : '수정되었습니다.'}`, 'success');
				navigate('/company/partner/management')
			} else {
				Swal.fire('', result.msg, 'error');
			}
		} catch(error) {
			Swal.fire('', error, 'error');
		}
	}

	useEffect(() => {
		if(selCust.custCode != '') {
			onInit();
		}
	}, [selCust.custCode])

	return (
		<div className="conRight">
			{/* conHeader */}
			<div className="conHeader">
				<ul className="conHeaderCate">
					<li>업체정보</li>
					<li>업체{(params?.custCode || '') != '' ? '수정' : '등록' }</li>
				</ul>
			</div>
			{/* // conHeader */}
			{/* contents */}
			<div className="contents">
				{(params?.custCode || '') === '' &&
				<div className="formWidth">
					<div className="conTopBox">
						<ul className="dList">
							<li><div>등록이 완료되면 업체 관리자에게 이메일로 등록 되었음을 알려드립니다.</div></li>
							<li><div>회원가입 <span className="star">*</span> 부분은 필수 입력 정보 입니다.</div></li>
						</ul>
					</div>
				</div>
				}
				<SaveCustInfo isEdit={isEdit} custInfo={custInfo} onChangeData={onChangeData}/>
				
				<div className="text-center mt50">
					<button className="btnStyle btnOutline" title="취소" onClick={onMove}>취소</button>
					<button className="btnStyle btnPrimary" title={!isEdit ? '회원가입 신청' : '저장' } onClick={onSave}>{!isEdit ? '회원가입 신청' : '저장' }</button>
				</div>
			</div>
			{/* // contents */}
		</div>
	)
}

export default SaveCust
