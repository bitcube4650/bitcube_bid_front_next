import React from 'react';
import Swal from 'sweetalert2'; // 공통 팝업창

//todo: 화면 대충 복붙해서 오류나는 부분 수정만 해서 다시 복붙해서 한줄씩 수정 필요...

const Header = () => {
    
    function fnTest ( prams){
        Swal.fire({
            title: '정말 확실합니까?',              // 타이틀
            text: "이 작업은 되돌릴 수 없습니다!",  // 내용
            icon: 'warning',                        // success / error / warning / info / question
            confirmButtonColor: '#3085d6',  // 기본옵션
            confirmButtonText: '확인',      // 기본옵션
            showCancelButton: true,         // conrifm 으로 하고싶을떄
            cancelButtonColor: '#d33',      // conrifm 에 나오는 닫기버튼 옵션
            cancelButtonText: '닫기',       // conrifm 에 나오는 닫기버튼 옵션
        });
    };

    return (
        <div className="header">
            <div className="headerLeft">
                <a href="/main" className="headerLogo" title="메인 페이지로 이동" >
                    <img src="../../images/bitcube_logo.png" className="img-responsive" alt="로고" style={{width: "150px"}}/>
                    <span>e-Bidding System</span>
                </a>
                <a href='#!' onClick={() => fnTest()}><p>편하고 빠른 전자입찰시스템</p></a>
            </div>
            <div v-if="this.$store.state.loginInfo !== null && this.$store.state.token !== ''" className="headerRight">
                <div className="profileDropWrap">
                    <a className="profileDrop"><i className="fa-solid fa-circle-user"> 비트큐브</i>님<i className="fa-solid fa-sort-down"></i></a>
                    <div className="profileDropMenu">
                        <a click="changeStatus('info')" data-toggle="modal" title="개인정보 수정"><i className="fa-light fa-gear"></i>개인정보 수정</a>
                        <a click="changeStatus('pwd')" data-toggle="modal" title="비밀번호 변경"><i className="fa-light fa-lock-keyhole"></i>비밀번호 변경</a>
                        <a data-toggle="modal" data-target="#logout" title="로그아웃"><i className="fa-light fa-arrow-right-from-bracket"></i>로그아웃</a>
                    </div>
                </div>
            </div> 
        </div>
    );
};

export default Header;