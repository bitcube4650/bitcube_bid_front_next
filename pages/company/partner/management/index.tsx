import React, { useEffect, useState } from 'react'
import SrcInput from '../../../../src/components/input/SrcInput'
import { MapType } from '../../../../src/components/types'
import * as CommonUtils from '../../../../src/components/CommonUtils';
import axios from 'axios'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'
import Pagination from '../../../../src/components/Pagination';
import SelectListSize from '../../../../src/components/SelectListSize';
import EditInput from '../../../../src/components/input/EditInput';
import SrcSelectBox from '../../../../src/components/input/SrcSelectBox';
import ItemPop from '../../../../src/modules/signup/components/ItemPop';
import BidCustUserList from '../../../../src/modules/bid/components/BidCustUserList';


const index = ({initList} : {initList:MapType}) => {
    const router = useRouter();
	// 세션정보
	const loginInfo = JSON.parse(localStorage.getItem("loginInfo") as string);

	//조회 결과
	const [custList, setCustList] = useState<MapType>(initList);
	const [itemPop, setItemPop] = useState<boolean>(false);		// 품목 팝업
	const [srcCertYn, setSrcCertYn] = useState([{"value" : "Y", "name" : "정상"}, {"value" : "D", "name" : "삭제"}])
	const [isBidCustUserListModal, setIsBidCustUserListModal] = useState<boolean>(false);
	const [custCode, setCustCode] = useState<string>('');

	//조회 조건
	const [srcData, setSrcData] = useState<MapType>({
		custName	: '',
		certYn		: router.query?.certYn as string == 'D' ? 'D' : 'Y',	// url 파라미터에 certYn이 있으면 해당 값을 가져온다
		custTypeNm	: '',
		custType	: '',
		size		: 10,
		page		: 0
	})
	
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

	// 업체 상세
	const onMoveDetail = (custCode:string) => {	
		router.push({
			pathname: "/company/partner/management/[custCode]",
			query: { custCode: custCode }
		});
	}

	// 업체 등록
	const onMoveSave = () => {
		router.push("/company/partner/management/save");
	}

	// 업체유형 팝업 callback
	const itemSelectCallback = (data:MapType) => {
		setSrcData({
			...srcData,
			custType	: data.itemCode,
			custTypeNm	: data.itemName
		})
	}

	// 사용자 현황 팝업
	const onUserListPop = (custCode:string) => {
		setCustCode(custCode)
		setIsBidCustUserListModal(true)
	}

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
			<div className="conRight">
				<div className="conHeader">
					<ul className="conHeaderCate">
						<li>업체정보</li>
						<li>업체 관리</li>
					</ul>
				</div>
				<div className="contents">
					<div className="conTopBox">
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
					</div>
					<div className="searchBox mt20">
						<div className="flex align-items-center">
							<div className="sbTit mr30">업체명</div>
							<div className="width150px">
								<SrcInput name="custName" onSearch={ onSearch } srcData={ srcData } setSrcData={ setSrcData } maxLength={ 300 } />
							</div>
							<div className="sbTit mr30 ml50">상태</div>
							<div className="width120px">
								<SrcSelectBox name='certYn' optionList={srcCertYn} valueKey='value' nameKey='name' onSearch={ onPageInit } srcData={ srcData } setSrcData={ setSrcData } value={srcData.certYn} />
							</div>
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
						{/* {(loginInfo.userAuth == '2' || loginInfo.userAuth == '4') && */}
							<div className="flex-shrink0">
								<a onClick={ onMoveSave } title="업체 등록"  className="btnStyle btnPrimary">업체등록</a>
							</div>
						{/* } */}
					</div>
					<table className="tblSkin1 mt10">
						<colgroup>
							<col />
							<col style={{width : "20%"}} />
							<col style={{width : "15%"}} />
							<col style={{width : "8%"}} />
							<col style={{width : "8%"}} />
							<col style={{width : "12%"}} />
							<col style={{width : "8%"}} />	
						</colgroup>
						<thead>
							<tr>
								<th>업체명</th>
								<th>업체유형</th>
								<th>사업자등록번호</th>
								<th>대표이사</th>
								<th>상태</th>
								<th>등록일시</th>
								<th className="end">사용자현황</th>
							</tr>
						</thead>
						<tbody>
							{
								custList?.totalElements == 0 ?
								<tr>
									<td colSpan={7}>조회된 데이터가 없습니다.</td>
								</tr>
							:
								custList?.content?.map((data:MapType) => (
									<tr key={data.custCode}>
										{/* 업체명 */}
										<td className="text-left">
											<a onClick={() => { onMoveDetail(data.custCode) }} className="textUnderline notiTitle">{data.custName}</a>
										</td>
										{/* 업체유형 */}
										<td>{data.custType1}</td>
										{/* 사업자등록번호 */}
										<td>{CommonUtils.onAddDashRegNum(data.regnum)}</td>
										{/* 대표이사 */}
										<td>{data.presName}</td>
										{/* 상태 */}
										<td style={data.certYn == 'D' ? {color : 'red'} : {}}>{onSetCustStatusStr(data.certYn)}</td>
										{/* 등록일시 */}
										<td>{data.createDate}</td>
										{/* 사용자 현황 버튼 */}
										<td className="end">
											<button title="조회" className="btnStyle btnSecondary btnSm" onClick={() => onUserListPop(data.custCode)}>조회</button>
										</td>
									</tr>
								))
							}
						</tbody>
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

export const getServerSideProps = async(context) => {
	
	let params = {
		custName	: '',
		certYn		: context.query?.certYn == 'D' ? 'D' : 'Y',
		custTypeNm	: '',
		custType	: '',
		size		: 10,
		page		: 0
	}
	
	const cookies = context.req.headers.cookie || '';
	try {
		axios.defaults.headers.cookie = cookies;
		const response = await axios.post('http://localhost:3000/api/v1/cust/custList', params);
		return {
			props: {
				initList: response.data.data
			}
		}
	} catch (error) {
		console.error('Error fetching initial progress list:', error);
		return {
			props: {
				initList: { content: [], totalElements: 0 }
			}
		}
	}
}

export default index