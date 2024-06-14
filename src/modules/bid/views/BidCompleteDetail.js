import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import CmmnInfo from '../components/BidCommonInfo'
import Ft from '../api/filters';
import Api from '../api/api';
import Modal from 'react-bootstrap/Modal';
import BidSubmitHistoryPop from '../components/BidSubmitHistoryPop';
import BidResultReport from '../components/BidResultReport';

const BidCompleteDetail = () => {

    //useEffect 안에 onSearch 한번만 실행하게 하는 플래그
    const isMounted = useRef(true);

    //조회 결과
    const [data, setData] = useState({});

    //세션 로그인 정보
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
    const userId = loginInfo.userId;

    //데이터 조회
    const onSearch = async() => {
        let params = {
            biNo : localStorage.getItem('biNo')
        }

        await axios.post('/api/v1/bidComplete/detail', params).then((response) => {
            if(response.data.code === 'OK'){
                setData(response.data.data);
            }else{
                Swal.fire('', '조회에 실패하였습니다.', 'error');
            }
        });
    };

    //실제계약금액 팝업
    const [realAmtPop, setRealAmtPop] = useState(false);

    //실제계약금액
    const [realAmt, setRealAmt] = useState("");

    //실제계약금액 저장
    const onSave = useCallback(() => {
        if(Ft.isEmpty(realAmt)){
            Swal.fire('', '실제계약금액을 입력해주세요.', 'warning');
            return false;
        }

        let letRealAmt = realAmt.toString().replace(/[^-0-9]/g, '');
        let params = {
            realAmt : letRealAmt
        ,	biNo : localStorage.getItem('biNo')
        }
        axios.post("/api/v1/bidComplete/updRealAmt", params).then((response) => {
            if(response.data.code === 'OK'){
                setData({...data,
                    realAmt: letRealAmt
                });
                Swal.fire('', '실제계약금액을 저장하였습니다.', 'success');
                setRealAmtPop(false);
            }else{
                Swal.fire('', response.data.msg, 'warning');
            }
        });
    },[realAmt])

    //업체 견적사항 이벤트
    const onEvent = useCallback( (event, cust) => {
        if(cust.esmtYn === '2' && data.estOpenDate === null){
            Swal.fire('', '복호화되지 않아 상세를 불러올 수 없습니다.', 'warning');
        }else if(cust.esmtYn === '2' && data.estOpenDate !== null){
            if(data.insMode === '1'){
                Api.fnCustSpecFileDown(cust.fileNm, cust.filePath);
            }else if(data.insMode === '2'){
                let detailView = event.target.closest('tr').nextSibling;
                if(detailView.style.display === '' || detailView.style.display==='none'){
                    detailView.style.display = "table-row";
                }else{
                    detailView.style.display = 'none'
                }
            }
        }
    }, [data.insMode, data.estOpenDate])

    //페이지 이동
    const navigate = useNavigate();
    const onMovePage = () => {
        navigate('/bid/complete');
    }

    //업체 제출 이력
    const [submitHistPop, setSubmitHistPop] = useState(false);
    const [histCust, setHistCust] = useState({});
    const onShowCustSubmitHist = (cust) =>{
        setHistCust(cust);
        setSubmitHistPop(true);
    };

    //입찰결과 보고서 팝업
    const [reportPop, setReportPop] = useState(false);

    useEffect(() => {
        if (isMounted.current) {
            onSearch();
            isMounted.current = false;
        }
    },[]);

    return (
        <div className="conRight">
            {/* conHeader  */}
            <div className="conHeader">
                <ul className="conHeaderCate">
                    <li>전자입찰</li>
                    <li>입찰완료 상세</li>
                </ul>
            </div>
            {/* //conHeader  */}
            {/* contents  */}
            <div className="contents">
                <div className="formWidth">
                    { !Ft.isEmpty(data) &&
                    <CmmnInfo key={'info_'+data.biNo} data={data} attSign="Y" />
                    }

                    <h3 className="h3Tit mt50">업체견적 사항 <strong className="textHighlight">(개찰 전까지 견적금액 및 내역파일은 암호화되어 보호됩니다)</strong></h3>
                    <div className="conTopBox mt20">
                        <ul className="dList">
                            <li><div>재 입찰일 경우 참가업체명을 클릭하면 차수 별 견적제출 이력을 볼 수 있습니다.</div></li>
                            <li><div>견적 상세 확인은 상세를 클릭하시면 확인하실 수 있습니다.</div></li>
                        </ul>
                    </div>
                    <div className="boxSt mt20">
                        <table className="tblSkin1">
                            <colgroup>
                                <col style={{}} />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>입찰참가업체명</th>
                                    <th>견적금액(총액)</th>
                                    <th>견적</th>
                                    <th>제출일시</th>
                                    <th>대표자</th>
                                    <th>기타첨부파일</th>
                                    <th>구분</th>
                                    <th className="end">낙찰일시</th>
                                </tr>
                            </thead>
                            <tbody>
                                { data.custList?.map((cust, idx) => 
                                <>
                                <tr key={idx}>
                                    <td className="text-left">
                                        <a href="#!" onClick={()=>onShowCustSubmitHist(cust)} className="textUnderline">{ cust.custName }</a>
                                    </td>
                                    <td className="text-overflow">{ Ft.ftEsmtAmt(cust) }</td>
                                    <td>
                                        <a href="#!" onClick={(e)=>onEvent(e, cust)} className={cust.esmtYn === '2' ? 'textUnderline textMainColor ' : ''}>{ Ft.ftEsmtYn(cust.esmtYn) }</a>
                                    </td>
                                    <td>{ cust.submitDate }</td>
                                    <td>{ cust.presName }</td>
                                    <td>
                                        {cust.etcPath &&
                                        <img onClick={ () => Api.fnCustSpecFileDown(cust.etcFile, cust.etcPath)} src="/images/icon_etc.svg" className="iconImg" alt="etc"/>
                                        }
                                    </td>
                                    <td>{ Ft.ftSuccYn(cust.succYn) }</td>
                                    <td>{ cust.updateDate }</td>
                                </tr>
                                <tr key={'sub_'+idx} className="detailView">
                                    <td colSpan="8" className="end">
                                        <table className="tblSkin2">
                                            <colgroup>
                                                <col />
                                            </colgroup>
                                            <thead>
                                                <tr>
                                                    <th>품목명</th>
                                                    <th>규격</th>
                                                    <th>수량</th>
                                                    <th>단위</th>
                                                    <th>예정단가</th>
                                                    <th className="end">합계</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                { cust.bidSpec?.map((spec, idx) =>
                                                <tr key={idx}>
                                                    <td className="text-left">{ spec.name }</td>
                                                    <td className="text-left">{ spec.ssize }</td>
                                                    <td className="text-right">{ Ft.numberWithCommas(spec.orderQty) }</td>
                                                    <td>{ spec.unitcode }</td>
                                                    <td className="text-right">{ Ft.numberWithCommas(spec.esmtUc / spec.orderQty) }</td>
                                                    <td className="text-right end">{ Ft.numberWithCommas(spec.esmtUc) }</td>
                                                </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                </>
                                )}
                            </tbody>
                        </table>
                        <div className="flex align-items-center mt20">
                            <div className="formTit flex-shrink0 width170px">낙찰 추가 합의사항</div>
                            <div className="width100">{ data.addAccept }</div>
                        </div>
                    </div>

                    <div className="text-center mt50">
                        <a href="#!" onClick={onMovePage} className="btnStyle btnOutline" title="목록">목록</a>
                        <a href="#!" onClick={()=>setReportPop(true)} className="btnStyle btnSecondary" title="입찰결과 보고서">입찰결과 보고서</a>
                        { ( data.ingTag === 'A5' && data.createUser === userId ) &&
                        <a href="#!" onClick={()=>setRealAmtPop(true)} className="btnStyle btnPrimary" title="실제 계약금액">실제 계약금액
                            <i className="fas fa-question-circle toolTipSt ml5">
                                <div className="toolTipText" style={{width: "480px"}}>
                                    <ul className="dList">
                                        <li><div>낙찰 금액과 실제계약금액이 다를 경우 실제 계약금액을 입력합니다. </div></li>
                                        <li><div>실제계약금액과 낙찰금액이 같을 경우 입력하지 않아도 됩니다. </div></li>
                                        <li><div className="textHighlight">낙찰금액과 실제계약금액이 다를 경우 클릭하여 실제 계약금액을 입력해 주십시오. </div></li>
                                    </ul>
                                </div>
                            </i>
                        </a>
                        }
                    </div>
                </div>
            </div>
            {/* //  contents  */}

            {/* //  실제 계약금액  */}
            {realAmtPop && 
            <Modal className="modalStyle" id="realAmtSave" show={realAmtPop} onHide={()=>setRealAmtPop(false)} keyboard={true}>
                <Modal.Body>
                    <a href="#!" onClick={()=>setRealAmtPop(false)} className="ModalClose" data-dismiss="modal" title="닫기">
                        <i className="fa-solid fa-xmark"></i>
                    </a>
                    <h2 className="modalTitle">실제 계약금액</h2>
                    <div className="modalTopBox">
                        <ul>
                            <li>
                            <div>
                                낙찰금액과 실제계약금액이 다를 경우 실제계약금액을 작성해 주십시오
                            </div>
                            </li>
                        </ul>
                    </div>
                    <div className="flex align-items-center mt20">
                        <div className="formTit flex-shrink0 width170px" style={{paddingLeft:"20px"}}>실제계약금액</div>
                        <div className="width100"><input type="text" className="inputStyle inputSm" defaultValue={realAmt} onChange={(e)=> setRealAmt(e.target.value)} placeholder="숫자만 입력"/></div>
                    </div>
                    <div className="modalFooter">
                        <a href="#!" className="modalBtnClose" onClick={()=>setRealAmtPop(false)} data-dismiss="modal" title="취소">취소</a>
                        <a href="#!" className="modalBtnCheck" data-toggle="modal" title="저장" onClick={onSave}>저장</a>
                    </div>
                </Modal.Body>
            </Modal>
            }

            {/* // 입찰결과보고서 */}
            <BidResultReport key={'rpt_'+data.biNo} title={"입찰결과 보고서"} data={data} reportPop={reportPop} setReportPop={setReportPop} />
            {/* // 입찰결과보고서 */}

            {/* 제출이력 */}
            {submitHistPop &&
            <BidSubmitHistoryPop key={'hist_'+data.biNo} biNo={data.biNo} custCode={histCust.custCode} custName={histCust.custName} userName={histCust.damdangName} submitHistPop={submitHistPop} setSubmitHistPop={setSubmitHistPop}/>
            }
            {/* //제출이력 */}

        </div>
    )
}

export default BidCompleteDetail