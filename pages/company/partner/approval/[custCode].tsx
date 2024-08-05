import { useRouter } from 'next/router'
import React, { useState } from 'react'
import DeleteCustPop from '../../../../src/modules/cust/components/DeleteCustPop';
import { MapType } from '../../../../src/components/types';
import axios from 'axios';
import Swal from 'sweetalert2';
import AdminInfo from '../../../../src/modules/cust/components/AdminInfo';
import CustInfo from '../../../../src/modules/cust/components/CustInfo';

const detail = ({initData} : {initData:MapType}) => {
	const router = useRouter();
	const custCode = router.query?.custCode as string
	
	const loginInfo = JSON.parse(localStorage.getItem("loginInfo") as string);		// 세션 정보
	
	const [custInfo, setCustInfo] = useState<MapType>(initData);					// 업체 정보
	const [deletePop, setDeletePop] = useState<boolean>(false)						// 업체 삭제 팝업
	const [deleteType, setDeleteType] = useState<string>("")						// 삭제 유형(반려, 삭제, 탈퇴)
	
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

	// 승인 callback
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
	
	// 목록
	const onMoveList = () => {
		router.push('/company/partner/management')
	};

	return (
		<div className="conRight">
			{/* conHeader */}
			<div className="conHeader">
				<ul className="conHeaderCate">
					<li>업체정보</li>
					<li>업체승인</li>
					
				</ul>
			</div>
			{/* //conHeader */}
			{/* contents */}
			<div className="contents">
				<div className="formWidth">
					{/* 업체 정보 */}
				<CustInfo isApproval={false} custInfo={custInfo} />
					{/* 관리자 정보 */}
				<AdminInfo custInfo={custInfo} setCustInfo={setCustInfo} />
				</div>
				{/* 계열사 사용자 조회 버튼 */}
				{loginInfo.custType == 'inter' &&
					<div className="text-center mt50">
						<button onClick={onMoveList} className="btnStyle btnOutlineRed" title="목록">목록</button>
						{custInfo.certYn != 'D' &&
							<>
								<button className="btnStyle btnRed" title="반려" onClick={() => {setDeletePop(true); setDeleteType("refuse");}}>반려</button>
								<button className="btnStyle btnPrimary" title="승인" onClick={onApproval}>승인</button>
							</>
						}
					</div>
				}
			</div>
			{/* 업체 반려/삭제/탈퇴시 호출 팝업 */}
			<DeleteCustPop deletePop={deletePop} setDeletePop={setDeletePop} deleteType={deleteType} custCode={custCode} onMoveList={onMoveList}/>		</div>
	)
}

export const getServerSideProps = async(context) => {	
	const cookies = context.req.headers.cookie || '';
	try {
		axios.defaults.headers.cookie = cookies;
		const response = await axios.post('http://localhost:3000/api/v1/cust/management/'+context.params.custCode, {});
		console.log(response)
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
export default detail