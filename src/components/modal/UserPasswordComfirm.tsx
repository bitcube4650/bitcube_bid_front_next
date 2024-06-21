import React, { useState, useCallback } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2'; // 공통 팝업창

interface GroupUserPasswordComfirmProps {
    srcUserId: string;
    GroupUserPasswordComfirmOpen: boolean;
    setGroupUserPasswordComfirmOpen: (open: boolean) => void;
    onUserDetailPop: (userId: string) => void;
}

const GroupUserPasswordComfirm : React.FC<GroupUserPasswordComfirmProps> = ({srcUserId, GroupUserPasswordComfirmOpen, setGroupUserPasswordComfirmOpen, onUserDetailPop}) => {
    const [GroupUserPasswordComfirmData, setGroupUserPasswordComfirmData] = useState({})
    //팝업 닫기
    const onClosePop = useCallback(() => {
        // 모달 닫기
        setGroupUserPasswordComfirmOpen(false);
    }, [setGroupUserPasswordComfirmOpen]);

    const onSetGroupUserPasswordComfirmData = (e : React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setGroupUserPasswordComfirmData((prevData) => ({
            ...prevData,
            [name]: value,
            userId : srcUserId
        }));
    };

    async function onSaveGroupUserPasswordComfirm(){
        // 저장 api
        const response = await axios.post("/api/v1/couser/pwdCheck", GroupUserPasswordComfirmData);
        if (response.data.code === 'OK') {
            onUserDetailPop(srcUserId)
        } else {
            Swal.fire('', '비밀번호를 확인해주세요.', 'warning');
        }
    }

    return (
        <Modal className="modalStyle" show={GroupUserPasswordComfirmOpen} onHide={onClosePop} >
            <Modal.Body>
                <a onClick={onClosePop} className="ModalClose" data-dismiss="modal" title="닫기">
                    <i className="fa-solid fa-xmark"></i>
                </a>
                <h2 className="modalTitle">비밀번호 확인</h2>
                <div className="flex align-items-center">
                    <div className="formTit flex-shrink0 width100px">비밀번호</div>
                    <div className="width100">
                        <input type="password" className="inputStyle" placeholder="" name="pwd" onChange={onSetGroupUserPasswordComfirmData}/>
                    </div>
                </div>
                <p className="text-center mt20"><i className="fa-light fa-circle-info"></i> 안전을 위해서 비밀번호를 입력해 주십시오</p>

                <div className="modalFooter">
                    <a onClick={onClosePop} className="modalBtnClose" title="닫기">닫기</a> 
                    <a onClick={onSaveGroupUserPasswordComfirm} className="modalBtnCheck" title="확인">확인</a>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default GroupUserPasswordComfirm;