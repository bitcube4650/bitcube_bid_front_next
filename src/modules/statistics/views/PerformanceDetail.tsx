import React, { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import CoInterSelect from '../components/CoInterSelect';
import * as CommonUtils from 'components/CommonUtils';
import axios from 'axios';
import Swal from 'sweetalert2';
import Pagination from 'components/Pagination';
import ItemPop from '../../signup/components/ItemPop';
import { MapType } from 'components/types'
import SelectListSize from 'components/SelectListSize'
import EditInput from 'components/input/EditInput';
import SrcDatePicker from 'components/input/SrcDatePicker';

const PerformanceDetail = () => {
	// 세션정보
	const loginInfo = JSON.parse(localStorage.getItem("loginInfo") as string);
	const location = useLocation();

	const [srcData, setSrcData] = useState<MapType>({
		size : 10,
		page : 0,
		startDay : (location.state?.srcData.startDay || CommonUtils.strDateAddDay(CommonUtils.getCurretDate(''), -30)),
		endDay : (location.state?.srcData.endDay || CommonUtils.getCurretDate('')),
		srcCoInter : (location.state?.interrelatedCustCode || ''),
		itemCode : '',
		itemCodeNm : '',
	})

	const [list, setList] = useState<MapType>({})
	const [itemPop, setItemPop] = useState<boolean>(false);		// 품목 팝업

	// 엑셀 다운로드
	const onExceldown = () => {
			// 감사사용자 : 본인이 속한 계열사 리스트 조회 / 시스템사용자 전체 계열사 조회
			axios.post("/api/v1/statistics/coInterList",
				{
					userAuth	: loginInfo.userAuth
				},
				).then((response) => {
					let result = response.data
					if (result.code === "OK") {
						// 조회하려는 계열사 파라미터 setting
						let coInters = new Array()
	
						// 조회조건 '계열사'의 값이 전체인 경우
						if(CommonUtils.isEmpty(srcData.srcCoInter)){
							for(let i = 0; i < result.data.length; i++){
								coInters.push(result.data[i].interrelatedCustCode)
							}
						} else {
							// 조회조건 '계열사'가 선택된 경우 해당 업체 코드만 setting
							coInters.push(srcData.srcCoInter)
						}
						
						// 엑셀 다운로드
						let time = CommonUtils.formatDate(new Date(), "yyyy_mm_dd");
						axios.post("/api/v1/statistics/excel",
							{
								startDay	: srcData.startDay,
								endDay		: srcData.endDay,
								fileName	: "입찰실적_상세내역_" + time,
								coInters	: coInters,
								itemCode	: srcData.itemCode,
								columnNames	: [
												'입찰번호',			'입찰명',			'입찰 품명',	'예산금액',		'낙찰금액',
												'계약금액',			'참여업체수',		'낙찰사',		'제출시작일',	'제출마감일',
												'투찰최고가(1)',	'투찰최저가(2)',	'편차(1)-(2)',	'재입찰횟수'
											],
								mappingColumnNames	: [
												'biNo',				'biName',		'itemName',		'bdAmt',			'succAmt',
												'realAmt',			'custCnt',		'custName',		'estStartDate',		'estCloseDate',
												'esmtAmtMax',		'esmtAmtMin',	'esmtAmtDev',	'reBidCnt'
											],
								excelUrl	: 'biInfoDetailList',
								excel		: 'Y'
							},
							{responseType: "blob"}
						).then((response2) => {
							if (response2.status === 200) {
								// 응답이 성공적으로 도착한 경우
								const url = window.URL.createObjectURL(new Blob([response2.data])); // 응답 데이터를 Blob 형식으로 변환하여 URL을 생성합니다.
								const link = document.createElement("a");
								link.href = url;
								link.setAttribute("download","입찰실적_상세내역_" + time + ".xlsx"); // 다운로드할 파일명을 설정합니다.
								document.body.appendChild(link);
								link.click();
								window.URL.revokeObjectURL(url); // 임시 URL을 해제합니다.
							} else {
								// 오류 처리
								Swal.fire('', '엑셀 다운로드 중 오류가 발생했습니다.', 'error');
							}
						})
					} else {
						// 오류 처리
						Swal.fire('', '엑셀 다운로드 중 오류가 발생했습니다.', 'error');
					}
				}
			)
	}

	// 업체유형 팝업 callback
	const itemSelectCallback = (data:MapType) => {
		setSrcData({
			...srcData,
			itemCode : data.itemCode,
			itemCodeNm : data.itemName
		})
	}

	// 조회
	const onSearch = async() => {
		let response = await axios.post('/api/v1/statistics/biInfoDetailList', srcData)
		let result = response.data;
		if(result.code === 'OK') {
			setList(result.data)
		}
	}

	useEffect(() => {
		onSearch()
	}, [srcData.page, srcData.size])

	return (
		<div className="conRight">
			<div className="conHeader">
				<ul className="conHeaderCate">
					<li>통계</li>
					<li>입찰실적 상세내역</li>
				</ul>
			</div>
			<div className="contents">
				<div className="conTopBox">
					<ul className="dList">
						<li>
							<div>조회기간 입찰완료일 기준으로 각 계열사의 상세 입찰 실적을 나타냅니다.</div>
						</li>
					</ul>
				</div>
				<div className="searchBox mt20">
					<div className="flex align-items-center">
						<div className="sbTit" style={{width : "100px"}}>입찰완료일</div>
						<div className="flex align-items-center" style={{width : '320px'}}>
							<SrcDatePicker name="startDay" selected={srcData.startDay} srcData={srcData} setSrcData={setSrcData} />
							<span style={{ margin : "0px 10px" }}>~</span>
							<SrcDatePicker name="endDay" selected={srcData.endDay} srcData={srcData} setSrcData={setSrcData} />
						</div>
					</div>
					<div className="flex align-items-center height50px mt10">
						<div className="sbTit" style={{width : "100px"}}>품목</div>
						<div className="flex align-items-center">
							
							<EditInput name="itemCodeNm" className="width280px readonly" editData={srcData} setEditData={setSrcData} value={srcData.itemCodeNm || ''} readOnly={true} placeholder="우측 검색 버튼을 클릭해 주세요" />
							<EditInput type="hidden" name="itemCode" editData={srcData} setEditData={setSrcData} value={srcData.itemCode || ''} />
							<button type="button"  title="조회" className="btnStyle btnSecondary ml10" onClick={() => {setItemPop(true)}}>조회</button>
							<button type="button" title="삭제" className="btnStyle btnOutline" style={{display : `${!CommonUtils.isEmpty(srcData.itemCode) ? "inline-flex" : "none"}`}} onClick={() => {setSrcData({...srcData, itemCode : '', itemCodeNm : ''})}}>삭제</button>
						</div>
						
						<div className="sbTit ml50" style={{width : "100px"}}>계열사</div>
						<div className="flex align-items-center">
							<CoInterSelect srcData={srcData} setSrcData={setSrcData} onSearch={onSearch} />
						</div>
						<button className="btnStyle btnSearch" onClick={onSearch}>검색</button>
					</div>
				</div>
				<div className="flex align-items-center justify-space-between mt40">
					<div className="width100">
						전체 : <span className="textMainColor"><strong>{list.totalElements ? list.totalElements.toLocaleString() : 0}</strong></span>건
						<SelectListSize onSearch={ onSearch } srcData={ srcData } setSrcData={ setSrcData } />
					</div>
					<div className="flex-shrink0">
						<button title="엑셀 다운로드" className="btnStyle btnPrimary" onClick={onExceldown}>엑셀 다운로드<i className="fa-light fa-arrow-down-to-line ml10"></i></button>
					</div>
				</div>
				<div className='tblScroll'>
					<table className="tblSkin1 mt10">
						<colgroup>
							<col />
						</colgroup>
						<thead>
							<tr>
								<th>입찰번호</th>
								<th>입찰명</th>
								<th>입찰 품명</th>
								<th>예산금액</th>
								<th>낙찰금액</th>
								<th>계약금액</th>
								<th>참여업체수</th>
								<th>낙찰사</th>
								<th>제출시작일</th>
								<th>제출마감일</th>
								<th>투찰최고가(1)</th>
								<th>투찰최저가(2)</th>
								<th>편차(1)-(2)</th>
								<th className="end">재입찰횟수</th>
							</tr>
						</thead>
						{(list?.totalElements || 0) > 0
						?
						<>
							<tbody>
								{list.content.map((obj:MapType,idx:number) => (
									<tr key={idx}>
										<td className="text-left">{obj.biNo}</td>									
										<td className="text-left">{obj.biName}</td>
										<td className="text-left">{obj.itemName}</td>
										<td className="text-right">{obj.bdAmt.toLocaleString()}</td>
										<td className="text-right">{obj.succAmt.toLocaleString()}</td>
										<td className="text-right">{obj.realAmt.toLocaleString()}</td>
										<td className="text-right">{obj.custCnt.toLocaleString()}</td>
										<td>{obj.custName}</td>
										<td>{obj.estStartDate}</td>
										<td>{obj.estCloseDate}</td>
										<td className="text-right">{obj.esmtAmtMax.toLocaleString()}</td>
										<td className="text-right">{obj.esmtAmtMin.toLocaleString()}</td>
										<td className="text-right">{obj.esmtAmtDev.toLocaleString()}</td>
										<td className="text-right end">{obj.reBidCnt.toLocaleString()}</td>
									</tr>
								))}
							</tbody>
						</>
						:
						<tbody>
							<tr>
								<td colSpan={14}>조회된 데이터가 없습니다.</td>
							</tr>
						</tbody>
						}
					</table>
				</div>
				{/* pagination */}
				<div className="row mt40">
					<div className="col-xs-12">
						<Pagination srcData={srcData} setSrcData={setSrcData} list={list} />
					</div>
				</div>
				{/* // pagination */}
			</div>
			
			{/* 품목 팝업 */}
			<ItemPop itemPop={itemPop} setItemPop={setItemPop} popClick={itemSelectCallback} />
		</div>
	)
}

export default PerformanceDetail
