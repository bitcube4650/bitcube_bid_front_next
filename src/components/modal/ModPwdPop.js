import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import axios from 'axios';


const ModPwdPop = ({modPwd, setModPwd, fnCloseCheckPwdPop}) => {
    const initPwd = {
        savePwd: '',
        checkSavePwd: ''
    };
    const [pwd, setPwd] = useState(initPwd); 

    useEffect(() => {
        if(modPwd) {
            setPwd(initPwd);
        }
    }, [modPwd]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPwd((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleKeyDown = (e) => {
        if(e.key === "Enter") {
            e.preventDefault();
            fnSavePwd();
        }
    }

    const fnCloseModPwdPop = () => {
        setModPwd(false);
        fnCloseCheckPwdPop();
    }

    const fnSavePwd = () => {
        if(checkValid()){
            axios.post("/api/v1/main/changePwd", {password : pwd.savePwd}).then((response) => {
                const result = response.data;
                if(result) {
                    Swal.fire('', '비밀번호를 저장하였습니다.', 'info');
                    fnCloseModPwdPop();
                } else {
                    Swal.fire('', '비밀번호가 일치하지 않습니다.', 'warning');
                }
            });
        }
    }

    const checkValid = () => {
        const password = pwd.savePwd;
        const checkSavePwd = pwd.checkSavePwd;
        const hasUpperCase = /[A-Z]/.test(password);//대문자
        const hasLowerCase = /[a-z]/.test(password);//소문자
        const hasDigit = /\d/.test(password);//숫자
        const hasSpecialChar = /[!@#$%^&*()\-_=+{};:,<.>]/.test(password);//특수문자

        var isValidPassword = (hasUpperCase && hasLowerCase && hasDigit) || (hasUpperCase && hasLowerCase && hasSpecialChar) || (hasDigit && hasSpecialChar);
        var isValidLength = password.length >= 8 && password.length <= 16;
        var isSame = password == checkSavePwd 

        if(!isValidPassword){
            Swal.fire('', '비밀번호는 대/소문자, 숫자, 특수문자중에서 2가지 이상 조합되어야 합니다.', 'warning');
            return false;
        }else if(!isValidLength){
            Swal.fire('', '비밀번호는 8자 이상 16자 이하로 작성해주세요.', 'warning');
            return false;
        }else if(!isSame){
            Swal.fire('', '비밀번호 확인이 일치하지 않습니다.', 'warning');
            return false;
        }
        return true;
    }

    return (
        <Modal className="modalStyle" show={modPwd} onHide={fnCloseModPwdPop} keyboard={true}>
            <Modal.Body>
                <a onClick={fnCloseModPwdPop} className="ModalClose" data-bs-dismiss="modal" title="닫기"><i className="fa-solid fa-xmark"></i></a>
                <h2 className="modalTitle">비밀번호 변경</h2>
                <div className="flex align-items-center">
                    <div className="formTit flex-shrink0 width120px">비밀번호</div>
                    <div className="width100">
                    <input name="savePwd" type="password" onKeyDown={handleKeyDown} onChange={handleInputChange} value={pwd.savePwd} className="inputStyle" placeholder="대/소문자, 숫자, 특수문자중에서 2가지 이상 조합(길이 8~16자리)" />
                    </div>
                </div>
                <div className="flex align-items-center mt10">
                    <div className="formTit flex-shrink0 width120px">비밀번호 확인</div>
                    <div className="width100">
                        <input name="checkSavePwd" type="password" onKeyDown={handleKeyDown} onChange={handleInputChange} value={pwd.checkSavePwd} className="inputStyle" placeholder="비밀번호와 동일해야 합니다." />
                    </div>
                </div>
                <div className="modalFooter">
                    <a onClick={fnCloseModPwdPop} className="modalBtnClose" title="닫기">닫기</a>
                    <a onClick={fnSavePwd} className="modalBtnCheck" title="확인">확인</a>
                </div>
            </Modal.Body>
        </Modal>
    )
}


export default ModPwdPop