import React from 'react'
import { CustInfoProps } from '../types/types';
import EditInputRadio from '../../../components/input/EditInputRadio';

const ManagementInfo = ({custInfo, setCustInfo}:CustInfoProps) => {
  return (
		<>
			<h3 className="h3Tit mt50">계열사 관리 항목</h3>
			<div className="boxSt mt20">
				<div className="flex align-items-center">
					<div className="formTit flex-shrink0 width170px">업체등급</div>
					<div className="width100">
						<EditInputRadio editData={ custInfo } setEditData={ setCustInfo } id="chkA" name="custLevel" value="A" label="A등급" checked={ custInfo.custLevel === "A" } disabled={true} />
						<EditInputRadio editData={ custInfo } setEditData={ setCustInfo } id="chkB" name="custLevel" value="B" label="B등급" checked={ custInfo.custLevel === "B" } disabled={true} />
						<EditInputRadio editData={ custInfo } setEditData={ setCustInfo } id="chkC" name="custLevel" value="C" label="C등급" checked={ custInfo.custLevel === "C" } disabled={true} />
						<EditInputRadio editData={ custInfo } setEditData={ setCustInfo } id="chkD" name="custLevel" value="D" label="D등급" checked={ custInfo.custLevel === "D" } disabled={true} />
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