import { ko } from 'date-fns/locale';
import React, { useCallback, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as CommonUtils from 'components/CommonUtils';
import { format } from 'date-fns';
import CoInterSelect from '../components/CoInterSelect'
import axios from 'axios';

const Company = () => {
	// 세션정보
	const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

	const [srcData, setSrcData] = useState({
		size : 10,
		page : 0,
		startDate : CommonUtils.strDateAddDay(CommonUtils.getCurretDate(), -365),
		endDate : CommonUtils.getCurretDate()
	})

	const onChangeSrcData = (e) => {
		setSrcData({
			...srcData,
			[e.target.name]: e.target.value
		});
	}

	const onChgStartDate = (day) => {
		const selectedDate = new Date(day)
		const formattedDate = format(selectedDate, 'yyyy-MM-dd');
		setSrcData({
			...srcData,
			startDate: formattedDate
		});
	}
	const onChgEndDate = (day) => {
		const selectedDate = new Date(day)
		const formattedDate = format(selectedDate, 'yyyy-MM-dd');
		setSrcData({
			...srcData,
			endDate: formattedDate
		});
	}

	const onSearch = useCallback(async() => {
		let response = await axios.post('/api/v1/statistics/biInfoList', srcData)
		console.log(response)
	})
	
	useEffect(() => {
	  onSearch()
	}, [srcData.page, srcData.size])
	

	return (
		<div className="conRight">
			<div className="conHeader">
				<ul className="conHeaderCate">
					<li>통계</li>
					<li>회사별 입찰실적</li>
				</ul>
			</div>
			<div className="contents">
				<div className="conTopBox">
					<ul className="dList">
						<li>
							<div>조회기간 입찰완료일 기준으로 각 계열사의 입찰 실적을 나타냅니다.</div>
						</li>
						<li>
							<div>통계 실적 Data는 사용권한이 시스템 관리자 일 경우 모든 계열사, 감사사용자일 경우 선택된 계열사를 대상으로 합니다.(감사사용자 계열사 선택은 시스템 관리자가 관리합니다.)</div>
						</li>
					</ul>
				</div>
				<div className="searchBox mt20">
					<div className="flex align-items-center">
						<div className="sbTit width100px">입찰완료일</div>
						<div className="flex align-items-center" style={{width : '320px'}}>
							{/* <DatePicker className="datepicker inputStyle hasDatepicker" locale={ko} shouldCloseOnSelect selected={srcData.startDate} onChange={(date) => onChgStartDate(date)} dateFormat="yyyy-MM-dd"/> */}
							<DatePicker className="datepicker inputStyle" locale={ko} shouldCloseOnSelect dateFormat="yyyy-MM-dd" selected={srcData.startDate} onChange={(date) => onChgStartDate(date)} />
							<span style={{ margin : "0px 10px" }}>~</span>
							<DatePicker className="datepicker inputStyle" locale={ko} shouldCloseOnSelect dateFormat="yyyy-MM-dd" selected={srcData.endDate}  onChange={(date) => onChgEndDate(date)} />
						</div>
						<div className="sbTit width80px ml50">계열사</div>
						<div className="flex align-items-center width280px">
							<CoInterSelect onChangeSrcData={onChangeSrcData} />
						</div>
						<button className="btnStyle btnSearch" onClick={onSearch}>검색</button>
					</div>
				</div>
				<div className="flex align-items-center justify-space-between mt40">
					<div className="width100">
						전체 : <span className="textMainColor"><strong>0</strong></span>건
					</div>
					<div className="flex-shrink0">
						<button title="엑셀 다운로드" className="btnStyle btnPrimary">엑셀 다운로드<i className="fa-light fa-arrow-down-to-line ml10"></i></button>
					</div>
				</div>
				<table className="tblSkin1 mt10">
					<colgroup>
						<col />
						<col style={{width : '10%'}} />
						<col style={{width : '15%'}} />
						<col style={{width : '15%'}} />
						<col style={{width : '15%'}} />
						<col style={{width : '10%'}} />
					</colgroup>
					<thead>
						<tr>
							<th>회사명</th>
							<th>입찰건수</th>
							<th>예산금액(1)</th>
							<th>낙찰금액(2)</th>
							<th>차이(1)-(2)</th>
							<th className="end">비고</th>
						</tr>
					</thead>
					<tbody>
					</tbody>
					<tfoot>
					</tfoot>
				</table>
			</div>
		</div>
	)
}

export default Company
