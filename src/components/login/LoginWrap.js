import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import LoginFailPop from "../login/LoginFailPop";
import LoginNotAppPop from "../login/LoginNotAppPop";
import IdSearchPop from "../login/IdSearchPop";
import PwSearchPop from "../login/PwSearchPop";
import Swal from 'sweetalert2';
import axios from "axios"



//todo: 화면 대충 복붙해서 오류나는 부분 수정만 해서 다시 복붙해서 한줄씩 수정 필요...

function LoginWrap(props) {
    const [loginInfo, setLoginInfo] = useState({
        loginId: '',
        loginPw: '',
        token: ''
    });    

    const [rememberMe, setRememberMe] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['rememberUserId', 'loginInfo']);

    // 로그인 실패 팝업
    const [loginFailPop, setLoginFailPop] = useState(false);

    // 로그인 승인 실패 팝업
    const [loginNotAppPop, setLoginNotAppPop] = useState(false);

    // 아이디 찾기 팝업
    const [idSearchPop, setIdSearchPop] = useState(false);

    // 비밀번호 찾기 팝업
    const [pwSearchPop, setPwSearchPop] = useState(false);

    const navigate = useNavigate();

    
    useEffect(() => {
        const userId = cookies.rememberUserId;
        if (userId) {
          setRememberMe(true);
          setLoginInfo({ ...loginInfo, loginId: userId });
        }
    }, [cookies.rememberUserId]);

    const onLogin = async () => {
        const id = loginInfo.loginId.trim();
        if(id === "") {
            Swal.fire('', '아아디를 입력해 주십시오', 'error');
            return;
        }

        if (loginInfo.loginPw === "") {
            Swal.fire('', '비밀번호를 입력해 주십시오', 'error');
            return;
        }

        try {
            const response = await axios.post('/login', loginInfo);
            const loginData = response.data;
            if(response.status === 200) {
                setCookie('loginInfo', JSON.stringify(loginData));
                sessionStorage.setItem("loginInfo", JSON.stringify(response.data));
                if (rememberMe) {
                    setCookie('rememberUserId', loginData.userId);
                } else {
                    removeCookie('rememberUserId');
                }
                axios.defaults.headers['x-auth-token'] = loginData.token;
                navigate("/main");
            }

        } catch (err) {
            // 기존 로그인 로직 interface처리하는부분의 로직이 사라져서 case처리 부분 삭제
            if (err.response.status === 403) {
                setLoginNotAppPop(true);
            } else {
                setLoginFailPop(true);
            }
        }
    };

    const onSignUp = () => {
        navigate("/SignUp");
    };

    const onIdSearch = () => {
        setIdSearchPop(true);
    };

    const onPwSearch = () => {
        setPwSearchPop(true);
    };

    const handleKeyDown = (e) => {
        if(e.key === "Enter") {
            e.preventDefault();
            onLogin();
        }
    }
    
    return (
        <div className="loginWrap" onKeyDown={handleKeyDown}>
            <div className="loginLeft">
                <h1><img src={props.logoUrl} className="img-responsive" alt="일진그룹 로고" /></h1>

                <input
                    type="text"
                    value={loginInfo.loginId}
                    onChange={(e) => setLoginInfo({ ...loginInfo, loginId: e.target.value })}
                    autoComplete="name"
                    name="username"
                    placeholder="아이디"
                    autoFocus
                    className="loginInputStyle"
                />
                <input
                    type="password"
                    value={loginInfo.loginPw}
                    onChange={(e) => setLoginInfo({ ...loginInfo, loginPw: e.target.value })}
                    autoComplete="new-password"
                    name="password"
                    className="loginInputStyle mt10"
                    placeholder="비밀번호"
                />
                <div className="loginFindWrap">
                    <input type="checkbox" id="chkID" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="loginCheckStyle"/>
                    <label htmlFor="chkID">아이디 저장</label>
                    <ul className="loginFind">
                        <li>
                            <a onClick={onIdSearch} title="아이디 찾기">아이디 찾기</a>
                        </li>
                        <li>
                            <a onClick={onPwSearch} title="비밀번호 찾기">비밀번호 찾기</a>
                        </li>
                    </ul>
                </div>
                <div className="loginBtnWrap">
                    <a onClick={onLogin} className="btnLoginPrimary" title="로그인">로그인</a>
                    <a onClick={onSignUp} className="btnLoginOutline mt10" title="회원가입">회원가입</a>
                </div>
            </div>
            <div className="loginRight">
                <h2><span>투명</span>합니다.</h2>
                <h2><span>함께</span>합니다.</h2>
                <h2><span>미래</span>를 엽니다.</h2>
                <h3>" CLEAR, UNITED, OPENING THE FUTURE "</h3>
                <div className="loginRight">
                    <h3 style={{fontSize: '30px', color: '#F3B352', fontWeight: 550}}>IT HelpDesk</h3>
                    <h3 style={{marginTop: '5px', fontSize: '30px', fontWeight: 550}}>Tel : 080-707-9100</h3>
                </div>
            </div>

            {/* 로그인 실패 */}
            <LoginFailPop loginFailPop={loginFailPop} setLoginFailPop={setLoginFailPop} />
            {/* 로그인 실패 */}

            {/* 로그인 인증 실패 */}
            <LoginNotAppPop loginNotAppPop={loginNotAppPop} setLoginNotAppPop={setLoginNotAppPop} />
            {/* 로그인 인증 실패 */}

            {/* 아이디찾기 */}
            <IdSearchPop idSearchPop={idSearchPop} setIdSearchPop={setIdSearchPop} />
            {/* 아이디찾기 */}

            {/* 비밀번호찾기 */}
            <PwSearchPop pwSearchPop={pwSearchPop} setPwSearchPop={setPwSearchPop} />
            {/* 비밀번호찾기 */}
        </div>
    )
}

export default LoginWrap;