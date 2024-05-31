import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2'; // 공통 팝업창


const GroupUserDetailPop = ({srcUserId, CreateUser, groupUserDetailPopOpen, setGroupUserDetailPopOpen, onSearch}) => {
    const [GroupUserDatailData, setGroupUserDatailData] = useState({
        "isCreate"              : CreateUser,
        "userId"                : "",
        "userPwd"               : "",
        "userPwdConfirm"        : "",
        "userName"              : "",
        "interrelatedCustCode"  : "",
        "userAuth"              : "4",
        "userInterrelatedList"  : [],
        "openauth"              : "",
        "bidauth"               : "",
        "userHp"                : "",
        "userTel"               : "",
        "userEmail"             : "",
        "userPosition"          : "",
        "deptName"              : "",
        "useYn"                 : "Y",
    })
    const [CreateUserTest, setCreateUserTest] = useState(true);
    const [InterrelatedCustCodeList, setInterrelatedCustCodeList] = useState({})
    const [UserIdChkYn, setUserIdChkYn] = useState(false);

    // 팝업 호출할때 isCreate 값 세팅
    useEffect(() => {
        setGroupUserDatailData(prevState => ({
            ...prevState,
            isCreate: CreateUser
        }));
        if(srcUserId != null){
            // 사용자 상세 조회
            //onSrcUserDatail();
        }
    }, [CreateUser, groupUserDetailPopOpen]);


    function onTest(){
        setCreateUserTest(!CreateUserTest)
    }

    // 계열사 가져오기
    useEffect(() => {
        const fetchData = async () => {
          try {
            const interrelatedListResponse = await axios.post("/api/v1/couser/interrelatedList", null);
            setInterrelatedCustCodeList(interrelatedListResponse.data.data)
          } catch (error) {
            console.log(error);
          }
        };
    
        fetchData();
      }, []);

    //팝업 닫기
    const onClosePop = useCallback( () => {
        // 입력값 초기화
        setGroupUserDatailData({});
        // 모달 닫기
        setGroupUserDetailPopOpen(false);
    });

    const onSetGroupUserData = (e) => {
        setGroupUserDatailData({
            ...GroupUserDatailData,
            [e.target.name]: e.target.value
        })
        //console.log(GroupUserDatailData);
    }

    // 로그인 ID 변경 시, 아이디 중복체크 false 처리하기위해....
    const onUserIdChange = (e) => {
        onSetGroupUserData(e);
        setUserIdChkYn(false);
    }

    // 로그인ID 중복 확인
    async function idDuplicateCheck(){
        if(!GroupUserDatailData.userId){
            Swal.fire({ type: "warning", text: "로그인ID를 입력해주세요." });
            return false;
        } else {
            const response = await axios.post("/api/v1/cust/idcheck", GroupUserDatailData);
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

    // 비밀번호 변경 팝업
    function fnShowChgPwdPop(){

    }

    // 저장/수정
    async function onSaveGroupUser(){
        if( validate() === false ){
        } else {
            // 저장 api
            const response = await axios.post("/api/v1/couser/userSave", GroupUserDatailData);
            if (response.data.code === 'OK') {
                Swal.fire('', '저장되었습니다.', 'success');
                onClosePop();
                onSearch();
            } else {
                Swal.fire('', '저장 중 오류가 발생했습니다.', 'warning');
            }
        }

    }

    // 벨리데이션
    const validate = () => {
        if (!GroupUserDatailData.userId) {
            Swal.fire('', '로그인ID를 입력해주세요.', 'warning');
            return false;
        }
        if (CreateUser && !UserIdChkYn) {
            Swal.fire('', '로그인ID 중복체크를 진행해주세요.', 'warning');
            return false;
        }
        if (CreateUser && !GroupUserDatailData.userPwd) {
            Swal.fire('', '비밀번호를 입력해주세요.', 'warning');
            return false;
        }
        if (CreateUser && !GroupUserDatailData.userPwdConfirm) {
            Swal.fire('', '비밀번호 확인을 입력해주세요.', 'warning');
            return false;
        }
        if (GroupUserDatailData.userPwdConfirm !== GroupUserDatailData.userPwd) {
            Swal.fire('', '비밀번호와 비밀번호 확인의 값이 일치하지 않습니다.', 'warning');
            return false;
        }
        if (CreateUser && !fnPwdvaildation(GroupUserDatailData.userPwd)) {
            return false;
        }
        if (!GroupUserDatailData.userName) {
            Swal.fire('', '이름을 입력해주세요.', 'warning');
            return false;
        }
        if (!GroupUserDatailData.interrelatedCustCode) {
            Swal.fire('', '소속 계열사를 선택해주세요.', 'warning');
            return false;
        }
        if (!GroupUserDatailData.userAuth) {
            Swal.fire('', '사용권한을 선택해주세요.', 'warning');
            return false;
        }
        if (GroupUserDatailData.userAuth === '4' && GroupUserDatailData.userInterrelatedList.length === 0) {
            Swal.fire('', '감사사용자 권한일 경우 계열사를 1개 이상 선택해주세요.', 'warning');
            return false;
        }
        if (!GroupUserDatailData.userHp) {
            Swal.fire('', '휴대폰을 입력해주세요.', 'warning');
            return false;
        } else {
            const phoneNumberRegex = /^\d{3}-\d{3,4}-\d{4}$/;
            if (!phoneNumberRegex.test(GroupUserDatailData.userHp)) {
                Swal.fire('', '휴대폰번호 형식에 맞게 입력해주세요.', 'warning');
                return false;
            }
        }
        if (!GroupUserDatailData.userTel) {
            Swal.fire('', '유선전화를 입력해주세요.', 'warning');
            return false;
        } else {
            const telNumberRegex = /^\d{2,3}-\d{3,4}-\d{4}$/;
            if (!telNumberRegex.test(GroupUserDatailData.userTel)) {
                Swal.fire('', '유선전화 형식에 맞게 입력해주세요.', 'warning');
                return false;
            }
        }
        if (!GroupUserDatailData.userEmail) {
            Swal.fire('', '이메일을 입력해주세요.', 'warning');
            return false;
        } else {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(GroupUserDatailData.userEmail)) {
                Swal.fire('', '입력한 이메일 형식이 올바르지 않습니다.', 'warning');
                return false;
            }
        }
        return true;
    };

    // 비밀번호 유효성 검사
    const fnPwdvaildation = (password) => {
        const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!pwdRegex.test(password)) {
            Swal.fire({ type: "warning", text: "비밀번호는 최소 8자 이상, 숫자와 특수문자를 포함해야 합니다." });
            return false;
        }
        return true;
    };


    return (
        <Modal className="modalStyle" show={groupUserDetailPopOpen} onHide={onClosePop} >
            <Modal.Body style={{width:"125% !important" }} >
                <Button onClick={onTest}> test용가리 </Button>
                <a onClick={onClosePop} className="ModalClose" data-dismiss="modal" title="닫기"><i className="fa-solid fa-xmark"></i></a>
                <h2 className="modalTitle">사용자 
                    {( CreateUserTest ? ' 등록' : ' 수정' )}
                </h2>
                <div className="flex align-items-center">
                    <div className="formTit flex-shrink0 width120px">로그인ID <span className="star">*</span></div>
                    {
                        CreateUserTest ? 
                        <div  className="flex align-items-center width100">
                            <div className="width100">
                                <input type="text" name="userId" className="inputStyle" placeholder="영문, 숫자 입력(10자 이내) 후 중복확인" maxLength="10" autoComplete="off" onChange={onUserIdChange}/>
                            </div>
                            <a onClick={idDuplicateCheck} className="btnStyle btnSecondary flex-shrink0 ml10" title="중복 확인">중복 확인</a>
                        </div>
                        : 
                        <div className="width100">
                            {GroupUserDatailData.userId}
                        </div>
                    }
                </div>
                {
                    CreateUserTest && 
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width120px">비밀번호</div>
                        <div className="width100">
                            <input type="password" name="userPwd" className="inputStyle" placeholder="대/소문자, 숫자, 특수문자 2 이상 조합(길이 8~16자리)" autoComplete="new-password" onChange={onSetGroupUserData}/>
                        </div>
                    </div>
                }
                {
                    CreateUserTest && 
                    <div  className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width120px">비밀번호 확인</div>
                        <div className="width100">
                            <input type="password" name="userPwdConfirm" className="inputStyle" placeholder="비밀번호와 동일해야 합니다." autoComplete="new-password" onChange={onSetGroupUserData}/>
                        </div>
                    </div>
                }
                <div  className="flex align-items-center mt10">
                    <div className="formTit flex-shrink0 width120px">이름 <span className="star">*</span></div>
                    <div className="width100"><input type="text" name="userName" className="inputStyle" placeholder="" value={GroupUserDatailData.userName} onChange={onSetGroupUserData}/></div>
                </div>
                <div className="flex align-items-center mt10">
                    <div className="formTi7t flex-shrink0 width120px">소속 계열사 <span className="star">*</span></div>
                    {
                        CreateUserTest ?
                        <div className="width100"  >
                            {
                                InterrelatedCustCodeList.length > 0 && (
                                    <select name="interrelatedCustCode" className="selectStyle" onChange={onSetGroupUserData}>
                                        <option value="">선택</option>
                                        {InterrelatedCustCodeList.map((option, index) => (
                                            <option key={index} value={option.interrelatedCustCode}>
                                                {option.interrelatedNm}
                                            </option>
                                        ))}
                                    </select>
                                    )
                            }
                        </div>
                        :
                        <div className="width100">
                            { GroupUserDatailData.interrelatedNm }
                        </div>
                    }
                </div>
                <div className="flex align-items-center mt10">
                    <div className="formTit flex-shrink0 width120px">사용권한 <span className="star">*</span></div>
                    <div className="width100">
                        <select name="userAuth" className="selectStyle" onChange={onSetGroupUserData}>
                            <option value="">선택</option>
                            <option value="1">시스템관리자</option>
                            <option value="2">각사관리자</option>
                            <option value="3">일반사용자</option>
                            <option value="4">감사사용자</option>
                        </select>
                    </div>
                </div>
                {
                    (GroupUserDatailData.userAuth === '4') &&
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width120px">계열사
                            <i className="fas fa-question-circle toolTipSt ml5">
                                <div className="toolTipText" >
                                    <ul className="dList">
                                        <li><div>사용권한을 감사사용자를 선택하면 아래 계열사는 한 개 이상 선택해야 합니다.</div></li>
                                        <li><div>선택된 계열사는 입찰 및 통계 조회 시 선택된 계열사에 한해 조회 됩니다.</div></li>
                                    </ul>
                                </div>
                            </i>
                        </div>
                        <div className="flex align-items-center flex-wrap-wrap width100">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                        {
                                            InterrelatedCustCodeList.length > 0 && (
                                                <div className="input-container">
                                                    {InterrelatedCustCodeList.map((value, index) => (
                                                        <label className="mr20" key={index}>{value.interrelatedNm}
                                                            <input
                                                                type="checkbox"
                                                                name="userInterrelatedList"
                                                                value={value.interrelatedCustCode}
                                                                onChange={onSetGroupUserData}
                                                                />
                                                        </label>
                                                    ))}
                                                </div>
                                            )
                                        }
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
                <div className="flex align-items-center mt20">
                    <div className="formTit flex-shrink0 width120px">개찰권한 <span className="star">*</span></div>
                    <div className="width100">
                        <select name="openauth" className="selectStyle" onChange={onSetGroupUserData}>
                            <option value="">아니오</option>
                            <option value="1">개찰권한</option>
                        </select>
                    </div>
                </div>
                <div className="flex align-items-center mt20">
                    <div className="formTit flex-shrink0 width120px">낙찰권한 <span className="star">*</span></div>
                    <div className="width100">
                        <select name="bidauth" className="selectStyle" onChange={onSetGroupUserData}>
                            <option value="">아니오</option>
                            <option value="1">낙찰권한</option>
                        </select>
                    </div>
                </div>
                {
                    !CreateUserTest && 
                    <div className="flex align-items-center mt10" v-if="!this.CreateUser">
                        <div className="formTit flex-shrink0 width120px">비밀번호 <span className="star">*</span></div>
                        <div className="width100">
                            최종변경일 : { GroupUserDatailData.pwdEditDateStr }
                        </div>
                        <a href="/#" onClick={fnShowChgPwdPop} className="btnStyle btnSecondary flex-shrink0 ml10" title="비밀번호 변경">비밀번호 변경</a>
                    </div>
                }
                
                <div className="flex align-items-center mt10">
                    <div className="formTit flex-shrink0 width120px">휴대폰 ☎  <span className="star">*</span></div>
                    <div className="width100"><input type="text" name="userHp" className="inputStyle" placeholder="숫자만" maxLength="13" onChange={onSetGroupUserData}/></div>
                </div>
                <div className="flex align-items-center mt10">
                    <div className="formTit flex-shrink0 width120px">유선전화 ☎  <span className="star">*</span></div>
                    <div className="width100"><input type="text" name="userTel" className="inputStyle" placeholder="숫자만" maxLength="13" onChange={onSetGroupUserData}/></div>
                </div>
                <div className="flex align-items-center mt10">
                    <div className="formTit flex-shrink0 width120px">이메일 <span className="star">*</span></div>
                    <div className="width100"><input type="text" name="userEmail" className="inputStyle" placeholder="james@iljin.co.kr" onChange={onSetGroupUserData}/></div>
                </div>
                <div className="flex align-items-center mt10">
                    <div className="formTit flex-shrink0 width120px">직급</div>
                    <div className="width100"><input type="text" name="userPosition" className="inputStyle" placeholder="" onChange={onSetGroupUserData}/></div>
                </div>
                <div className="flex align-items-center mt10">
                    <div className="formTit flex-shrink0 width120px">부서</div>
                    <div className="width100"><input type="text" name="deptName" className="inputStyle" placeholder="" onChange={onSetGroupUserData}/></div>
                </div>
                <div className="flex align-items-center mt10">
                    <div className="formTit flex-shrink0 width120px">사용여부 <span className="star">*</span></div>
                    <div className="width100">
                        <select name="useYn" className="selectStyle" onChange={onSetGroupUserData}>
                            <option value="Y">사용</option>
                            <option value="N">미사용</option>
                        </select>
                    </div>
                </div>
                <div className="modalFooter">
                    <a onClick={onClosePop} className="modalBtnClose" title="취소">취소</a>
                    <a onClick={onSaveGroupUser} className="modalBtnCheck" title="저장">저장</a>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default GroupUserDetailPop;