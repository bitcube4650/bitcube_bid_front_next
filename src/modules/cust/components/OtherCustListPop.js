import React, { useCallback, useEffect, useState } from 'react'
import Pagination from '../../../components/Pagination'
import axios from 'axios'
import { Modal } from 'react-bootstrap'
import * as CommonUtils from 'components/CommonUtils';
import ItemPop from '../../signup/components/ItemPop';

const OtherCustListPop = ({setOtherCustModal, onChangeData}) => {
	const [srcData, setSrcData] = useState({			// 조회조건
		custCode : '11',								// 업체코드
		custName : '',
		custType : '',
		custTypeNm : '',
		size : 10,										// 최대 조회건수
		page : 0										// 페이지 위치
	})
	const [otherCustList, setOtherCustList] = useState([])
	const [itemPop, setItemPop] = useState(false);		// 품목 팝업

	const onChangeSrcData = (e) => {
		const { name, value } = e.target;
		setSrcData({
			...srcData,
			[name]: value
		})
	}

	// 업체 리스트 조회
	const onSearch = useCallback(async() => {
		const response = await axios.post('/api/v1/cust/otherCustList', srcData)
		setOtherCustList(response.data.data); 
	})

	const selectCustCode = async(custCode) => {
		onChangeData('selCust', 'custCode', custCode);
		onChangeData('selCust', 'url', '/api/v1/cust/otherCustManagement/');

		setOtherCustModal(false)
	}
	
	// 업체유형 팝업 callback
	const itemSelectCallback = (data) => {
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
	<Modal className={`modalStyle ${itemPop ? 'modal-cover' : ''}`} id="otherCustPop" show={setOtherCustModal} onHide={() => setOtherCustModal(false)} dialogClassName="modal-xl">
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
					</div>
					<input type="hidden"  name='custType' value={srcData.custType} />
					<button className="btnStyle btnSecondary ml10" title="조회" onClick={()=>setItemPop(true)}>조회</button>
					<button type="button" title="삭제" className="btnStyle btnOutline" style={{display : `${!CommonUtils.isEmpty(srcData.custType) ? "inline-flex" : "none"}`}} onClick={() => {setSrcData({...srcData, custType : '', custTypeNm : ''})}}>삭제</button>
					<div className="sbTit mr30 ml50">업체명</div>
					<div className="width150px">
						<input type="text" className="inputStyle" name="custName" value={srcData.custName} onChange={onChangeSrcData} onKeyDown={(e) => { if(e.key === 'Enter') onSearch()}} />
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
					{ otherCustList.content?.map(otherCust => (
						<tr key={otherCust?.custCode}>
							<td>{otherCust?.custName}</td>
							<td className="text-left" dangerouslySetInnerHTML={{__html : otherCust?.custType1}}></td>
							<td>{CommonUtils.onAddDashRegNum(otherCust.regnum)}</td>
							<td>{otherCust.presName}</td>
							<td>{otherCust.interrelatedNm}</td>
							<td className="end">
								<button className="btnStyle btnSecondary btnSm" title="선택" onClick={() => selectCustCode(otherCust?.custCode)}>선택</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			{/* pagination */}
			<div className="row mt30">
				<div className="col-xs-12">
					<Pagination onChangeSrcData={onChangeSrcData} list={otherCustList} />
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