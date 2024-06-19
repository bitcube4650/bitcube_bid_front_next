import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import LogoutPop from './Logout'
import CheckPwdPop from '../modal/CheckPwd'
import { MapType } from '../../../src/components/types'

//todo: 화면 대충 복붙해서 오류나는 부분 수정만 해서 다시 복붙해서 한줄씩 수정 필요...

const Menu = () => {
    // 현재 경로 /~~~
    const path : string = window.location.pathname;
    const navigate = useNavigate();
    // 선택한 메뉴
    const [targetId, setTargetId] = useState<string>("")
    // 메뉴 선택 여부
    const [menuClickBoolean, setMenuClickBoolean] = useState<boolean>(false)
    // 메뉴에 사용자 이름 클릭 시, 메뉴 보여주는거
    const [profileDrop, setProfileDrop] = useState<boolean>(false)
    // 사용자 입찰 정보
    const [BidInfo, setBidInfo] = useState<MapType>({
        ing : 0,
        completed : 0,
        awarded : 0,
    })
    //세션 로그인 정보
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo") as string) ;
    // 운영사 / 협력사 구분
    const userCustType = loginInfo.custType;
    // 사용자 권한 1, 2, 3, 4
    const userAuth = loginInfo.userAuth;
    // 비밀번호확인 팝업 
    const [checkPwdPop, setCheckPwdPop] = useState<boolean>(false);
    // 수정팝업창
    const [modPop, setModPop] = useState<string>("");
    // 로그아웃팝업창
    const [logoutPop, setLogoutPop] = useState<boolean>(false);
    // 팝업창 
    const changeStatus = (flag : string) => {
       setModPop(flag);
       setCheckPwdPop(true);
    }
    const logoutConfirm = () => {
        setLogoutPop(true);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = ""
                if(userCustType === 'inter'){
                    url = "/api/v1/main/selectBidCnt"
                } else {
                    url = "/api/v1/main/selectPartnerBidCnt"
                }
                const response = await axios.post(url, loginInfo);
                if(response.data.code === 'OK'){
                    setBidInfo(response.data.data) 
                } else {
                    setBidInfo({
                        ing : 0,
                        completed : 0,
                        awarded : 0,
                    })
                }
            } catch (error) {
            console.log(error);
            }
        };
        fetchData();
    }, [])
    

    // 메뉴 클릭시 펼쳐지는거
    const onClickMenu = (e : React.MouseEvent<HTMLAnchorElement>) => {
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

    // 진행중 / 낙찰 로 이동
    const onMoveBiddingPage = (type : string) => {
        if( type === 'completed')
            {//계열사 낙찰이력으로 이동
            navigate('/bid/history?flag='+type)
        } 
        else if( type === 'awarded'){
            //협력사 입찰완료로 이동
            navigate('/bid/partnerComplete?flag='+type)
        } else {
            //입찰진행으로 이동
            if( userCustType === 'inter' ){
                navigate('/bid/status')
            } else {
                navigate('/bid/partnerStatus?flag='+type)
            }
        }
    }
    

    return (
        <div className="conLeftWrap">
            <div className={(profileDrop ? 'profileDropWrap2 active' : 'profileDropWrap2')}>
                <a onClick={() => {setProfileDrop(!profileDrop)}} className="profileDrop2">테스트 님<i className="fa-solid fa-sort-down"></i></a>
                <div  className="profileDropMenu2">
                    <a onClick={() => changeStatus('info')} data-toggle="modal" title="개인정보 수정"><i className="fa-light fa-gear"></i>개인정보 수정</a>
                    <a onClick={() => changeStatus('pwd')}  data-toggle="modal" title="비밀번호 변경"><i className="fa-light fa-lock-keyhole"></i>비밀번호 변경</a>
                    <a onClick={() => {logoutConfirm()}} data-toggle="modal" data-target="#logout" title="로그아웃"><i className="fa-light fa-arrow-right-from-bracket"></i>로그아웃</a>
                </div>
            </div>
            {
                (userCustType === 'inter') &&                
                <div className="myState">
                    <div>진행중<a onClick={()=>onMoveBiddingPage('')} className="myStateNum" title="전자입찰 페이지로 이동"><span>{BidInfo.ing}</span>건</a></div>
                    <div>낙찰 (12개월)<a onClick={()=>onMoveBiddingPage('completed')} className="myStateNum" title="전자입찰 페이지로 이동"><span>{BidInfo.completed}</span>건</a></div>
                </div>
            }
            {
                (userCustType === 'cust') &&                
                <div className="myState">
                    <div>진행중<a onClick={()=>onMoveBiddingPage('')} className="myStateNum" title="전자입찰 페이지로 이동"><span>{BidInfo.ing}</span>건</a></div>
                    <div>낙찰 (12개월)<a onClick={()=>onMoveBiddingPage('awarded')} className="myStateNum" title="전자입찰 페이지로 이동"><span>{BidInfo.awarded}</span>건</a></div>
                </div>
            }
            <ul className="conLeft">
                <li className={(path === '/main'? 'active' : '')}><a href="/main"><span><i className="fa-light fa-desktop"></i></span>메인</a></li>
                <li className={(path === ('/bid/progress') || path === ('/bid/status') || path === ('/bid/partnerStatus') || path === ('/bid/complete') || path === ('/bid/partnerComplete') || path === ('/bid/history')? 'active' : '')}>
                    <a id="ebid" onClick={onClickMenu} ><span><i className="fa-light fa-file-contract"></i></span>전자입찰</a>
                    <div className={(targetId === "ebid" && menuClickBoolean) ? 'depth2Lnb_active' : 'depth2Lnb'} >
                        <ul>
                            <li style={{ display: userCustType === 'inter' ? 'block' : 'none' }} className={(path === ('/bid/progress') ? 'active' : '')}>
                                <a href="/bid/progress">입찰계획</a>
                            </li>
                            <li style={{ display: userCustType === 'inter' ? 'block' : 'none' }} className={(path === ('/bid/status') ? 'active' : '')}>
                                <a href='/bid/status'>입찰진행</a>
                            </li>
                            <li style={{ display: userCustType === 'inter' ? 'none' : 'block' }} className={(path === ('/bid/partnerStatus') ? 'active' : '')}>
                                <a href='/bid/partnerStatus'>입찰진행-협력사</a>
                            </li>
                            
                            <li style={{ display: userCustType === 'inter' ? 'block' : 'none' }} className={(path === ('/bid/complete') ? 'active' : '')}>
                                <a href='/bid/complete'>입찰완료</a>
                                </li>
                            <li style={{ display: userCustType === 'inter' ? 'none' : 'block' }} className={(path === ('/bid/partnerComplete') ? 'active' : '')}>
                                <a href='/bid/partnerComplete'>입찰완료-협력사</a>
                                </li>
                            <li style={{ display: userCustType === 'inter' ? 'block' : 'none' }} className={(path === ('/bid/history') ? 'active' : '')}>
                                <a href='/bid/history'>낙찰이력</a>
                            </li>
                        </ul>
                    </div>
                </li>
                <li className={(path === ('/notice') || path === ('/notice/faq/admin') || path === ('/notice/faq/user')? 'active' : '')}>         
                    <a id="notice" onClick={onClickMenu}><span><i className="fa-light fa-bullhorn"></i></span>공지</a>
                    <div className={(targetId === "notice" && menuClickBoolean) ? 'depth2Lnb_active' : 'depth2Lnb'} >
                        <ul>
                            <li className={(path === '/notice' ? 'active' : '')}><a href="/notice">공지사항</a></li>
                            <li style={{ display: userCustType === 'inter' ? 'block' : 'none' }} className={(path === '/notice/faq/admin' ? 'active' : '')}>
                                <a href='/notice/faq/admin'>FAQ</a>
                            </li>
                            <li style={{ display: userCustType === 'inter' ? 'none' : 'block' }} className={(path === '/notice/faq/user' ? 'active' : '')}>
                                <a href='/notice/faq/user'>FAQ-협력사</a>
                            </li>
                            <li style={{ display: (userCustType === 'inter')  ? 'block' : 'none' }} >
                                <a href="../../installFile/전자입찰_매뉴얼_본사.pdf" download="전자입찰_메뉴얼.pdf">메뉴얼</a>
                            </li>
                            <li style={{ display: (userCustType === 'cust')  ? 'block' : 'none' }} >
                                <a href="../../installFile/전자입찰_매뉴얼_업체.pdf" download="전자입찰_메뉴얼.pdf">메뉴얼</a>
                            </li>
                        </ul>
                    </div>
                </li>
                <li style={{ display: ((userCustType === 'inter' && (userAuth === '1' || userAuth === '2' || userAuth === '4')) || (userCustType === 'cust' && userAuth === '1')) ? 'block' : 'none' }} 
                    className={((path === '/company/partner/approval') || path.indexOf('/company/partner/management') > -1) ? 'active' : ''}>      
                    <a id="company" onClick={onClickMenu}><span><i className="fa-light fa-buildings"></i></span>업체정보</a>
                    <div className={(targetId === "company" && menuClickBoolean) ? 'depth2Lnb_active' : 'depth2Lnb'} >
                        <ul style={{ display: ((userCustType === 'inter' && (userAuth === '1' || userAuth === '2' || userAuth === '4'))) ? 'block' : 'none' }} > 
                            <li className={(path === ('/company/partner/approval') ? 'active' : '')}><a href="/company/partner/approval">업체승인</a></li>
                            <li className={(path === ('/company/partner/management') ? 'active' : '')}><a href="/company/partner/management">업체관리</a></li>
                        </ul>
                        <ul style={{ display: ((userCustType === 'cust' && userAuth === '1')) ? 'block' : 'none' }} > 
                            <li className={(path === (`/company/partner/management/${loginInfo.custCode}`) ? 'active' : '')}><a href={`/company/partner/management/${loginInfo.custCode}`}>자사정보</a></li>
                            <li className={(path === ('/company/partner/user') ? 'active' : '')}><a href="/company/partner/user">사용자관리</a></li>
                        </ul>
                    </div>
                </li>
                <li style={{ display: (userCustType === 'inter' && (userAuth === '1' || userAuth === '4'))  ? 'block' : 'none' }} 
                    className={(path === ('/statistics/performance/company') || path === ('/statistics/performance/detail') || path === ('/statistics/status') || path === ('/statistics/detail')? 'active' : '')}>    
                    <a id="statistics" onClick={onClickMenu}><span><i className="fa-light fa-chart-pie-simple"></i></span>통계</a>
                    <div className={(targetId === "statistics" && menuClickBoolean) ? 'depth2Lnb_active' : 'depth2Lnb'} >
                        <ul>
                            <li className={(path === ('/statistics/performance/company') ? 'active' : '')}><a href="/statistics/performance/company">회사별 입찰실적</a></li>
                            <li className={(path === ('/statistics/performance/detail') ? 'active' : '')}><a href="/statistics/performance/detail">입찰실적 상세내역</a></li>
                            <li className={(path === ('/statistics/status') ? 'active' : '')}><a href="/statistics/status">입찰현황</a></li>
                            <li className={(path === ('/statistics/detail') ? 'active' : '')}><a href="/statistics/detail">입찰 상세내역</a></li>
                        </ul>
                    </div>
                </li>
                <li style={{ display: (userCustType === 'inter' && userAuth === '1')  ? 'block' : 'none' }} className={(path === ('/info/group/user') || path === ('/info/group/item')? 'active' : '')}>     
                    <a id="info" onClick={onClickMenu}><span><i className="fa-light fa-memo-circle-info"></i></span>정보관리</a>
                    <div className={(targetId === "info" && menuClickBoolean) ? 'depth2Lnb_active' : 'depth2Lnb'} >
                        <ul>
                            <li className={(path === ('/info/group/user') ? 'active' : '')}><a href="/info/group/user">사용자관리</a></li>
                            <li className={(path === ('/info/group/item') ? 'active' : '')}><a href="/info/group/item">품목관리</a></li>
                        </ul>
                    </div>
                </li>
            </ul>
            <LogoutPop logoutPop={logoutPop} setLogoutPop={setLogoutPop} />
            <CheckPwdPop checkPwdPop={checkPwdPop} setCheckPwdPop={setCheckPwdPop} modPop={modPop} />
        </div>
    );
};

export default Menu;