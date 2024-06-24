import React, { useEffect } from 'react'
import Swal from 'sweetalert2';
import axios from 'axios';
import { SaveCustAdminProps } from '../types/types';
import EditInput from 'components/input/EditInput';
import * as CommonUtils from 'components/CommonUtils';

const SaveAdminInfo = ({isEdit, custInfo, setCustInfo}:SaveCustAdminProps) => {
	const onIdCheck = async () => {
		if(CommonUtils.isEmpty(custInfo.userId)){
			Swal.fire('', '아이디를 입력해주세요.', 'warning')
			return
		}

		const response = await axios.post('/api/v1/cust/idcheck', custInfo)
		var result = response.data;

		if(result.code === 'OK'){
			Swal.fire('', '사용 가능한 아이디 입니다.', 'info');
			setCustInfo({
				...custInfo,
				idCheck : true
			})
		} else if(result.code == 'DUP') {
			Swal.fire('', '이미 등록된 아이디입니다.', 'error');
			setCustInfo({
				...custInfo,
				idCheck : false
			})
		} else {
			Swal.fire('', '입력한 아이디를 사용할 수 없습니다.', 'error');
			setCustInfo({
				...custInfo,
				idCheck : false
			})
		}
	}

	// 중복확인 후 아이디값 변경시 중복체크 false 처리
	useEffect(() => {
		if(custInfo.idCheck){
			setCustInfo({
				...custInfo,
				idCheck : false
			})
		}
	}, [custInfo.userId])
	
	useEffect(() => {
		setCustInfo({
			...custInfo,
			userHp : CommonUtils.onAddDashTel(custInfo.userHp),
			userTel : CommonUtils.onAddDashTel(custInfo.userTel)
		})
	}, [custInfo.userHp, custInfo.userTel])

	return (
		<>
		<h3 className="h3Tit mt50">관리자 정보</h3>
		<div className="boxSt mt20">
			<div className="flex align-items-center">
				<div className="formTit flex-shrink0 width170px">이름 <span className="star">*</span></div>
				<div className="width100">
					<EditInput name="userName" className="maxWidth-max-content" editData={custInfo} setEditData={setCustInfo} value={custInfo.userName || ''} maxLength={50} />
				</div>
			</div>
			<div className="flex align-items-center mt10">
				<div className="formTit flex-shrink0 width170px">이메일 <span className="star">*</span></div>
				<div className="width100">
					<EditInput name="userEmail" className="maxWidth-max-content" editData={custInfo} setEditData={setCustInfo} value={custInfo.userEmail || ''} maxLength={100} placeholder="ex) sample@iljin.co.kr" />
				</div>
			</div>
			{!isEdit ?
			<>
				<div className="flex align-items-center mt10">
					<div className="formTit flex-shrink0 width170px">아이디 <span className="star">*</span></div>
					<div className="flex align-items-center width100">
						<EditInput name="userId" className="maxWidth-max-content" editData={custInfo} setEditData={setCustInfo} value={custInfo.userId || ''} maxLength={10} placeholder="영문, 숫자 입력(10자 이내) 후 중복확인" />
						<button className="btnStyle btnSecondary flex-shrink0 ml10" title="중복 확인" onClick={onIdCheck}>중복 확인</button>
					</div>
				</div>
				<div className="flex align-items-center mt10">
					<div className="formTit flex-shrink0 width170px">비밀번호 <span className="star">*</span></div>
					<div className="width100">
						<EditInput type="password" name="userPwd" className="maxWidth-max-content" editData={custInfo} setEditData={setCustInfo} value={custInfo.userPwd || ''} maxLength={100} placeholder="대/소문자, 숫자, 특수문자 2 이상 조합(길이 8~16자리)" />
					</div>
				</div>
				<div className="flex align-items-center mt10">
					<div className="formTit flex-shrink0 width170px">비밀번호 확인 <span className="star">*</span></div>
					<div className="width100">
						<EditInput type="password" name="userPwdConfirm" className="maxWidth-max-content" editData={custInfo} setEditData={setCustInfo} value={custInfo.userPwdConfirm || ''} maxLength={100} placeholder="비밀번호와 동일해야 합니다." />
					</div>
				</div>
			</>
			:
			<>
				<div className="flex align-items-center mt10">
					<div className="formTit flex-shrink0 width170px">아이디</div>
					<div className="width100">{ custInfo.userId }</div>
				</div>
			</>
			}
			
			<div className="flex align-items-center mt10">
				<div className="formTit flex-shrink0 width170px">휴대폰 <span className="star">*</span></div>
				<div className="width100">
					<EditInput name="userHp" className="maxWidth-max-content" editData={custInfo} setEditData={setCustInfo} value={custInfo.userHp || ''} maxLength={13} />
				</div>
			</div>
			<div className="flex align-items-center mt10">
				<div className="formTit flex-shrink0 width170px">유선전화 <span className="star">*</span></div>
				<div className="width100">
					<EditInput name="userTel" className="maxWidth-max-content" editData={custInfo} setEditData={setCustInfo} value={custInfo.userTel || ''} maxLength={13} />
				</div>
			</div>
			<div className="flex align-items-center mt10">
				<div className="formTit flex-shrink0 width170px">직급</div>
				<div className="width100">
					<EditInput name="userPosition" className="maxWidth-max-content" editData={custInfo} setEditData={setCustInfo} value={custInfo.userPosition || ''} maxLength={50} />
				</div>
			</div>
			<div className="flex align-items-center mt10">
				<div className="formTit flex-shrink0 width170px">부서</div>
				<div className="width100">
					<EditInput name="userBuseo" className="maxWidth-max-content" editData={custInfo} setEditData={setCustInfo} value={custInfo.userBuseo || ''} maxLength={50} />
				</div>
			</div>
		</div>
		</>
	)
}

export default SaveAdminInfo