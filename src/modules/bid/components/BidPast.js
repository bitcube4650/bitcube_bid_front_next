import React, { useEffect, useState, useCallback } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import BidPastList from './BidPastList';
import Pagination from '../../../components/Pagination';

const BidPast = ({ isBidPastModal, setIsBidPastModal }) => {
  const [srcData, setSrcData] = useState({
    biNo: '',
    biName: '',
    size: 5,
    page: 0
  });

  const [bidPastList, setBidPastList] = useState({});

  const onBidPastModalHide = () => {
    setIsBidPastModal(false);
  };

  const onChangeSrcData = (e) => {
    setSrcData({
      ...srcData,
      [e.target.name]: e.target.value
    });
  };

  const onSearch = useCallback(async () => {
    try {
      const response = await axios.post('/api/v1/bid/pastBidList', srcData);
      setBidPastList(response.data.data);
    } catch (error) {
      Swal.fire('조회에 실패하였습니다.', '', 'error');
      console.log(error);
    }
  });

  useEffect(() => {
    if (isBidPastModal) {
      const initialSrcData = {
        biNo: '',
        biName: '',
        size: 5,
        page: 0
      };
      setSrcData(initialSrcData);
      const fetchInitialData = async () => {
        try {
          const response = await axios.post('/api/v1/bid/pastBidList', initialSrcData);
          setBidPastList(response.data.data);
        } catch (error) {
          Swal.fire('조회에 실패하였습니다.', '', 'error');
          console.log(error);
        }
      };
      fetchInitialData();
    }
  }, [isBidPastModal]);

  return (
    <Modal className="modalStyle" show={isBidPastModal} onHide={onBidPastModalHide} size="xl">
      <Modal.Body>
        <button className="ModalClose" title="닫기" onClick={onBidPastModalHide}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        <h2 className="modalTitle">과거입찰내역</h2>
        <div className="modalSearchBox mt20">
          <div className="flex align-items-center">
            <div className="sbTit mr30">입찰번호</div>
            <div className="width150px">
              <input
                type="text"
                name="biNo"
                className="inputStyle"
                placeholder=""
                onChange={onChangeSrcData}
                value={srcData.biNo}
                maxLength="10"
                autoComplete="off"
                onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
              />
            </div>
            <div className="sbTit mr30 ml50">입찰명</div>
            <div className="width150px">
              <input
                type="text"
                name="biName"
                className="inputStyle"
                placeholder=""
                onChange={onChangeSrcData}
                value={srcData.biName}
                maxLength="50"
                autoComplete="off"
                onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
              />
            </div>
            <button className="btnStyle btnSearch" onClick={()=>{onSearch()}}>검색</button>
          </div>
        </div>
        <table className="tblSkin1 mt30">
          <colgroup>
            <col style={{ width: '123px' }} />
            <col style={{ width: 'auto' }} />
            <col style={{ width: '170px' }} />
            <col style={{ width: '120px' }} />
            <col style={{ width: '77px' }} />
            <col style={{ width: '77px' }} />
            <col style={{ width: '107px' }} />
          </colgroup>
          <thead>
            <tr>
              <th>입찰번호</th>
              <th>입찰명</th>
              <th>제출마감일시</th>
              <th>입찰방식</th>
              <th>상태</th>
              <th>내역</th>
              <th className="end">선택</th>
            </tr>
          </thead>
          <tbody>
            {bidPastList?.content?.length > 0 ? (
              bidPastList.content.map((item) => (
                <BidPastList key={item.biNo} bidPastList={item} onBidPastModalHide={onBidPastModalHide} />
              ))
            ) : (
              <tr>
                <td className="end" colSpan="7">조회된 데이터가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="row mt30">
          <div className="col-xs-12">
            <Pagination onChangeSrcData={onChangeSrcData} list={bidPastList} />
          </div>
        </div>
        <div className="modalFooter">
          <button className='modalBtnClose' onClick={()=>{onBidPastModalHide()}} title="닫기">닫기</button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default BidPast;
