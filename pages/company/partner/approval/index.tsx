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
import ItemPop from '../../../../src/modules/signup/components/ItemPop';

const index = ({initList} : {initList:MapType}) => {
    const router = useRouter();

	//조회 결과
	const [custList, setCustList] = useState<MapType>(initList);
	const [itemPop, setItemPop] = useState<boolean>(false);		// 품목 팝업

	//조회 조건
	const [srcData, setSrcData] = useState<MapType>({
		custName	: '',
		certYn		: 'N',	// 업체 상태 (승인 요청인 경우 'N')
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

	// 업체명 상세 이동
	const onDetail = (custCode:string) => {
		router.push({
			pathname: "/company/partner/approval/[custCode]",
			query: {custCode : custCode}
		});
	}

	// 업체유형 팝업 callback
	const itemSelectCallback = (data:MapType) => {
		setSrcData({
			...srcData,
			custType	: data.itemCode,
			custTypeNm	: data.itemName
		})
	}

	return (
			<div className="conRight">
				<div className="conHeader">
					<ul className="conHeaderCate">
						<li>업체정보</li>
						<li>업체 승인</li>
					</ul>
				</div>
				<div className="contents">
					<div className="conTopBox">
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
					</div>
					<div className="searchBox mt20">
						<div className="flex align-items-center">
							<div className="sbTit mr30">업체명</div>
							<div className="width150px">
								<SrcInput name="custName" onSearch={ onSearch } srcData={ srcData } setSrcData={ setSrcData } maxLength={ 300 } />
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
					</div>
					<table className="tblSkin1 mt10">
						<colgroup>
							<col />
							<col style={{width : "20%"}} />
							<col style={{width : "15%"}} />
							<col style={{width : "8%"}} />
							<col style={{width : "8%"}} />
							<col style={{width : "12%"}} />
						</colgroup>
						<thead>
							<tr>
								<th>업체명</th>
								<th>업체유형</th>
								<th>사업자등록번호</th>
								<th>대표이사</th>
								<th>담당자명</th>
								<th className="end">요청일시</th>
							</tr>
						</thead>
						<tbody>
							{
								custList?.totalElements == 0 ?
								<tr>
									<td colSpan={6}>조회된 데이터가 없습니다.</td>
								</tr>
							:
								custList?.content?.map((data:MapType) => (
									// 업체 승인 : [업체명, 업체유형, 사업자등록번호, 대표이사, 담당자, 요청일시]
									<tr key={data.custCode}>
										{/* 업체명 */}
										<td className="text-left">
											<a onClick={() => { onDetail(data.custCode) }} className="textUnderline notiTitle">{data.custName}</a>
										</td>
										{/* 업체유형 */}
										<td>{data.custType1}</td>
										{/* 사업자등록번호 */}
										<td>{CommonUtils.onAddDashRegNum(data.regnum)}</td>
										{/* 대표이사 */}
										<td>{data.presName}</td>
										{/* 담당자 */}
										<td>{data.userName}</td>
										{/* 요청일시 */}
										<td className="end">{data.createDate}</td>
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
			</div>
	)
}

export const getServerSideProps = async () => {
	let params = {
		custName	: '',
		certYn		: 'N',	// 업체 상태 (승인 요청인 경우 'N')
		custTypeNm	: '',
		custType	: '',
		size		: 10,
		page		: 0
	}
	
	try {
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