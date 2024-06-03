import axios from 'axios';
import React, { useCallback, useState } from 'react'
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';

const BidSuccessPop = ({ biNo, custCode, custName, biName, succPop, setSuccPop }) => {

    const navigate = useNavigate();

    const [succDetail, setSuccDetail] = useState("");
    const onSuccDetail = useCallback((e) => {
        setSuccDetail(e.target.value);
    });

    //팝업닫기
    const onClosePop = useCallback(() => {
        setSuccPop(false);
    })

    //페이지 이동
    const onMovePage = useCallback(()=>{
        navigate('/bid/status');
    })

    const bidSucc = useCallback(() =>{
        let params = {
            biNo : biNo
        ,   succCust : custCode
        ,   succDetail : succDetail
        ,   biName : biName                //메일전송에 사용
        }
        axios.post("/api/v1/bidstatus/bidSucc", params).then((response) => {
            if (response.data.code != "OK") {
                Swal.fire('', "낙찰 처리중 오류가 발생했습니다.", 'warning');
            }else{
                Swal.fire('', "낙찰 처리했습니다.", 'success');
                onClosePop();
                onMovePage();
            }
        });
    })

    return (
        <Modal className="modalStyle" id="bidSucc" show={succPop} onHide={onClosePop} keyboard={true}>
            <Modal.Body>
                <a className="ModalClose" data-dismiss="modal" onClick={onClosePop} title="닫기"><i className="fa-solid fa-xmark"></i></a>
                <h2 className="modalTitle">낙찰</h2>
                <div className="modalTopBox">
                    <ul>
                        <li>
                            <div>[{ custName }] 업체로 낙찰 처리합니다.<br /> 아래 낙찰 시 추가합의 사항이 있을 경우 입력해 주십시오.<br />낙찰 하시겠습니까?</div>
                        </li>
                    </ul>
                </div>
                <textarea className="textareaStyle height150px mt20" placeholder="추가합의 사항(필수아님)" value={succDetail} onChange={onSuccDetail}></textarea>
                <div className="modalFooter">
                    <a className="modalBtnClose" data-dismiss="modal" onClick={onClosePop} title="취소">취소</a>
                    <a className="modalBtnCheck" title="낙찰" onClick={bidSucc}>낙찰</a>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default BidSuccessPop