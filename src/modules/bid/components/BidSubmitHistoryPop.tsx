import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import Ft from '../api/filters';
import Pagination from 'components/Pagination';
import { MapType } from 'components/types';

interface props {
    biNo : string;
    custCode : string;
    custName : string;
    userName : string;
    submitHistPop : boolean;
    setSubmitHistPop : any;
}

const BidSubmitHistoryPop:React.FC<props> = ({biNo, custCode, custName, userName, submitHistPop, setSubmitHistPop}) => {

    //useEffect 안에 onSearch 한번만 실행하게 하는 플래그
    const isMounted = useRef<boolean>(true);

    //조회 결과
    const [list, setList] = useState<MapType>({
        totalElements   : 0,
        val         : [{}]
    });

    //조회조건
    const [srcData, setSrcData] = useState<MapType>({
        biNo : biNo
    ,   custCode : custCode
    ,	size : 10
    ,	page : 0
    });

    const onSearch = useCallback(async() => {
        await axios.post("/api/v1/bidstatus/submitHist", srcData).then((response) => {
            if (response.data.code !== "OK") {
                Swal.fire('', response.data.msg, 'error');
            } else {
                setList(response.data.data.content);
            }
        })
    }, [srcData]);

    const onClosePop = () => {
        setSubmitHistPop(false);
    }

    //마운트 완료 후 검색
    useEffect(() => {
        if (isMounted.current) {
            isMounted.current = false;
        } else {
            onSearch();
        }
    },[srcData]);

    return (
        <Modal className="modalStyle" id="submitHistPop" show={submitHistPop} onHide={onClosePop} keyboard={true} size="lg">
            <Modal.Body>
                <a className="ModalClose" onClick={onClosePop} data-dismiss="modal" title="닫기"><i className="fa-solid fa-xmark"></i></a>
                <h2 className="modalTitle">제출 이력</h2>
                <table className="tblSkin1 mt20">
                    <colgroup>
                        <col />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>차수</th>
                            <th>입찰참가업체명</th>
                            <th>견적금액(총액)</th>
                            <th>담당자</th>
                            <th className="end">제출일시</th>
                        </tr>
                    </thead>
                    <tbody>
                    { list?.map((val:MapType) =>
                        <tr>
                            <td>{val.biOrder}</td>
                            <td className="text-left">{custName}</td>
                            <td>{val.esmtCurr} { Ft.numberWithCommas(val.esmtAmt) }</td>
                            <td>{userName}</td>
                            <td className="end">{val.submitDate}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                {/* pagination  */}
                <div className="row mt40">
                    <div className="col-xs-12">
                        <Pagination srcData={ srcData } setSrcData={ setSrcData } list={ list } />
                    </div>
                </div>
                {/* pagination  */}
                <div className="modalFooter">
                    <a className="modalBtnClose" data-dismiss="modal" onClick={onClosePop} title="닫기">닫기</a>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default BidSubmitHistoryPop
