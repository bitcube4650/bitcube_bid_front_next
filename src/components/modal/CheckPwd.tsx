import React, { useCallback, useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import axios from 'axios';
import ModPwdPop from './ModPwdPop'
import PersonalInfoInterPop from './PersonalInfoInterPop'
import PersonalInfoCustPop from './PersonalInfoCustPop'
import { MapType } from '../../components/types';
import SrcInput from '../../components/input/SrcInput';

interface CheckPwdPopProps {
    checkPwdPop : boolean;
    setCheckPwdPop : React.Dispatch<React.SetStateAction<boolean>>;
    modPop : string;
}

const CheckPwdPop: React.FC<CheckPwdPopProps> = ({checkPwdPop, setCheckPwdPop, modPop}) => {
    const pwParamInit = {password : ""};
    const [srcData, setSrcData] = useState<MapType>(pwParamInit);
    const [modPwd, setModPwd] = useState(false);
    const [infoInter, setInfoInter] = useState(false);
    const [infoCust, setInfoCust] = useState(false);
    
    let loginInfo = null;
    try {
      const loginInfoString = localStorage.getItem('loginInfo');
      if (loginInfoString) {
        loginInfo = JSON.parse(loginInfoString);
      }
    } catch (error) {
      console.error('Error parsing loginInfo from localStorage:', error);
    }

    useEffect(() => {
        if(checkPwdPop) {
            setSrcData(pwParamInit);
        }
    }, [checkPwdPop]);

    // 팝업 닫기
    const fnCloseCheckPwdPop = useCallback(() => {
        setSrcData(pwParamInit);
        setCheckPwdPop(false);
    }, [])

    const checkPwd = () => {
        axios.post("/api/v1/main/checkPwd", {password : srcData.password}).then((response) => {
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

    return (
        <Modal className="modalStyle" show={checkPwdPop} onHide={fnCloseCheckPwdPop} keyboard={true}>
            <Modal.Body>
                <a onClick={fnCloseCheckPwdPop} className="ModalClose" data-bs-dismiss="modal" title="닫기"><i className="fa-solid fa-xmark"></i></a>
                <h2 className="modalTitle">비밀번호 확인</h2>
                    <div className="flex align-items-center">
                        <div className="formTit flex-shrink0 width100px">비밀번호</div>
                        <div className="width100">
                            <SrcInput name="password" type="password" srcData={ srcData } setSrcData={ setSrcData } onSearch={ checkPwd } />
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
