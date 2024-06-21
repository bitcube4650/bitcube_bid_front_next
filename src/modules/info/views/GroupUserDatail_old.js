import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2'; // 공통 팝업창
import GroupUserPasswordChange from '../components/GroupUserPasswordChange'


const GroupUserDetailPop = ({srcUserId, CreateUser, groupUserDetailPopOpen, setGroupUserDetailPopOpen, onSearch}) => {
    const [GroupUserDetailData, setGroupUserDetailData] = useState({
        "isCreate"              : CreateUser,
        "userId"                : "",
        "userPwd"               : "",
        "userPwdConfirm"        : "",
        "userName"              : "",
        "interrelatedCustCode"  : "",
        "userAuth"              : "",
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
    //소속계열사 리스트
    const [InterrelatedCustCodeList, setInterrelatedCustCodeList] = useState([])
    //사용자중복확인 체크 여부
    const [UserIdChkYn, setUserIdChkYn] = useState(false);
    //감사사용자 > 계열사 체크 리스트
    const [InterrelatedCustCodeCheckedList, setInterrelatedCustCodeCheckedList] = useState([])
    
    const [GroupUserPasswordChangeOpen, setGroupUserPasswordChangeOpen] = useState(false);  // 모달 오픈
    // 사용자등록 모달창 오픈 시 상태값
    const onGroupUserChgPwdPop = useCallback(() => {
        setGroupUserPasswordChangeOpen(true); 
    }, []);
    
    // 값 세팅
    const onSetGroupUserData = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setInterrelatedCustCodeCheckedList((prevCheckedList) => {
                const updatedCheckedList = checked
                    ? [...prevCheckedList, value]
                    : prevCheckedList.filter((code) => code !== value);

                setGroupUserDetailData((prevData) => ({
                    ...prevData,
                    [name]: value,
                    userInterrelatedList: updatedCheckedList,
                }));

                return updatedCheckedList;
            });
        } else {
            setGroupUserDetailData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };
    // 체크한 계열사가 변경됫을때 세팅
    useEffect(() => {
        setGroupUserDetailData((prevData) => ({
            ...prevData,
            isCreate: CreateUser,
            reactYn: true,
            userInterrelatedList : InterrelatedCustCodeCheckedList
        }));
    }, [InterrelatedCustCodeCheckedList]);

    // 사용자 상세 조회
    const onSrcUserDatail = useCallback(async () => {
        if (srcUserId != null) {
            try {
                const srcUserDatailResponse = await axios.post("/api/v1/couser/userDetail", {
                    userId: srcUserId
                });
                setGroupUserDetailData(srcUserDatailResponse.data.data);
                // 감사관리자면 계열사 체크
                if(srcUserDatailResponse.data.data.userAuth === '4'){
                    const userInterrelated = srcUserDatailResponse.data.data.userInterrelated;
                    // checked 상태 설정
                    const checkedList = userInterrelated
                        .filter(item => InterrelatedCustCodeList.some(codeItem => codeItem.interrelatedCustCode === item.interrelatedCustCode))
                        .map(item => item.interrelatedCustCode);
    
                    setInterrelatedCustCodeCheckedList(checkedList);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }, [srcUserId, InterrelatedCustCodeList]);

    // 처음들어왓을때 값세팅 
    useEffect(() => {
        setGroupUserDetailData(prevState => ({
            ...prevState,
            isCreate: CreateUser
        }));
        if (!CreateUser && srcUserId != null) {
            onSrcUserDatail();
        }
    }, [CreateUser, groupUserDetailPopOpen, onSrcUserDatail]);

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
        setGroupUserDetailData({});
        // 모달 닫기
        setGroupUserDetailPopOpen(false);
    });

    // 로그인 ID 변경 시, 아이디 중복체크 false 처리하기위해....
    const onUserIdChange = (e) => {
        onSetGroupUserData(e);
        setUserIdChkYn(false);
    }

    // 로그인ID 중복 확인
    async function idDuplicateCheck(){
        if(!GroupUserDetailData.userId){
            Swal.fire({ type: "warning", text: "로그인ID를 입력해주세요." });
            return false;
        } else {
            const response = await axios.post("/api/v1/cust/idcheck", GroupUserDetailData);
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
        if( onValidate() === false ){
        } else {
            // 저장 api
            const response = await axios.post("/api/v1/couser/userSave", GroupUserDetailData);
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
    const onValidate = () => {
        if (!GroupUserDetailData.userId) {
            Swal.fire('', '로그인ID를 입력해주세요.', 'warning');
            return false;
        }
        if (CreateUser && !UserIdChkYn) {
            Swal.fire('', '로그인ID 중복체크를 진행해주세요.', 'warning');
            return false;
        }
        if (CreateUser && !GroupUserDetailData.userPwd) {
            Swal.fire('', '비밀번호를 입력해주세요.', 'warning');
            return false;
        }
        if (CreateUser && !GroupUserDetailData.userPwdConfirm) {
            Swal.fire('', '비밀번호 확인을 입력해주세요.', 'warning');
            return false;
        }
        if (GroupUserDetailData.userPwdConfirm !== GroupUserDetailData.userPwd) {
            Swal.fire('', '비밀번호와 비밀번호 확인의 값이 일치하지 않습니다.', 'warning');
            return false;
        }
        if (CreateUser && !onPwdvaildation(GroupUserDetailData.userPwd)) {
            return false;
        }
        if (!GroupUserDetailData.userName) {
            Swal.fire('', '이름을 입력해주세요.', 'warning');
            return false;
        }
        if (!GroupUserDetailData.interrelatedCustCode) {
            Swal.fire('', '소속 계열사를 선택해주세요.', 'warning');
            return false;
        }
        if (!GroupUserDetailData.userAuth) {
            Swal.fire('', '사용권한을 선택해주세요.', 'warning');
            return false;
        }
        if (GroupUserDetailData.userAuth === '4' && GroupUserDetailData.userInterrelatedList.length === 0) {
            Swal.fire('', '감사사용자 권한일 경우 계열사를 1개 이상 선택해주세요.', 'warning');
            return false;
        }
        if (!GroupUserDetailData.userHp) {
            Swal.fire('', '휴대폰을 입력해주세요.', 'warning');
            return false;
        } else {
            const phoneNumberRegex = /^\d{3}-\d{3,4}-\d{4}$/;
            if (!phoneNumberRegex.test(GroupUserDetailData.userHp)) {
                Swal.fire('', '휴대폰번호 형식에 맞게 입력해주세요.', 'warning');
                return false;
            }
        }
        if (!GroupUserDetailData.userTel) {
            Swal.fire('', '유선전화를 입력해주세요.', 'warning');
            return false;
        } else {
            const telNumberRegex = /^\d{2,3}-\d{3,4}-\d{4}$/;
            if (!telNumberRegex.test(GroupUserDetailData.userTel)) {
                Swal.fire('', '유선전화 형식에 맞게 입력해주세요.', 'warning');
                return false;
            }
        }
        if (!GroupUserDetailData.userEmail) {
            Swal.fire('', '이메일을 입력해주세요.', 'warning');
            return false;
        } else {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(GroupUserDetailData.userEmail)) {
                Swal.fire('', '입력한 이메일 형식이 올바르지 않습니다.', 'warning');
                return false;
            }
        }
        return true;
    };

    // 비밀번호 유효성 검사
    const onPwdvaildation = (password) => {
        const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!pwdRegex.test(password)) {
            Swal.fire({ type: "warning", text: "비밀번호는 최소 8자 이상, 숫자와 특수문자를 포함해야 합니다." });
            return false;
        }
        return true;
    };


    return (
        <Modal  className={`modalStyle ${groupUserDetailPopOpen ? 'modal-cover' : ''}`} show={groupUserDetailPopOpen} onHide={onClosePop} size='lg'>
            <Modal.Body>
                <a onClick={onClosePop} className="ModalClose" data-dismiss="modal" title="닫기"><i className="fa-solid fa-xmark"></i></a>
                <h2 className="modalTitle">사용자 
                    {( CreateUser? ' 등록' : ' 수정' )}
                </h2>
                <div className="flex align-items-center" style={{height : '50px'}}>
                    <div className="formTit flex-shrink0 width120px">로그인ID <span className="star">*</span></div>
                    {
                        CreateUser? 
                        <div  className="flex align-items-center width100">
                            <div className="width100">
                                <input type="text" name="userId" className="inputStyle" placeholder="영문, 숫자 입력(10자 이내) 후 중복확인" maxLength="10" autoComplete="off" onChange={onUserIdChange}/>
                            </div>
                            <a onClick={idDuplicateCheck} className="btnStyle btnSecondary flex-shrink0 ml10" title="중복 확인">중복 확인</a>
                        </div>
                        : 
                        <div className="width100">
                            {GroupUserDetailData.userId}
                        </div>
                    }
                </div>
                {
                    CreateUser&& 
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width120px">비밀번호</div>
                        <div className="width100">
                            <input type="password" name="userPwd" className="inputStyle" placeholder="대/소문자, 숫자, 특수문자 2 이상 조합(길이 8~16자리)" autoComplete="new-password" onChange={onSetGroupUserData}/>
                        </div>
                    </div>
                }
                {
                    CreateUser&& 
                    <div  className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width120px">비밀번호 확인</div>
                        <div className="width100">
                            <input type="password" name="userPwdConfirm" className="inputStyle" placeholder="비밀번호와 동일해야 합니다." autoComplete="new-password" onChange={onSetGroupUserData}/>
                        </div>
                    </div>
                }
                <div  className="flex align-items-center mt10">
                    <div className="formTit flex-shrink0 width120px">이름 <span className="star">*</span></div>
                    <div className="width100"><input type="text" name="userName" className="inputStyle" placeholder="" value={GroupUserDetailData.userName} onChange={onSetGroupUserData}/></div>
                </div>
                <div className="flex align-items-center mt10" style={{height : '50px'}}>
                    <div className="formTi7t flex-shrink0 width120px">소속 계열사 <span className="star">*</span></div>
                    {
                        CreateUser?
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
                            { GroupUserDetailData.interrelatedNm }
                        </div>
                    }
                </div>
                <div className="flex align-items-center mt10">
                    <div className="formTit flex-shrink0 width120px">사용권한 <span className="star">*</span></div>
                    <div className="width100">
                        <select name="userAuth" className="selectStyle" value={GroupUserDetailData.userAuth} onChange={onSetGroupUserData}>
                            <option value="">선택</option>
                            <option value="1">시스템관리자</option>
                            <option value="2">각사관리자</option>
                            <option value="3">일반사용자</option>
                            <option value="4">감사사용자</option>
                        </select>
                    </div>
                </div>
                {
                    (GroupUserDetailData.userAuth === '4') &&
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
                                                    {InterrelatedCustCodeList.map((value) => (
                                                        <label className="mr20" key={value.interrelatedCustCode}>
                                                            <input
                                                                type="checkbox"
                                                                value={value.interrelatedCustCode}
                                                                checked={InterrelatedCustCodeCheckedList.includes(value.interrelatedCustCode)}
                                                                onChange={onSetGroupUserData}
                                                                />
                                                            {value.interrelatedNm}
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
                    !CreateUser&& 
                    <div className="flex align-items-center mt10" v-if="!this.CreateUser">
                        <div className="formTit flex-shrink0 width120px">비밀번호 <span className="star">*</span></div>
                        <div className="width100">
                            최종변경일 : { GroupUserDetailData.pwdEditDateStr }
                        </div>
                        <a onClick={onGroupUserChgPwdPop} className="btnStyle btnSecondary flex-shrink0 ml10" title="비밀번호 변경">비밀번호 변경</a>
                    </div>
                }
                
                <div className="flex align-items-center mt10">
                    <div className="formTit flex-shrink0 width120px">휴대폰 ☎  <span className="star">*</span></div>
                    <div className="width100"><input type="text" name="userHp" className="inputStyle" value={GroupUserDetailData.userHp} placeholder="숫자만" maxLength="13" onChange={onSetGroupUserData}/></div>
                </div>
                <div className="flex align-items-center mt10">
                    <div className="formTit flex-shrink0 width120px">유선전화 ☎  <span className="star">*</span></div>
                    <div className="width100"><input type="text" name="userTel" className="inputStyle" value={GroupUserDetailData.userTel} placeholder="숫자만" maxLength="13" onChange={onSetGroupUserData}/></div>
                </div>
                <div className="flex align-items-center mt10">
                    <div className="formTit flex-shrink0 width120px">이메일 <span className="star">*</span></div>
                    <div className="width100"><input type="text" name="userEmail" className="inputStyle" value={GroupUserDetailData.userEmail} placeholder="james@iljin.co.kr" onChange={onSetGroupUserData}/></div>
                </div>
                <div className="flex align-items-center mt10">
                    <div className="formTit flex-shrink0 width120px">직급</div>
                    <div className="width100"><input type="text" name="userPosition" className="inputStyle" value={GroupUserDetailData.userPosition} placeholder="" onChange={onSetGroupUserData}/></div>
                </div>
                <div className="flex align-items-center mt10">
                    <div className="formTit flex-shrink0 width120px">부서</div>
                    <div className="width100"><input type="text" name="deptName" className="inputStyle" value={GroupUserDetailData.deptName} placeholder="" onChange={onSetGroupUserData}/></div>
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
            <GroupUserPasswordChange
                srcUserId={srcUserId}
                GroupUserPasswordChangeOpen={GroupUserPasswordChangeOpen}
                setGroupUserPasswordChangeOpen={setGroupUserPasswordChangeOpen}
            />
        </Modal>
    );
};

export default GroupUserDetailPop;