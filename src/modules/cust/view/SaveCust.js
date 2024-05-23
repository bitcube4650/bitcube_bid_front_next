import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import SaveCustInfo from '../components/SaveCustInfo';
import axios from 'axios';

const SaveCust = () => {
	const params = useParams();
	
	const custCode = params.custCode		// 수정 대상 업체 코드
	const [data, setData] = useState({});


	let isEdit = false;
	if(custCode != null && custCode != '' && custCode != undefined) isEdit = true;

	// 업체 상세 정보 조회
	const fnInit = useCallback(async() => {
			const response = await axios.post('/api/v1/cust/management/'+custCode, {})
			setData(response.data.data)
	}, [custCode])

	useEffect(() => {
		if(isEdit) {
			fnInit();
		}
	}, [fnInit])
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
				<SaveCustInfo isEdit={isEdit} data={data}/>
			</div>
			{/* // contents */}
		</div>
	)
}

export default SaveCust
