import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { MapType } from '../../../../../src/components/types';
import SaveCustInfo from '../../../../../src/modules/cust/components/SaveCustInfo';
import SaveManagementInfo from '../../../../../src/modules/cust/components/SaveManagementInfo';
import SaveAdminInfo from '../../../../../src/modules/cust/components/SaveAdminInfo';
import Swal from 'sweetalert2';
import * as CommonUtils from '../../../../../src/components/CommonUtils';
import axios from 'axios';

const index = ({initData} : {initData:MapType}) => {
	const router = useRouter();
	const params = router.query;

	const loginInfo = JSON.parse(localStorage.getItem("loginInfo") as string);	

	const [selCustCode, setSelCustCode] = useState('')
	const [uploadRegnumFile, setUploadRegnumFile] = useState<File|null>();
	const [uploadBFile, setUploadBFile] = useState<File|null>();
	const [custInfo, setCustInfo] = useState<MapType>({									// 업체 정보
		...initData,
		interrelatedCustCode : loginInfo.custCode,
		userHp			: !CommonUtils.isEmpty(initData.userHp) ? CommonUtils.onAddDashTel(initData.userHp) : '',
		userTel			: !CommonUtils.isEmpty(initData.userTel) ? CommonUtils.onAddDashTel(initData.userTel) : '',
		tel				: !CommonUtils.isEmpty(initData.tel) ? CommonUtils.onAddDashTel(initData.tel) : '',
		fax				: !CommonUtils.isEmpty(initData.fax) ? CommonUtils.onAddDashTel(initData.fax) : '',
		capital			: !CommonUtils.isEmpty(initData.capital) ? CommonUtils.onComma(initData.capital) : '',

		// 사업자 등록 번호
		regnum1			: !CommonUtils.isEmpty(initData.regnum) ? initData.regnum.substring(0,3) : '',
		regnum2			: !CommonUtils.isEmpty(initData.regnum) ? initData.regnum.substring(3,5) : '',
		regnum3			: !CommonUtils.isEmpty(initData.regnum) ? initData.regnum.substring(5,10) : '',

		// 법인번호
		presJuminNo1	: !CommonUtils.isEmpty(initData.presJuminNo) ? initData.presJuminNo.substring(0,6) : '',
		presJuminNo2	: !CommonUtils.isEmpty(initData.presJuminNo) ? initData.presJuminNo.substring(6,13) : '',

		// 첨부파일
		regnumFile		: !CommonUtils.isEmpty(initData.regnumFileName) ? initData.regnumFileName : null,
		bFile			: !CommonUtils.isEmpty(initData.bFileName) ? initData.bFileName : null
	})
	

	let isEdit = true;

	// 취소
	const onMove = () => {
		router.push('/company/partner/management')
	};

	const onValidation = () => {
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

		if(CommonUtils.isEmpty(custInfo.zipcode) || CommonUtils.isEmpty(custInfo.addr)){
			Swal.fire('', '회사주소를 입력해주세요.', 'warning')
			return false;
		}

		if(CommonUtils.isEmpty(custInfo.addrDetail)){
			Swal.fire('', '회사 상세주소를 입력해주세요.', 'warning')
			return false;
		}
		
		// 업체 등록인 경우 사업자등록증 필수 아님
		if(loginInfo.custType === 'cust' && CommonUtils.isEmpty(custInfo.regnumFileName)){
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

    const onPwdvaildation = (userPwd:string) => {
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
			text : '저장 하시겠습니까?',
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#004B9E",
			confirmButtonText: '저장',
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
		if(uploadRegnumFile){
			formData.append('regnumFile', uploadRegnumFile);
		} else {
			setCustInfo({
				...custInfo,
				regnumFile : custInfo.regnumFileName
			})
		}
		if(uploadBFile) {
			formData.append('bFile', uploadBFile);
		} else {
			setCustInfo({
				...custInfo,
				bFile : custInfo.bfileName
			})
		}

		formData.append('data',	new Blob([JSON.stringify(custInfo)], { type: 'application/json' }));
		
		const response = await axios.post('/api/v1/cust/save', formData)

		let result = response.data;
		if(result.code != 'ERROR'){
			Swal.fire('', '수정되었습니다.', 'success');
			if(loginInfo.custType === 'inter') {
				router.push('/company/partner/management')
			} else {
				router.push(`/company/partner/management/${loginInfo.custCode}`)
			}
		} else {
			Swal.fire('', result.msg, 'error');
		}
	}

	return (
		<div className="conRight">
			{/* conHeader */}
			<div className="conHeader">
				<ul className="conHeaderCate">
					<li>업체정보</li>
					<li>업체수정</li>
				</ul>
			</div>
			{/* // conHeader */}
			{/* contents */}
			<div className="contents">
				{/* 업체 정보 */}
				<SaveCustInfo isEdit={isEdit} custInfo={custInfo} setCustInfo={setCustInfo} setSelCustCode={setSelCustCode} setUploadRegnumFile={setUploadRegnumFile} setUploadBFile={setUploadBFile} />
				{/*계열사 관리항목 */}
				<SaveManagementInfo custInfo={custInfo} setCustInfo={setCustInfo} />
				{/* 관리자 정보 */}
				<SaveAdminInfo  isEdit={isEdit} custInfo={custInfo} setCustInfo={setCustInfo} />

				{/* 업체 정보 등록 및 수정 버튼 */}
				<div className="text-center mt50">
					<button className="btnStyle btnOutline" title="목록" onClick={onMove}>목록</button>
					<button className="btnStyle btnPrimary" title='저장' onClick={onSave}>저장</button>
				</div>
			</div>
			{/* // contents */}
		</div>
	)
}

export const getServerSideProps = async(context) => {	
	const cookies = context.req.headers.cookie || '';
	try {
		axios.defaults.headers.cookie = cookies;
		const response = await axios.post('http://localhost:3000/api/v1/cust/management/'+context.params.custCode, {});

		return {
			props: {
				initData: response.data.data
			}
		}
	} catch (error) {
		console.error('Error fetching initial progress list:', error);
		return {
			props: {
				initData: {}
			}
		}
	}
}
export default index