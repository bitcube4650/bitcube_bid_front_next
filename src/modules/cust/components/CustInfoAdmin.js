import React from 'react'

const CustInfoAdmin = ({data}) => {
	return (
		<>
			<h3 className="h3Tit mt50">관리자 정보</h3>
			<div className="boxSt mt20">
				<div className="flex align-items-center">
					<div className="formTit flex-shrink0 width170px">이름</div>
					<div className="width100">{ data.userName }</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">이메일</div>
					<div className="width100">{ data.userEmail }</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">아이디</div>
					<div className="width100">{ data.userId }</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">휴대폰</div>
					<div className="width100">{ data.userHp }</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">유선전화</div>
					<div className="width100">{ data.userTel }</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">직급</div>
					<div className="width100">{ data.userPosition }</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">부서</div>
					<div className="width100">{ data.userBuseo }</div>
				</div>
			</div>
		</>
	)
}
export default CustInfoAdmin
