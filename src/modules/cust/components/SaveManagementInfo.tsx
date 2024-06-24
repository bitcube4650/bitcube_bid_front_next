import React from 'react'
import { SaveCustAdminProps } from '../types/types'
import EditInput from 'components/input/EditInput'
import EditInputRadio from 'components/input/EditInputRadio'
import EditTextArea from 'components/input/EditTextArea'

const SaveManagementInfo = ({custInfo, setCustInfo}:SaveCustAdminProps) => {
	return (
		<>
		<h3 className="h3Tit mt50">계열사 관리항목</h3>
		<div className="boxSt mt20">
			<div className="flex align-items-center">
				<div className="formTit flex-shrink0 width170px">업체등급</div>
				<div className="width100">
					<EditInputRadio editData={ custInfo } setEditData={ setCustInfo } id="chkA" name="custLevel" value="A" label="A등급" checked={ custInfo.custLevel === "A" } />
					<EditInputRadio editData={ custInfo } setEditData={ setCustInfo } id="chkB" name="custLevel" value="B" label="B등급" checked={ custInfo.custLevel === "B" } />
					<EditInputRadio editData={ custInfo } setEditData={ setCustInfo } id="chkC" name="custLevel" value="C" label="C등급" checked={ custInfo.custLevel === "C" } />
					<EditInputRadio editData={ custInfo } setEditData={ setCustInfo } id="chkD" name="custLevel" value="D" label="D등급" checked={ custInfo.custLevel === "D" } />
				</div>
			</div>
			<div className="flex align-items-center mt20">
				<div className="formTit flex-shrink0 width170px">D업체평가</div>
				<div className="width100">
					<EditTextArea editData={ custInfo } setEditData={ setCustInfo } name="careContent" value={ custInfo.careContent } maxLength={2000} />
				</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">관리단위</div>
				<div className="width100">
					<EditInput name="custValuation" editData={custInfo} setEditData={setCustInfo} value={custInfo.custValuation || ''} maxLength={100} />
				</div>
			</div>
		</div>
		</>
	)
}

	export default SaveManagementInfo