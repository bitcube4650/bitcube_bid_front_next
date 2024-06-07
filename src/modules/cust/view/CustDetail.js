import React, { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CustInfo from '../components/CustInfo'
import ManagementInfo from '../components/ManagementInfo'
import AdminInfo from '../components/AdminInfo'
import DeleteCustPop from '../components/DeleteCustPop'
import Swal from 'sweetalert2';

const CustDetail = ({title, isApproval}) => {
	const navigate = useNavigate();
	const params = useParams();
	// 세션정보
	const loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
	const custCode = params.custCode		// 상세 조회할 업체 코드

	// 업체 정보
	const [custInfo, setCustInfo] = useState({});
	const [deletePop, setDeletePop] = useState(false)

	// 업체 상세 정보 조회
	const onInit = useCallback(async() => {
		let api = ''
		if(loginInfo.custType === "inter") {
			api = '/api/v1/cust/management/'+custCode
		} else {
			api = '/api/v1/cust/info'
		}
		const response = await axios.post(api, {})
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
		
		let result = response.data
		if(result.code == 'ERROR'){
			Swal.fire('', result.msg, 'success');
		} else {
			Swal.fire('', '승인처리되었습니다.', 'success');
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
				<li>{loginInfo.custType === 'inter' ? title : '자사정보'}</li>
			</ul>
		</div>
		{/* //conHeader */}
		{/* contents */}
		<div className="contents">
			<div className="formWidth">
				<CustInfo isApproval={isApproval} custInfo={custInfo} />
				{loginInfo.custType === "inter" ?
					/* 계열사 사용자 계열사 관리 항목 조회 */
					(!isApproval &&
					<>
						{/* 승인 업체 상세에서는 미조회 */}
						<ManagementInfo custInfo={custInfo} />
					</>
					)
					: 
					/* 협력사 사용자인 경우 회원탈퇴 및 수정 버튼 */
					<div className="text-center mt30">
						<buttn className="btnStyle btnOutlineRed">회원탈퇴</buttn>
						<Link to={`/company/partner/management/save/${custInfo.custCode}`} className="btnStyle btnPrimary" title="수정">수정</Link>
					</div>
				}
				<AdminInfo custInfo={custInfo} />
			</div>
			{/* 계열사 사용자 수정 및 삭제 버튼 */}
			{loginInfo.custType == 'inter' &&
				<div className="text-center mt50">
					<button onClick={onMoveList} className="btnStyle btnOutlineRed" title="취소">취소</button>
					{custInfo.certYn != 'D' &&
					<>
					{/* 감사 사용자 / 각사 관리자만 업체 승인/반려/수정/삭제 처리 가능 */}
					{(loginInfo.userAuth == '2' || loginInfo.userAuth == '4') && 
						(
							!isApproval ?
							<>
								<button className="btnStyle btnRed" title="삭제" onClick={() => setDeletePop(true)}>삭제</button>
								<Link to={`/company/partner/management/save/${custCode}`} className="btnStyle btnPrimary" title="수정">수정 이동</Link>
							</>
							:
							<>
								<button className="btnStyle btnRed" title="반려" onClick={() => setDeletePop(true)}>반려</button>
								<button className="btnStyle btnPrimary" title="승인" onClick={onApproval}>승인</button>
							</>
						)
					}
					</>
					}
				</div>
			}
		</div>
		{/* 업체 반려 및 삭제 팝업 */}
		<DeleteCustPop deletePop={deletePop} setDeletePop={setDeletePop} isApproval={isApproval} custCode={custCode} onMoveList={onMoveList}/>
	</div>
  )
}

export default CustDetail