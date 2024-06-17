import React, { useCallback, useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import axios from 'axios';
import * as CommonUtils from '../CommonUtils'

const PersonalInfoInterPop = ({infoInter, setInfoInter, fnCloseCheckPwdPop}) => {
    const loginInfoString = localStorage.getItem("loginInfo"); 
    const loginInfo = loginInfoString ? JSON.parse(loginInfoString) : null;

    const [userInfo, setUserInfo] = useState({});
    const [openauth, setOpenauth] = useState(false);
    const [bidauth, setBidauth] = useState(false);
    const [confirmPop, setConfirmPop] = useState(false);

    useEffect(() => {
        if(infoInter) {
            fnInit();
        }
    }, [infoInter]);

    useEffect(() => {
        setUserInfo((prevDetail) => ({
            ...prevDetail,
            userHp: CommonUtils.onAddDashTel(prevDetail.userHp),
        }));
    }, [userInfo.userHp]);

    useEffect(() => {
        setUserInfo((prevDetail) => ({
            ...prevDetail,
            userTel: CommonUtils.onAddDashTel(prevDetail.userTel),
        }));
    }, [userInfo.userTel]);

    const fnCloseInterPop = () => {
        setInfoInter(false);
    }

    const fnInit = () => {
        axios.post("/api/v1/main/selectUserInfo", {}).then((response) => {
            const result = response.data;
            if(result.code === "OK") {
                setUserInfo(result.data);
                if(result.data.bidauth === "1") setBidauth(true);
                if(result.data.openauth === "1") setOpenauth(true);
            } else {
                Swal.fire('', result.msg, 'warning');
            }
        });
    }

    const handleKeyDown = (e) => {
        if(e.key === "Enter") {
            e.preventDefault();
            confirm();
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    const confirm = () => {
        if(validChek()){
            setConfirmPop(true);
        }
    }

    const validChek = () => {
        if(userInfo.userHp == null || userInfo.userHp == ''){
            Swal.fire('', '휴대폰 번호를 입력해주세요', 'warning');
            return false;
        }else if(userInfo.userTel == null || userInfo.userTel == ''){
            Swal.fire('', '유선전화 번호를 입력해주세요', 'warning');
            return false;
        }else if(userInfo.userEmail == null || userInfo.userEmail == ''){
            Swal.fire('', '이메일을 입력해주세요', 'warning');
            return false;
        }else if(!validateEmail(userInfo.userEmail)){
            Swal.fire('', '이메일 형식에 맞게 입력해주세요', 'warning');
            return false;
        }
        return true;
    }

    const validateEmail = (email) => {
        // 이메일 주소를 검사하기 위한 정규 표현식
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            
        // 정규 표현식을 사용하여 이메일 주소를 검사하고 결과를 반환
        return regex.test(email);
    }

    const saveInfo = () => {
        axios.post("/api/v1/main/saveUserInfo", {userInfo}).then((response) => {
            const result = response.data;
            if(result.code === "OK") {
                Swal.fire('', '개인정보를 수정하였습니다.', 'info');
                setConfirmPop(false);
                fnCloseInterPop();
                fnCloseCheckPwdPop();
            } else {
                Swal.fire('', result.msg, 'warning');
            }
        });

    }

    const fnCloseConfirm = () => {
        setConfirmPop(false);
    }

    return (
        <div>
            <Modal className="modalStyle" show={infoInter} onHide={fnCloseInterPop} keyboard={true}>
                <Modal.Body>
                    <a onClick={fnCloseInterPop} className="ModalClose" data-bs-dismiss="modal" title="닫기"><i className="fa-solid fa-xmark"></i></a>
                    <h2 className="modalTitle">개인정보</h2>
                    <div className="flex align-items-center">
                        <div className="formTit flex-shrink0 width120px">로그인ID</div>
                        <div className="width100">{ loginInfo.userId }</div>
                    </div>
                    <div className="flex align-items-center mt20">
                        <div className="formTit flex-shrink0 width120px">이름</div>
                        <div className="width100">{ loginInfo.userName }</div>
                    </div>
                    <div className="flex align-items-center mt20">
                        <div className="formTit flex-shrink0 width120px">소속 계열사</div>
                        <div className="width100">{ loginInfo.custName }</div>
                    </div>
                    <div className="flex align-items-center mt20">
                        <div className="formTit flex-shrink0 width120px">사용자 권한</div>
                        {loginInfo.userAuth === '1' && <div className="width100">시스템관리자</div>}
                        {loginInfo.userAuth === '2' && <div className="width100">각사관리자</div>}
                        {loginInfo.userAuth === '3' && <div className="width100">일반관리자</div>}
                        {loginInfo.userAuth === '4' && <div className="width100">감사사용자</div>}
                    </div>
                    <div className="flex align-items-center mt20">
                        <div className="formTit flex-shrink0 width120px">입찰권한</div>
                        <div className="width100">
                            <input type="checkbox" checked={openauth} id="checkbox1" className="checkStyle" disabled />
                            <label htmlFor="checkbox1"><div>개찰</div></label>&nbsp;&nbsp;&nbsp;&nbsp;
                            <input type="checkbox" checked={bidauth} id="checkbox2" className="checkStyle" disabled />
                            <label htmlFor="checkbox2"><div>낙찰</div></label>
                        </div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width120px">비밀번호</div>
                        <div className="flex align-items-center width100">
                            <div className="width100">최종변경일 : { userInfo.pwdEditDate }</div>
                        </div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width120px">휴대폰 <span className="star">*</span></div>
                        <div className="width100"><input type="text" onKeyDown={handleKeyDown} onChange={handleInputChange} name="userHp" id="" className="inputStyle" placeholder="" value={userInfo.userHp} /></div>
                        
                        {/* <div className="width100"><input type="text" name="" id="" className="inputStyle" placeholder="" value={userInfo.userHp} @input="formatPhoneNumber"></div> */}
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width120px">유선전화 <span className="star">*</span></div>
                        <div className="width100"><input type="text" onKeyDown={handleKeyDown} onChange={handleInputChange} name="userTel" id="" className="inputStyle" placeholder="" value={userInfo.userTel} /></div>
                        
                        {/* <div className="width100"><input type="text" name="" id="" className="inputStyle" placeholder="" value={userInfo.userTel} @input="formatLandlineNumber"></div> */}
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width120px">이메일 <span className="star">*</span></div>
                        <div className="width100"><input type="text" onKeyDown={handleKeyDown} onChange={handleInputChange} name="userEmail" id="" className="inputStyle" placeholder="" value={userInfo.userEmail} /></div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width120px">직급</div>
                        <div className="width100"><input type="text" onKeyDown={handleKeyDown} onChange={handleInputChange} name="userPosition" id="" className="inputStyle" placeholder="" value={userInfo.userPosition} /></div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width120px">부서</div>
                        <div className="width100"><input type="text" onKeyDown={handleKeyDown} onChange={handleInputChange} name="deptName" id="" className="inputStyle" placeholder="" value={userInfo.deptName} /></div>
                    </div>

                    <div className="modalFooter">
                        <a onClick={fnCloseInterPop} className="modalBtnClose" title="닫기">닫기</a>
                        <a onClick={confirm} className="modalBtnCheck" title="저장">저장</a>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal className="modalStyle" show={confirmPop} onHide={fnCloseConfirm} keyboard={true}>
            <Modal.Body>
                    <a onClick={fnCloseConfirm} className="ModalClose" data-bs-dismiss="modal" title="닫기"><i className="fa-solid fa-xmark"></i></a>
                    <div className="alertText2">개인정보를 변경하시겠습니까?</div>
                    <div className="modalFooter">
                        <a onClick={fnCloseConfirm} className="modalBtnClose" data-dismiss="modal" title="취소">취소</a>
                        <a onClick={saveInfo} className="modalBtnCheck" data-toggle="modal" title="저장">저장</a>
                    </div>
                    
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default PersonalInfoInterPop
