import { useRouter } from 'next/router'
import React, { useState } from 'react'
import DeleteCustPop from '../../../src/modules/cust/components/DeleteCustPop';
import UserPasswordComfirm from '../../../src/components/modal/UserPasswordComfirm';
import { MapType } from '../../../src/components/types';
import CustInfo from '../../../src/modules/cust/components/CustInfo'
import axios from 'axios';
import AdminInfo from '../../../src/modules/cust/components/AdminInfo';

const detail = ({initData} : {initData:MapType}) => {
	const router = useRouter();
	const custCode = router.query?.custCode as string
	
	const loginInfo = JSON.parse(localStorage.getItem("loginInfo") as string);		// 세션 정보
	
	const [custInfo, setCustInfo] = useState<MapType>(initData);					// 업체 정보
	const [deletePop, setDeletePop] = useState<boolean>(false)						// 업체 삭제 팝업
	const [deleteType, setDeleteType] = useState<string>("")						// 삭제 유형(반려, 삭제, 탈퇴)
	const [pwdCheckPop, setPwdCheckPop] = useState<boolean>(false)					// 비밀번호 확인 팝업
    
	// 비밀번호 확인
	const onCheckPwd = () => {
		// 비밀번호 확인 후 탈퇴 팝업 호출
		setPwdCheckPop(true)
	}

	const onCheckPwdCallback = () => {
		setPwdCheckPop(false)			// 비밀번호 확인 팝업 닫기
		setDeletePop(true);				// 탈퇴 팝업 활성화
		setDeleteType("leave")			// 삭제 유형 '탈퇴'
	}
	
	// 업체 수정
	const onEdit = () => {
		router.push({
			pathname: "/company/partner/save"
		});
	}

	// 탈퇴 후 화면이동
	const onMoveList = () => {
	};

	return (
		<div className="conRight">
			{/* conHeader */}
			<div className="conHeader">
				<ul className="conHeaderCate">
					<li>업체정보</li>
					<li>자사정보</li>
					
				</ul>
			</div>
			{/* //conHeader */}
			{/* contents */}
			<div className="contents">
				<div className="formWidth">
					{/* 업체 정보 */}
                    <CustInfo isApproval={false} custInfo={custInfo} />
                    {/* 협력사 사용자인 경우 회원탈퇴 및 수정 버튼 */}
                    <div className="text-center mt30">
                        <button className="btnStyle btnOutlineRed" onClick={onCheckPwd}>회원탈퇴</button>
                        <a onClick={onEdit} className="btnStyle btnPrimary" title="수정">수정</a>
                    </div>
					{/* 관리자 정보 */}
				    <AdminInfo custInfo={custInfo} setCustInfo={setCustInfo} />
				</div>
			</div>
			{/* 업체 반려/삭제/탈퇴시 호출 팝업 */}
			<DeleteCustPop deletePop={deletePop} setDeletePop={setDeletePop} deleteType={deleteType} custCode={custCode} onMoveList={onMoveList}/>
			{/* 비밀번호 확인 공통팝업 */}
			<UserPasswordComfirm srcUserId={loginInfo.userId} GroupUserPasswordComfirmOpen={pwdCheckPop} setGroupUserPasswordComfirmOpen={setPwdCheckPop} onUserDetailPop={onCheckPwdCallback}/>
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
export default detail