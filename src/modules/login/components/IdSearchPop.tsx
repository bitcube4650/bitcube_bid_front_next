import React, { useState, useEffect, ChangeEvent } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import { MapType } from '../../../components/types';
import * as CommonUtils from 'components/CommonUtils';
import SrcInput from '../../../components/input/SrcInput';

interface IdSearchPopProps {
    idSearchPop : boolean;
    setIdSearchPop : React.Dispatch<React.SetStateAction<boolean>>;
}

const IdSearchPop: React.FC<IdSearchPopProps> = ({idSearchPop, setIdSearchPop}) => {
    const initIdSearch = {regnum1 : '', regnum2 : '', regnum3 : '', userName : '', userEmail : ''};
    const [srcData, setSrcData] = useState<MapType>(initIdSearch);
    const [showAlert, setShowAlert] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if(idSearchPop) {
            setSrcData(initIdSearch);
        }
    }, [idSearchPop]);

    const validate = () => {
        if (!srcData.regnum1 || !srcData.regnum2 || !srcData.regnum3 || !srcData.userName || !srcData.userEmail) {
          setShowAlert(true);
        } else {
          setShowConfirm(true);
        }
    };

    const onSearch = () => {
        const params = srcData;
        axios.post("/login/idSearch", params).then((response) => {
            const result = response.data;
            if (result.status === 200) {
                if(result.code == "OK") {
                    Swal.fire('', '전송되었습니다.', 'success');
                    setShowConfirm(false);
                    setIdSearchPop(false);
                } else {
                    Swal.fire('', '입력한 정보가 등록된 정보와 상이합니다. 다시 입력해 주십시오.', 'warning');
                    setShowConfirm(false);
                }
            } else {
                Swal.fire('', '아이디 찾기 중 오류가 발생하였습니다.', 'error');
                setShowConfirm(false);
            }
        });
    };

    return (
        <div>
            <Modal show={idSearchPop} onHide={() => {setIdSearchPop(false)}}>
                <Modal.Body>
                    <a onClick={() => {setIdSearchPop(false)}} className="ModalClose" data-bs-dismiss="modal" title="닫기"><i className="fa-solid fa-xmark"></i></a>
                    <h2 className="modalTitle">아이디 찾기</h2>
                    <div className="modalTopBox">
                    <ul>
                        <li>
                            <div>
                                아래 사업자등록번호, 찾고자 하는 로그인 사용자명 그리고 등록된 이메일을 정확히 입력하셔야 이메일 및 문자로 아이디를 발송합니다.
                            </div>
                        </li>
                        <li>
                            <div>
                                [아이디 찾기]는 전자입찰 협력사 사용자만 해당 됩니다. 계열사 사용자는 시스템 관리자에게 문의해 주십시오.
                            </div>
                        </li>
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
                        <div className="formTit flex-shrink0 width150px">등록된 이메일 <span className="star">*</span></div>
                        <div className="flex align-items-center width100">
                            <SrcInput name="userEmail" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate } />
                        </div>
                    </div>
                    <div className="modalFooter">
                        <Button variant="secondary" onClick={() => {setIdSearchPop(false)}} style={{ marginRight: '10px'}}>닫기</Button>
                        <Button variant="primary" onClick={validate}>아이디 이메일 발송</Button>
                    </div>
                </Modal.Body>
            </Modal>

             {/* 사용자가 지정한 크기를 스타일로 적용 */}
             <style>{`
                .modal-dialog {
                    width: 100%;
                    max-Width: 510px;
                }
            `}</style>

            <Modal show={showAlert} onHide={() => setShowAlert(false)}>
                <Modal.Body>
                    {/* ::Before */}
                    <div className="alertText2">아이디를 찾기 위해서는 필수 정보[<span className="star">*</span>]를 입력해야 합니다.</div>
                    <div className="modalFooter">
                    <Button variant="secondary" onClick={() => setShowAlert(false)}>닫기</Button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Body>
                    <div className="alertText2">입력하신 사용자에게 문자와 이메일로 e-bidding 시스템에 접속하실 아이디를 전송합니다.<br />아이디를 전송하시겠습니까?</div>
                    <div className="modalFooter">
                    <Button variant="secondary" onClick={() => setShowConfirm(false)} style={{ marginRight: '10px'}}>취소</Button>
                    <Button variant="primary" onClick={onSearch}>전송</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default IdSearchPop;