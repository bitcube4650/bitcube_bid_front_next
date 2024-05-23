import React, { useState } from 'react'

const ManageAffiliate = ({data}) => {
	const [custLevel, setCustLevel]= useState("");
	return (
		<>
			<h3 className="h3Tit mt50">계열사 관리 항목</h3>
			<div className="boxSt mt20">
				<div className="flex align-items-center">
					<div className="formTit flex-shrink0 width170px">업체등급</div>
					<div class="width100">
						<input type="radio" name="custLevel" value="A" id="chkA" class="radioStyle" checked={data.custLevel === 'A'} disabled /><label for="chkA">A등급</label>
						<input type="radio" name="custLevel" value="B" id="chkB" class="radioStyle" checked={data.custLevel === 'B'} disabled /><label for="chkB">B등급</label>
						<input type="radio" name="custLevel" value="C" id="chkC" class="radioStyle" checked={data.custLevel === 'C'} disabled /><label for="chkC">C등급</label>
						<input type="radio" name="custLevel" value="D" id="chkD" class="radioStyle" checked={data.custLevel === 'D'} disabled /><label for="chkD">D등급</label>
					</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">D업체평가</div>
					<div className="width100">{ data.careContent }</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">관리단위</div>
					<div className="width100">{ data.custValuation }</div>
				</div>
			</div>
		</>
	)
}
export default ManageAffiliate
