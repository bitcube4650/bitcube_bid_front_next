import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Swal from 'sweetalert2';

interface LogoutProps {
    logoutPop : boolean;
    setLogoutPop : React.Dispatch<React.SetStateAction<boolean>>;
}

const Logout: React.FC<LogoutProps> = ({setLogoutPop, logoutPop}) => {
    const [cookies, setCookie, removeCookie] = useCookies(['loginInfo']);

    const navigate = useNavigate();

    const logoutCheck = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        axios.post("/logout", {}).then((response) => {
            const status = response.status;
            if(status == 200) {
                removeCookie('loginInfo');
                localStorage.clear();
                navigate('/');
            } else {
                Swal.fire('', '로그아웃 처리에 실패하였습니다.', 'error');
            }
        });
    }

    return (
        <Modal className="modalStyle" id="loginAlert" show={logoutPop} onHide={() => {setLogoutPop(false)}} keyboard={true}>
            <Modal.Body>
                <a onClick={() => {setLogoutPop(false)}} className="ModalClose" data-bs-dismiss="modal" title="닫기"><i className="fa-solid fa-xmark"></i></a>
                <div className="alertText1">로그아웃 하시겠습니까?</div>
                <div className="modalFooter">
                    <a href="#" onClick={() => {setLogoutPop(false)}} className="modalBtnClose" data-dismiss="modal" title="취소">취소</a>
                    <a href="#" onClick={logoutCheck} className="modalBtnCheck" data-toggle="modal" title="확인">확인</a>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default Logout;
