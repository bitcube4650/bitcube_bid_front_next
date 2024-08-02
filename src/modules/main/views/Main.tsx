import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NoticeList from '../../notice/components/NoticeList';
import PwInitPop from '../components/PwInitPop';
import { useRouter } from 'next/router';

interface Notice {
    bno: number;
}

interface NoticeResponse {
    content: Notice[];
}

interface BidInfo {
    planning: string;
    noticing: string;
    beforeOpening: string;
    opening: string;
    completed: string;
    unsuccessful: string;
}

interface PartnerInfo {
    request: string;
    approval: string;
    deletion: string;
}

interface MainProps {
    noticeListData?: NoticeResponse;
    bidInfoData?: BidInfo;
    partnerCntData?: PartnerInfo;
    //pwInitData: boolean;
}

const Main: React.FC<MainProps> = ({noticeListData, bidInfoData, partnerCntData}) => {
    console.log(bidInfoData)
    const router = useRouter();
    const [noticeList, setNoticeList] = useState<NoticeResponse>();
    const [bidInfo, setBidInfo] = useState<BidInfo>();
    const [partnerInfo, setPartnerInfo] = useState<PartnerInfo>();
    const [pwInit, setPwInit] = useState<boolean>(false);

    const loginInfoString = localStorage.getItem("loginInfo"); 
    const loginInfo = loginInfoString ? JSON.parse(loginInfoString) : null;

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

    useEffect(() => {
        setNoticeList(noticeListData);
        setBidInfo(bidInfoData);
        setPartnerInfo(partnerCntData);
    },[noticeListData,bidInfoData,partnerCntData]);
    
    useEffect(() => {
        fnChkPwChangeEncourage()
    }, [])
    

    const moveBiddingPage = (keyword: string) => {
        let params = {
            'keyword' : keyword
        }
        if (keyword === 'planning') {
            router.push('/bid/progress');
        } else if (keyword === 'completed' || keyword === 'unsuccessful') {
            router.push({pathname : '/bid/complete/', query : params}, '/bid/complete/');
        } else {
            router.push({pathname : '/bid/status/', query : params}, '/bid/status/');
        }
    };

    const onMoveNotice = ()=>{
        router.push("/notice" )
    }

    return (
        <div className="conRight">
            <div className="conHeader" style={{ padding: '23px 30px 20px 30px' }}>
                <ul className="conHeaderCate">
                    <li>메인</li>
                </ul>
            </div>
            <div className="contents">
                <div className="mainConLayout" style={{ marginTop: '10px' }}>
                    <div className="mcl_left mainConBox" style={{ height: '700px' }}>
                        <h2 className="h2Tit">전자입찰</h2>
                        <div className="biddingList">
                            <a onClick={() => moveBiddingPage('planning')} className="biddingStep1">
                                <div className="biddingListLeft" style={{height: '70px'}}><i className="fa-light fa-flag"></i>입찰계획</div>{/*공고전 상태*/}
                                <div className="biddingListRight"><span>{ bidInfo ? bidInfo.planning : '0' }</span>건<i className="fa-light fa-angle-right"></i></div>
                            </a>

                            <a onClick={() => moveBiddingPage('noticing')} className="biddingStep2">
                                <div className="biddingListLeft" style={{height: '70px'}}><i className="fa-light fa-comments"></i>입찰진행(입찰공고)</div>{/*공고는 되었지만 개찰은 안된 상태(재입찰 포함)*/}
                                <div className="biddingListRight"><span>{ bidInfo ? bidInfo.noticing : '0'}</span>건<i className="fa-light fa-angle-right"></i></div>
                            </a>
                            <a onClick={() => moveBiddingPage('beforeOpening')} className="biddingStep3">
                                <div className="biddingListLeft" style={{height: '70px'}}><i className="fa-light fa-files"></i>입찰진행(개찰대상)</div>{/*공고는 되었는데 공고 기간이 지난 입찰(재입찰 포함)*/}
                                <div className="biddingListRight"><span>{ bidInfo ? bidInfo.beforeOpening : '0' }</span>건<i className="fa-light fa-angle-right"></i></div>
                            </a>
                            <a onClick={() => moveBiddingPage('opening')} className="biddingStep4">
                                <div className="biddingListLeft" style={{height: '70px'}}><i className="fa-light fa-file-check"></i>입찰진행(개찰)</div>{/*개찰은 되었지만 업체 선정이 안된 상태*/}
                                <div className="biddingListRight"><span>{ bidInfo ? bidInfo.opening : '0' }</span>건<i className="fa-light fa-angle-right"></i></div>
                            </a>
                            <a onClick={() => moveBiddingPage('completed')} className="biddingStep5">
                                <div className="biddingListLeft" style={{height: '70px'}}><i className="fa-light fa-puzzle-piece"></i>입찰완료 (12개월)</div>{/*업체선정까지 완료된 상태(업체 선정된 시점이 12개월 이내)*/}
                                <div className="biddingListRight"><span>{ bidInfo ? bidInfo.completed : '0' }</span>건<i className="fa-light fa-angle-right"></i></div>
                            </a>
                            <a onClick={() => moveBiddingPage('unsuccessful')} className="biddingStep5">
                                <div className="biddingListLeft" ><i className="fa-light fa-puzzle-piece"></i>유찰 (12개월)</div>{/*유찰된 시점이 12개월이내*/}
                                <div className="biddingListRight"><span>{ bidInfo ?bidInfo.unsuccessful : '0' }</span>건<i className="fa-light fa-angle-right"></i></div>
                            </a>


                        </div>
                    </div>
                    <div className="mcl_right">
                        <div className="mainConBox">
                            <h2 className="h2Tit">협력업체<a href="/company/partner/management" title="협력업체 페이지로 이동" className="mainConBoxMore">더보기<i className="fa-solid fa-circle-plus"></i></a></h2>
                            <div className="cooperativ">
                                <a href="/company/partner/approval" title="미승인 업체 페이지로 이동">
                                    <span className="cooperativ_tit">미승인 업체</span>
                                    <span className="cooperativ_num">{ partnerInfo ? partnerInfo.request : '0' }</span>
                                </a>
                                <a href="/company/partner/management" title="승인 업체 (인증서 제출) 페이지로 이동">
                                    <span className="cooperativ_tit">승인 업체</span>
                                    <span className="cooperativ_num">{ partnerInfo ? partnerInfo.approval : '0'}</span>
                                </a>
                                <a href="/company/partner/management?certYn=D" title="삭제 업체 페이지로 이동">
                                    <span className="cooperativ_tit">삭제 업체</span>
                                    <span className="cooperativ_num">{ partnerInfo ? partnerInfo.deletion : '0'}</span>
                                </a>
                            </div>
                        </div>
                        <div className="mainConBox" style={{ height: '381.41px' }}>
                            <h2 className="h2Tit">공지사항<a onClick={()=>{onMoveNotice()}} title="공지사항 페이지로 이동" className="mainConBoxMore">더보기<i className="fa-solid fa-circle-plus"></i></a></h2>
                            <div className="notiList">
                                {noticeList?.content?.map((notice: Notice) => <NoticeList key={notice.bno} content={notice} isMain={true} />)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
             <PwInitPop pwInit={pwInit} setPwInit={setPwInit} /> 
        </div>
    );
};

/*
export const getServerSideProps = async () => {
    const selectNotice = async () => {
        console.log('noticeList')
        try {
            const response = await axios.post('/api/v1/notice/noticeList', { size: 7, page: 0 });
            console.log(response)
            if (response.data.code === 'OK') {
                return response.data.data;
            } else {
                console.log(response.data.msg);
                return { content: [] }; 
            }
        } catch (error) {
            console.error(error);
            return { content: [] }; 
        }
    };

    const selectBidCnt = async () => {
        console.log('selectBidCnt log')
        try {
            const response = await axios.post('/api/v1/main/selectBidCnt', {});
            console.log('selectBidCnt log',response)
            if (response.data.code === 'OK') {
                return response.data.data;
            } else {
                console.log(response.data.msg);
                return {
                    planning: "0",
                    noticing: "0",
                    beforeOpening: "0",
                    opening: "0",
                    completed: "0",
                    unsuccessful: "0",
                };
            }
        } catch (error) {
            console.error(error);
            return {
                planning: "0",
                noticing: "0",
                beforeOpening: "0",
                opening: "0",
                completed: "0",
                unsuccessful: "0",
            };
        }
    };

    const selectPartnerCnt = async () => {
        try {
            const response = await axios.post('/api/v1/main/selectPartnerCnt', {});
            console.log(response)
            if (response.data.code === 'OK') {
                return response.data.data;
            } else {
                console.log(response.data.msg);
                return {
                    request: "0",
                    approval: "0",
                    deletion: "0",
                };
            }
        } catch (error) {
            console.error(error);
            return {
                request: "0",
                approval: "0",
                deletion: "0",
            };
        }
    };


    const noticeListData = await selectNotice();
    const bidInfoData = await selectBidCnt();
    const partnerCntData = await selectPartnerCnt();

    return {
        props: {
            noticeListData,
            bidInfoData,
            partnerCntData,
        },
    };
}
    */
export default Main;