import React from 'react'
import { CustInfoProps } from '../types/types';

const ManagementInfo = ({custInfo}:CustInfoProps) => {
  return (
		<>
			<h3 className="h3Tit mt50">계열사 관리 항목</h3>
			<div className="boxSt mt20">
				<div className="flex align-items-center">
					<div className="formTit flex-shrink0 width170px">업체등급</div>
					<div className="width100">
						<input type="radio" name="custLevel" value="A" id="chkA" className="radioStyle" checked={custInfo.custLevel === 'A'} disabled /><label htmlFor="chkA">A등급</label>
						<input type="radio" name="custLevel" value="B" id="chkB" className="radioStyle" checked={custInfo.custLevel === 'B'} disabled /><label htmlFor="chkB">B등급</label>
						<input type="radio" name="custLevel" value="C" id="chkC" className="radioStyle" checked={custInfo.custLevel === 'C'} disabled /><label htmlFor="chkC">C등급</label>
						<input type="radio" name="custLevel" value="D" id="chkD" className="radioStyle" checked={custInfo.custLevel === 'D'} disabled /><label htmlFor="chkD">D등급</label>
					</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">D업체평가</div>
					<div className="width100">{ custInfo.careContent }</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">관리단위</div>
					<div className="width100">{ custInfo.custValuation }</div>
				</div>
			</div>
		</>
	)
}

export default ManagementInfo