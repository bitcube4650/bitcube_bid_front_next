import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

const PwSearchPop = ({pwSearchPop, setPwSearchPop}) => {

    const initPwSearch = {regnum1 : '', regnum2 : '', regnum3 : '', userName : '', userId : '', userEmail : ''};
    const [pwSearch, setPwSearch] = useState(initPwSearch);
    const [showAlert, setShowAlert] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if(pwSearchPop) {
            setPwSearch(initPwSearch);
        }
    }, [pwSearchPop]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPwSearch((prevState) => ({
          ...prevState,
          [name]: value.replace(/[^0-9]/g, '').trim()
        }));
    };

    const validate = () => {
        if (!pwSearch.regnum1 || !pwSearch.regnum2 || !pwSearch.regnum3 || !pwSearch.userName || !pwSearch.userId || !pwSearch.userEmail) {
          setShowAlert(true);
        } else {
          setShowConfirm(true);
        }
    };

    const send = () => {
        const params = pwSearch;
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
            {/* <Modal show={idSearchPop} onHide={() => {setIdSearchPop(false)}}></Modal> */}
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
                            <Form.Control type="text" name="regnum1" value={pwSearch.regnum1} onChange={handleInputChange} maxLength="3" className="inputStyle" />
                            <span style={{ margin: '0 10px' }}>-</span>
                            <Form.Control type="text" name="regnum2" value={pwSearch.regnum2} onChange={handleInputChange} maxLength="2" className="inputStyle" />
                            <span style={{ margin: '0 10px' }}>-</span>
                            <Form.Control type="text" name="regnum3" value={pwSearch.regnum3} onChange={handleInputChange} maxLength="5" className="inputStyle" />
                        </div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width150px">로그인 사용자명 <span className="star">*</span></div>
                        <div className="flex align-items-center width100">
                            <Form.Control type="text" name="userName" value={pwSearch.userName} onChange={(e) => setPwSearch({ ...pwSearch, userName: e.target.value })} className="inputStyle" />
                        </div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width150px">로그인 아이디 <span className="star">*</span></div>
                        <div className="flex align-items-center width100">
                            <Form.Control type="text" name="userName" value={pwSearch.userId} onChange={(e) => setPwSearch({ ...pwSearch, userId: e.target.value })} className="inputStyle" />
                        </div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width150px">등록된 이메일 <span className="star">*</span></div>
                        <div className="flex align-items-center width100">
                            <Form.Control type="text" name="userEmail" value={pwSearch.userEmail} onChange={(e) => setPwSearch({ ...pwSearch, userEmail: e.target.value.trim() })} className="inputStyle" placeholder="ex) sample@iljin.co.kr" />
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