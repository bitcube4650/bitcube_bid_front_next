import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import List from '../components/CustList';
import Swal from 'sweetalert2';
import Pagination from 'components/Pagination';
import ItemPop from '../../signup/components/ItemPop';
import * as CommonUtils from 'components/CommonUtils';
import BidCustUserList from '../../bid/components/BidCustUserList';
import { MapType } from 'components/types'
import SrcInput from 'components/input/SrcInput'
import SrcSelectBox from 'components/input/SrcSelectBox'
import SelectListSize from 'components/SelectListSize'
import EditInput from 'components/input/EditInput';

const CustList = () => {
	const url = useLocation().pathname;
	// url 파라미터에 certYn이 있으면 해당 값을 가져온다
	const certYn = new URLSearchParams(useLocation().search).get("certYn") as string
	
	// 세션정보
	const loginInfo = JSON.parse(localStorage.getItem("loginInfo") as string);
	const [itemPop, setItemPop] = useState<boolean>(false);		// 품목 팝업
	const [isBidCustUserListModal, setIsBidCustUserListModal] = useState<boolean>(false);
	const [custCode, setCustCode] = useState<string>('');
	const [srcCertYn, setSrcCertYn] = useState([{"value" : "Y", "name" : "정상"}, {"value" : "D", "name" : "삭제"}])

	let isApproval = false;								// 업체 승인 화면 여부
	if(url.indexOf('approval') > -1) {
		isApproval = true;
	} else {
		isApproval = false
	}

	const [srcData, setSrcData] = useState<MapType>({					// 조회조건
		custName	: '',
		certYn		: certYn == 'D' ? 'D' : (isApproval ? 'N' : 'Y'),	// 업체 상태 (승인 요청인 경우 'N')
		custTypeNm	: '',
		custType	: '',
		size		: 10,
		page		: 0
	})
	
	const [custList, setCustList] = useState<MapType>({		// 업체 리스트
		totalElements	: 0,
		content			: []
	});
	
	// 업체유형 팝업 callback
	const itemSelectCallback = (data:MapType) => {
		setSrcData({
			...srcData,
			custType	: data.itemCode,
			custTypeNm	: data.itemName
		})
	}

	// 업체 리스트 조회
	const onSearch = async() => {
		const response = await axios.post('/api/v1/cust/custList', srcData)
		let result = response.data
		if(result.code == 'OK'){
			setCustList(result.data);
		} else {
			Swal.fire('', result.msg, 'warning');
		}
	}
	
	const onUserListPop = (custCode:string) => {
		setCustCode(custCode)
		setIsBidCustUserListModal(true)
	}

	useEffect(() => {
		onSearch();
	}, [srcData.size, srcData.page])

	const onPageInit = () => {
		if(srcData.page === 0){
			onSearch()
		} else {
			setSrcData({
				...srcData,
				page : 0
			})
		}
    }

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
					<ul className="dList">
					{isApproval ? 
						// 승인 업체
						<>
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
						</>
					:
						// 업체 관리
						<>
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
						</>
					}
					</ul>
				</div>
				<div className="searchBox mt20">
					<div className="flex align-items-center">
						<div className="sbTit mr30">업체명</div>
						<div className="width150px">
							<SrcInput name="custName" onSearch={ onPageInit } srcData={ srcData } setSrcData={ setSrcData } maxLength={ 300 } />
						</div>
						{/* 업체 승인 화면에서는 조회조건 '상태' 미 조회 */}
						{!isApproval &&
							<>
							<div className="sbTit mr30 ml50">상태</div>
							<div className="width120px">
								<SrcSelectBox name='certYn' optionList={srcCertYn} valueKey='value' nameKey='name' onSearch={ onPageInit } srcData={ srcData } setSrcData={ setSrcData }/>
							</div>
							</>
						}
						<div className="sbTit mr30 ml50">업체유형</div>
						<div className="flex align-items-center">
							<EditInput name="custTypeNm1" className="width280px readonly" editData={srcData} setEditData={setSrcData} value={srcData.custTypeNm || ''} readOnly={true} placeholder="우측 검색 버튼을 클릭해 주세요" />
							<EditInput type="hidden" name="custType" editData={srcData} setEditData={setSrcData} value={srcData.custType || ''} />
							<button type="button"  title="조회" className="btnStyle btnSecondary ml10" onClick={() => {setItemPop(true)}}>조회</button>
							<button type="button" title="삭제" className="btnStyle btnOutline" style={{display : `${!CommonUtils.isEmpty(srcData.custType) ? "inline-flex" : "none"}`}} onClick={() => {setSrcData({...srcData, custType : '', custTypeNm : ''})}}>삭제</button>
						</div>
						<button className="btnStyle btnSearch" onClick={onPageInit}>검색</button>
					</div>
				</div>
				<div className="flex align-items-center justify-space-between mt40">
					<div className="width100">
						전체 : <span className="textMainColor"><strong>{ custList.totalElements ? custList.totalElements.toLocaleString() : 0 }</strong></span>건
						<SelectListSize onSearch={ onPageInit } srcData={ srcData } setSrcData={ setSrcData } />
					</div>

					{/* 감사 사용자 / 각사 관리자만 업체 등록 가능 */}
					{(!isApproval && (loginInfo.userAuth == '2' || loginInfo.userAuth == '4')) &&
						<div className="flex-shrink0">
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
						<col style={{width : "12%"}} />
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
								<>
									<th>상태</th>
									<th>등록일시</th>
									<th className="end">사용자현황</th>
								</>
							:
								<>
									<th>담당자명</th>
									<th className="end">요청일시</th>
								</>
							}
						</tr>
					</thead>
					<List isApproval={isApproval} custList={custList} onUserListPop={onUserListPop} />
				</table>
				{/* pagination */}
				<div className="row mt40">
					<div className="col-xs-12">
						<Pagination srcData={ srcData } setSrcData={ setSrcData } list={ custList } />
					</div>
				</div>
				{/* // pagination */}
			</div>
			
			{/* 품목 팝업 */}
			<ItemPop itemPop={itemPop} setItemPop={setItemPop} popClick={itemSelectCallback} />
			
			{/* 협력사 사용자 팝업 */}
			<BidCustUserList isBidCustUserListModal={isBidCustUserListModal} setIsBidCustUserListModal={setIsBidCustUserListModal} srcCustCode={custCode} /> 	
		</div>
	)
}

export default CustList;