import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import CmmnInfo from '../components/BidCommonInfo'
import api from '../api/api'
import Ft from '../api/filters';
import BidSaveFailPop from '../components/BidSaveFailPop';

const BidStatusDetail = () => {

    const navigate = useNavigate();

    //조회 결과
    const [data, setData] = useState({});

    //유찰 팝업
    const [bidSaveFailPop, setBidSaveFailPop] = useState(false);

    const fnOpenBidSaveFailPop = () => {
        setBidSaveFailPop(true);
    }

    //세션 로그인 정보
    const loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
    const userId = loginInfo.userId;

    const onSearch = useCallback(async() => {
        let params = {
            biNo : localStorage.getItem('biNo')
        }

        await axios.post('/api/v1/bidstatus/statusDetail', params).then((response) => {
            if(response.data.status != '999'){
                setData(response.data.data);
            }else{
                Swal.fire('', '조회에 실패하였습니다.', 'error');
            }
        });
    });

    const fnOpenBid = () => {
    
    }

    const fnCheck = useCallback(()=> {
        if(!Ft.isEmpty(data.openAtt1Id) && data.openAtt1Sign != 'Y'){
            Swal.fire('', '입회자1의 서명이 필요합니다.', 'warning');
            return false;
        }

        if(!Ft.isEmpty(data.openAtt2Id) && data.openAtt2Sign != 'Y'){
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
                //this.fnOpenCert();
                ===============================================================================
                */

                //비밀번호 입력하지 않고 바로 개찰 처리
                fnOpenBid();

            }
        });
    })

    const fnMovePage = useCallback(()=>{
        navigate('/bid/status');
    })

    useEffect(() => {
        onSearch();
    },[]);

    //상세 및 기타첨부파일 열람 시 알림창
    function fnRejectDetail(cust){
        if(cust.esmtYn == 2){
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
                    <CmmnInfo key={'test'+data.biNo} data={data} attSign="Y" />
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
                                    <td><a onClick={()=>fnRejectDetail(cust)} className={cust.esmtYn == '2' ? 'textUnderline textMainColor' : ''}>{ Ft.ftEsmtYn(cust.esmtYn) }</a></td>
                                    <td>{ cust.submitDate }</td>
                                    <td>{ cust.damdangName }</td>
                                    <td className="end">
                                        { cust.etcPath && <img onClick={()=>fnRejectDetail(cust)} src="/images/icon_etc.svg" className="iconImg" alt="etc" /> }
                                    </td>
                                </tr>
                            ) }
                        </tbody>
                    </table>
                    </div>


                    <div className="text-center mt50">
                        <a className="btnStyle btnOutline" title="목록" onClick={fnMovePage}>목록</a>
                        { (data.ingTag == 'A1' || data.ingTag == 'A3') && (data.bidAuth || data.openAuth || (data.createUser == userId)) &&
                        <a onClick={fnOpenBidSaveFailPop} className="btnStyle btnSecondary" title="유찰">유찰</a>
                        }
                        { ((data.ingTag == 'A1' || data.ingTag == 'A3') && data.openAuth && data.estCloseCheck) && 
                        <a onClick={fnCheck} className="btnStyle btnPrimary" title="개찰">개찰</a>
                        }
                    </div>
                </div>
            </div>
             {/* //contents */}

             {/* 인증서 비밀번호 입력 */}
            <div className="modal fade modalStyle" id="certPwd" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog" style={{width:"100%", maxWidth:"510px"}} >
                    <div className="modal-content">
                        <div className="modal-body">
                            <a className="ModalClose" data-dismiss="modal" title="닫기"><i className="fa-solid fa-xmark"></i></a>
                            <h2 className="modalTitle">공동인증서 비밀번호 입력</h2>
                            <div className="flex align-items-center" style={{marginTop:"30px"}}>
                                <div className="formTit flex-shrink0 width120px">비밀번호</div>
                                <div className="width100">
                                    <input type="password" v-model="certPwd" onKeyUp={(e) => { if(e.key === 'Enter') fnOpenBid()}} className="inputStyle" placeholder="비밀번호를 입력해주세요." />
                                </div>
                            </div>

                            <div className="modalFooter">
                                <a className="modalBtnClose" data-dismiss="modal" title="취소">취소</a>
                                <a onClick={ () => fnOpenBid} className="modalBtnCheck" data-toggle="modal" title="확인">확인</a>
                            </div>
                        </div>				
                    </div>
                </div>
            </div>
            {/* //인증서 비밀번호 입력 */}

             
            {/* 유찰 */}
            <BidSaveFailPop biNo={data.biNo} biName={data.biName} bidSaveFailPop={bidSaveFailPop} setBidSaveFailPop={setBidSaveFailPop} />
            {/* //유찰 */}
        </div>
    )
}

export default BidStatusDetail
