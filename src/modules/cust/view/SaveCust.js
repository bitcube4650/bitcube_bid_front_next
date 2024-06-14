import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import SaveCustInfo from '../components/SaveCustInfo';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as CommonUtils from 'components/CommonUtils';
import SaveManagementInfo from '../components/SaveManagementInfo';
import AdminInfo from '../components/AdminInfo';
import SaveAdminInfo from '../components/SaveAdminInfo';

const SaveCust = () => {
	const params = useParams();
	const navigate = useNavigate();

	const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));			// 세션정보
	const [selCustCode, setSelCustCode] = useState('')							// 타계열사 선택시 선택한 업체 코드
	const [custInfo, setCustInfo] = useState({									// 업체 정보
		idCheck : false,
		interrelatedCustCode : loginInfo.custCode
	})

	let isEdit = (params?.custCode || '') === '' && selCustCode === '' ? false : true;
	
	// 자식 컴포넌트에서 입력한 input 데이터 data에 셋팅
	const onChangeData = (name, value) => {
		setCustInfo(current => ({
			...current,
			[name] : value
		}))
	}

	// 취소
	const onMove = () => {
		let custCode = params?.custCode || ''
		{custCode === '' 
			?	navigate('/company/partner/management')						// 업체 등록시 업체 관리 리스트로 이동
			:	navigate('/company/partner/management/'+custCode)			// 업체 수정시 업체 상세 리스트로 이동
		}
	};

	// 업체 상세 정보 조회
	const onInit = useCallback(async() => {
		let api = ''
		if(loginInfo.custType === 'inter') {
			// 계열사 권한 로그인
			if(selCustCode !== '') api = '/api/v1/cust/otherCustManagement/'+selCustCode		// 타사 계열사 업체 상세 조회
			else api = '/api/v1/cust/management/'+params?.custCode								// 업체 상세 조회
		} else {
			// 협력업체 로그인
			api = '/api/v1/cust/info'															// 자사 정보 조회
		}

		const response = await axios.post(api, {})
		const result = response.data;

		setCustInfo({
			...result.data,
			userHp			: !CommonUtils.isEmpty(result.data.userHp) ? CommonUtils.onAddDashTel(result.data.userHp) : '',
			userTel			: !CommonUtils.isEmpty(result.data.userTel) ? CommonUtils.onAddDashTel(result.data.userTel) : '',
			tel				: !CommonUtils.isEmpty(result.data.tel) ? CommonUtils.onAddDashTel(result.data.tel) : '',
			fax				: !CommonUtils.isEmpty(result.data.fax) ? CommonUtils.onAddDashTel(result.data.fax) : '',
			capital			: !CommonUtils.isEmpty(result.data.capital) ? CommonUtils.onComma(result.data.capital) : '',

			// 사업자 등록 번호
			regnum1			: !CommonUtils.isEmpty(result.data.regnum) ? result.data.regnum.substring(0,3) : '',
			regnum2			: !CommonUtils.isEmpty(result.data.regnum) ? result.data.regnum.substring(3,5) : '',
			regnum3			: !CommonUtils.isEmpty(result.data.regnum) ? result.data.regnum.substring(5,10) : '',

			// 법인번호
			presJuminNo1	: !CommonUtils.isEmpty(result.data.presJuminNo) ? result.data.presJuminNo.substring(0,6) : '',
			presJuminNo2	: !CommonUtils.isEmpty(result.data.presJuminNo) ? result.data.presJuminNo.substring(6,13) : '',

			// 첨부파일
			regnumFile		: !CommonUtils.isEmpty(result.data.regnumFileName) ? result.data.regnumFileName : null,
			bFile			: !CommonUtils.isEmpty(result.data.bFileName) ? result.data.bFileName : null
		})
	})

	const onValidation = () => {
		// 등록인 경우에만 체크
		if(!isEdit){
			if(CommonUtils.isEmpty(custInfo.custType1)){
				Swal.fire('', '업체유형 1을 선택해주세요.', 'warning')
				return false;
			}
		}

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

		if(CommonUtils.isEmpty(custInfo.tel)){
			Swal.fire('', '대표전화를 입력해주세요.', 'warning')
			return false;
		}

		if(CommonUtils.isEmpty(custInfo.zipcode) || CommonUtils.isEmpty(custInfo.addr) || CommonUtils.isEmpty(custInfo.addrDetail)){
			Swal.fire('', '회사주소를 입력해주세요.', 'warning')
			return false;
		}
		
		// 업체 등록인 경우 사업자등록증 필수 아님
		if((params?.custCode || '') !== '' && CommonUtils.isEmpty(custInfo.regnumFileName)){
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
	
			// 비밀번호 유효성 검사
			if (!onPwdvaildation(custInfo.userPwd)) {
				return false;
			}
	
			if(custInfo.userPwdConfirm !== custInfo.userPwd){
				Swal.fire('', '관리자 비밀번호와 동일하게 입력해주세요.', 'warning')
				return false;
			}
		}

		if(CommonUtils.isEmpty(custInfo.userHp)){
			Swal.fire('', '관리자 휴대폰 번호를 입력해주세요.', 'warning')
			return false;
		} else {
			const phoneNumberRegex = /^\d{3}-\d{3,4}-\d{4}$/;
			if (!phoneNumberRegex.test(custInfo.userHp)) {
				Swal.fire('', '휴대폰번호 형식에 맞게 입력해주세요.', 'warning');
				return false;
			}
		}

		if(CommonUtils.isEmpty(custInfo.userTel)){
			Swal.fire('', '관리자 유선전화를 입력해주세요.', 'warning')
			return false;
		} else {
			const telNumberRegex = /^\d{2,3}-\d{3,4}-\d{4}$/;
			if (!telNumberRegex.test(custInfo.userTel)) {
				Swal.fire('', '유선전화 형식에 맞게 입력해주세요.', 'warning');
				return false;
			}
		}
	}

    const onPwdvaildation = (userPwd) => {
        let password = !CommonUtils.isEmpty(userPwd) ? userPwd : "";
		let hasUpperCase = /[A-Z]/.test(password);//대문자
		let hasLowerCase = /[a-z]/.test(password);//소문자
		let hasDigit = /\d/.test(password);//숫자
		let hasSpecialChar = /[!@#$%^&*()\-_=+{};:,<.>]/.test(password);//특수문자

		let isValidPassword = (hasLowerCase && hasUpperCase) || (hasLowerCase && hasDigit) || (hasLowerCase && hasSpecialChar)
							|| (hasUpperCase && hasDigit) || (hasUpperCase && hasSpecialChar) || (hasDigit && hasSpecialChar)

		let isValidLength = password.length >= 8 && password.length <= 16
		if (!isValidPassword) {
			Swal.fire('', '비밀번호는 대/소문자, 숫자, 특수문자중에서 2가지 이상 조합되어야 합니다.', 'warning');
			return false;
		} else if (!isValidLength) {
			Swal.fire('', '비밀번호는 8자 이상 16자 이하로 작성해주세요.', 'warning');
			return false;
		}

		return true;
    };

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
		let formData = new FormData();
		formData.append('regnumFile',	typeof custInfo.regnumFile === "string" ? null : custInfo.regnumFile);
		formData.append('bFile',		typeof custInfo.bFile === "string" ? null : custInfo.bFile);
		formData.append('data',			new Blob([JSON.stringify(custInfo)], { type: 'application/json' }));

		const response = await axios.post('/api/v1/cust/save', formData, {
			headers : 'multipart/form-data'
		})
		
		let result = response.data;
		if(result.code != 'ERROR'){
			Swal.fire('', `${!isEdit ? '가입되었습니다.' : '수정되었습니다.'}`, 'success');
			if(loginInfo.custType === 'inter') {
				navigate('/company/partner/management')
			} else {
				navigate(`/company/partner/management/${loginInfo.custCode}`)
			}
		} else {
			Swal.fire('', result.msg, 'error');
		}
	}

	useEffect(() => {
		if(isEdit) {
			onInit();
		}
	}, [selCustCode, params.custCode])

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
				{/* 업체 정보 */}
				<SaveCustInfo isEdit={isEdit} custInfo={custInfo} onChangeData={onChangeData} setSelCustCode={setSelCustCode}/>
				
				{loginInfo.custType === 'inter'
				?
				// 계열사 사용자 로그인시 조회
					<>
					{/*계열사 관리항목 업체 수정시 조회 */}
					{isEdit &&
						<SaveManagementInfo isEdit={isEdit} custInfo={custInfo} onChangeData={onChangeData} />					
					}
					{/* 관리자 정보 */}
					<SaveAdminInfo  isEdit={isEdit} custInfo={custInfo} onChangeData={onChangeData} />

					{/* 업체 정보 등록 및 수정 버튼 */}
					<div className="text-center mt50">
						<button className="btnStyle btnOutline" title="취소" onClick={onMove}>취소</button>
						<button className="btnStyle btnPrimary" title={!isEdit ? '회원가입 신청' : '저장' } onClick={onSave}>{!isEdit ? '회원가입 신청' : '저장' }</button>
					</div>
					</>
				:
				// 협력사사용자(관리자) 로그인시 조회
					<>
						{/* 협력사 정보 수정 버튼 */}
						<div className="text-center mt50">
							<button className="btnStyle btnOutline" title="취소" onClick={onMove}>취소</button>
							<button className="btnStyle btnPrimary" title='저장' onClick={onSave}>저장</button>
						</div>
						{/* 협력사 사용자 로그인시 관리자 정보 조회 */}
						<AdminInfo custInfo={custInfo} />
					</>
				}
			</div>
			{/* // contents */}
		</div>
	)
}

export default SaveCust
