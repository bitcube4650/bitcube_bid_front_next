import { useRouter } from 'next/router'
import React, { useState } from 'react'
import DeleteCustPop from '../../../../src/modules/cust/components/DeleteCustPop';
import { MapType } from '../../../../src/components/types';
import axios from 'axios';
import CustInfo from '../../../../src/modules/cust/components/CustInfo';
import ManagementInfo from '../../../../src/modules/cust/components/ManagementInfo';
import AdminInfo from '../../../../src/modules/cust/components/AdminInfo';

const detail = ({initData} : {initData:MapType}) => {
	const router = useRouter();
	const custCode = router.query?.custCode as string
	
	const loginInfo = JSON.parse(localStorage.getItem("loginInfo") as string);		// 세션 정보
	
	const [custInfo, setCustInfo] = useState<MapType>(initData);					// 업체 정보
	const [deletePop, setDeletePop] = useState<boolean>(false)						// 업체 삭제 팝업
	const [deleteType, setDeleteType] = useState<string>("")						// 삭제 유형(반려, 삭제, 탈퇴)

	// 업체 수정
	const onEdit = (custCode:string) => {
		router.push({
			pathname: "/company/partner/management/save/[custCode]",
			query: { custCode: custCode }
		});
	}

	// 취소
	const onMoveList = () => {
		router.push('/company/partner/management')
	};

	return (
		<div className="conRight">
			{/* conHeader */}
			<div className="conHeader">
				<ul className="conHeaderCate">
					<li>업체정보</li>
					<li>{loginInfo.custType === 'inter' ? '업체상세' : '자사정보'}</li>
					
				</ul>
			</div>
			{/* //conHeader */}
			{/* contents */}
			<div className="contents">
				<div className="formWidth">
					{/* 업체 정보 */}
					<CustInfo isApproval={false} custInfo={custInfo} />
					<ManagementInfo custInfo={custInfo} setCustInfo={setCustInfo} />
					{/* 관리자 정보 */}
					<AdminInfo custInfo={custInfo} setCustInfo={setCustInfo} />
				</div>
				{/* 계열사 사용자 조회 버튼 */}
				{loginInfo.custType == 'inter' &&
					<div className="text-center mt50">
						<button onClick={onMoveList} className="btnStyle btnOutlineRed" title="취소">목록</button>
						{custInfo.certYn != 'D' &&
							<>
								<button className="btnStyle btnRed" title="삭제" onClick={() => {setDeletePop(true); setDeleteType("delete");}}>삭제</button>
								<a onClick={() => { onEdit(custInfo.custCode)}} className="btnStyle btnPrimary" title="수정">수정</a>
							</>
						}
					</div>
				}
			</div>
			{/* 업체 반려/삭제/탈퇴시 호출 팝업 */}
			<DeleteCustPop deletePop={deletePop} setDeletePop={setDeletePop} deleteType={deleteType} custCode={custCode} onMoveList={onMoveList}/>
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
export default detail