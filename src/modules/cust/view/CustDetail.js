import React, { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CustInfo from '../components/CustInfo'
import Swal from 'sweetalert2';

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
	const [custInfo, setCustInfo] = useState({});

	// 업체 상세 정보 조회
	const onInit = useCallback(async() => {
		const response = await axios.post('/api/v1/cust/management/'+custCode, {})
		const result = response.data;
		setCustInfo(result.data)

	}, [custCode])

	// 취소
	const onMoveList = () => {
		{!isApproval ? 
			navigate('/company/partner/management')
		:
			navigate('/company/partner/approval')
		}
	};
	
	// 업체 승인 처리
	const onApproval = async() => {
		// confirm
		Swal.fire({
			title: "",
			text : '승인처리하시겠습니까?',
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#004B9E",
			confirmButtonText: "승인",
			cancelButtonColor: "#b70b2e",
			cancelButtonText : '취소',
		}).then((result) => {
			if (result.isConfirmed) {
				onApprovalCallBack();
			}
		})
	}

	const onApprovalCallBack = async() => {
		const response = await axios.post('/api/v1/cust/approval', {
			custCode : custCode,
			custName : custInfo.custName
		})
		
		if(response.status != '200'){
			alert(response.data.message);
			return;
		} else {
			Swal.fire('', '승인처리되었습니다.', 'success');
			onMoveList();
		}
	}

	// 반려 사유 팝업 호출
	const onRefuse = () => {
		Swal.fire({
			title: "",
			text : '반려처리하시겠습니까?',
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#004B9E",
			confirmButtonText: "반려",
			cancelButtonColor: "#b70b2e",
			cancelButtonText : '취소',
		}).then((result) => {
			if (result.isConfirmed) {
				onRefuseCallback()
			}
		})
	}

	// 업체 반려 처리
	const onRefuseCallback = async() => {
		const response = await axios.post('/api/v1/cust/back', {
			custCode : custCode,
			custName : custInfo.custName,
			etc : '',
			userEmail : custInfo.userEmail
		})
		
		if(response.status != '200'){
			alert(response.data.message);
			return;
		} else {
			Swal.fire('', '반려되었습니다.', 'success');
			onMoveList();
		}
	}

	// 삭제 사유 팝업 호출
	const onDelete = () => {
		Swal.fire({
			title: "",
			text : '삭제처리하시겠습니까?',
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#004B9E",
			confirmButtonText: "삭제",
			cancelButtonColor: "#b70b2e",
			cancelButtonText : '취소',
		}).then((result) => {
			if (result.isConfirmed) {
				onDeleteCallback()
			}
		})
	}

	// 업체 삭제 처리
	const onDeleteCallback = async() => {
		const response = await axios.post('/api/v1/cust/del', {
			custCode : custCode,
			etc : '',
		})
		
		if(response.status != '200'){
			alert(response.data.message);
			return;
		} else {
			Swal.fire('', '삭제되었습니다.', 'success');
			onMoveList();
		}
	}

	useEffect(() => {
		onInit();
	}, [onInit])

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
				<CustInfo isApproval={isApproval} custInfo={custInfo} />
			</div>
			<div className="text-center mt50">
				<button onClick={onMoveList} className="btnStyle btnOutlineRed" title="취소">취소</button>
				{custInfo.certYn != 'D' &&
				<>
				{/* 감사 사용자 / 각사 관리자만 업체 승인/반려/수정/삭제 처리 가능 */}
				{!isApproval ?
					<>
						<button className="btnStyle btnRed" title="삭제" onClick={onDelete}>삭제</button>
						<Link to={`/company/partner/management/save/${custCode}`} className="btnStyle btnPrimary" title="수정">수정 이동</Link>
					</>
					:
					<>
						<button className="btnStyle btnRed" title="반려" onClick={onRefuse}>반려</button>
						<button className="btnStyle btnPrimary" title="승인" onClick={onApproval}>승인</button>
					</>
				}
				</>
				}
			</div>
		</div>
	</div>
  )
}

export default CustDetail