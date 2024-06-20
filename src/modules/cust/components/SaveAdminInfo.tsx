import React from 'react'
import * as CommonUtils from 'components/CommonUtils';
import Swal from 'sweetalert2';
import axios from 'axios';
import { SaveCustAdminProps } from '../types/types';
import EditInput from 'components/input/EditInput';

const SaveAdminInfo = ({isEdit, custInfo, setCustInfo}:SaveCustAdminProps) => {
	const onIdCheck = async () => {
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
			Swal.fire('', '입력한 아이디를 사용할 수 있습니다.', 'error');
			setCustInfo({
				...custInfo,
				idCheck : false
			})
		}
	}

	return (
		<>
		<h3 className="h3Tit mt50">관리자 정보</h3>
		<div className="boxSt mt20">
			<div className="flex align-items-center">
				<div className="formTit flex-shrink0 width170px">이름 <span className="star">*</span></div>
				<div className="width100">
					<EditInput name="userName" editData={custInfo} setEditData={setCustInfo} defaultValue={custInfo.userName || ''} maxLength={50} />
					{/* <input type="text" name="userName" value={custInfo.userName || ''} className="inputStyle maxWidth-max-content" maxLength="50" onChange={handleChange}/> */}
				</div>
			</div>
			<div className="flex align-items-center mt10">
				<div className="formTit flex-shrink0 width170px">이메일 <span className="star">*</span></div>
				<div className="width100">
					<EditInput name="userEmail" editData={custInfo} setEditData={setCustInfo} defaultValue={custInfo.userEmail || ''} maxLength={100} />
					{/* <input type="text" name="userEmail" value={custInfo.userEmail || ''} maxLength="100" className="inputStyle maxWidth-max-content" placeholder="ex) sample@iljin.co.kr" onChange={handleChange} /> */}
				</div>
			</div>
			{!isEdit ?
			<>
				<div className="flex align-items-center mt10">
					<div className="formTit flex-shrink0 width170px">아이디 <span className="star">*</span></div>
					<div className="flex align-items-center width100">
						<EditInput name="userId" editData={custInfo} setEditData={setCustInfo} defaultValue={custInfo.userId || ''} maxLength={10} />
						{/* <input type="text" name="userId" value={custInfo.userId || ''} maxLength="10" className="inputStyle maxWidth-max-content" placeholder="영문, 숫자 입력(10자 이내) 후 중복확인" onChange={(e) => {handleChange(e); onChangeData('custInfo', 'idCheck', false);}} /> */}
						<button className="btnStyle btnSecondary flex-shrink0 ml10" title="중복 확인" onClick={onIdCheck}>중복 확인</button>
					</div>
				</div>
				<div className="flex align-items-center mt10">
					<div className="formTit flex-shrink0 width170px">비밀번호 <span className="star">*</span></div>
					<div className="width100">
						<input type='password' name="userPwd" value={custInfo.userPwd || ''} maxLength={100} className="inputStyle maxWidth-max-content" placeholder="대/소문자, 숫자, 특수문자 2 이상 조합(길이 8~16자리)" />
					</div>
				</div>
				<div className="flex align-items-center mt10">
					<div className="formTit flex-shrink0 width170px">비밀번호 확인 <span className="star">*</span></div>
					<div className="width100">
						<input type='password' name="userPwdConfirm" value={custInfo.userPwdConfirm || ''} maxLength={100} className="inputStyle maxWidth-max-content" placeholder="비밀번호와 동일해야 합니다." />
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
					<EditInput name="userHp" editData={custInfo} setEditData={setCustInfo} defaultValue={custInfo.userHp || ''} maxLength={13} />
					{/* <input type="text" name="userHp" value={custInfo.userHp || ''} maxLength="13" className="inputStyle maxWidth-max-content" onChange={handleChange} /> */}
				</div>
			</div>
			<div className="flex align-items-center mt10">
				<div className="formTit flex-shrink0 width170px">유선전화 <span className="star">*</span></div>
				<div className="width100">
					<EditInput name="userTel" editData={custInfo} setEditData={setCustInfo} defaultValue={custInfo.userTel || ''} maxLength={13} />
					{/* <input type="text" name="userTel" value={custInfo.userTel || ''} maxLength="13" className="inputStyle maxWidth-max-content" onChange={handleChange} /> */}
				</div>
			</div>
			<div className="flex align-items-center mt10">
				<div className="formTit flex-shrink0 width170px">직급</div>
				<div className="width100">
					<EditInput name="userPosition" editData={custInfo} setEditData={setCustInfo} defaultValue={custInfo.userPosition || ''} maxLength={50} />
					{/* <input type="text" name="userPosition" value={custInfo.userPosition || ''} maxLength="50" className="inputStyle maxWidth-max-content" onChange={handleChange} /> */}
				</div>
			</div>
			<div className="flex align-items-center mt10">
				<div className="formTit flex-shrink0 width170px">부서</div>
				<div className="width100">
					<EditInput name="userBuseo" editData={custInfo} setEditData={setCustInfo} defaultValue={custInfo.userBuseo || ''} maxLength={50} />
					{/* <input type="text" name="userBuseo" value={custInfo.userBuseo || ''} maxLength="50" className="inputStyle maxWidth-max-content" onChange={handleChange} /> */}
				</div>
			</div>
		</div>
		</>
	)
}

export default SaveAdminInfo