import React, { useCallback, useState } from 'react'
import Modal from 'react-bootstrap/Modal';

interface LoginFailPopProps {
    loginFailPop : boolean;
    setLoginFailPop : React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginFailPop: React.FC<LoginFailPopProps> = ({setLoginFailPop, loginFailPop}) => {
    
    // 팝업 닫기
    const fnCloseLoginFailPop = () => {
        setLoginFailPop(false);
    }

    return (
        <Modal className="modalStyle" id="loginAlert" show={loginFailPop} onHide={fnCloseLoginFailPop} keyboard={true}>
            <Modal.Body>
                <a onClick={fnCloseLoginFailPop} className="ModalClose" data-bs-dismiss="modal" title="닫기"><i className="fa-solid fa-xmark"></i></a>
                <div className="alertText1">아이디 또는 비밀번호를 확인해 주십시오.</div>
                <div className="modalFooter">
                    <a onClick={fnCloseLoginFailPop} className="modalBtnClose" data-dismiss="modal" title="닫기">닫기</a>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default LoginFailPop
