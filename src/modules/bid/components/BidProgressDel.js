
import axios from 'axios'
import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

const BidProgressDel = ({isBidProgressDelModal,setIsBidProgressDelModal,data,interNm}) => {
    const navigate = useNavigate();
    const [delReason, setDelReason] = useState('')

    const onBidProgressDelModalHide =()=>{
        setIsBidProgressDelModal(false)
    }

    const onChangeDelReason= (e) => {
        setDelReason(e.target.value)
    };

    const onBidProgressDel = async () =>{
        if(!delReason.trim()){
            Swal.fire('', '삭제 사유를 입력해 주세요.', 'warning')
            return
        }

        const params = {
            biNo : data.biNo,
            biName : data.biName,
            type : "del",
            interNm : interNm,
            cuserCode : data.createUser,
            gongoIdCode : data.gongoId,
            biModeCode : data.biMode,
            reason : delReason
        }

        if(data.biMode === 'A'){
          params.custCode = data.custList.map(item => item.custCode).join(',')
        }

        try {
            await axios.post(`/api/v1/bid/delete`, params)
            Swal.fire('입찰계획이 삭제되었습니다.', '', 'success');
            navigate('/bid/progress');
            onBidProgressDelModalHide()
            setDelReason('')
        } catch (error) {
            Swal.fire('입찰계획 삭제를 실패하였습니다.', '', 'error');
            console.log(error);
        }

    }

  return (
    <div>
        <Modal className="modalStyle" show={isBidProgressDelModal} onHide={onBidProgressDelModalHide}>
            <Modal.Body>
            <button className="ModalClose" onClick={()=>{onBidProgressDelModalHide()}} title="닫기"
              ><i className="fa-solid fa-xmark"></i>
            </button>
            <h2 className="modalTitle">입찰계획 삭제</h2>
            <div className="modalTopBox">
              <ul>
                <li>
                    입찰 계획 삭제 시 지정된 사용자에게 삭제 메일이
                    발송됩니다.
                </li>
                <li>
                아래 삭제 사유 내용으로 공지자에게 발송됩니다.
                </li>
              </ul>
            </div>
            <textarea
              className="textareaStyle height150px mt20"
              placeholder="삭제 사유 필수 입력"
              name='delReason'
              onChange={onChangeDelReason}
            ></textarea>
            <div className="modalFooter">
              <button className="modalBtnClose"title="취소" onClick={()=>{onBidProgressDelModalHide()}}
                >취소</button
              >
              <button
                className="modalBtnCheck"
                title="삭제"
                onClick={()=>{onBidProgressDel()}}
                >삭제</button
              >
            </div>
            </Modal.Body>
        </Modal>

    </div>
  )
}

export default BidProgressDel
