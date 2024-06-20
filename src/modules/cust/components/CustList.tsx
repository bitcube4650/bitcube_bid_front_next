import React from 'react'
import { Link } from 'react-router-dom'
import * as CommonUtils from 'components/CommonUtils';
import { MapType } from 'components/types';
import { CustListProps } from '../types/types';

const CustList = ({isApproval, custList, onUserListPop} : CustListProps) => {

	// 상태 str
	const onSetCustStatusStr = (val:string) =>{
		if(val == 'Y'){
			return '정상'
		}else if(val == 'D'){
			return '삭제'
		}else{
			return '미승인';
		}
	}

	return (
		<tbody>
			{
				custList?.totalElements == 0 ?
				<tr>
					<td colSpan={!isApproval ? 7 : 6}>조회된 데이터가 없습니다.</td>
				</tr>
			:
				custList?.content?.map((data:MapType) => (
					// 업체 승인 : [업체명, 업체유형, 사업자등록번호, 대표이사, 담당자, 요청일시]
					// 업체 관리 : [업체명, 업체유형, 사업자등록번호, 대표이사, 상태, 등록일시, 사용자 현황]
					<tr key={data.custCode}>
						{/* 업체명 */}
						<td className="text-left">
							<Link to={isApproval ? {pathname:`/company/partner/approval/${data.custCode}`} : {pathname:`/company/partner/management/${data.custCode}`}} className="textUnderline notiTitle">{data.custName}</Link>
						</td>
						{/* 업체유형 */}
						<td>{data.custType1}</td>
						{/* 사업자등록번호 */}
						<td>{CommonUtils.onAddDashRegNum(data.regnum)}</td>
						{/* 대표이사 */}
						<td>{data.presName}</td>
						{!isApproval ?
							<>
								{/* 상태 */}
								<td style={data.certYn == 'D' ? {color : 'red'} : {}}>{onSetCustStatusStr(data.certYn)}</td>
								{/* 등록일시 */}
								<td>{data.createDate}</td>
								{/* 사용자 현황 버튼 */}
								<td className="end">
									<button title="조회" className="btnStyle btnSecondary btnSm" onClick={() => onUserListPop(data.custCode)}>조회</button>
								</td>
							</>
						:
							<>
								{/* 담당자 */}
								<td>{data.userName}</td>
								{/* 요청일시 */}
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