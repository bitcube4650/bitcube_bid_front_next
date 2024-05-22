import React from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios"

//todo: 화면 대충 복붙해서 오류나는 부분 수정만 해서 다시 복붙해서 한줄씩 수정 필요...

function LoginWrap(props) {
    {/* input value 처리 */}
    const [value, setValue] = useState({});
    function onChangeInputValue(e) {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        });
    }

    const navigate = useNavigate();

    async function onLogin() {
        try {
            const response = await axios.post('/login', {
                loginId: value.username,
                loginPw: value.password
            });
            console.log(response);

            if(response.status == 200) {
                sessionStorage.setItem("loginInfo", JSON.stringify(response.data));
                navigate("/main");
            } else {
                alert(response.message);    //todo: modal 표시 처리........
            }
        } catch (error) {
            alert("아이디 또는 비밀번호를 확인해 주십시오.");    //todo: modal 표시 처리........
            console.log(error);
        }
    }

    return (
        <div class="loginWrap">
            <div class="loginLeft">
                <h1><img src={props.logoUrl} class="img-responsive" alt="일진그룹 로고" /></h1>

                <input onChange={onChangeInputValue} autofocus="" autocomplete="name" type="text" name="username" class="loginInputStyle" placeholder="아이디" />
                <input onChange={onChangeInputValue} autocomplete="new-password" type="password" name="password" class="loginInputStyle mt10" placeholder="비밀번호" />

                <div class="loginFindWrap">
                    <input type="checkbox" id="chkID" v-model="rememberMe" class="loginCheckStyle" /><label for="chkID">아이디 저장</label>
                    <ul class="loginFind">
                        <li><a href="#" data-toggle="modal" data-target="#idSearch" title="아이디 찾기">아이디 찾기</a></li>
                        <li><a href="#" data-toggle="modal" data-target="#pwSearch" title="비밀번호 찾기">비밀번호 찾기</a></li>
                    </ul>
                </div>
                <div class="loginBtnWrap">
                    <a onClick={onLogin} class="btnLoginPrimary" title="로그인">로그인</a>
                    <router-link to="/signup"  class="btnLoginOutline mt10" title="회원가입">회원가입</router-link>
                </div>
            </div>
            <div class="loginRight">
                <h2><span>투명</span>합니다.</h2>
                <h2><span>함께</span>합니다.</h2>
                <h2><span>미래</span>를 엽니다.</h2>
                <h3>" CLEAR, UNITED, OPENING THE FUTURE "</h3>
                <div class="loginRight">
                    <h3 style={{fontSize: '30px', color: '#F3B352', fontWeight: 550}}>IT HelpDesk</h3>
                    <h3 style={{marginTop: '5px', fontSize: '30px', fontWeight: 550}}>Tel : 080-707-9100</h3>
                </div>
            </div>
        </div>
    )
}

export default LoginWrap;