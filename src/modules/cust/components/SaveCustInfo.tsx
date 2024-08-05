import React, { useCallback, useEffect, useState } from 'react'
import OtherCustListPop from './OtherCustListPop'
import { useParams } from 'react-router-dom';
import * as CommonUtils from 'components/CommonUtils';
import ItemPop from '../../signup/components/ItemPop';
import AddrPop from 'components/AddrPop';
import { SaveCustInfoProps } from '../types/types';
import { MapType } from 'components/types'
import EditInputFileBox from 'components/input/EditInputFileBox';
import EditInput from 'components/input/EditInput';

const SaveCustInfo = ({isEdit, custInfo, setCustInfo, setSelCustCode, setUploadRegnumFile, setUploadBFile}:SaveCustInfoProps) => {
	// 세션정보
	const loginInfo = JSON.parse(localStorage.getItem("loginInfo") as string);
	const [otherCustModal, setOtherCustModal] = useState<boolean>(false)
	const params = useParams();
	
	const [type, setType] = useState("type1");			// 업체 유형
	const [itemPop, setItemPop] = useState<boolean>(false);		// 품목 팝업
	const [addrPop, setAddrPop] = useState<boolean>(false);		// 주소 팝업

	// 업체유형 팝업 호출
	const openItemPop = (type : string) => {
		setType(type);
		setItemPop(true);
	}

	// 업체유형 팝업 callback
	const itemSelectCallback = (data:MapType) => {
		if("type1" === type) {
			setCustInfo({
				...custInfo,
				['custType1']: data.itemCode,
				['custTypeNm1']: data.itemName
			})
		} else if("type2" === type) {
			setCustInfo({
				...custInfo,
				['custType2']: data.itemCode,
				['custTypeNm2']: data.itemName
			})
		}
	}

	// 주소 조회 팝업
	const openAddrPop = () => {
		setAddrPop(true);
	}
	
	// 주소 조회 callback
    const addrPopCallback = (data:MapType) => {
		setCustInfo({
			...custInfo,
			['zipcode']: data.zipcode,
			['addr']: data.addr
		})
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

	// 조회데이터 필터처리
	useEffect(() => {
		setCustInfo({
			...custInfo,
			tel : CommonUtils.onAddDashTel(custInfo.tel),
			fax : CommonUtils.onAddDashTel(custInfo.fax),
			capital : CommonUtils.onComma(custInfo.capital)
		})
	}, [custInfo.capital, custInfo.tel, custInfo.fax])

	
	useEffect(() => {
		if(CommonUtils.isEmpty(custInfo.regnumFileName)){
			setCustInfo({
				...custInfo,
				regnumPath : ''
			})
		}

		if(CommonUtils.isEmpty(custInfo.bFileName)){
			setCustInfo({
				...custInfo,
				bFilePath : ''
			})
		}
	}, [custInfo.regnumFileName, custInfo.bFileName])

	return (
		<>
			{/* 회사 정보 */}
			<h3 className={(params?.custCode || '') == '' ? "h3Tit" : "h3Tit mt50" }>회사 정보</h3>
			<div className="formWidth">
				<div className="boxSt mt20">
				{loginInfo.custType === "inter"
				?((params?.custCode || '') == ''
				?
					<>
						<div className="flex align-items-center">
							<div className="formTit flex-shrink0 width170px">승인 계열사</div>
							<div className="width100">
								{loginInfo.custName}
								<button data-toggle="modal" data-target="#otherCustPop" className="btnStyle btnSecondary ml50" title="타계열사 업체" onClick={() => {setOtherCustModal(true); }}>타계열사 업체</button>
								{/* tooltip */}
								<i className="fas fa-question-circle toolTipSt toolTipMd ml5">
									<div className="toolTipText" style={{width:"320px"}}>
									<ul className="dList">
										<li><div>등록하실 업체가 다른 계열사에 이미 등록되어 있다면 [타계열사 업체]를 조회하여 등록하십시오.</div></li>
									</ul>
									</div>
								</i>
								{/* // tooltip */}
							</div>
						</div>
					</>
				:
					<>
						<div className="flex align-items-center">
							<div className="formTit flex-shrink0 width170px">승인 계열사</div>
							<div className="width100">{ custInfo.interrelatedNm }</div>
						</div>
					</>
				)
				:
				<>
					<div className="flex align-items-center">
						<div className="formTit flex-shrink0 width170px">
							승인 계열사
							<i className="fas fa-question-circle toolTipSt ml5">
								<div className="toolTipText" style={{width: "420px"}}>
									<ul className="dList">
										<li>
											<div>
												승인된 계열사의 입찰에만 참여할 수 있습니다.
											</div>
										</li>
										<li>
											<div>
												승인 계열사에 없는 계열사의 입찰에 참여를 하려면 유선으로 해당 계열사에 등록요청 하시기 바랍니다.
											</div>
										</li>
									</ul>
								</div>
							</i>
						</div>
						<div className="overflow-y-scroll boxStSm width100" style={{height:"80px"}} dangerouslySetInnerHTML={{__html : custInfo.interrelatedNm}} />
					</div>
				</>
				}
				{!isEdit
					?
						<>
						<div className="flex align-items-center mt20">
							<div className="formTit flex-shrink0 width170px">업체유형 1 <span className="star">*</span></div>
							<div className="flex align-items-center width100">
								<EditInput name="custTypeNm1" className="readonly" editData={custInfo} setEditData={setCustInfo} value={custInfo.custTypeNm1 || ''} readOnly={true} placeholder="우측 검색 버튼을 클릭해 주세요" />
								<EditInput type="hidden" name="custType1" editData={custInfo} setEditData={setCustInfo} value={custInfo.custType1 || ''} />
								<button onClick={() => openItemPop('type1')} className="btnStyle btnSecondary ml10" title="조회">조회</button>
							</div>
						</div>
						<div className="flex align-items-center mt20">
							<div className="formTit flex-shrink0 width170px">업체유형 2</div>
							<div className="flex align-items-center width100">
								<EditInput name="custTypeNm2" className="readonly" editData={custInfo} setEditData={setCustInfo} value={custInfo.custTypeNm2 || ''} readOnly={true} placeholder="우측 검색 버튼을 클릭해 주세요" />
								<EditInput type="hidden" name="custType2" editData={custInfo} setEditData={setCustInfo} value={custInfo.custType2 || ''} />
								<button onClick={() => openItemPop('type2')} className="btnStyle btnSecondary ml10" title="조회">조회</button>
							</div>
						</div>
						</>
					:
					<>
						<div className="flex align-items-center mt20">
							<div className="formTit flex-shrink0 width170px">업체유형 1</div>
							<div className="width100">{ custInfo.custTypeNm1 }</div>
						</div>
						<div className="flex align-items-center mt20">
							<div className="formTit flex-shrink0 width170px">업체유형 2</div>
							<div className="width100">{ custInfo.custTypeNm2 }</div>
						</div>
					</>
				}
					<div className="flex align-items-center mt20">
						<div className="formTit flex-shrink0 width170px">회사명 <span className="star">*</span></div>
						<div className="width100">
							<EditInput name="custName" className="maxWidth-max-content" editData={custInfo} setEditData={setCustInfo} value={custInfo.custName || ''} />
						</div>
					</div>
					
					<div className="flex align-items-center mt10">
						<div className="formTit flex-shrink0 width170px">대표자명 <span className="star">*</span></div>
						<div className="width100">
							<EditInput name="presName" className="maxWidth-max-content" editData={custInfo} setEditData={setCustInfo} value={custInfo.presName || ''} />
						</div>
					</div>

					<div className="flex align-items-center mt10">
						<div className="formTit flex-shrink0 width170px">사업자등록번호 <span className="star">*</span></div>
						<div className="flex align-items-center width100">
							<EditInput name="regnum1" className="maxWidth-max-content" editData={custInfo} setEditData={setCustInfo} value={custInfo.regnum1 || ''} maxLength={3} />
							<span style={{margin:"0 10px"}}>-</span>
							<EditInput name="regnum2" className="maxWidth-max-content" editData={custInfo} setEditData={setCustInfo} value={custInfo.regnum2 || ''} maxLength={2} />
							<span style={{margin:"0 10px"}}>-</span>
							<EditInput name="regnum3" className="maxWidth-max-content" editData={custInfo} setEditData={setCustInfo} value={custInfo.regnum3 || ''} maxLength={5} />
						</div>
					</div>
					
					<div className="flex align-items-center mt10">
						<div className="formTit flex-shrink0 width170px">법인번호</div>
						<div className="flex align-items-center width100">
							<EditInput name="presJuminNo1" className="maxWidth-max-content" editData={custInfo} setEditData={setCustInfo} value={custInfo.presJuminNo1 || ''} maxLength={6} />
							<span style={{margin:"0 10px"}}>-</span>
							<EditInput name="presJuminNo2" className="maxWidth-max-content" editData={custInfo} setEditData={setCustInfo} value={custInfo.presJuminNo2 || ''} maxLength={7} />
						</div>
					</div>

					<div className="flex align-items-center mt10">
						<div className="formTit flex-shrink0 width170px">자본금 <span className="star">*</span></div>
						<div className="flex align-items-center width100">
							<EditInput name="capital" className="maxWidth-max-content" editData={custInfo} setEditData={setCustInfo} value={custInfo.capital || ''} maxLength={15} placeholder="ex) 10,000,000" />
							<div className="ml10">원</div>
						</div>
					</div>
					
					<div className="flex align-items-center mt10">
						<div className="formTit flex-shrink0 width170px">설립년도 <span className="star">*</span></div>
						<div className="flex align-items-center width100">
							<EditInput name="foundYear" className="maxWidth-max-content" editData={custInfo} setEditData={setCustInfo} value={custInfo.foundYear || ''} maxLength={4} placeholder="ex) 2021" />
							<div className="ml10">년</div>
						</div>
					</div>
					
					<div className="flex align-items-center mt10">
						<div className="formTit flex-shrink0 width170px">대표전화 <span className="star">*</span></div>
						<div className="width100">
							<EditInput name="tel" className="maxWidth-max-content" editData={custInfo} setEditData={setCustInfo} value={custInfo.tel || ''} />
						</div>
					</div>
					
					<div className="flex align-items-center mt10">
						<div className="formTit flex-shrink0 width170px">팩스</div>
						<div className="width100">
							<EditInput name="fax" className="maxWidth-max-content" editData={custInfo} setEditData={setCustInfo} value={custInfo.fax || ''} />
						</div>
					</div>
					
					<div className="flex mt10">
						<div className="formTit flex-shrink0 width170px">회사주소 <span className="star">*</span></div>
						<div className="width100">
							<div className="flex align-items-center width100">
								<EditInput name="zipcode" className="maxWidth-max-content readonly" editData={custInfo} setEditData={setCustInfo} value={custInfo.zipcode || ''} readOnly={true} placeholder="주소 조회 클릭" />
								<a onClick={openAddrPop} className="btnStyle btnSecondary flex-shrink0 ml10" title="주소 조회">주소 조회</a>
							</div>
							<div className="mt5">
								<EditInput name="addr" className="readonly" editData={custInfo} setEditData={setCustInfo} value={custInfo.addr || ''} readOnly={true} />
							</div>
							<div className="mt5">
								<EditInput name="addrDetail" editData={custInfo} setEditData={setCustInfo} value={custInfo.addrDetail || ''} placeholder="상세 주소 입력" />
							</div>
						</div>
					</div>

					
					<div className="flex mt10">
						<div className="formTit flex-shrink0 width170px">사업자등록증 <span className="star" style={{display : loginInfo.custType !== 'inter' ? '' : 'none' }} >*</span></div>
						<div className="width100">
							{/* 다중파일 업로드 */}
							<EditInputFileBox name='regnumFileName' fileName={ custInfo.regnumFileName } setUploadFile={ setUploadRegnumFile } editData={ custInfo } setEditData={ setCustInfo }/>
							{/* 다중 파일 업로드 */}
						</div>
					</div>
					
					<div className="flex mt10">
						<div className="formTit flex-shrink0 width170px">회사소개 및 기타자료
							{/* tooltip */}
							<i className="fas fa-question-circle toolTipSt ml5">
								<div className="toolTipText" style={{ width:"420px" }}>
									<ul className="dList">
										<li><div>첨부파일은 간단한 업체 소개 자료 등의 파일을 첨부해 주십시오.</div></li>
										<li><div>1개  이상의 파일을 첨부하실 경우 Zip으로 압축하여 첨부해 주십시오</div></li>
										<li><div>파일은 10M 이상을 초과할 수 없습니다.</div></li>
									</ul>
								</div>
							</i>
							{/* tooltip */}
						</div>
						<div className="width100">
							{/* 다중파일 업로드 */}
							<EditInputFileBox name='bFileName' fileName={ custInfo.bFileName } setUploadFile={ setUploadBFile } editData={ custInfo } setEditData={ setCustInfo }/>
							{/* //다중파일 업로드 */}
						</div>
					</div>
				
					{(loginInfo.custType === 'inter' && isEdit) &&
						<div className="flex align-items-center mt20">
							<div className="formTit flex-shrink0 width170px">상태</div>
							<div className="width100">{ onSetCustStatusStr(custInfo.certYn) }</div>
						</div>
					}
				</div>
			</div>
			{/* // 회사정보 */}
			{/* 타계열사 업체조회 */}
			{(params?.custCode || '') === '' &&
				<OtherCustListPop otherCustModal={otherCustModal} setOtherCustModal={setOtherCustModal} setSelCustCode={setSelCustCode} />
			}
			{/* 업체유형 팝업 */}
			{!isEdit &&
				<ItemPop itemPop={itemPop} setItemPop={setItemPop} popClick={itemSelectCallback} />
			}
			{/* 주소조회 팝업 */}
			<AddrPop addrPop={addrPop} setAddrPop={setAddrPop} addrPopClick={addrPopCallback} />
		</>
	)
}

export default SaveCustInfo

