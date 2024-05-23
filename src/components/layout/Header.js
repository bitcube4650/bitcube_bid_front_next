import React from 'react';

//todo: 화면 대충 복붙해서 오류나는 부분 수정만 해서 다시 복붙해서 한줄씩 수정 필요...

const Header = () => {
    return (
        <div class="header">
            <div class="headerLeft">
                <a href="/main" class="headerLogo" title="메인 페이지로 이동">
                    <img src="../../images/bitcube_logo.png" class="img-responsive" alt="로고" style={{width: "150px"}}/>
                    <span>e-Bidding System</span>
                </a>
                <p>편하고 빠른 전자입찰시스템</p>
            </div>
            <div v-if="this.$store.state.loginInfo !== null && this.$store.state.token !== ''" class="headerRight">
                <div class="profileDropWrap">
                    <a class="profileDrop"><i class="fa-solid fa-circle-user"></i>님<i class="fa-solid fa-sort-down"></i></a>
                    <div class="profileDropMenu">
                        <a click="changeStatus('info')" data-toggle="modal" title="개인정보 수정"><i class="fa-light fa-gear"></i>개인정보 수정</a>
                        <a click="changeStatus('pwd')" data-toggle="modal" title="비밀번호 변경"><i class="fa-light fa-lock-keyhole"></i>비밀번호 변경</a>
                        <a data-toggle="modal" data-target="#logout" title="로그아웃"><i class="fa-light fa-arrow-right-from-bracket"></i>로그아웃</a>
                    </div>
                </div>
            </div> 
        </div>
    );
};

export default Header;