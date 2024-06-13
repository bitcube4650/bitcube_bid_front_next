import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import CmmnInfo from '../components/BidCommonInfo'
import Ft from '../api/filters';
import Api from '../api/api';
import BidSaveFailPop from '../components/BidSaveFailPop';
import BidResultReport from '../components/BidResultReport';
import BidSubmitHistoryPop from '../components/BidSubmitHistoryPop';
import BidSuccessPop from '../components/BidSuccessPop';

const BidStatusDetail = () => {

    //마운트 여부
    const isMounted = useRef(true);

    const navigate = useNavigate();

    //조회 결과
    const [data, setData] = useState({});

    //선택된 업체 리스트
    const [custCheck, setCustCheck] = useState([]);
    const onChecked = useCallback((checked, custCode) => {
        if (checked) {
            setCustCheck([...custCheck, custCode]);
        } else {
            setCustCheck(custCheck.filter((el) => el !== custCode));
        }
    },[custCheck]);

    //개찰 후 업체 전체선택
    const onAllChk = useCallback((checked) => {
        if (checked) {
            const checkedListArray = [];
            const list = data.custList;
            list.forEach((cust) => checkedListArray.push(cust.custCode));
            setCustCheck(checkedListArray);
        } else {
            setCustCheck([]);
        }
    },[data.custList])

    //유찰 팝업
    const [bidSaveFailPop, setBidSaveFailPop] = useState(false);

    const onOpenBidSaveFailPop = () => {
        setBidSaveFailPop(true);
    }

    //세션 로그인 정보
    const loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
    const userId = loginInfo.userId;

    //데이터 조회
    const onSearch = async() => {
        let params = {
            biNo : localStorage.getItem('biNo')
        }

        await axios.post('/api/v1/bidstatus/statusDetail', params).then((response) => {
            if(response.data.code === 'OK'){
                setData(response.data.data);
            }else{
                Swal.fire('', '조회에 실패하였습니다.', 'error');
            }
        });
    };

    //개찰 공인인증서 비밀번호
    // const [certPwd, setCertPwd] = useState('');

    //개찰
    const onOpenBid = useCallback( () => {
        /* tradeSign 라이센스 문제로 암호화 복호화 부분 주석처리 하여 비밀번호 입력 불필요
        =====================================================================
        if(cmmn.isEmpty(this.certPwd)){
            this.$swal({
                type: "warning",
                text: "인증서 비밀번호를 입력해주세요.",
            });

            return false;
        }
        =====================================================================
        */
        let params = {
            biNo : data.biNo,
            // certPwd : certPwd
            certPwd : ''
        }

        axios.post("/api/v1/bidstatus/bidOpening", params).then((response) => {
            if (response.data.code !== "OK") {
                Swal.fire('', '개찰 처리중 오류가 발생했습니다.', 'error');
            } else {
                Swal.fire('', '개찰했습니다.', 'success');
                onSearch();
            }
        });
    },[data])

    //개찰 확인
    const onCheck = useCallback(()=> {
        if(!Ft.isEmpty(data.openAtt1Id) && data.openAtt1Sign !== 'Y'){
            Swal.fire('', '입회자1의 서명이 필요합니다.', 'warning');
            return false;
        }

        if(!Ft.isEmpty(data.openAtt2Id) && data.openAtt2Sign !== 'Y'){
            Swal.fire('', '입회자2의 서명이 필요합니다.', 'warning');
            return false;
        }

        Swal.fire({
            title: '',              // 타이틀
            text: "개찰하시겠습니까?",  // 내용
            icon: 'question',                        // success / error / warning / info / question
            confirmButtonColor: '#3085d6',  // 기본옵션
            confirmButtonText: '개찰',      // 기본옵션
            showCancelButton: true,         // conrifm 으로 하고싶을떄
            cancelButtonColor: '#d33',      // conrifm 에 나오는 닫기버튼 옵션
            cancelButtonText: '취소',       // conrifm 에 나오는 닫기버튼 옵션
        }).then((result) => {
            if(result.value){
                
                /*tradeSign 라이센스 문제로 암호화 복호화 부분 주석처리 하여 비밀번호 입력 불필요
                ===============================================================================
                //this.onOpenCert();
                ===============================================================================
                */

                //비밀번호 입력하지 않고 바로 개찰 처리
                onOpenBid();

            }
        });
    }, [data])

    //개찰결과 보고서
    const [reportPop, setReportPop] = useState(false);
    const onOpenReportPop = () => {
        setReportPop(true);
    }

    //재입찰
    const onRebid = useCallback(() =>{
        if(custCheck.length === 0){
            Swal.fire('', '업체를 선택해주세요', 'warning');
            return false;
        }

        Swal.fire({
                title: '',              // 타이틀
                text: "선택한 업체로 재입찰을 진행합니다. 재입찰 하시겠습니까?",  // 내용
                icon: 'question',                        // success / error / warning / info / question
                confirmButtonColor: '#3085d6',  // 기본옵션
                confirmButtonText: '재입찰',      // 기본옵션
                showCancelButton: true,         // conrifm 으로 하고싶을떄
                cancelButtonColor: '#d33',      // conrifm 에 나오는 닫기버튼 옵션
                cancelButtonText: '취소',       // conrifm 에 나오는 닫기버튼 옵션
        }).then((result) => {
            if(result.value){
                localStorage.setItem("reCustCode", custCheck);
                navigate('/bid/rebid');
            }
        });
    }, [custCheck])

    const onEvent = useCallback( (event, cust) => {
        if(data.insMode === '1' && cust.esmtYn === '2'){
            Api.fnCustSpecFileDown(cust.fileNm, cust.filePath)
        }else if(data.insMode === '2' && cust.esmtYn === '2'){
            let detailView = event.target.closest('tr').nextSibling;
            if(detailView.style.display === '' || detailView.style.display === 'none'){
                detailView.style.display = "table-row";
            }else{
                detailView.style.display = 'none'
            }
        }
    }, [data.insMode])

    //낙찰
    const [succPop, setSuccPop] = useState(false);
    const [succCust, setSuccCust] = useState({});
    const onSuccSelect = (cust) =>{
        setSuccCust(cust)
        setSuccPop(true);
    }

    //업체 제출 이력
    const [submitHistPop, setSubmitHistPop] = useState(false);
    const [histCust, setHistCust] = useState({});
    const onShowCustSubmitHist = (cust) =>{
        setHistCust(cust);
        setSubmitHistPop(true);
    };

    //페이지 이동
    const onMovePage = () => {
        navigate('/bid/status');
    }

    useEffect(() => {
        if (isMounted.current) {
            onSearch();
            isMounted.current = false;
        }
    },[]);

    //상세 및 기타첨부파일 열람 시 알림창
    const onRejectDetail = (cust) =>{
        if(cust.esmtYn === '2'){
            Swal.fire('', '개찰 전 견적 내용은 확인할 수 없습니다.', 'warning');
        }
    }

    return (
        <div className="conRight">
             {/* conHeader */}
            <div className="conHeader">
                <ul className="conHeaderCate">
                    <li>전자입찰</li>
                    <li>입찰진행 상세</li>
                </ul>
            </div>
             {/* //conHeader */}
             {/* contents */}
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
                    { ( data.ingTag === 'A1' || data.ingTag === 'A3' ) &&
                    <>
                    <div className="boxSt mt20">
                        <table className="tblSkin1">
                            <colgroup>
                                <col />
                            </colgroup>
                            <thead>
                            <tr>
                                <th>입찰참가업체명</th>
                                <th>견적금액(총액)</th>
                                <th>확인</th>
                                <th>제출일시</th>
                                <th>담당자</th>
                                <th className="end">기타첨부파일</th>
                            </tr>
                            </thead>
                            <tbody>
                                { data.custList?.map((cust) => 
                                    <tr>
                                        <td className="text-left">{ cust.custName }</td>
                                        <td className="text-overflow">{ Ft.ftEsmtAmt(cust) }</td>
                                        <td><a href="#!" onClick={()=>onRejectDetail(cust)} className={cust.esmtYn === '2' ? 'textUnderline textMainColor' : ''}>{ Ft.ftEsmtYn(cust.esmtYn) }</a></td>
                                        <td>{ cust.submitDate }</td>
                                        <td>{ cust.damdangName }</td>
                                        <td className="end">
                                            { cust.etcPath && <img onClick={()=>onRejectDetail(cust)} src="/images/icon_etc.svg" className="iconImg" alt="etc" /> }
                                        </td>
                                    </tr>
                                ) }
                            </tbody>
                        </table>
                    </div>

                    <div className="text-center mt50">
                        <a href="#!" className="btnStyle btnOutline" title="목록" onClick={onMovePage}>목록</a>
                        { (data.ingTag === 'A1' || data.ingTag === 'A3') && (data.bidAuth || data.openAuth || (data.createUser === userId)) &&
                        <a href="#!" onClick={onOpenBidSaveFailPop} className="btnStyle btnSecondary" title="유찰">유찰</a>
                        }
                        { ((data.ingTag === 'A1' || data.ingTag === 'A3') && data.openAuth && (data.estCloseCheck === 1)) && 
                        <a href="#!" onClick={onCheck} className="btnStyle btnPrimary" title="개찰">개찰</a>
                        }
                    </div>
                    </>
                    }
                    { (data.ingTag === 'A2') &&
                    <>
                    <div className="boxSt mt20">
                        <table className="tblSkin1">
                            <colgroup>
                                <col />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>
                                        <input type="checkbox" onChange={(e) => onAllChk(e.target.checked)} 
                                                                checked={custCheck.length === 0 ? false : (custCheck.length === data.custList.length ? true : false)} 
                                                                id="allChk" className="checkStyle checkOnly"/>
                                        <label htmlFor="allChk"></label></th>
                                    <th>입찰참가업체명</th>
                                    <th>견적금액(총액)</th>
                                    <th>견적</th>
                                    <th>제출일시</th>
                                    <th>담당자</th>
                                    <th>기타첨부파일</th>
                                    <th className="end">선정</th>
                                </tr>
                            </thead>
                            <tbody>
                            { data.custList?.map((cust, idx) => 
                                <>
                                <tr>
                                    <td>
                                        <input type="checkbox"  id={idx} 
                                                                onChange={(e) => onChecked(e.target.checked, cust.custCode)} 
                                                                checked={custCheck.includes(cust.custCode) ? true : false} 
                                                                className="checkStyle checkOnly"/>
                                        <label htmlFor={idx}></label>
                                    </td>
                                    <td className="text-left">
                                        <a href="#!" onClick={()=>onShowCustSubmitHist(cust)} className="textUnderline">{ cust.custName }</a>
                                    </td>
                                    <td className="text-overflow">{ Ft.ftEsmtAmt(cust) }</td>
                                    <td>
                                        <a href="#!" onClick={(e)=>onEvent(e, cust)} className={cust.esmtYn === '2' ? 'textUnderline textMainColor ' : ''}>{ Ft.ftEsmtYn(cust.esmtYn) }</a>
                                    </td>
                                    <td>{ cust.submitDate }</td>
                                    <td>{ cust.damdangName }</td>
                                    <td>
                                        {cust.etcPath &&
                                        <img onClick={ () => Api.fnCustSpecFileDown(cust.etcFile, cust.etcPath)} src="/images/icon_etc.svg" className="iconImg" alt="etc"/>
                                        }
                                    </td>
                                    <td>
                                        {(cust.esmtYn === '2' && (data.openAuth || data.bidAuth)) &&
                                        <a href="#!" onClick={()=>onSuccSelect(cust)} className="btnStyle btnSecondary btnSm" title="낙찰">낙찰</a>
                                        }
                                    </td>
                                </tr>
                                <tr className="detailView">
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
                                                { cust.bidSpec?.map((spec) =>
                                                <tr>
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
                    </div>

                    <div className="text-center mt50">
                        <a href="#!" className="btnStyle btnOutline" title="목록" onClick={onMovePage}>목록</a>
                        <a href="#!" className="btnStyle btnOutline" title="개찰결과 보고서" onClick={onOpenReportPop} >개찰결과 보고서</a>
                        { (data.openAuth || data.bidAuth || (data.createUser === userId)) &&
                        <a href="#!" onClick={onOpenBidSaveFailPop} className="btnStyle btnSecondary" title="유찰">유찰</a>
                        }
                        { ((data.createUser === userId) || data.openAuth) &&
                        <a href="#!" onClick={onRebid} className="btnStyle btnOutlineRed" title="선택업체 재입찰">선택업체 재입찰하러 가기</a>
                        }
                    </div>
                    </>
                    }
                </div>
            </div>
             {/* //contents */}

             {/* 인증서 비밀번호 입력 */}
            {/* <div className="modal fade modalStyle" id="certPwd" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog" style={{width:"100%", maxWidth:"510px"}} >
                    <div className="modal-content">
                        <div className="modal-body">
                            <a className="ModalClose" data-dismiss="modal" title="닫기"><i className="fa-solid fa-xmark"></i></a>
                            <h2 className="modalTitle">공동인증서 비밀번호 입력</h2>
                            <div className="flex align-items-center" style={{marginTop:"30px"}}>
                                <div className="formTit flex-shrink0 width120px">비밀번호</div>
                                <div className="width100">
                                    <input type="password" v-model="certPwd" onKeyUp={(e) => { if(e.key === 'Enter') onOpenBid()}} className="inputStyle" placeholder="비밀번호를 입력해주세요." />
                                </div>
                            </div>

                            <div className="modalFooter">
                                <a className="modalBtnClose" data-dismiss="modal" title="취소">취소</a>
                                <a onClick={ () => onOpenBid} className="modalBtnCheck" data-toggle="modal" title="확인">확인</a>
                            </div>
                        </div>				
                    </div>
                </div>
            </div> */}
            {/* //인증서 비밀번호 입력 */}

            {/* 낙찰 */}
            {succPop && 
            <BidSuccessPop biNo={data.biNo} custCode={succCust.custCode} custName={succCust.custName} biName={data.biName} succPop={succPop} setSuccPop={setSuccPop} />
            }
            {/* //낙찰 */}
             
            {/* 유찰 */}
            <BidSaveFailPop key={'fali_'+data.biNo} biNo={data.biNo} biName={data.biName} bidSaveFailPop={bidSaveFailPop} setBidSaveFailPop={setBidSaveFailPop} />
            {/* //유찰 */}
            
            {/* 개찰결과 보고서 */}
            <BidResultReport key={'rpt_'+data.biNo} title={"개찰결과 보고서"} data={data} reportPop={reportPop} setReportPop={setReportPop} />
            {/* //개찰결과 보고서 */}

            {/* 제출이력 */}
            {submitHistPop &&
            <BidSubmitHistoryPop key={'hist_'+data.biNo} biNo={data.biNo} custCode={histCust.custCode} custName={histCust.custName} userName={histCust.damdangName} submitHistPop={submitHistPop} setSubmitHistPop={setSubmitHistPop}/>
            }
            {/* //제출이력 */}
        </div>
    )
}

export default BidStatusDetail
