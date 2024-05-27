import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import Pagination from '../../../components/Pagination';
import List from '../components/CustList';

const CustList = () => {
	const url = useLocation().pathname;
	// url 파라미터에 certYn이 있으면 해당 값을 가져온다
	const certYn = new URLSearchParams(useLocation().search).get("certYn")
	
	let isApproval = false;								// 업체 승인 화면 여부
	if(url.indexOf('approval') > -1) {
		isApproval = true;
	} else {
		isApproval = false
	}

	const [srcData, setSrcData] = useState({			// 조회조건
		custName : '',									// 업체명
		certYn : certYn == 'D' ? 'D' : (isApproval ? 'N' : 'Y'),				// 업체 상태 (승인 요청인 경우 'N')
		size : 10,										// 최대 조회건수
		page : 0										// 페이지 위치
	})
	
	const [custList, setCustList] = useState(Array)		// 업체 리스트

	// 조회조건 변경시 파라미터 셋팅
	const onChangeSrcData = (e) => {
		const { name, value } = e.target;
		setSrcData({
			...srcData,
			[name]: value
		})
	}

	// 업체 리스트 조회
	const onSearch = useCallback(async() => {
		const response = await axios.post('/api/v1/cust/custList', srcData)
		setCustList(response.data);
	})

	useEffect(() => {
		onSearch();
	}, [srcData.size, srcData.page])
	
	return (
		<div className="conRight">
			<div className="conHeader">
				<ul className="conHeaderCate">
					<li>업체정보</li>
					<li>{isApproval ? '업체 승인' : '업체 관리'}</li>
				</ul>
			</div>
			<div className="contents">
				<div className="conTopBox">
					{/* 업체 관리 */}
					{isApproval ? 
					    // 승인 업체
						<ul className="dList">
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
					:
						// 업체 관리
						<ul className="dList">
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
					}
				</div>					
				<div className="searchBox mt20">
					<div className="flex align-items-center">
						<div className="sbTit mr30">업체명</div>
						<div className="width150px">
							<input type="text" className="inputStyle" name="custName" value={srcData.custName} onChange={onChangeSrcData} onKeyDown={(e) => { if(e.key === 'Enter') onSearch()}} />
						</div>
						{/* 업체 승인 화면에서는 조회조건 '상태' 미 조회 */}
						{!isApproval &&
							<>
							<div className="sbTit mr30 ml50">상태</div>
							<div className="width120px">
								<select className="selectStyle" name="certYn" value={srcData.certYn} onChange={onChangeSrcData} >
									<option value="">전체</option>
									<option value="Y">정상</option>
									<option value="D">삭제</option>
								</select>
							</div>
							</>
						}
						<div className="sbTit mr30 ml50">업체유형</div>
						<div className="flex align-items-center">
							<input type="text" placeholder="우측 검색 버튼을 클릭해 주세요" className="inputStyle width280px readonly" readOnly/>
							<input type="hidden" />
							<a href="#" data-toggle="modal" data-target="#itemPop" title="조회" className="btnStyle btnSecondary ml10">조회</a>
							<button type="button" title="삭제" className="btnStyle btnOutline" style={{display : "none"}}>삭제</button>
						</div>
						<a className="btnStyle btnSearch" onClick={onSearch}>검색</a>
					</div>
				</div>
				<div className="flex align-items-center justify-space-between mt40">
					<div className="width100">
						전체 : <span className="textMainColor"><strong>{ custList.totalElements ? custList.totalElements.toLocaleString() : 0 }</strong></span>건
						<select className="selectStyle maxWidth140px ml20" name="size" value={srcData.size} onChange={onChangeSrcData}>
							<option value="10">10개씩 보기</option>
							<option value="20">20개씩 보기</option>
							<option value="30">30개씩 보기</option>
							<option value="50">50개씩 보기</option>
						</select>
					</div>

					{/* 감사 사용자 / 각사 관리자만 업체 등록 가능 */}
					{!isApproval &&
						<div class="flex-shrink0">
							<Link to="/company/partner/management/save" title="업체 등록"  className="btnStyle btnPrimary"> 업체등록 </Link>
						</div>
					}
				</div>
				<table className="tblSkin1 mt10">
					<colgroup>
						<col />
						<col style={{width : "20%"}} />
						<col style={{width : "15%"}} />
						<col style={{width : "8%"}} />
						<col style={{width : "8%"}} />
						<col style={{width : "10%"}} />
						{!isApproval &&
						<col style={{width : "8%"}} />	
						}
					</colgroup>

					{/* 업체 승인 헤더 : [업체명, 업체유형, 사업자등록번호, 대표이사, 담당자, 요청일시]
					업체 관리 헤더 : [업체명, 업체유형, 사업자등록번호, 대표이사, 상태, 등록일시, 사용자 현황] */}
					<thead>
						<tr>
							<th>업체명</th>
							<th>업체유형</th>
							<th>사업자등록번호</th>
							<th>대표이사</th>
							{!isApproval ?
							// 업체 관리 리스트
							<>
							<th>상태</th>
							<th>등록일시</th>
							<th className="end">사용자현황</th>
							</>
							:
							// 업체승인 리스트
							<>
							<th>담당자명</th>
							<th className="end">요청일시</th>
							</>
							}
						</tr>
					</thead>
					<List isApproval={isApproval} custList={custList} />
				</table>
				{/* pagination */}
				<div class="row mt40">
					<div class="col-xs-12">
                        <Pagination onChangeSrcData={onChangeSrcData} list={custList} />
					</div>
				</div>
				{/* // pagination */}
			</div>
		</div>
	)
}

export default CustList;