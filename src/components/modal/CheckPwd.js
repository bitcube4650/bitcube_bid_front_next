import React, { useCallback, useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import axios from 'axios';
import ModPwdPop from './ModPwdPop'
import PersonalInfoInterPop from './PersonalInfoInterPop'
import PersonalInfoCustPop from './PersonalInfoCustPop'

const CheckPwdPop = ({checkPwdPop, setCheckPwdPop, modPop}) => {
    const [pwd, setPwd] = useState("");
    const [modPwd, setModPwd] = useState(false);
    const [infoInter, setInfoInter] = useState(false);
    const [infoCust, setInfoCust] = useState(false);
    const loginInfoString = localStorage.getItem("loginInfo"); 
    const loginInfo = loginInfoString ? JSON.parse(loginInfoString) : null;

    useEffect(() => {
        if(checkPwdPop) {
            setPwd("");
        }
    }, [checkPwdPop]);

    const handleInputChange = (e) => {
        setPwd(e.target.value);
    }

    // 팝업 닫기
    const fnCloseCheckPwdPop = useCallback(() => {
        setCheckPwdPop(false);
    })

    const checkPwd = () => {
        axios.post("/api/v1/main/checkPwd", {password : pwd}).then((response) => {
            const result = response.data;
            if(result) {
                if("info" === modPop) {
                    // 계열사, 협력사에 따라 유저정보 변경처리
                    if("inter" === loginInfo.custType) {
                        // 계열사
                        setInfoInter(true);
                    } else {
                        // 협력사
                        setInfoCust(true);
                    }
                } else if ("pwd" === modPop) {
                    // 비밀번호 변경
                    setModPwd(true);
                } else {
                    Swal.fire('', '잘못된 접근입니다.', 'warning');
                }
            } else {
                Swal.fire('', '비밀번호가 일치하지 않습니다.', 'warning');
            }
        });
    }

    const handleKeyDown = (e) => {
        if(e.key === "Enter") {
            e.preventDefault();
            checkPwd();
        }
    }

    return (
        <Modal className="modalStyle" show={checkPwdPop} onHide={fnCloseCheckPwdPop} keyboard={true}>
            <Modal.Body>
                <a onClick={fnCloseCheckPwdPop} className="ModalClose" data-bs-dismiss="modal" title="닫기"><i className="fa-solid fa-xmark"></i></a>
                <h2 className="modalTitle">비밀번호 확인</h2>
                    <div className="flex align-items-center">
                        <div className="formTit flex-shrink0 width100px">비밀번호</div>
                        <div className="width100">
                            <input name="pwd" type="password" onKeyDown={handleKeyDown} onChange={handleInputChange} value={pwd} className="inputStyle" placeholder="" />
                        </div>
                    </div>
                    <p className="text-center mt20"><i className="fa-light fa-circle-info"></i> 안전을 위해서 비밀번호를 입력해 주십시오</p>

                    <div className="modalFooter">
                        <a onClick={fnCloseCheckPwdPop} className="modalBtnClose" title="닫기">닫기</a>
                        <a onClick={checkPwd} className="modalBtnCheck" title="확인">확인</a>
                    </div>
            </Modal.Body>
            <ModPwdPop modPwd={modPwd} setModPwd={setModPwd} fnCloseCheckPwdPop={fnCloseCheckPwdPop} />
            <PersonalInfoInterPop infoInter={infoInter} setInfoInter={setInfoInter} fnCloseCheckPwdPop={fnCloseCheckPwdPop} />
            <PersonalInfoCustPop infoCust={infoCust} setInfoCust={setInfoCust} fnCloseCheckPwdPop={fnCloseCheckPwdPop} />
        </Modal>
    )
}

export default CheckPwdPop
