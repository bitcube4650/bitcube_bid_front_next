import React from 'react'

const SaveCustInfo = ({isEdit, data}) => {
	return (
		<>
			<h3 className="h3Tit mt50">회사 정보</h3>
			<div className="formWidth">
				<div className="boxSt mt20">
				{isEdit ?
					<div className="flex align-items-center">
						<div className="formTit flex-shrink0 width170px">승인 계열사</div>
						<div className="width100">{ data.interrelatedNm }</div>
					</div>
				: 
					<div className="flex align-items-center">
						<div className="formTit flex-shrink0 width170px">승인 계열사</div>
						<div className="width100">
							{/* {{ $store.state.loginInfo.custName }} */}
							<a href="#" data-toggle="modal" data-target="#otherCustPop" className="btnStyle btnSecondary ml50" title="타계열사 업체">타계열사 업체</a>
							{/* tooltip */}
							<i className="fas fa-question-circle toolTipSt toolTipMd ml5">
								<div className="toolTipText" style={{width:"320px"}}>
								<ul className="dList">
									<li><div>등록하실 업체가 다른 계열사에 이미 등록되어 있다면 [타계열사 업체]를 조회하여 등록하십시오.</div></li>
								</ul>
								</div>
							</i>
							{/* // tooltip */}
						</div>
					</div>
				}
				</div>
			</div>
		</>
	)
}

export default SaveCustInfo

