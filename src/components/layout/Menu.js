import React from 'react';

//todo: 화면 대충 복붙해서 오류나는 부분 수정만 해서 다시 복붙해서 한줄씩 수정 필요...

const Menu = () => {
    // 현재 경로 /~~~
    const path = window.location.pathname;

    // 메뉴 클릭시 펼쳐지는거
    function onClickMenu(){

    }

    return (
        <div className="conLeftWrap">
            <div className="profileDropWrap2">
                <a  className="profileDrop2"> 님<i className="fa-solid fa-sort-down"></i></a>
                <div className="profileDropMenu2">
                    <a click="changeStatus('info')" data-toggle="modal" title="개인정보 수정"><i className="fa-light fa-gear"></i>개인정보 수정</a>
                    <a click="changeStatus('pwd')" data-toggle="modal" title="비밀번호 변경"><i className="fa-light fa-lock-keyhole"></i>비밀번호 변경</a>
                    <a data-toggle="modal" data-target="#logout" title="로그아웃"><i className="fa-light fa-arrow-right-from-bracket"></i>로그아웃</a>
                </div>
            </div>
            <div className="myState">
                <div>진행중<a click="moveBiddingPage()" className="myStateNum" title="전자입찰 페이지로 이동"><span></span>건</a></div>
                <div>낙찰 (12개월)<a  click="moveBiddingPage('completed')" className="myStateNum" title="전자입찰 페이지로 이동"><span></span>건</a></div>
            </div>
            <ul className="conLeft">
                <li><a href="/"><span><i className="fa-light fa-desktop"></i></span>메인</a></li>
                <li className={(path === ('/bid/progress' || '/bid/status' || '/bid/partnerStatus' || '/bid/complete' || '/bid/partnerComplete' || '/bid/history')? 'active' : '')}>         
                    <a onClick={(onClickMenu)}><span><i className="fa-light fa-file-contract"></i></span>전자입찰</a>
                    <div className="depth2Lnb">
                        <ul>
                            <li><a href="/bid/progress">입찰계획</a></li>
                            <li><a click="clickBidStatus">입찰진행</a></li>
                            <li><a click="clickBidComplete">입찰완료</a></li>
                        </ul>
                    </div>
                </li>
                <li className={(path === ('/notice' || '/notice/faq/admin' || '/notice/faq/user')? 'active' : '')}>         
                    <a ><span><i className="fa-light fa-bullhorn"></i></span>공지</a>
                    <div className="depth2Lnb">
                        <ul>
                            <li className={(path === ('/notice') ? 'active' : '')}><a href="/notice">공지사항</a></li>
                            <li><a click="clickFaq">FAQ</a></li>
                            <li><a href="company == 'cust'? '/installFile/전자입찰_매뉴얼_업체.pdf' : '/installFile/전자입찰_매뉴얼_본사.pdf'" download="전자입찰_메뉴얼.pdf">메뉴얼</a></li>
                        </ul>
                    </div>
                </li>
                <li className={(path === ('/company/partner/approval' || '/company/partner/management')? 'active' : '')}>      
                    <a ><span><i className="fa-light fa-buildings"></i></span>업체정보</a>
                    <div className="depth2Lnb">
                        <ul>
                            <li><a href="/company/partner/approval">업체승인</a></li>
                            <li><a href="/company/partner/management">업체관리</a></li>
                        </ul>
                    </div>
                </li>
                <li className={(path === ('/statistics/performance/company' || '/statistics/performance/detail' || 'statistics/status' || 'statistics/detail')? 'active' : '')}>    
                    <a ><span><i className="fa-light fa-chart-pie-simple"></i></span>통계</a>
                    <div className="depth2Lnb">
                        <ul>
                            <li><a href="/statistics/performance/company">회사별 입찰실적</a></li>
                            <li><a href="/statistics/performance/detail">입찰실적 상세내역</a></li>
                            <li><a href="/statistics/status">입찰현황</a></li>
                            <li><a href="/statistics/detail">입찰 상세내역</a></li>
                        </ul>
                    </div>
                </li>
                <li>     
                <a ><span><i className="fa-light fa-memo-circle-info"></i></span>정보관리</a>
                    <div className="depth2Lnb">
                        <ul>
                            <li><a href="/info/group/user">사용자관리</a></li>
                            <li><a href="/info/group/item">품목관리</a></li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default Menu;