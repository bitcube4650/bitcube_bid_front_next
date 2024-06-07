import React from 'react'
import * as CommonUtils from 'components/CommonUtils';

const AdminInfo = ({custInfo}) => {
	return (
		<>
		<h3 className="h3Tit mt50">관리자 정보</h3>
		<div className="boxSt mt20">
			<div className="flex align-items-center">
				<div className="formTit flex-shrink0 width170px">이름</div>
				<div className="width100">{ custInfo.userName }</div>
			</div>
			<div className="flex align-items-center mt20">
				<div className="formTit flex-shrink0 width170px">이메일</div>
				<div className="width100">{ custInfo.userEmail }</div>
			</div>
			<div className="flex align-items-center mt20">
				<div className="formTit flex-shrink0 width170px">아이디</div>
				<div className="width100">{ custInfo.userId }</div>
			</div>
			<div className="flex align-items-center mt20">
				<div className="formTit flex-shrink0 width170px">휴대폰</div>
				<div className="width100">{ CommonUtils.onAddDashTel(custInfo.userHp) }</div>
			</div>
			<div className="flex align-items-center mt20">
				<div className="formTit flex-shrink0 width170px">유선전화</div>
				<div className="width100">{ CommonUtils.onAddDashTel(custInfo.userTel) }</div>
			</div>
			<div className="flex align-items-center mt20">
				<div className="formTit flex-shrink0 width170px">직급</div>
				<div className="width100">{ custInfo.userPosition }</div>
			</div>
			<div className="flex align-items-center mt20">
				<div className="formTit flex-shrink0 width170px">부서</div>
				<div className="width100">{ custInfo.userBuseo }</div>
			</div>
		</div>
		</>
	)
}

export default AdminInfo