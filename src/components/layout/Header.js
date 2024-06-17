import React  from 'react';
import {useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import LogoutPop from './Logout'
import CheckPwdPop from '../modal/CheckPwd'

//todo: 화면 대충 복붙해서 오류나는 부분 수정만 해서 다시 복붙해서 한줄씩 수정 필요...

const Header = () => {    
    const [profileDrop, setProfileDrop] = useState(false);
    const [logoutPop, setLogoutPop] = useState(false);
    const [checkPwdPop, setCheckPwdPop] = useState(false);
    const [modPop, setModPop] = useState("");
    const navigate = useNavigate();
    const loginInfoString = localStorage.getItem("loginInfo"); 
    const loginInfo = loginInfoString ? JSON.parse(loginInfoString) : null;

    const changeStatus = (flag) => {
        // this.$store.commit('updatePwdOrInfo', word);
        // $('#mody1').modal('show');
       setModPop(flag);
       setCheckPwdPop(true);
    }

    const fnMoveMain = () => {
        navigate("/");
    }

    const logoutConfirm = () => {
        setLogoutPop(true);
    }

    return (
        <div className="header">
            <div className="headerLeft">
                <a href="#" onClick={() => fnMoveMain()}  className="headerLogo" title="메인 페이지로 이동" >
                    <img src="../../images/bitcube_logo.png" className="img-responsive" alt="로고" style={{width: "150px"}}/>
                    <span>e-Bidding System</span>
                </a>
                <p>편하고 빠른 전자입찰시스템</p>
            </div>
            {loginInfo !== null && (
                <div className="headerRight">
                    <div className={(profileDrop ? 'profileDropWrap active' : 'profileDropWrap')}>
                        <a href='#' onClick={() => {setProfileDrop(!profileDrop)}} className="profileDrop"><i className="fa-solid fa-circle-user"> {loginInfo.userName}</i>님<i className="fa-solid fa-sort-down"></i></a>
                        <div className="profileDropMenu">
                            <a href='#' onClick={() => changeStatus('info')} data-toggle="modal" title="개인정보 수정"><i className="fa-light fa-gear"></i>개인정보 수정</a>
                            <a href='#' onClick={() => changeStatus('pwd')} data-toggle="modal" title="비밀번호 변경"><i className="fa-light fa-lock-keyhole"></i>비밀번호 변경</a>
                            <a href='#' onClick={() => {logoutConfirm()}} data-toggle="modal" data-target="#logout" title="로그아웃"><i className="fa-light fa-arrow-right-from-bracket"></i>로그아웃</a>
                        </div>
                    </div>
                </div> 
            )}
            <LogoutPop logoutPop={logoutPop} setLogoutPop={setLogoutPop} />
            <CheckPwdPop checkPwdPop={checkPwdPop} setCheckPwdPop={setCheckPwdPop} modPop={modPop} />
        </div>

    );
};

export default Header;