import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
// import CustUserPop from './CustUserPop'

const CustList = () => {
	const url = useLocation().pathname;

	let isApproval = false;								// 업체 승인 화면 여부
	let title = ''
	if(url.indexOf('approval') > -1) {
		title = '업체승인'
		isApproval = true;
	} else {
		title = '업체관리'
		isApproval = false
	}

	const [srcData, setSrcData] = useState({			// 조회조건
		srcCustNm : '',									// 업체명
		srcState : isApproval ? 'N' : 'Y',				// 업체 상태 (승인 요청인 경우 'N')
		pageSize : 10,									// 최대 조회건수
		page : 0										// 페이지 위치
	})
	const [dataArr, setDataArr] = useState(Array)		// 업체 리스트
	const [totalCnt, setTotalCnt] = useState(0)			// 업체 조회 건수

	// 조회조건 변경시 파라미터 셋팅
	const handleChange = (e) => {
		const { name, value } = e.target;
		setSrcData({
			...srcData,
			[name]: value
		})
	}

	// 업체 리스트 조회
	const fnSearch = useCallback(async() => {
		const response = await axios.post('/api/v1/cust/custList', {
			custName : srcData.srcCustNm,
			certYn : srcData.srcState,
			size : srcData.pageSize,
			page : srcData.page
		})

		setDataArr(response.data.content);
		setTotalCnt(response.data.totalElements);
	},[srcData])

	useEffect(() => {
		fnSearch();
	}, [fnSearch])
	
	// 조회 리스트 컴포넌트
	const List = ({dataArr}) => {
		return (
			<tbody>
				{dataArr?.map(data => (
					<tr key={data.custCode}>
						<td className="text-left"><Link to={isApproval ? {pathname:`/company/partner/approval/${data.custCode}`} : {pathname:`/company/partner/management/${data.custCode}`}} className="textUnderline notiTitle">{data.custName}</Link></td>
						<td>{data.custType1}</td>
						<td>{data.regnum}</td>
						<td>{data.presName}</td>

						<td style={isApproval ? {display : "none"} : {}}>{data.certYn}</td>
						<td style={isApproval ? {} : {display : "none"}}>{data.userName}</td>
						<td className={isApproval ? 'end' : ''}>{data.createDate}</td>
						<td style={isApproval ? {display : "none"} : {}}><a title="조회" className="btnStyle btnSecondary btnSm" data-toggle="modal" data-target="#custUserPop">조회</a></td>
					</tr>
				))}
			</tbody>
		)
	}

	return (
		<div className="conRight">
			<div className="conHeader">
				<ul className="conHeaderCate">
					<li>업체정보</li>
					<li>{title}</li>
				</ul>
			</div>
			<div className="contents">
				<div className="conTopBox">
					{/* 업체 관리 */}
					<ul className="dList"style={isApproval ? {display : "none"} : {}}>
						<li>
							<div>
								아래는 시스템에서 관리되는 업체 목록 입니다. 업체명을 클릭하면 상세내용을 확인 하실 수 있습니다.
							</div>
						</li>
						<li>
							<div>
								업체를 등록/수정하시면 이력이 남습니다. 주의해서 작성해 주십시오.
							</div>
						</li>
					</ul>
					{/* 업체 승인 */}
					<ul className="dList"style={isApproval ? {} : {display : "none"}}>
						<li>
							<div>
							아래는 가입 신청한 업체 목록 입니다. 업체명을 클릭하여 상세내용을 확인 후 승인 처리 하십시오 (가입 승인은 최대 3일을 넘지 않도록 합니다)
							</div>
						</li>
						<li>
							<div>
							가입 승인이 완료되면 업체 관리자에게 이메일로 통보 됩니다.
							</div>
						</li>
					</ul>
				</div>					
				<div className="searchBox mt20">
					<div className="flex align-items-center">
						<div className="sbTit mr30">업체명</div>
						<div className="width150px">
							<input type="text" className="inputStyle" name="srcCustNm" value={srcData.srcCustNm} onChange={handleChange} />
						</div>
						{/* 업체 승인 화면에서는 조회조건 '상태' 미 조회 */}
						<div className="sbTit mr30 ml50" style={isApproval ? {display : "none"} : {}}>상태</div>
						<div className="width120px" style={isApproval ? {display : "none"} : {}}>
							<select className="selectStyle" name="srcState" value={srcData.srcState} onChange={handleChange}>
								<option value="">전체</option>
								<option value="Y">정상</option>
								<option value="D">삭제</option>
							</select>
						</div>
						<div className="sbTit mr30 ml50">업체유형</div>
						<div className="flex align-items-center">
							<input type="text" placeholder="우측 검색 버튼을 클릭해 주세요" className="inputStyle width280px readonly" readOnly/>
							<input type="hidden" />
							<a href="#" data-toggle="modal" data-target="#itemPop" title="조회" className="btnStyle btnSecondary ml10">조회</a>
							<button type="button" title="삭제" className="btnStyle btnOutline" style={{display : "none"}}>삭제</button>
						</div>
						<a className="btnStyle btnSearch" onClick={fnSearch}>검색</a>
					</div>
				</div>
				<div className="flex align-items-center justify-space-between mt40">
					<div className="width100">
						전체 : <span className="textMainColor"><strong>{totalCnt}</strong></span>건
						<select className="selectStyle maxWidth140px ml20" name="pageSize" value={srcData.pageSize} onChange={handleChange}>
							<option value="10">10개씩 보기</option>
							<option value="20">20개씩 보기</option>
							<option value="30">30개씩 보기</option>
							<option value="50">50개씩 보기</option>
						</select>
					</div>

					{/* 감사 사용자 / 각사 관리자만 업체 등록 가능 */}
					<div class="flex-shrink0" style={isApproval ? {display : "none"} : {}}>
						<Link to="/company/partner/management/create" title="업체 등록"  className="btnStyle btnPrimary"> 업체등록 </Link>
					</div>
				</div>
				<table className="tblSkin1 mt10">
					<colgroup>
						<col />
						<col style={{width : "20%"}} />
						<col style={{width : "15%"}} />
						<col style={{width : "8%"}} />
						<col style={{width : "8%"}} />
						<col style={{width : "10%"}} />
						<col style={isApproval ? {display : "none"} : {width : "8%"}} />
					</colgroup>

					{/* 업체 승인 헤더 : [업체명, 업체유형, 사업자등록번호, 대표이사, 담당자, 요청일시]
					업체 관리 헤더 : [업체명, 업체유형, 사업자등록번호, 대표이사, 상태, 등록일시, 사용자 현황] */}
					<thead>
						<tr>
							<th>업체명</th>
							<th>업체유형</th>
							<th>사업자등록번호</th>
							<th>대표이사</th>
							<th style={isApproval ? {display : "none"} : {}}>상태</th>
							<th style={isApproval ? {} : {display : "none"}}>담당자명</th>
							<th className={isApproval ? 'end' : ''}>{isApproval ? '요청일시' : '등록일시'}</th>
							<th className="end" style={isApproval ? {display : "none"} : {}}>사용자현황</th>
						</tr>
					</thead>
					<List dataArr={dataArr} />
				</table>
				{/* pagination */}
				<div class="row mt40">
					<div class="col-xs-12">
						{/* <pagination @searchFunc="search" :page="listPage"/> */}
					</div>
				</div>
				{/* // pagination */}
			</div>
		</div>
	)
}

export default CustList;