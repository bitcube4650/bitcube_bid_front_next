import axios from 'axios';
import React from 'react'

// 첨부파일 다운로드
const fnDownloadFile = async(filePath, fileName) => {

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

const CustDetail = ({isApproval, data}) => {
	return (
		<>
			<h3 className="h3Tit">회사 정보</h3>
			<div className="boxSt mt20">
				<div className="flex align-items-center">
					<div className="formTit flex-shrink0 width170px">가입희망 계열사</div>
					<div className="width100">{ data.interrelatedNm }</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">업체유형 1</div>
					<div className="width100">{ data.custTypeNm1 }</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">업체유형 2</div>
					<div className="width100">{ data.custTypeNm2 }</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">회사명</div>
					<div className="width100">{ data.custName }</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">대표자명</div>
					<div className="width100">{ data.presName }</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">사업자등록번호</div>
					<div className="width100">{ data.regnum }</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">법인번호</div>
					<div className="width100">{ data.presJuminNo }</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">자본금</div>
					<div className="width100">{ data.capital } 원</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">설립년도</div>
					<div className="width100">{ data.foundYear } 년</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">대표전화</div>
					<div className="width100">{ data.tel }</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">팩스</div>
					<div className="width100">{ data.fax }</div>
				</div>
				<div className="flex mt20">
					<div className="formTit flex-shrink0 width170px">회사주소</div>
					<div className="width100">
						<p>{ data.zipcode }</p>
						<p>{ data.addr }</p>
						<p>{ data.addrDetail }</p>
					</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">사업자등록증</div>
					<div className="width100">
						<a className="textUnderline" onClick={() => fnDownloadFile(data.regnumPath, data.regnumFile)}>{ data.regnumFile }</a>
					</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">회사소개 및 기타자료</div>
					<div className="width100">
						<a className="textUnderline" onClick={() => fnDownloadFile(data.bfilePath, data.bfile)}>{ data.bfile }</a>
					</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">상태</div>
					<div className="width100">{ data.certYn }</div>
				</div>
				<div className="flex align-items-center mt20" style={data.certYn == 'D' ? {} : {display : "none"}}>
					<div className="formTit flex-shrink0 width170px">사유</div>
					<div className="width100">{ data.etc }</div>
				</div>
			</div>

			{/* 승인 업체 상세에서는 미조회 */}
			{!isApproval &&
			<>
			<h3 className="h3Tit mt50">계열사 관리 항목</h3>
			<div className="boxSt mt20">
				<div className="flex align-items-center">
					<div className="formTit flex-shrink0 width170px">업체등급</div>
					<div class="width100">
						<input type="radio" name="custLevel" value="A" id="chkA" class="radioStyle" checked={data.custLevel === 'A'} disabled /><label for="chkA">A등급</label>
						<input type="radio" name="custLevel" value="B" id="chkB" class="radioStyle" checked={data.custLevel === 'B'} disabled /><label for="chkB">B등급</label>
						<input type="radio" name="custLevel" value="C" id="chkC" class="radioStyle" checked={data.custLevel === 'C'} disabled /><label for="chkC">C등급</label>
						<input type="radio" name="custLevel" value="D" id="chkD" class="radioStyle" checked={data.custLevel === 'D'} disabled /><label for="chkD">D등급</label>
					</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">D업체평가</div>
					<div className="width100">{ data.careContent }</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">관리단위</div>
					<div className="width100">{ data.custValuation }</div>
				</div>
			</div>
			</>
			}

			<h3 className="h3Tit mt50">관리자 정보</h3>
			<div className="boxSt mt20">
				<div className="flex align-items-center">
					<div className="formTit flex-shrink0 width170px">이름</div>
					<div className="width100">{ data.userName }</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">이메일</div>
					<div className="width100">{ data.userEmail }</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">아이디</div>
					<div className="width100">{ data.userId }</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">휴대폰</div>
					<div className="width100">{ data.userHp }</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">유선전화</div>
					<div className="width100">{ data.userTel }</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">직급</div>
					<div className="width100">{ data.userPosition }</div>
				</div>
				<div className="flex align-items-center mt20">
					<div className="formTit flex-shrink0 width170px">부서</div>
					<div className="width100">{ data.userBuseo }</div>
				</div>
			</div>
		</>
	)
}

export default CustDetail
