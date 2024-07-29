
import axios from 'axios'
import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
//import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { MapType } from '../../../components/types';
import { useRouter } from 'next/router';
import EditTextArea from '../../../components/input/EditTextArea';

interface BidProgressDelPropsType {
    isBidProgressDelModal: boolean;
    setIsBidProgressDelModal: React.Dispatch<React.SetStateAction<boolean>>;
    data: {
        biNo: string;
        biName: string;
        createUser: string;
        gongoId: string;
        biMode: string;
        custList?: { custCode: string }[];
    };
    interNm: string;
}

const BidProgressDel: React.FC<BidProgressDelPropsType> = ({ isBidProgressDelModal, setIsBidProgressDelModal, data, interNm }) => {
    //const navigate = useNavigate();
    const router = useRouter()
    const [delReason, setDelReason] = useState<MapType>(
      {delReasonContent : '' }
    )

    const onBidProgressDelModalHide =()=>{
        setIsBidProgressDelModal(false)
    }

    const onBidProgressDel = async () =>{
        if(!delReason.delReasonContent.trim()){
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
            reason : delReason.delReasonContent
        }

        /*
        if(data.biMode === 'A'){
          params.custCode :string = data.custList.map((item :{custCode : string}) => item.custCode).join(',')
        }
        */

        try {
            await axios.post(`/api/v1/bid/delete`, params)
            Swal.fire('입찰계획이 삭제되었습니다.', '', 'success');
            router.push('/bid/progress');
            onBidProgressDelModalHide()
            setDelReason({
              delReasonContent : ''
            })
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
             <EditTextArea editData={ delReason } setEditData={ setDelReason } name="delReasonContent"/>
            <div className="modalFooter">
              <button className="modalBtnClose"title="취소" onClick={()=>{onBidProgressDelModalHide()}}
                >취소
              </button>
              <button
                className="modalBtnCheck"
                title="삭제"
                onClick={()=>{onBidProgressDel()}}
                >삭제
              </button>
            </div>
            </Modal.Body>
        </Modal>

    </div>
  )
}

export default BidProgressDel
