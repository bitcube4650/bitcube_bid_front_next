import React, { useState, useEffect, ChangeEvent } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import { MapType } from '../../../components/types';
import * as CommonUtils from '../../../components/CommonUtils';
import SrcInput from '../../../components/input/SrcInput';

interface PwSearchPopProps {
    pwSearchPop : boolean;
    setPwSearchPop : React.Dispatch<React.SetStateAction<boolean>>;
}

const PwSearchPop: React.FC<PwSearchPopProps> = ({pwSearchPop, setPwSearchPop}) => {
    const initPwSearch = {regnum1 : '', regnum2 : '', regnum3 : '', userName : '', userId : '', userEmail : ''};
    const [srcData, setSrcData] = useState<MapType>(initPwSearch);
    const [showAlert, setShowAlert] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if(pwSearchPop) {
            setSrcData(initPwSearch);
        }
    }, [pwSearchPop]);

    const validate = () => {
        if (!srcData.regnum1 || !srcData.regnum2 || !srcData.regnum3 || !srcData.userName || !srcData.userId || !srcData.userEmail) {
          setShowAlert(true);
        } else {
          setShowConfirm(true);
        }
    };

    const send = () => {
        const params = srcData;
        axios.post("/login/pwSearch", params).then((response) => {
            const result = response.data;
            if (result.status === 200) {
                if(result.code == "OK") {
                    Swal.fire('', '전송되었습니다.', 'success');
                    setShowConfirm(false);
                    setPwSearchPop(false);
                } else {
                    Swal.fire('', '입력한 정보가 등록된 정보와 상이합니다. 다시 입력해 주십시오.', 'warning');
                    setShowConfirm(false);
                }
            } else {
                Swal.fire('', '비밀번호 찾기 중 오류가 발생하였습니다.', 'error');
                setShowConfirm(false);
            }
        });
    };

    return (
        <div>
            <Modal show={pwSearchPop} onHide={() => {setPwSearchPop(false)}} className="modalStyle" size="lg">
                <Modal.Body>
                    <a onClick={() => {setPwSearchPop(false)}} className="ModalClose" data-bs-dismiss="modal" title="닫기"><i className="fa-solid fa-xmark"></i></a>
                    <h2 className="modalTitle">비밀번호 찾기</h2>
                    <div className="modalTopBox">
                        <ul>
                        <li><div>아래 사업자등록번호, 찾고자 하는 로그인 사용자명, 로그인 아이디 그리고 등록된 이메일을 정확히 입력하셔야 이메일 및 문자로 비밀번호를 발송합니다.</div></li>
                        <li><div>비밀번호는 초기화되어 발송 하므로 로그인 후 암호를 변경하시고 사용하십시오.</div></li>
                        <li><div>[비밀번호 찾기]는 전자입찰 협력사 사용자만 해당 됩니다. 계열사 사용자는 시스템 관리자에게 문의해 주십시오.</div></li>
                        </ul>
                    </div>
                    <div className="flex align-items-center mt30">
                        <div className="formTit flex-shrink0 width150px">사업자등록번호 <span className="star">*</span></div>
                        <div className="flex align-items-center width100">
                            <SrcInput name="regnum1" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate } maxLength={3} value={ CommonUtils.onNumber(srcData.regnum1) || ''} />
                            <span style={{ margin: '0 10px' }}>-</span>
                            <SrcInput name="regnum2" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate } maxLength={2} value={ CommonUtils.onNumber(srcData.regnum2) || ''} />
                            <span style={{ margin: '0 10px' }}>-</span>
                            <SrcInput name="regnum3" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate } maxLength={5} value={ CommonUtils.onNumber(srcData.regnum3) || ''} />
                        </div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width150px">로그인 사용자명 <span className="star">*</span></div>
                        <div className="flex align-items-center width100">
                            <SrcInput name="userName" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate } />
                        </div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width150px">로그인 아이디 <span className="star">*</span></div>
                        <div className="flex align-items-center width100">
                            <SrcInput name="userId" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate } />
                        </div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width150px">등록된 이메일 <span className="star">*</span></div>
                        <div className="flex align-items-center width100">
                            <SrcInput name="userEmail" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate } />
                        </div>
                    </div>
                    <div className="modalFooter">
                        <Button variant="secondary" onClick={() => {setPwSearchPop(false)}} style={{ marginRight: '10px'}}>닫기</Button>
                        <Button variant="primary" onClick={validate}>비밀번호 이메일 발송</Button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* 비밀번호 이메일 발송 얼럿 */}
            <Modal show={showAlert} onHide={() => setShowAlert(false)} className="modalStyle" size="sm">
                <Modal.Body>
                <Button variant="close" className="ModalClose" onClick={() => setShowAlert(false)}>&times;</Button>
                <div className="alertText2">비밀번호를 찾기 위해서는 필수 정보[<span className="star">*</span>]를 입력해야 합니다.</div>
                <div className="modalFooter">
                    <Button variant="secondary" onClick={() => setShowAlert(false)}>닫기</Button>
                </div>
                </Modal.Body>
            </Modal>

            {/* 비밀번호 이메일 발송 컨펌 */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)} className="modalStyle" size="sm">
                <Modal.Body>
                <Button variant="close" className="ModalClose" onClick={() => setShowConfirm(false)}>&times;</Button>
                <div className="alertText2">
                    입력하신 사용자에게 문자와 이메일로 e-bidding 시스템에 접속하실 비밀번호를 전송합니다.
                    비밀번호는 초기화 되어 새로 생성됩니다. 비밀번호를 전송하시겠습니까?
                </div>
                <div className="modalFooter">
                    <Button variant="secondary" onClick={() => setShowConfirm(false)} style={{ marginRight: '10px'}}>취소</Button>
                    <Button variant="primary" onClick={() => send()}>전송</Button>
                </div>
                </Modal.Body>
            </Modal>
        </div>
    );
} 

export default PwSearchPop;