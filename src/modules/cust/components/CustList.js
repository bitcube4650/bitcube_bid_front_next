import React from 'react'
import { Link } from 'react-router-dom'
import * as CommonUtils from 'components/CommonUtils';
import filters from '../api/filters';

const CustList = ({isApproval, custList, onUserListPop}) => {
	return (
		<tbody>
			{
				custList?.totalElements == 0 ?
				<tr>
					<td colSpan={!isApproval ? "7" : "6"}>조회된 데이터가 없습니다.</td>
				</tr>
			:
				custList?.content?.map(data => (
					// 업체 승인 : [업체명, 업체유형, 사업자등록번호, 대표이사, 담당자, 요청일시]
					// 업체 관리 : [업체명, 업체유형, 사업자등록번호, 대표이사, 상태, 등록일시, 사용자 현황]
					<tr key={data.custCode}>
						<td className="text-left">
							<Link to={isApproval ? {pathname:`/company/partner/approval/${data.custCode}`} : {pathname:`/company/partner/management/${data.custCode}`}} className="textUnderline notiTitle">{data.custName}</Link>
						</td>
						<td>{data.custType1}</td>
						<td>{CommonUtils.onAddDashRegNum(data.regnum)}</td>
						<td>{data.presName}</td>
						{!isApproval ?
						// 업체 관리 리스트
						<>
						<td style={data.certYn == 'D' ? {color : 'red'} : {}}>{filters.onSetCustStatusStr(data.certYn)}</td>
						<td>{data.createDate}</td>
						<td className="end">
							<button title="조회" className="btnStyle btnSecondary btnSm" onClick={() => onUserListPop(data.custCode)}>조회</button>
						</td>
						</>
						:
						// 업체승인 리스트
						<>
						<td>{data.userName}</td>
						<td className="end">{data.createDate}</td>
						</>
						}
					</tr>
				))
			}
		</tbody>
	)
}
export default CustList