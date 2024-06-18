import React, { useCallback, useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import NoticeList from 'modules/notice/components/NoticeList';
import PwInitPop from '../components/PwInitPop';

const PartnerMain = () => {
    const loginInfoString = localStorage.getItem("loginInfo"); 
    const loginInfo = loginInfoString ? JSON.parse(loginInfoString) : null;

    const navigate = useNavigate();

    const [noticeList, setNoticeList] = useState({});
    const [bidInfo, setBidInfo] = useState({});
    const [completeInfo, setCompleteInfo] = useState({});
    const [pwInit, setPwInit] = useState(false);

    useEffect(() => {
        selectNotice();//공지사항 조회
        selectPartnerBidCnt();//전자입찰 건수 조회
        selectCompletedBidCnt();//입찰완료 조회
        fnChkPwChangeEncourage();//비밀번호 변경 권장
    },[]);


    const moveBiddingPage = (keyword) => {
        if(keyword == 'awarded' || keyword == 'awardedAll' || keyword == 'unsuccessful'){//입찰완료로 이동
            navigate('/bid/partnerComplete');
        }else{//입찰진행 이동
            navigate('/bid/partnerStatus');
        }

        // if(keyword == 'awarded' || keyword == 'awardedAll' || keyword == 'unsuccessful'){//입찰완료로 이동
        //     this.$router.push({name:"partnerBidComplete" , params: { 'flag': keyword }});
        // }else{//입찰진행으로 이동
        //     this.$router.push({name:"partnerBidStatus" , params: { 'flag': keyword }});
        // }
    }

    const selectNotice = useCallback(async() => {
        try {
            const noticeResponse = await axios.post("/api/v1/notice/noticeList", {size: 7, page: 0});
            setNoticeList(noticeResponse.data.data);
        } catch (error) {
            console.log(error);
        }
    });

    const selectPartnerBidCnt = useCallback(async() => {
        try {
            const response = await axios.post("/api/v1/main/selectPartnerBidCnt", {});
            setBidInfo(response.data.data);
        } catch (error) {
            console.log(error);
        }
    });

    const selectCompletedBidCnt = useCallback(async() => {
        try {
            const response = await axios.post("/api/v1/main/selectCompletedBidCnt", {});
            setCompleteInfo(response.data.data);
        } catch (error) {
            console.log(error);
        }
    });

    const fnChkPwChangeEncourage = () => {
        const params = {
            userId : loginInfo.userId,
            isGroup : false
        }
        axios.post("/api/v1/main/chkPwChangeEncourage", params).then((response) => {
            if (response.data.code == "OK") {
                if(response.data.data){
                    setPwInit(true);
                }
            }
        });
    };


    return (
        <div className="conRight">
            <div className="conHeader" style={{padding: '23px 30px 20px 30px'}}>
                <ul className="conHeaderCate">
                    <li>메인</li>
                </ul>
            </div>
            <div className="contents">
                <div className="mainConLayout" style={{marginTop: '10px'}}>
                    <div className="mcl_left mainConBox">
                        <h2 className="h2Tit">전자입찰</h2>
                        <div className="biddingList" style={{marginTop: '70px'}}>
                            <a onClick={() => moveBiddingPage('noticing')} className="biddingStep1">
                                <div className="biddingListLeft"><i className="fa-light fa-flag"></i>미투찰(재입찰 포함)</div>
                                <div className="biddingListRight"><span>{ bidInfo.noticing }</span>건<i className="fa-light fa-angle-right"></i></div>
                            </a>
                            <a onClick={() => moveBiddingPage('submitted')} className="biddingStep2">
                                <div className="biddingListLeft"><i className="fa-light fa-check-to-slot"></i>투찰한 입찰</div>
                                <div className="biddingListRight"><span>{ bidInfo.submitted }</span>건<i className="fa-light fa-angle-right"></i></div>
                            </a>
                            <a onClick={() => moveBiddingPage('awarded')} className="biddingStep4">
                                <div className="biddingListLeft"><i className="fa-light fa-file-check"></i>낙찰(12개월)</div>
                                <div className="biddingListRight"><span>{ bidInfo.awarded }</span>건<i className="fa-light fa-angle-right"></i></div>
                            </a>
                            <a onClick={() => moveBiddingPage('unsuccessful')} className="biddingStep5">
                                <div className="biddingListLeft"><i className="fa-light fa-puzzle-piece"></i>비선정(12개월)</div>
                                <div className="biddingListRight"><span>{ bidInfo.unsuccessful }</span>건<i className="fa-light fa-angle-right"></i></div>
                            </a>
                        </div>
                    </div>
                    <div className="mcl_right">
                        <div className="mainConBox">
                            <h2 className="h2Tit">입찰완료 (12개월)<a href="/bid/partnerComplete" title="입찰 페이지로 이동" className="mainConBoxMore">더보기<i className="fa-solid fa-circle-plus"></i></a></h2>
                            <div className="biddingCompleted">
                                <a className="bcStep1" title="공고되었던 입찰 페이지로 이동" style={{cursor:'default'}}>
                                    <i className="fa-light fa-file-lines"></i>
                                    <div className="bcTitWrap">
                                        <div className="bcTit">공고되었던 입찰</div>
                                        <div className="bcNum"><span>{ completeInfo.posted }</span>건</div>
                                    </div>
                                </a>
                                <a onClick={() => moveBiddingPage('awardedAll')} className="bcStep2" title="투찰했던 입찰 페이지로 이동">
                                    <i className="fa-light fa-message-check"></i>
                                    <div className="bcTitWrap">
                                        <div className="bcTit">투찰했던 입찰</div>
                                        <div className="bcNum"><span>{ completeInfo.submitted }</span>건</div>
                                    </div>
                                </a>
                                <a onClick={() => moveBiddingPage('awarded')} className="bcStep3" title="낙찰된 입찰 페이지로 이동">
                                    <i className="fa-light fa-clipboard-check"></i>
                                    <div className="bcTitWrap">
                                        <div className="bcTit">낙찰된 입찰</div>
                                        <div className="bcNum"><span>{ completeInfo.awarded }</span>건</div>
                                    </div>
                                </a>
                            </div>
                        </div>
                        <div className="mainConBox" style={{height: '381.41px'}}>
                            <h2 className="h2Tit">공지사항<a href="/notice" title="공지사항 페이지로 이동" className="mainConBoxMore">더보기<i className="fa-solid fa-circle-plus"></i></a></h2>
                            <div className="notiList">
                                { noticeList.content?.map((notice) => <NoticeList key={notice.bno} notice={notice} isMain='true' />) }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <PwInitPop pwInit={pwInit} setPwInit={setPwInit} ></PwInitPop>
        </div>
    );
};
export default PartnerMain;