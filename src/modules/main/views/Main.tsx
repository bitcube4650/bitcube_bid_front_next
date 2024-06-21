import React, { useCallback, useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import NoticeList from '../../notice/components/NoticeList';
import PwInitPop from '../components/PwInitPop';

interface Notice {
    bno: number;
}

interface NoticeResponse {
    data: {
        content: Notice[];
    };
}

const Main: React.FC = () => {
    const loginInfoString = localStorage.getItem("loginInfo"); 
    const loginInfo = loginInfoString ? JSON.parse(loginInfoString) : null;

    const navigate = useNavigate();

    const [noticeList, setNoticeList] = useState<NoticeResponse['data']>({ content: [] });
    const [bidInfo, setBidInfo] = useState({planning: "", noticing: "", beforeOpening: "", opening: "", completed: "", unsuccessful: ""});
    const [partnerInfo, setPartnerInfo] = useState({request: "", approval: "", deletion: ""});
    const [pwInit, setPwInit] = useState(false);

    useEffect(() => {
        selectNotice();             // 공지사항 조회
        selectBidCnt();             // 전자입찰 건수 조회
        selectPartnerCnt();         // 협력사 업체수 조회
        fnChkPwChangeEncourage();   // 비밀번호 변경 권장
    },[]);
    
    const selectNotice = useCallback(async() => {
        await axios.post("/api/v1/notice/noticeList", {size: 7, page: 0}).then((response) =>{
            if (response.data.code === "OK") {
                setNoticeList(response.data.data);
            } else {
                console.log(response.data.msg);
            }
        })
    }, []);

    const selectBidCnt = useCallback(async() => {
        try {
            const response = await axios.post('/api/v1/main/selectBidCnt', {});
            setBidInfo(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }, []);

    const selectPartnerCnt = useCallback(async() => {
        try {
            const response = await axios.post('/api/v1/main/selectPartnerCnt', {});
            setPartnerInfo(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }, []);

    const fnChkPwChangeEncourage = () => {
        const params = {
            userId : loginInfo.userId,
            isGroup : true
        }
        axios.post("/api/v1/main/chkPwChangeEncourage", params).then((response) => {
            if (response.data.code == "OK") {
                if(response.data.data){
                    setPwInit(true);
                }
            }
        });
    };

    const moveBiddingPage = (keyword:string) => {
        if(keyword == 'planning'){//입찰계획 이동
            navigate('/bid/progress');
        }else if(keyword == 'completed' || keyword == 'unsuccessful'){//입찰완료 이동
            navigate('/bid/complete/'+keyword);
        }else{//입찰진행 이동
            navigate('/bid/status/'+keyword);
        }
    }

    return (
        <div className="conRight">
            <div className="conHeader" style={{padding: '23px 30px 20px 30px'}}>
                <ul className="conHeaderCate">
                    <li>메인</li>
                </ul>
            </div>
            <div className="contents">
                <div className="mainConLayout" style={{marginTop: '10px'}}>
                    <div className="mcl_left mainConBox" style={{height: '700px'}}>
                        <h2 className="h2Tit">전자입찰</h2>
                        <div className="biddingList">
                            <a onClick={() => moveBiddingPage('planning')} className="biddingStep1">
                                <div className="biddingListLeft" style={{height: '70px'}}><i className="fa-light fa-flag"></i>입찰계획</div>{/*공고전 상태*/}
                                <div className="biddingListRight"><span>{ bidInfo.planning }</span>건<i className="fa-light fa-angle-right"></i></div>
                            </a>
                            <a onClick={() => moveBiddingPage('noticing')} className="biddingStep2">
                                <div className="biddingListLeft" style={{height: '70px'}}><i className="fa-light fa-comments"></i>입찰진행(입찰공고)</div>{/*공고는 되었지만 개찰은 안된 상태(재입찰 포함)*/}
                                <div className="biddingListRight"><span>{ bidInfo.noticing }</span>건<i className="fa-light fa-angle-right"></i></div>
                            </a>
                            <a onClick={() => moveBiddingPage('beforeOpening')} className="biddingStep3">
                                <div className="biddingListLeft" style={{height: '70px'}}><i className="fa-light fa-files"></i>입찰진행(개찰대상)</div>{/*공고는 되었는데 공고 기간이 지난 입찰(재입찰 포함)*/}
                                <div className="biddingListRight"><span>{ bidInfo.beforeOpening }</span>건<i className="fa-light fa-angle-right"></i></div>
                            </a>
                            <a onClick={() => moveBiddingPage('opening')} className="biddingStep4">
                                <div className="biddingListLeft" style={{height: '70px'}}><i className="fa-light fa-file-check"></i>입찰진행(개찰)</div>{/*개찰은 되었지만 업체 선정이 안된 상태*/}
                                <div className="biddingListRight"><span>{ bidInfo.opening }</span>건<i className="fa-light fa-angle-right"></i></div>
                            </a>
                            <a onClick={() => moveBiddingPage('completed')} className="biddingStep5">
                                <div className="biddingListLeft" style={{height: '70px'}}><i className="fa-light fa-puzzle-piece"></i>입찰완료 (12개월)</div>{/*업체선정까지 완료된 상태(업체 선정된 시점이 12개월 이내)*/}
                                <div className="biddingListRight"><span>{ bidInfo.completed }</span>건<i className="fa-light fa-angle-right"></i></div>
                            </a>
                            <a onClick={() => moveBiddingPage('unsuccessful')} className="biddingStep5">
                                <div className="biddingListLeft" ><i className="fa-light fa-puzzle-piece"></i>유찰 (12개월)</div>{/*유찰된 시점이 12개월이내*/}
                                <div className="biddingListRight"><span>{ bidInfo.unsuccessful }</span>건<i className="fa-light fa-angle-right"></i></div>
                            </a>
                        </div>
                    </div>
                    <div className="mcl_right">
                        <div className="mainConBox">
                            <h2 className="h2Tit">협력업체<a href="/company/partner/management" title="협력업체 페이지로 이동" className="mainConBoxMore">더보기<i className="fa-solid fa-circle-plus"></i></a></h2>
                            <div className="cooperativ">
                                <a href="/company/partner/approval" title="미승인 업체 페이지로 이동">
                                    <span className="cooperativ_tit">미승인 업체</span>
                                    <span className="cooperativ_num">{ partnerInfo.request }</span>
                                </a>
                                <a href="/company/partner/management" title="승인 업체 (인증서 제출) 페이지로 이동">
                                    <span className="cooperativ_tit">승인 업체</span>
                                    <span className="cooperativ_num">{ partnerInfo.approval }</span>
                                </a>
                                <a href="/company/partner/management?certYn=D" title="삭제 업체 페이지로 이동">
                                    <span className="cooperativ_tit">삭제 업체</span>
                                    <span className="cooperativ_num">{ partnerInfo.deletion }</span>
                                </a>
                            </div>
                        </div>
                        <div className="mainConBox" style={{height: '381.41px'}}>
                            <h2 className="h2Tit">공지사항<a href="/notice" title="공지사항 페이지로 이동" className="mainConBoxMore">더보기<i className="fa-solid fa-circle-plus"></i></a></h2>
                            <div className="notiList">
                                { noticeList.content?.map((notice: Notice) => <NoticeList key={notice.bno} content={notice} isMain={true} />) }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <PwInitPop pwInit={pwInit} setPwInit={setPwInit} ></PwInitPop>
        </div>
    );
};

export default Main;