import React from 'react';
import { useState } from "react";

//todo: 화면 대충 복붙해서 오류나는 부분 수정만 해서 다시 복붙해서 한줄씩 수정 필요...

const Menu = () => {
    // 현재 경로 /~~~
    const path = window.location.pathname;
    const [targetId, setTargetId] = useState("")
    const [menuClickBoolean, setMenuClickBoolean] = useState(false)

    // 메뉴 클릭시 펼쳐지는거
    const onClickMenu = (e) => {
        e.preventDefault();
        const clickedId = e.currentTarget.id;
        if (targetId === clickedId) {
            // 같은 메뉴 클릭했을 때 닫히도록하려고
            setMenuClickBoolean(!menuClickBoolean);
        } else {
            // 다른메뉴 선택했을때 무조건 트루로 줘야 열려서
            setTargetId(clickedId);
            setMenuClickBoolean(true);
        }
    };

    return (
        <div className="conLeftWrap">
            <div className="profileDropWrap2">
                <a href="#!" className="profileDrop2">테스트 님<i className="fa-solid fa-sort-down"></i></a>
                <div className="profileDropMenu2">
                    <a href="#!" click="changeStatus('info')" data-toggle="modal" title="개인정보 수정"><i className="fa-light fa-gear"></i>개인정보 수정</a>
                    <a href="#!" click="changeStatus('pwd')" data-toggle="modal" title="비밀번호 변경"><i className="fa-light fa-lock-keyhole"></i>비밀번호 변경</a>
                    <a href="#!" data-toggle="modal" data-target="#logout" title="로그아웃"><i className="fa-light fa-arrow-right-from-bracket"></i>로그아웃</a>
                </div>
            </div>
            <div className="myState">
                <div>진행중<a href="#!" click="moveBiddingPage()" className="myStateNum" title="전자입찰 페이지로 이동"><span>0</span>건</a></div>
                <div>낙찰 (12개월)<a href="#!" click="moveBiddingPage('completed')" className="myStateNum" title="전자입찰 페이지로 이동"><span>0</span>건</a></div>
            </div>
            <ul className="conLeft">
                <li><a href="/main"><span><i className="fa-light fa-desktop"></i></span>메인</a></li>
                <li className={(path === ('/bid/progress' || '/bid/status' || '/bid/partnerStatus' || '/bid/complete' || '/bid/partnerComplete' || '/bid/history')? 'active' : '')}>         
                    <a id="ebid" href="#!" onClick={onClickMenu} ><span><i className="fa-light fa-file-contract"></i></span>전자입찰</a>
                    <div className={(targetId === "ebid" && menuClickBoolean) ? 'depth2Lnb_active' : 'depth2Lnb'} >
                        <ul>
                            <li><a href="/bid/progress">입찰계획</a></li>
                            <li><a click="clickBidStatus">입찰진행</a></li>
                            <li><a click="clickBidComplete">입찰완료</a></li>
                        </ul>
                    </div>
                </li>
                <li className={(path === ('/notice' || '/notice/faq/admin' || '/notice/faq/user')? 'active' : '')}>         
                    <a id="notice" href="#!" onClick={onClickMenu}><span><i className="fa-light fa-bullhorn"></i></span>공지</a>
                    <div className={(targetId === "notice" && menuClickBoolean) ? 'depth2Lnb_active' : 'depth2Lnb'} >
                        <ul>
                            <li className={(path === ('/notice') ? 'active' : '')}><a href="/notice">공지사항</a></li>
                            <li><a click="clickFaq">FAQ</a></li>
                            <li><a href="company == 'cust'? '/installFile/전자입찰_매뉴얼_업체.pdf' : '/installFile/전자입찰_매뉴얼_본사.pdf'" download="전자입찰_메뉴얼.pdf">메뉴얼</a></li>
                        </ul>
                    </div>
                </li>
                <li className={(path === ('/company/partner/approval' || '/company/partner/management')? 'active' : '')}>      
                    <a id="company" href="#!" onClick={onClickMenu}><span><i className="fa-light fa-buildings"></i></span>업체정보</a>
                    <div className={(targetId === "company" && menuClickBoolean) ? 'depth2Lnb_active' : 'depth2Lnb'} >
                        <ul>
                            <li><a href="/company/partner/approval">업체승인</a></li>
                            <li><a href="/company/partner/management">업체관리</a></li>
                        </ul>
                    </div>
                </li>
                <li className={(path === ('/statistics/performance/company' || '/statistics/performance/detail' || 'statistics/status' || 'statistics/detail')? 'active' : '')}>    
                    <a id="statistics" href="#!" onClick={onClickMenu}><span><i className="fa-light fa-chart-pie-simple"></i></span>통계</a>
                    <div className={(targetId === "statistics" && menuClickBoolean) ? 'depth2Lnb_active' : 'depth2Lnb'} >
                        <ul>
                            <li><a href="/statistics/performance/company">회사별 입찰실적</a></li>
                            <li><a href="/statistics/performance/detail">입찰실적 상세내역</a></li>
                            <li><a href="/statistics/status">입찰현황</a></li>
                            <li><a href="/statistics/detail">입찰 상세내역</a></li>
                        </ul>
                    </div>
                </li>
                <li className={(path === ('/info/group/user' || '/info/group/item')? 'active' : '')}>     
                    <a id="info" href="#!" onClick={onClickMenu}><span><i className="fa-light fa-memo-circle-info"></i></span>정보관리</a>
                    <div className={(targetId === "info" && menuClickBoolean) ? 'depth2Lnb_active' : 'depth2Lnb'} >
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