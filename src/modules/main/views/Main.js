import React, { useCallback, useEffect, useState } from 'react';
import axios from "axios";
import NoticeList from 'modules/notice/components/NoticeList';

//todo: 화면 대충 복붙해서 오류나는 부분 수정만 해서 다시 복붙해서 한줄씩 수정 필요...

const Main = () => {
    const bidInfo = {};
    const partnerInfo = {};

    //공지사항 조회 결과
    const [noticeList, setNoticeList] = useState({});

    const onSearch = useCallback(async() => {
        try {
            const noticeResponse = await axios.post("/api/v1/notice/noticeList", {size: 7, page: 0});
            setNoticeList(noticeResponse.data.data);
        } catch (error) {
            console.log(error);
        }
    });

    useEffect(() => {
        onSearch();
    },[]);

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
                            <a click="moveBiddingPage('planning')" className="biddingStep1">
                                <div className="biddingListLeft" style={{height: '70px'}}><i className="fa-light fa-flag"></i>입찰계획</div>{/*공고전 상태*/}
                                <div className="biddingListRight"><span>{ bidInfo.planning }0</span>건<i className="fa-light fa-angle-right"></i></div>
                            </a>
                            <a  click="moveBiddingPage('noticing')" className="biddingStep2">
                                <div className="biddingListLeft" style={{height: '70px'}}><i className="fa-light fa-comments"></i>입찰진행(입찰공고)</div>{/*공고는 되었지만 개찰은 안된 상태(재입찰 포함)*/}
                                <div className="biddingListRight"><span>{ bidInfo.noticing }0</span>건<i className="fa-light fa-angle-right"></i></div>
                            </a>
                            <a  click="moveBiddingPage('beforeOpening')" className="biddingStep3">
                                <div className="biddingListLeft" style={{height: '70px'}}><i className="fa-light fa-files"></i>입찰진행(개찰대상)</div>{/*공고는 되었는데 공고 기간이 지난 입찰(재입찰 포함)*/}
                                <div className="biddingListRight"><span>{ bidInfo.beforeOpening }0</span>건<i className="fa-light fa-angle-right"></i></div>
                            </a>
                            <a  click="moveBiddingPage('opening')" className="biddingStep4">
                                <div className="biddingListLeft" style={{height: '70px'}}><i className="fa-light fa-file-check"></i>입찰진행(개찰)</div>{/*개찰은 되었지만 업체 선정이 안된 상태*/}
                                <div className="biddingListRight"><span>{ bidInfo.opening }0</span>건<i className="fa-light fa-angle-right"></i></div>
                            </a>
                            <a  click="moveBiddingPage('completed')" className="biddingStep5">
                                <div className="biddingListLeft" style={{height: '70px'}}><i className="fa-light fa-puzzle-piece"></i>입찰완료 (12개월)</div>{/*업체선정까지 완료된 상태(업체 선정된 시점이 12개월 이내)*/}
                                <div className="biddingListRight"><span>{ bidInfo.completed }0</span>건<i className="fa-light fa-angle-right"></i></div>
                            </a>
                            <a  click="moveBiddingPage('unsuccessful')" className="biddingStep5">
                                <div className="biddingListLeft" ><i className="fa-light fa-puzzle-piece"></i>유찰 (12개월)</div>{/*유찰된 시점이 12개월이내*/}
                                <div className="biddingListRight"><span>{ bidInfo.unsuccessful }0</span>건<i className="fa-light fa-angle-right"></i></div>
                            </a>
                        </div>
                    </div>
                    <div className="mcl_right">
                        <div className="mainConBox">
                            <h2 className="h2Tit">협력업체<a href="/company/partner/management" title="협력업체 페이지로 이동" className="mainConBoxMore">더보기<i className="fa-solid fa-circle-plus"></i></a></h2>
                            <div className="cooperativ">
                                <a href="/company/partner/approval" title="미승인 업체 페이지로 이동">
                                    <span className="cooperativ_tit">미승인 업체</span>
                                    <span className="cooperativ_num">{ partnerInfo.request }0</span>
                                </a>
                                <a href="/company/partner/management" title="승인 업체 (인증서 제출) 페이지로 이동">
                                    <span className="cooperativ_tit">승인 업체</span>
                                    <span className="cooperativ_num">{ partnerInfo.approval }0</span>
                                </a>
                                <a href="/company/partner/management?certYn=D" title="삭제 업체 페이지로 이동">
                                    <span className="cooperativ_tit">삭제 업체</span>
                                    <span className="cooperativ_num">{ partnerInfo.deletion }0</span>
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
        </div>
    );
};

export default Main;