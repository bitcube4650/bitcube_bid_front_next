import axios from 'axios';
import React from 'react'
import * as CommonUtils from 'components/CommonUtils';
import { MapType } from 'components/types'

// 첨부파일 다운로드
const fnDownloadFile = async(filePath:string, fileName:string) => {

	const response = await axios.post(
		"/api/v1/notice/downloadFile",
		{ fileId: filePath },			// 서버에서 파일을 식별할 수 있는 고유한 ID 또는 다른 필요한 데이터
		{ responseType: "blob" }		// 응답 데이터를 Blob 형식으로 받기
	);

	// 파일 다운로드를 위한 처리
	const url = window.URL.createObjectURL(new Blob([response.data]));
	const link = document.createElement("a");
	link.href = url;
	link.setAttribute("download", fileName); // 다운로드될 파일명 설정
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

interface custInfoProps {
	isApproval : boolean;
	custInfo : MapType
}

const CustDetail = ({isApproval, custInfo}:custInfoProps) => {
	// 세션정보
	const loginInfo = JSON.parse(localStorage.getItem("loginInfo") as string);

	// 법인번호 dash
	const onAddDashRPresJuminNum = (val:string) =>{
		if (!val) return '';
		val = val.toString();
		val = val.replace(/[^0-9]/g, '')
		
		let tmp = ''
		tmp += val.substr(0, 6);
		tmp += '-';
		tmp += val.substr(6,7);
		
		return tmp;
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
		<>
			<h3 className="h3Tit">회사 정보</h3>
			<div className="boxSt mt20">
				{loginInfo.custType === "inter"
				?
					<div className="flex align-items-center">
						<div className="formTit flex-shrink0 width170px">가입희망 계열사</div>
						<div className="width100">{ custInfo.interrelatedNm }</div>
					</div>
				:
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
				}
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">업체유형 1</div>
					<div className="width100">{ custInfo.custTypeNm1 }</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">업체유형 2</div>
					<div className="width100">{ custInfo.custTypeNm2 }</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">회사명</div>
					<div className="width100">{ custInfo.custName }</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">대표자명</div>
					<div className="width100">{ custInfo.presName }</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">사업자등록번호</div>
					<div className="width100">{ CommonUtils.onAddDashRegNum(custInfo.regnum) }</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">법인번호</div>
					<div className="width100">{ onAddDashRPresJuminNum(custInfo.presJuminNo) }</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">자본금</div>
					<div className="width100">{ CommonUtils.onComma(custInfo.capital) } 원</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">설립년도</div>
					<div className="width100">{ custInfo.foundYear } 년</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">대표전화</div>
					<div className="width100">{ CommonUtils.onAddDashTel(custInfo.tel) }</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">팩스</div>
					<div className="width100">{ CommonUtils.onAddDashTel(custInfo.fax) }</div>
				</div>
				<div className="flex mt20">
					<div className="formTit flex-shrink0 width170px">회사주소</div>
					<div className="width100">
						<p>{ custInfo.zipcode }</p>
						<p>{ custInfo.addr }</p>
						<p>{ custInfo.addrDetail }</p>
					</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">사업자등록증</div>
					<div className="width100">
						<a className="textUnderline" onClick={() => fnDownloadFile(custInfo.regnumPath, custInfo.regnumFileName)}>{ custInfo.regnumFileName }</a>
					</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">회사소개 및 기타자료</div>
					<div className="width100">
						<a className="textUnderline" onClick={() => fnDownloadFile(custInfo.bFilePath, custInfo.bFileName)}>{ custInfo.bFileName }</a>
					</div>
				</div>
				{/* 승인 업체 상세에서는 미조회 */}
				{loginInfo.custType === "inter"&&
				<>
					<div className="flex align-items-center mt20">
						<div className="formTit flex-shrink0 width170px">상태</div>
						<div className="width100">{ onSetCustStatusStr(custInfo.certYn) }</div>
					</div>
					<div className="flex align-items-center mt20" style={custInfo.certYn == 'D' ? {} : {display : "none"}}>
						<div className="formTit flex-shrink0 width170px">사유</div>
						<div className="width100">{ custInfo.etc }</div>
					</div>
				</>
				}
			</div>
		</>
	)
}

export default CustDetail
