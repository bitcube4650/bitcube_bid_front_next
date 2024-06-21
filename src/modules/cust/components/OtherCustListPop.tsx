import React, { useCallback, useEffect, useState } from 'react'
import Pagination from 'components/Pagination'
import axios from 'axios'
import { Modal } from 'react-bootstrap'
import * as CommonUtils from 'components/CommonUtils';
import ItemPop from '../../signup/components/ItemPop';
import { MapType } from 'components/types'
import { OtherCustListProps } from '../types/types';
import SrcInput from 'components/input/SrcInput';

/* 타계열사 업체 조회 팝업 */
const OtherCustListPop = ({otherCustModal, setOtherCustModal, setSelCustCode}:OtherCustListProps) => {
	// 세션정보
	const loginInfo = JSON.parse(localStorage.getItem("loginInfo") as string)

	const [srcData, setSrcData] = useState<MapType>({						// 조회조건
		custCode : loginInfo.custCode,
		custName : '',
		custType : '',
		custTypeNm : '',
		size : 10,													// 최대 조회건수
		page : 0													// 페이지 위치
	})
	const [otherCustList, setOtherCustList] = useState<MapType>([])			// 타계열사 업체 리스트
	const [itemPop, setItemPop] = useState(false);					// 품목 팝업
	
	// 타계열사 업체 리스트 조회
	const onSearch = async() => {
		const response = await axios.post('/api/v1/cust/otherCustList', srcData)
		setOtherCustList(response.data.data); 
	}
	
	// 업체유형 팝업 callback
	const itemSelectCallback = (data:MapType) => {
		setSrcData({
			...srcData,
			custType : data.itemCode,
			custTypeNm : data.itemName
		})
	}

	useEffect(() => {
		onSearch();
	}, [srcData.size, srcData.page])

  return (
	<Modal className={`modalStyle ${itemPop ? 'modal-cover' : ''}`} id="otherCustPop" show={otherCustModal} onHide={() => setOtherCustModal(false)} dialogClassName="modal-xl">
		<Modal.Body>
			<button className="ModalClose" data-dismiss="modal" title="닫기" onClick={() => setOtherCustModal(false)}><i className="fa-solid fa-xmark"></i></button>
			<h2 className="modalTitle">타계열사 업체조회</h2>
			<div className="modalTopBox">
				<ul>
					<li><div>계열사에 등록되어 있는 업체리스트를 조회합니다</div></li>
				</ul>
			</div>
			
			<div className="modalSearchBox mt20">
				<div className="flex align-items-center">
					<div className="sbTit mr30">업체유형</div>
					<div className="width150px">
						<input type="text" className="inputStyle readonly" name='custTypeNm' value={srcData.custTypeNm} readOnly />
					<input type="hidden"  name='custType' value={srcData.custType} />
					</div>
					<button className="btnStyle btnSecondary ml10" title="조회" onClick={()=>setItemPop(true)}>조회</button>
					<button type="button" title="삭제" className="btnStyle btnOutline" style={{display : `${!CommonUtils.isEmpty(srcData.custType) ? "inline-flex" : "none"}`}} onClick={() => {setSrcData({...srcData, custType : '', custTypeNm : ''})}}>삭제</button>
					<div className="sbTit mr30 ml50">업체명</div>
					<div className="width150px">
						<SrcInput name="custName" onSearch={ onSearch } srcData={ srcData } setSrcData={ setSrcData } maxLength={ 30 } />
					</div>
					<button className="btnStyle btnSearch" onClick={onSearch}>검색</button>
				</div>
			</div>
			<table className="tblSkin1 mt30">
				<colgroup>
					<col />
				</colgroup>
				<thead>
					<tr>
						<th>업체명</th>
						<th>업체유형</th>
						<th>사업자번호</th>
						<th>대표이사</th>
						<th>등록 계열사</th>
						<th className="end">선택</th>
					</tr>
				</thead>
				<tbody>
					{ otherCustList.content?.map((otherCust:MapType) => (
						<tr key={otherCust.custCode}>
							<td>{otherCust.custName}</td>
							<td className="text-left" dangerouslySetInnerHTML={{__html : otherCust.custType1}}></td>
							<td>{CommonUtils.onAddDashRegNum(otherCust.regnum)}</td>
							<td>{otherCust.presName}</td>
							<td>{otherCust.interrelatedNm}</td>
							<td className="end">
								<button className="btnStyle btnSecondary btnSm" title="선택" onClick={() => {setSelCustCode(otherCust.custCode); setOtherCustModal(false)}}>선택</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			{/* pagination */}
			<div className="row mt30">
				<div className="col-xs-12">
					<Pagination srcData={srcData} setSrcData={setSrcData} list={otherCustList} />
				</div>
			</div>
			{/* //pagination */}
			<div className="modalFooter">
				<button className="modalBtnClose" data-dismiss="modal" title="닫기" onClick={() => setOtherCustModal(false)}>닫기</button>
			</div>
			
			{/* 품목 팝업 */}
			<ItemPop itemPop={itemPop} setItemPop={setItemPop} popClick={itemSelectCallback} />
		</Modal.Body>
	</Modal>
  )
}

export default OtherCustListPop