import React, { useCallback, useState } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';

interface props {
    biNo : string;
    whoAtt : string;
    attSignId : string;
    setAttPop : any;
    attPop : boolean;
    onAttSignUpdate : any;
}

const BidAttSignPop:React.FC<props> = ({biNo, whoAtt, attSignId, setAttPop, attPop, onAttSignUpdate}) => {

    const [attPw, setAttPw] = useState<string>("");
    
    //입회자 서명 팝업 닫기
    const onCloseAttSignPop =  () => {
        setAttPw('')
        setAttPop(false);
    }

    //입회자 서명
    const onAttSign = useCallback(() => {
        if (attPw === null || attPw === "") {
            Swal.fire('', '비밀번호를 입력해주세요.', 'error');
            return false;
        }
        
        let params = {
            biNo : biNo
        ,   whoAtt : whoAtt            //몇번 입회자
        ,   attSignId : attSignId    //입회자 아이디
        ,   attPw : attPw        //입회자 비밀번호
        }
        
        axios.post("/api/v1/bidstatus/attSign", params).then((response) => {
            if (response.data.code === "OK") {
                onAttSignUpdate(whoAtt);

                Swal.fire('', '서명이 완료되었습니다.', 'success');
                onCloseAttSignPop();
            } else if (response.data.code === "inValid") {
                Swal.fire('', '입회자 비밀번호가 올바르지 않습니다.', 'warning');
            } else{
                Swal.fire('', '입회자 서명 중 오류가 발생하였습니다.', 'error');
            }
        });
    }, [attPw])

    return (
        <Modal className="modalStyle" id="attSignPop" show={attPop} onHide={onCloseAttSignPop} keyboard={true}>
            <Modal.Body>
                <a onClick={onCloseAttSignPop} className="ModalClose" data-bs-dismiss="modal" title="닫기"><i className="fa-solid fa-xmark"></i></a>
                <h2 className="modalTitle">입회자 확인</h2>
                <div className="modalTopBox">
                    <ul>
                        <div>개찰참석자의 로그인 비밀번호를 입력해주세요.</div>
                    </ul>
                </div>
                <div className="flex align-items-center mt20">
                    <div className="formTit flex-shrink0 width100px">비밀번호</div>
                    <div className="width100">
                        <input type="password" value={attPw} onChange={(e)=> setAttPw(e.target.value)} onKeyUp={(e) => { if(e.key === 'Enter') onAttSign()}} className="inputStyle" />
                    </div>
                </div>
                <div className="modalFooter">
                    <a onClick={onCloseAttSignPop} className="modalBtnClose" data-bs-dismiss="modal" title="취소">취소</a>
                    <a onClick={onAttSign} className="modalBtnCheck" title="확인">확인</a>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default BidAttSignPop
