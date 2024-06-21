import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2'; // 공통 팝업창
import * as CommonUtils from 'components/CommonUtils';
import { MapType } from 'components/types'


interface CustUserDatailProps {
    srcUserId : string;
    CreateUser : boolean;
    CustUserDetailPopOpen: boolean;
    setCustUserDetailPopOpen: (open: boolean) => void;
    onSearch : () => void
}

const CustUserDetailPop : React.FC<CustUserDatailProps> = ({srcUserId, CreateUser, CustUserDetailPopOpen, setCustUserDetailPopOpen, onSearch}) => {
    const [CustUserDetailData, setCustUserDetailData] = useState({
        "isCreate"              : CreateUser,
        "userId"                : "",
        "userPwd"               : "",
        "userPwdConfirm"        : "",
        "userName"              : "",
        "interrelatedCustCode"  : "",
        "userAuth"              : "",
        "openauth"              : "",
        "bidauth"               : "",
        "userHp"                : "",
        "userTel"               : "",
        "userEmail"             : "",
        "userPosition"          : "",
        "userBuseo"             : "",
        "useYn"                 : "Y",
    })
    //사용자중복확인 체크 여부
    const [UserIdChkYn, setUserIdChkYn] = useState(false);
    
    // 값 세팅
    const onSetCustUserData = (e : React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, } = e.target;

        setCustUserDetailData((prevData) => ({
            ...prevData,
            [name]: value,
            isCreate: CreateUser
        }));
    };

    // 사용자 상세 조회
    const onSrcUserDatail = useCallback(async () => {
        if (srcUserId != null) {
            try {
                const srcUserDatailResponse = await axios.post("/api/v1/custuser/" + srcUserId, {
                    userId: srcUserId
                });
                setCustUserDetailData(srcUserDatailResponse.data.data);
            } catch (error) {
                console.log(error);
            }
        }
    }, [srcUserId]);

    // 처음들어왓을때 값세팅 
    useEffect(() => {
        if( CustUserDetailPopOpen ){
            setCustUserDetailData(prevState => ({
                ...prevState,
                isCreate: CreateUser
            }));
            if (!CreateUser && srcUserId != null) {
                onSrcUserDatail();
            }
        }
    }, []);

    //팝업 닫기
    const onClosePop = useCallback( () => {
        // 입력값 초기화
        setCustUserDetailData({
            "isCreate"              : CreateUser,
            "userId"                : "",
            "userPwd"               : "",
            "userPwdConfirm"        : "",
            "userName"              : "",
            "interrelatedCustCode"  : "",
            "userAuth"              : "",
            "openauth"              : "",
            "bidauth"               : "",
            "userHp"                : "",
            "userTel"               : "",
            "userEmail"             : "",
            "userPosition"          : "",
            "userBuseo"             : "",
            "useYn"                 : "Y",
        });
        // 모달 닫기
        setCustUserDetailPopOpen(false);
    }, [setCustUserDetailData, setCustUserDetailPopOpen]);

    // 로그인 ID 변경 시, 아이디 중복체크 false 처리하기위해....
    const onUserIdChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        onSetCustUserData(e);
        setUserIdChkYn(false);
    }

    // 로그인ID 중복 확인
    async function idDuplicateCheck(){
        if(!CustUserDetailData.userId){
            Swal.fire('', '로그인ID를 입력해주세요.', 'warning');
            return false;
        } else {
            const response = await axios.post("/api/v1/cust/idcheck", CustUserDetailData);
            if (response.data.code === 'OK') {
                Swal.fire('', '사용 가능한 로그인ID입니다.', 'success');
                setUserIdChkYn(true);
                return;
            } else {
                Swal.fire('', '사용 불가능한 로그인ID입니다.', 'warning');
                setUserIdChkYn(false);
                return;
            }
        }
    }

    // 저장/수정
    async function onSaveCustUser(){
        if( onValidate() === false ){
        } else {
            // 저장 api
            const response = await axios.post("/api/v1/custuser/save", CustUserDetailData);
            if (response.data.code === 'OK') {
                Swal.fire('', '저장되었습니다.', 'success');
                onClosePop();
                onSearch();
            } else {
                Swal.fire('', '저장 중 오류가 발생했습니다.', 'warning');
            }
        }
    }

    //삭제
    const onDeleteCustUserConfirm =  () => {
        Swal.fire({
            title: '',
            html: "삭제된 사용자는 로그인 하실 수 없습니다.<br/>사용자를 삭제 하시겠습니까?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: '확인',
            cancelButtonColor: '#d33',
            cancelButtonText: '닫기',
            customClass: {
              confirmButton: 'modalBtnCheck',
              cancelButton: 'modalBtnClose'
            }
        }).then((result) => {
            if(result.value){
                onDeleteCustUser();
            }
        });
    }

    async function onDeleteCustUser(){
        // 저장 api
        const response = await axios.post("/api/v1/custuser/del", CustUserDetailData);
        if (response.data.code === 'OK') {
            Swal.fire('', '삭제되었습니다.', 'success');
            onClosePop();
            onSearch();
        } else {
            Swal.fire('', '삭제 중 오류가 발생했습니다.', 'warning');
        }
    }

    // 벨리데이션
    const onValidate = () => {
        if (!CustUserDetailData.userName) {
            Swal.fire('', '이름을 입력해주세요.', 'warning');
            return false;
        }
        if (!CustUserDetailData.userEmail) {
            Swal.fire('', '이메일을 입력해주세요.', 'warning');
            return false;
        } else {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(CustUserDetailData.userEmail)) {
                Swal.fire('', '입력한 이메일 형식이 올바르지 않습니다.', 'warning');
                return false;
            }
        }
        if (!CustUserDetailData.userId) {
            Swal.fire('', '로그인ID를 입력해주세요.', 'warning');
            return false;
        }
        if (CreateUser && !UserIdChkYn) {
            Swal.fire('', '로그인ID 중복체크를 진행해주세요.', 'warning');
            return false;
        }
        if (CreateUser && !CustUserDetailData.userPwd) {
            Swal.fire('', '비밀번호를 입력해주세요.', 'warning');
            return false;
        }
        if (CreateUser && !CustUserDetailData.userPwdConfirm) {
            Swal.fire('', '비밀번호 확인을 입력해주세요.', 'warning');
            return false;
        }
        if (CustUserDetailData.userPwdConfirm !== CustUserDetailData.userPwd) {
            Swal.fire('', '비밀번호와 비밀번호 확인의 값이 일치하지 않습니다.', 'warning');
            return false;
        }
        if (CreateUser && !onPwdvaildation(CustUserDetailData.userPwd)) {
            return false;
        }
        if (!CustUserDetailData.userHp) {
            Swal.fire('', '휴대폰을 입력해주세요.', 'warning');
            return false;
        } else {
            const phoneNumberRegex = /^\d{3}-\d{3,4}-\d{4}$/;
            if (!phoneNumberRegex.test(CommonUtils.onAddDashTel(CustUserDetailData.userHp))) {
                Swal.fire('', '휴대폰번호 형식에 맞게 입력해주세요.', 'warning');
                return false;
            }
        }
        if (!CustUserDetailData.userTel) {
            Swal.fire('', '유선전화를 입력해주세요.', 'warning');
            return false;
        } else {
            const telNumberRegex = /^\d{2,3}-\d{3,4}-\d{4}$/;
            if (!telNumberRegex.test(CommonUtils.onAddDashTel(CustUserDetailData.userTel))) {
                Swal.fire('', '유선전화 형식에 맞게 입력해주세요.', 'warning');
                return false;
            }
        }
        return true;
    };

    // 비밀번호 유효성 검사
    const onPwdvaildation = (password : string) => {
        const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!pwdRegex.test(password)) {
            Swal.fire('', '비밀번호는 최소 8자 이상, 숫자와 특수문자를 포함해야 합니다.', 'warning');
            return false;
        }
        return true;
    };


    return (
        <Modal  className={`modalStyle ${CustUserDetailPopOpen ? 'modal-cover' : ''}`} show={CustUserDetailPopOpen} onHide={onClosePop} size='lg'>
            <Modal.Body>
                <a onClick={onClosePop} className="ModalClose" data-dismiss="modal" title="닫기"><i className="fa-solid fa-xmark"></i></a>
                <h2 className="modalTitle">사용자 
                    {( CreateUser? ' 등록' : ' 수정' )}
                </h2>
                <div  className="flex align-items-center mt10">
                    <div className="formTit flex-shrink0 width120px">이름 <span className="star">*</span></div>
                    <div className="width100"><input type="text" name="userName" className="inputStyle" placeholder="" value={CustUserDetailData.userName} onChange={onSetCustUserData}/></div>
                </div>
                <div className="flex align-items-center mt10">
                    <div className="formTit flex-shrink0 width120px">이메일 <span className="star">*</span></div>
                    <div className="width100"><input type="text" name="userEmail" className="inputStyle" value={CustUserDetailData.userEmail} placeholder="james@iljin.co.kr" onChange={onSetCustUserData}/></div>
                </div>
                <div className="flex align-items-center mt10" style={{height : '50px'}}>
                    <div className="formTit flex-shrink0 width120px">로그인ID <span className="star">*</span></div>
                    {
                        CreateUser? 
                        <div  className="flex align-items-center width100">
                            <div className="width100">
                                <input type="text" name="userId" className="inputStyle" placeholder="영문, 숫자 입력(10자 이내) 후 중복확인" maxLength={10} autoComplete="off" onChange={onUserIdChange}/>
                            </div>
                            <Button onClick={idDuplicateCheck} className="btnStyle btnSecondary flex-shrink0 ml10" title="중복 확인">중복 확인</Button>
                        </div>
                        : 
                        <div className="width100">
                            {CustUserDetailData.userId}
                        </div>
                    }
                </div>
                <div className="flex align-items-center mt10">
                    <div className="formTit flex-shrink0 width120px">비밀번호</div>
                    <div className="width100">
                        <input type="password" name="userPwd" className="inputStyle" placeholder="대/소문자, 숫자, 특수문자 2 이상 조합(길이 8~16자리)" autoComplete="new-password" onChange={onSetCustUserData}/>
                    </div>
                </div>
                <div  className="flex align-items-center mt10">
                    <div className="formTit flex-shrink0 width120px">비밀번호 확인</div>
                    <div className="width100">
                        <input type="password" name="userPwdConfirm" className="inputStyle" placeholder="비밀번호와 동일해야 합니다." autoComplete="new-password" onChange={onSetCustUserData}/>
                    </div>
                </div>
                <div className="flex align-items-center mt10">
                    <div className="formTit flex-shrink0 width120px">휴대폰 ☎  <span className="star">*</span></div>
                    <div className="width100"><input type="text" name="userHp" className="inputStyle" value={CommonUtils.onAddDashTel(CustUserDetailData.userHp)} placeholder="숫자만" maxLength={13} onChange={onSetCustUserData}/></div>
                </div>
                <div className="flex align-items-center mt10">
                    <div className="formTit flex-shrink0 width120px">유선전화 ☎  <span className="star">*</span></div>
                    <div className="width100"><input type="text" name="userTel" className="inputStyle" value={CommonUtils.onAddDashTel(CustUserDetailData.userTel)} placeholder="숫자만" maxLength={13} onChange={onSetCustUserData}/></div>
                </div>
                <div className="flex align-items-center mt10">
                    <div className="formTit flex-shrink0 width120px">직급</div>
                    <div className="width100"><input type="text" name="userPosition" className="inputStyle" value={CustUserDetailData.userPosition} placeholder="" onChange={onSetCustUserData}/></div>
                </div>
                <div className="flex align-items-center mt10">
                    <div className="formTit flex-shrink0 width120px">부서</div>
                    <div className="width100"><input type="text" name="userBuseo" className="inputStyle" value={CustUserDetailData.userBuseo} placeholder="" onChange={onSetCustUserData}/></div>
                </div>
                <div className="modalFooter">
                    <Button onClick={onClosePop} className="modalBtnClose" title="취소">취소</Button>
                    <Button onClick={onDeleteCustUserConfirm} className="btnStyle btnOutlineRed" title="삭제">삭제</Button>
                    <Button onClick={onSaveCustUser} className="modalBtnCheck" title="저장">저장</Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default CustUserDetailPop;