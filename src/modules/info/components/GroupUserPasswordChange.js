import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2'; // 공통 팝업창


const GroupUserPasswordChange = ({srcUserId, GroupUserPasswordChangeOpen, setGroupUserPasswordChangeOpen}) => {
    const [GroupUserPasswordData, setGroupUserPasswordData] = useState({})
    //팝업 닫기
    const onClosePop = useCallback( () => {
        // 모달 닫기
        setGroupUserPasswordChangeOpen(false);
    });

    const onSetGroupUserPasswordData = (e) => {
        const { name, value } = e.target;

        setGroupUserPasswordData((prevData) => ({
            ...prevData,
            [name]: value,
            userId : srcUserId
        }));
    };

    // 비밀번호 유효성 검사
    const onPwdvaildation = (password) => {
        const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!pwdRegex.test(password)) {
            Swal.fire({ type: "warning", text: "비밀번호는 최소 8자 이상, 숫자와 특수문자를 포함해야 합니다." });
            return false;
        }
        if (GroupUserPasswordData.chgPasswordChk !== GroupUserPasswordData.chgPassword) {
            Swal.fire('', '비밀번호와 비밀번호 확인의 값이 일치하지 않습니다.', 'warning');
            return false;
        }
        return true;
    };

    async function onSaveGroupUserPasswordChange(){
        if( onPwdvaildation(GroupUserPasswordData.chgPassword) === false ){
        } else {
            // 저장 api
            const response = await axios.post("/api/v1/couser/saveChgPwd", GroupUserPasswordData);
            if (response.data.code === 'OK') {
                Swal.fire('', '저장되었습니다.', 'success');
                onClosePop();
            } else {
                Swal.fire('', '저장 중 오류가 발생했습니다.', 'warning');
            }
        }
    }

    return (
        <Modal className="modalStyle" show={GroupUserPasswordChangeOpen} onHide={onClosePop} >
            <Modal.Body>
                <a onClick={onClosePop} className="ModalClose" data-dismiss="modal" title="닫기">
                    <i className="fa-solid fa-xmark"></i>
                </a>
                <h2 className="modalTitle">비밀번호 변경</h2>
                <div className="flex align-items-center">
                    <div className="formTit flex-shrink0 width120px">비밀번호</div>
                    <div className="width100">
                        <input type="password" name="chgPassword" className="inputStyle" placeholder="대/소문자, 숫자, 특수문자중에서 2가지 이상 조합(길이 8~16자리)" autoComplete="new-password" onChange={onSetGroupUserPasswordData}/>
                    </div>
                </div>
                <div className="flex align-items-center mt10">
                    <div className="formTit flex-shrink0 width120px">비밀번호 확인</div>
                    <div className="width100">
                        <input type="password" name="chgPasswordChk" className="inputStyle" placeholder="비밀번호와 동일해야 합니다." autoComplete="new-password" onChange={onSetGroupUserPasswordData}/>
                    </div>
                </div>

                <div className="modalFooter">
                    <a onClick={onClosePop} className="modalBtnClose" title="취소">취소</a>
                    <a onClick={onSaveGroupUserPasswordChange} className="modalBtnCheck" title="저장">저장</a>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default GroupUserPasswordChange;