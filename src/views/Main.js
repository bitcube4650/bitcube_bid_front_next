import React from 'react';
import axios from "axios"

//todo: 로그아웃 시 세션 삭제...sessionStorage.removeItem();
//세션 체크 후 세션 없으면 로그인 화면으로 보내기
//todo: 화면 대충 복붙해서 오류나는 부분 수정만 해서 다시 복붙해서 한줄씩 수정 필요...

const Main = () => {
    const loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
    const bidInfo = {};
    const partnerInfo = {};
    const val = {};

    async function onTest() {
        try {
            const response = await axios.post("/api/v1/bid/progresslist", {
            });
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div class="conRight">
            <div class="conHeader" style={{padding: '23px 30px 20px 30px'}}>
                <ul class="conHeaderCate">
                    <li onClick={onTest}>메인</li>
                </ul>
            </div>
            <div class="contents">
                <div class="mainConLayout" style={{marginTop: '10px'}}>
                    <div class="mcl_left mainConBox" style={{height: '700px'}}>
                        <h2 class="h2Tit">전자입찰</h2>
                        <div class="biddingList">
                            <a click="moveBiddingPage('planning')" class="biddingStep1">
                                <div class="biddingListLeft" style={{height: '70px'}}><i class="fa-light fa-flag"></i>입찰계획</div>{/*공고전 상태*/}
                                <div class="biddingListRight"><span>{ bidInfo.planning }</span>건<i class="fa-light fa-angle-right"></i></div>
                            </a>
                            <a  click="moveBiddingPage('noticing')" class="biddingStep2">
                                <div class="biddingListLeft" style={{height: '70px;'}}><i class="fa-light fa-comments"></i>입찰진행(입찰공고)</div>{/*공고는 되었지만 개찰은 안된 상태(재입찰 포함)*/}
                                <div class="biddingListRight"><span>{ bidInfo.noticing }</span>건<i class="fa-light fa-angle-right"></i></div>
                            </a>
                            <a  click="moveBiddingPage('beforeOpening')" class="biddingStep3">
                                <div class="biddingListLeft" style={{height: '70px'}}><i class="fa-light fa-files"></i>입찰진행(개찰대상)</div>{/*공고는 되었는데 공고 기간이 지난 입찰(재입찰 포함)*/}
                                <div class="biddingListRight"><span>{ bidInfo.beforeOpening }</span>건<i class="fa-light fa-angle-right"></i></div>
                            </a>
                            <a  click="moveBiddingPage('opening')" class="biddingStep4">
                                <div class="biddingListLeft" style={{height: '70px'}}><i class="fa-light fa-file-check"></i>입찰진행(개찰)</div>{/*개찰은 되었지만 업체 선정이 안된 상태*/}
                                <div class="biddingListRight"><span>{ bidInfo.opening }</span>건<i class="fa-light fa-angle-right"></i></div>
                            </a>
                            <a  click="moveBiddingPage('completed')" class="biddingStep5">
                                <div class="biddingListLeft" style={{height: '70px'}}><i class="fa-light fa-puzzle-piece"></i>입찰완료 (12개월)</div>{/*업체선정까지 완료된 상태(업체 선정된 시점이 12개월 이내)*/}
                                <div class="biddingListRight"><span>{ bidInfo.completed }</span>건<i class="fa-light fa-angle-right"></i></div>
                            </a>
                            <a  click="moveBiddingPage('unsuccessful')" class="biddingStep5">
                                <div class="biddingListLeft" ><i class="fa-light fa-puzzle-piece"></i>유찰 (12개월)</div>{/*유찰된 시점이 12개월이내*/}
                                <div class="biddingListRight"><span>{ bidInfo.unsuccessful }</span>건<i class="fa-light fa-angle-right"></i></div>
                            </a>
                        </div>
                    </div>
                    <div class="mcl_right">
                        <div class="mainConBox">
                            <h2 class="h2Tit">협력업체<router-link to="/company/partner/management" title="협력업체 페이지로 이동" class="mainConBoxMore">더보기<i class="fa-solid fa-circle-plus"></i></router-link></h2>
                            <div class="cooperativ">
                                <router-link to="/company/partner/approval" title="미승인 업체 페이지로 이동">
                                    <span class="cooperativ_tit">미승인 업체</span>
                                    <span class="cooperativ_num">{ partnerInfo.request }</span>
                                </router-link>
                                <router-link to="/company/partner/management" title="승인 업체 (인증서 제출) 페이지로 이동">
                                    <span class="cooperativ_tit">승인 업체</span>
                                    <span class="cooperativ_num">{ partnerInfo.approval }</span>
                                </router-link>
                                <router-link to="/company/partner/management?certYn=D" title="삭제 업체 페이지로 이동">
                                    <span class="cooperativ_tit">삭제 업체</span>
                                    <span class="cooperativ_num">{ partnerInfo.deletion }</span>
                                </router-link>
                            </div>
                        </div>
                        <div class="mainConBox" style={{height: '381.41px'}}>
                            <h2 class="h2Tit">공지사항<router-link to="/notice" title="공지사항 페이지로 이동" class="mainConBoxMore">더보기<i class="fa-solid fa-circle-plus"></i></router-link></h2>
                            <div class="notiList">
                                <a v-for="(val, idx) in listPage.content" click="setDetailData(val)" data-toggle="modal" data-target="#notiModal" title="해당 게시글 자세히 보기">
                                    <span class="notiTit"><span v-if="val.bco == 'ALL'">[공통] </span>{ val.btitle }</span>
                                    <span class="notiDate">{ val.bdate }</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*<NoticeDetailPopup dataFromMain="detailData" ref="noticePop" />

            <pwdInit />*/}
        </div>
    );
};

export default Main;