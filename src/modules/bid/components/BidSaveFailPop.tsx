import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';

interface props {
    biNo : string;
    biName : string;
    bidSaveFailPop : boolean;
    setBidSaveFailPop : any;
}

const BidSaveFailPop:React.FC<props> = ({ biNo, biName, bidSaveFailPop, setBidSaveFailPop }) => {

    const navigate = useNavigate();

    //유찰사유
    const [reason, setReason] = useState("");

    //유찰팝업 닫기
    const onCloseSaveFailPop = () => {
        setReason("");
        setBidSaveFailPop(false);
    };

    const onMovePage = ()=>{
        navigate('/bid/status');
    }

    //유찰 처리
    const bidFailure = useCallback( () => {
        if (reason === null || reason === "") {
            Swal.fire('', '유찰사유를 입력해주세요.', 'warning');
            return;
        }
        
        let params = {
            biNo : biNo             //입찰번호
        ,   reason : reason         //유찰사유
        ,   type : 'fail'           //메일 타입 : fail - 유찰
        ,   biName : biName         //메일 파라미터
        }
        
        axios.post("/api/v1/bidstatus/bidFailure", params).then((response) => {
            if (response.data.code !== "OK") {
                Swal.fire('', response.data.msg, 'warning');
            }else{
                Swal.fire('', '유찰 처리 되었습니다.', 'success');
                onCloseSaveFailPop();
                onMovePage();
            }
        });
    }, [reason])

    return (
        <Modal className="modalStyle" id="biddingReserve" show={bidSaveFailPop} onHide={onCloseSaveFailPop} keyboard={true}>
            <Modal.Body>
                <a onClick={onCloseSaveFailPop} className="ModalClose" data-bs-dismiss="modal" title="닫기"><i className="fa-solid fa-xmark"></i></a>
                <h2 className="modalTitle">유찰</h2>
                <div className="modalTopBox">
                    <ul>
                        <li>
                            <div>유찰처리 합니다.<br/>유찰처리 시 참가업체에게 유찰 메일이 발송됩니다.<br />유찰 처리 시 유찰 사유 내용으로 업체에게 발송 됩니다.</div>
                        </li>
                    </ul>
                </div>
                <textarea className="textareaStyle height150px mt20" placeholder="유찰사유 필수 입력" value={reason} onChange={(e)=>setReason(e.target.value)}></textarea>
                <div className="modalFooter">
                    <a className="modalBtnClose" onClick={onCloseSaveFailPop} data-bs-dismiss="modal" title="취소">취소</a>
                    <a className="modalBtnCheck" title="유찰" onClick={ bidFailure }>유찰</a>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default BidSaveFailPop
