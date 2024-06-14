import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import Ft from '../api/filters';

const BidJoinCustListPop = ({ biNo, joinCustPop, setJoinCustPop }) => {

    //마운트 여부
    const isMounted = useRef(false);

    //데이터
    const [popData, setPopData] = useState([]);

    const onSearch = async() => {
        let params = {
            biNo : biNo
        }
        await axios.post("/api/v1/bidComplete/joinCustList", params).then((response) => {
            if(response.data.code == 'OK'){
                setPopData(response.data.data);
            }else{
                Swal.fire('', response.data.msg, 'error');
            }
        });

    };

    //팝업 이벤트
    const onClosePop = async() => {
        isMounted.current = false;
        setJoinCustPop(false)
    };

    useEffect(() => {
        if (!isMounted.current) {
            onSearch();
            isMounted.current = true;
        }
    },[]);

    return (
        <Modal className="modalStyle" show={joinCustPop} onHide={onClosePop} keyboard={true}>
            <Modal.Body className="modal-body">
                <a className="ModalClose" data-dismiss="modal" onClick={onClosePop} title="닫기"><i className="fa-solid fa-xmark"></i></a>
                <h2 className="modalTitle">투찰 정보</h2>
                <div className="modalBoxSt mt10" v-if="popData.length != 0">
                    <div className="flex align-items-center">
                        <div className="formTit flex-shrink0 width120px">입찰번호</div>
                        <div className="width100">{ popData.length > 0 && popData[0].biNo }</div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width120px">입찰명</div>
                        <div className="width100">{ popData.length > 0 && popData[0].biName }</div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width120px">낙찰업체</div>
                        <div className="width100">{ popData.length > 0 && popData[0].succYn == 'Y' ? popData[0].custName : '' }</div>
                    </div>
                </div>

                <table className="tblSkin1 mt20">
                    <thead>
                        <tr>
                            <th>업체명</th>
                            <th>투찰가</th>
                            <th className="end">투찰 일시</th>
                        </tr>
                    </thead>
                    <tbody>
                        {popData?.map((cust, index) => 
                        <tr key={index}>
                            <td className={cust.succYn == 'Y' ? 'text-left textHighlight' : 'text-left'} >{ cust.custName }</td>
                            <td className={cust.succYn == 'Y' ? 'text-right textHighlight' : 'text-right'} >{ Ft.numberWithCommas(cust.esmtAmt) }</td>
                            <td className={cust.succYn == 'Y' ? 'textHighlight end' : 'end'} >{ cust.submitDate }</td>
                        </tr>
                        )}
                    </tbody>
                </table>

                <div className="modalFooter">
                    <a className="modalBtnClose" data-dismiss="modal" onClick={onClosePop} title="닫기">닫기</a>
                </div>
            </Modal.Body>				
        </Modal>
    )
}

export default BidJoinCustListPop