import React from 'react'

const SaveManagementInfo = ({custInfo, onChangeData}) => {
	// custInfo의 input 데이터 setting
	const handleChange = (e) => {
		onChangeData(e.target.name, e.target.value)
	}

	return (
		<>
		<h3 className="h3Tit mt50">계열사 관리항목</h3>
		<div className="boxSt mt20">
			<div className="flex align-items-center">
				<div className="formTit flex-shrink0 width170px">업체등급</div>
				<div className="width100">
					<input type="radio" name="custLevel" value="A" id="chkA" className="radioStyle"  checked={custInfo.custLevel === 'A'} onChange={handleChange}/><label htmlFor="chkA">A등급</label>
					<input type="radio" name="custLevel" value="B" id="chkB" className="radioStyle"  checked={custInfo.custLevel === 'B'} onChange={handleChange}/><label htmlFor="chkB">B등급</label>
					<input type="radio" name="custLevel" value="C" id="chkC" className="radioStyle"  checked={custInfo.custLevel === 'C'} onChange={handleChange}/><label htmlFor="chkC">C등급</label>
					<input type="radio" name="custLevel" value="D" id="chkD" className="radioStyle"  checked={custInfo.custLevel === 'D'} onChange={handleChange}/><label htmlFor="chkD">D등급</label>
				</div>
			</div>
			<div className="flex align-items-center mt20">
				<div className="formTit flex-shrink0 width170px">D업체평가</div>
				<div className="width100">
					<textarea className="textareaStyle boxOverflowY" name="careContent" value={custInfo.careContent || ''} maxLength="2000" onChange={handleChange}></textarea>
				</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">관리단위</div>
				<div className="width100">
					<input type="text" className="inputStyle" name="custValuation" value={custInfo.custValuation || ''} maxLength="100"  onChange={handleChange}/>
				</div>
			</div>
		</div>
		</>
	)
}

	export default SaveManagementInfo