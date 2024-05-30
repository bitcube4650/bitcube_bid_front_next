import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import Ft from '../api/filters';

const BidSubmitHistoryPop = ({biNo, custCode, custName, userName, submitHistPop, setSubmitHistPop}) => {

    const [list, setList] = useState([]);

    const onSearch = useCallback(async() => {
        let params = {
            biNo : biNo,
            custCode : custCode
        }
        await axios.post("/api/v1/bidstatus/submitHist", params).then((response) => {
            if (response.data.code != "OK") {
                Swal.fire('', response.data.msg, 'error');
            } else {
                setList(response.data.data);
            }
        })
    });

    const onClosePop = useCallback(() => {
        setSubmitHistPop(false);
    })

    useEffect(() => {
        onSearch();
    },[custCode]);

    return (
        <Modal class="modalStyle" id="submitHistPop" show={submitHistPop} onHide={onClosePop} keyboard={true} size="lg">
            <Modal.Body class="modal-body">
                <a class="ModalClose" onClick={onClosePop} data-dismiss="modal" title="닫기"><i class="fa-solid fa-xmark"></i></a>
                <h2 class="modalTitle">제출 이력</h2>
                <table class="tblSkin1 mt20">
                    <colgroup>
                    <col />
                    </colgroup>
                    <thead>
                    <tr>
                        <th>차수</th>
                        <th>입찰참가업체명</th>
                        <th>견적금액(총액)</th>
                        <th>담당자</th>
                        <th class="end">제출일시</th>
                    </tr>
                    </thead>
                    <tbody>
                    { list.content?.map((val) =>
                        <tr>
                            <td>{val.biOrder}</td>
                            <td class="text-left">{custName}</td>
                            <td>{val.esmtCurr} { Ft.numberWithCommas(val.esmtAmt) }</td>
                            <td>{userName}</td>
                            <td class="end">{val.submitDate}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                {/* pagination */}
                <div class="row mt30">
                    <div class="col-xs-12">
                    <pagination searchFunc="search" />
                    </div>
                </div>
                {/* //pagination */}
                <div class="modalFooter">
                    <a class="modalBtnClose" data-dismiss="modal" onClick={onClosePop} title="닫기">닫기</a>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default BidSubmitHistoryPop
