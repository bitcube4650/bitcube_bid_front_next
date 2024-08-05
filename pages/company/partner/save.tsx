import { useRouter } from 'next/router';
import React, { useState } from 'react'
import SaveCustInfo from '../../../src/modules/cust/components/SaveCustInfo';
import SaveManagementInfo from '../../../src/modules/cust/components/SaveManagementInfo';
import SaveAdminInfo from '../../../src/modules/cust/components/SaveAdminInfo';
import AdminInfo from '../../../src/modules/cust/components/AdminInfo';
import Swal from 'sweetalert2';
import * as CommonUtils from '../../../src/components/CommonUtils';
import axios from 'axios';
import { MapType } from '../../../src/components/types';

const save = ({initData} : {initData:MapType}) => {
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
		router.push('/company/partner')
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
		
		if(CommonUtils.isEmpty(custInfo.regnumFileName)){
			Swal.fire('', '사업자등록증을 첨부해주세요.', 'warning')
			return false;
		}
	}
    
    // 업체정보 저장
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
            router.push('/company/partner')
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
                <>
                    {/* 협력사 정보 수정 버튼 */}
                    <div className="text-center mt50">
                        <button className="btnStyle btnOutline" title="이전" onClick={onMove}>이전</button>
                        <button className="btnStyle btnPrimary" title='저장' onClick={onSave}>저장</button>
                    </div>
                    {/* 협력사 사용자 로그인시 관리자 정보 조회 */}
                    <AdminInfo custInfo={custInfo} setCustInfo={setCustInfo} />
                </>
			</div>
			{/* // contents */}
		</div>
	)
}

export const getServerSideProps = async(context) => {	
	const cookies = context.req.headers.cookie || '';
	try {
		axios.defaults.headers.cookie = cookies;
		const response = await axios.post('http://localhost:3000/api/v1/cust/info', {});

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
export default save