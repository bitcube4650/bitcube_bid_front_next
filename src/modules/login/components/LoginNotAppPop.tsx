import React, { useCallback, useState } from 'react'
import Modal from 'react-bootstrap/Modal';

interface LoginNotAppPopProps {
    loginNotAppPop : boolean;
    setLoginNotAppPop : React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginNotAppPop: React.FC<LoginNotAppPopProps> = ({setLoginNotAppPop, loginNotAppPop}) => {
    
    // 팝업 닫기
    const fnCloseLoginNotAppPop = () => {
        setLoginNotAppPop(false);
    }

    return (
        <Modal className="modalStyle" id="loginAlert" show={loginNotAppPop} onHide={fnCloseLoginNotAppPop} keyboard={true}>
            <Modal.Body>
                <a onClick={fnCloseLoginNotAppPop} className="ModalClose" data-bs-dismiss="modal" title="닫기"><i className="fa-solid fa-xmark"></i></a>
                <div className="alertText1">입력하신 아이디와 비밀번호는 일치하나, 아직 본사의 승인이 이루어지지 않았습니다. 본사의 승인 후 본 전자입찰/계약 시스템을 이용하실 수 있습니다. 본사승인 후 다시 로그인 해 주세요.</div>
                <div className="modalFooter">
                    <a onClick={fnCloseLoginNotAppPop} className="modalBtnClose" data-dismiss="modal" title="닫기">닫기</a>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default LoginNotAppPop