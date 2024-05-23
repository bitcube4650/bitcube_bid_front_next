import React, { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CustInfo from '../components/CustInfo'

const CustDetail = () => {
	const url = useLocation().pathname;
	const navigate = useNavigate();
	const params = useParams();

	const custCode = params.custCode		// 상세 조회할 업체 코드
	let isApproval = false;					// 승인 받기 위한 업체 상세 조회인지 확인

	let title = ''
	if(url.indexOf('approval') > -1) {
		title = '업체승인'
		isApproval = true;
	} else {
		title = '업체상세'
		isApproval = false
	}

	// 업체 정보
	const [data, setData] = useState({});

	// 업체 상세 정보 조회
	const fnInit = useCallback(async() => {
		const response = await axios.post('/api/v1/cust/management/'+custCode, {})

		setData(response.data.data)
	}, [custCode])

	// 뒤로가기
	const goBack = () => {
		navigate(-1);
	};
	
	// 업체 승인 처리
	const fnApproval = async() => {
		// confirm 처리 후 승인

		const response = await axios.post('/api/v1/cust/approval', {
			custCode : custCode,
			custName : data.custName
		})
		
		if(response.status != '200'){
			alert(response.data.message);
			return;
		} else {
			alert("승인처리하였습니다.");
			goBack();
		}
	}

	// 반려 사유 팝업 호출
	const fnRefuse = () => {

	}

	// 업체 반려 처리
	const fnRefuseCallback = async() => {
		const response = await axios.post('/api/v1/cust/back', {
			custCode : custCode,
			custName : data.custName,
			etc : '',
			userEmail : data.userEmail
		})
		
		if(response.status != '200'){
			alert(response.data.message);
			return;
		} else {
			alert("반려되었습니다.");
			goBack();
		}
	}

	// 삭제 사유 팝업 호출
	const fnDelete = () => {
		
	}

	// 업체 삭제 처리
	const fnDeleteCallback = async() => {
		const response = await axios.post('/api/v1/cust/del', {
			custCode : custCode,
			etc : '',
		})
		
		if(response.status != '200'){
			alert(response.data.message);
			return;
		} else {
			alert("삭제되었습니다.");
			goBack();
		}
	}

	useEffect(() => {
		fnInit();
	}, [fnInit])

  return (
	<div className="conRight">
		{/* conHeader */}
		<div className="conHeader">
			<ul className="conHeaderCate">
				<li>업체정보</li>
				<li>{title}</li>
			</ul>
		</div>
		{/* //conHeader */}
		{/* contents */}
		<div className="contents">
			<div className="formWidth">
				<CustInfo isApproval={isApproval} data={data} />
			</div>
			<div className="text-center mt50">
				<button onClick={goBack} className="btnStyle btnOutlineRed" title="취소">취소</button>
				{/* <!-- 감사 사용자 / 각사 관리자만 업체 승인/반려/수정/삭제 처리 가능 */}
				{!isApproval ?
				<>
					<button className="btnStyle btnRed" title="삭제" onClick={fnDelete}>삭제</button>
					<Link to={`/company/partner/management/save/${custCode}`} className="btnStyle btnPrimary" title="수정">수정 이동</Link>
				</>
				:
				<>
					<button className="btnStyle btnRed" title="반려" onClick={fnRefuse}>반려</button>
					<button className="btnStyle btnPrimary" title="승인" onClick={fnApproval}>승인</button>
				</>
				}
			</div>
		</div>
	</div>
  )
}

export default CustDetail