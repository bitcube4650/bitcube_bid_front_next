import React, { useEffect, useState, useCallback } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import BidPastList from './BidPastList';
import Pagination from '../../../components/Pagination';
import SrcInput from '../../../components/input/SrcInput';
import { MapType } from '../../../components/types';

interface BidPastPropsType {
  isBidPastModal : boolean;
  setIsBidPastModal : React.Dispatch<React.SetStateAction<boolean>>;
}

const BidPast : React.FC<BidPastPropsType> = ({ isBidPastModal, setIsBidPastModal }) => {
  const [srcData, setSrcData] = useState<MapType>({
    biNo: '',
    biName: '',
    size: 5,
    page: 0
  });

  const [bidPastList, setBidPastList] = useState<MapType>({});

  const onBidPastModalHide = () => {
    setIsBidPastModal(false);
  };

  const onSearch = useCallback(async () => {
    try {
      const response = await axios.post('/api/v1/bid/pastBidList', srcData);
      setBidPastList(response.data.data);
    } catch (error) {
      Swal.fire('조회에 실패하였습니다.', '', 'error');
      console.log(error);
    }
  },[srcData]);

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

  useEffect(() => {
      onSearch();
  }, [srcData.page]);

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
              <SrcInput
              name="biNo"
              onSearch={ ()=>{onSearch() }}
              srcData={ srcData } 
              setSrcData={ setSrcData }
              maxLength={10}
              />
            </div>
            <div className="sbTit mr30 ml50">입찰명</div>
            <div className="width150px">
            <SrcInput
              name="biName"
              onSearch={ ()=>{onSearch() }}
              srcData={ srcData } 
              setSrcData={ setSrcData }
              maxLength={50}
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
          {bidPastList?.content && bidPastList?.content?.length > 0 ? (
              bidPastList.content.map((item : any) => (
                <BidPastList key={item.biNo} bidPastList={item} onBidPastModalHide={onBidPastModalHide} />
              ))
            ) : (
              <tr>
                <td className="end" colSpan={7}>조회된 데이터가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="row mt30">
          <div className="col-xs-12">
          <Pagination srcData={ srcData } setSrcData={ setSrcData } list={ bidPastList } />
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
