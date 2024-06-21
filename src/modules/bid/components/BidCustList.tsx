import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import Pagination from '../../../components/Pagination'
import axios from 'axios';
import Swal from 'sweetalert2';
import BidCustUserList from './BidCustUserList';
import { BidContext } from '../context/BidContext';
import { MapType } from '../../../components/types';
import SrcInput from '../../../components/input/SrcInput';

interface BidCustListPropsType {
  isBidCustListModal: boolean;
  setIsBidCustListModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const BidCustList : React.FC<BidCustListPropsType> = ({ isBidCustListModal, setIsBidCustListModal }) => {

  const {custContent} = useContext(BidContext)

  const [srcData, setSrcData] = useState<MapType>({
      custName: '',
      chairman: '',
      size: 5,
      page: 0
  });


  const [bidCustList, setBidCustList] = useState<any>([]);

  const [custCode,setCustCode] = useState<string>('');

  const [custName,setCustName] = useState<string>('');

  const [isBidCustUserListModal, setIsBidCustUserListModal] = useState<boolean>(false);
  
  const onBidCustListModalHide = () => {
      setIsBidCustListModal(false);
    };
  
    const onSearch = useCallback(async () => {
      try {
        const response = await axios.post('/api/v1/bid/custList', srcData);
        setBidCustList(response.data.data);
      } catch (error) {
        Swal.fire('조회에 실패하였습니다.', '', 'error');
        console.log(error);
      }
    }, [srcData]);


    //팝업 오픈 시에만 실행
    useEffect(() => {
      if (isBidCustListModal) {
        const initialSrcData = {
          custName: '',
          chairman: '',
          size: 5,
          page: 0
        };
        setSrcData(initialSrcData);
        const fetchInitialData = async () => {
          try {
            const response = await axios.post('/api/v1/bid/custList', initialSrcData);
            setBidCustList(response.data.data);
          } catch (error) {
            Swal.fire('조회에 실패하였습니다.', '', 'error');
            console.log(error);
          }
        };
        fetchInitialData();
      }
      }, [isBidCustListModal]);
    
    const onBidCustUserListModal = ()=>{
      setIsBidCustUserListModal(true)
    }
    
    // 업체 선택 후 업체 정보로 협력사 사용자 팝업 오픈 함수
    const onBidCustSelect = (srcCustCode : string,srcCustName : string) => {
      const hasCustCode = custContent.some((item : {custCode : string}) => item.custCode == srcCustCode);
      setCustCode(srcCustCode)
      setCustName(srcCustName)

      //custContent에 이미 등록된 업체가 아닐 때만 등록
      if (!hasCustCode) {
        onBidCustUserListModal();
      } else {
          Swal.fire('이미 등록된 업체입니다.', '', 'error');
          
      }

    }
    
  return (
    <div>
      <Modal className={`modalStyle ${isBidCustUserListModal ? 'modal-cover' : ''}`} show={isBidCustListModal} onHide={onBidCustListModalHide} size="xl">
          <Modal.Body>
              <button className="ModalClose" title="닫기" onClick={()=>{onBidCustListModalHide()}}
              ><i className="fa-solid fa-xmark"></i>
              </button>
              <h2 className="modalTitle">업체조회</h2>
              <div className="modalTopBox">
              <ul>
                  <li>
                  <div>계열사에 등록되어 있는 업체리스트를 조회합니다</div>
                  </li>
              </ul>
              </div>

              <div className="modalSearchBox mt20">
              <div className="flex align-items-center">
                  <div className="sbTit mr30">업체명</div>
                  <div className="width150px">
                  <SrcInput
                    name="custName"
                    srcData={ srcData } 
                    setSrcData={ setSrcData }
                    onSearch={ onSearch }
                    maxLength={50}
                  />
                  </div>
                  <div className="sbTit mr30 ml50">대표자명</div>
                  <div className="width150px">
                  <SrcInput
                    name="chairman"
                    srcData={ srcData } 
                    setSrcData={ setSrcData }
                    onSearch={ onSearch }
                    maxLength={25}
                  />
                  </div>
                  <button className="btnStyle btnSearch" 
                  onClick={()=>{onSearch()}}
                  >검색
                  </button>
              </div>
              </div>
              <table className="tblSkin1 mt30">
              <colgroup>
                  <col />
              </colgroup>
              <thead>
                  <tr>
                  <th>업체명</th>
                  <th>주소</th>
                  <th>대표자명</th>
                  <th className="end">선택</th>
                  </tr>
              </thead>
              <tbody>
              {
              bidCustList?.content?.length > 0 ? (
                  bidCustList.content.map((item : MapType) => (
                    <tr key={item.custCode}>
                      <td>{item.custName}</td>
                      <td>{item.combinedAddr}</td>       
                      <td>{item.presName}</td>
                      <td className="end">
                      <button className="btnStyle btnSecondary btnSm" title="선택" onClick={ () => {
                          onBidCustSelect(item.custCode,item.custName)
                          }
                      }>선택</button>
                      </td> 
                    </tr> 
              ))
              ) :
              (
              <tr>
                  <td className="end" colSpan={4}>조회된 데이터가 없습니다.</td>
              </tr>
              )
              }
              </tbody>

              </table>
  
              <div className="row mt30">
              <div className="col-xs-12">
              <Pagination srcData={ srcData } setSrcData={ setSrcData } list={ bidCustList } />
              </div>
              </div>
              <div className="modalFooter">
              <button className="modalBtnClose" title="닫기" onClick={()=>{onBidCustListModalHide()}}>닫기</button>
              </div>

          </Modal.Body>
      </Modal>

      {/* 협력사 사용자 팝업 */}
      <BidCustUserList isBidCustUserListModal={isBidCustUserListModal} setIsBidCustUserListModal={setIsBidCustUserListModal} srcCustCode={custCode} srcCustName={custName} type="save"/> 
    </div>
  )
}

export default BidCustList
