import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import Pagination from '../../../components/Pagination'
import axios from 'axios';
import Swal from 'sweetalert2';
import { BidContext } from '../context/BidContext';
import { onAddDashTel } from 'components/CommonUtils';

const BidCustUserList = ({isBidCustUserListModal, setIsBidCustUserListModal,srcCustCode, srcCustName, type}) => {
    
  const {custContent, setCustContent,custUserName,setCustUserName, custUserInfo, setCustUserInfo} = useContext(BidContext);

    const [srcData, setSrcData] = useState({
      userName: '',
      userId: '',
      size: 20,
      page: 0,
      custCode : srcCustCode,
      useYn : 'Y'
    });

    const [bidCustUserList, setBidCustUserList] = useState({});
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [allChecked, setAllChecked] = useState(false);

    
    const onBidCustUserListModalHide = () => {
        setIsBidCustUserListModal(false);
      };
    
      const onChangeSrcData = (e) => {
        setSrcData({
          ...srcData,
          [e.target.name]: e.target.value
        });
      };

      const onSearch = useCallback(async () => {
        try {
          const response = await axios.post('/api/v1/custuser/userListForCust', srcData);
          setBidCustUserList(response.data.data);
        } catch (error) {
          Swal.fire('조회에 실패하였습니다.', '', 'error');
          console.log(error);
        }
      }, [srcData]);

      useEffect(() => {
        setSrcData((prevSrcData) => ({
          ...prevSrcData,
          custCode: srcCustCode
        }));
      }, [srcCustCode]);


      // 팝업 오픈시만 실행
      useEffect(() => {
        if (isBidCustUserListModal && srcCustCode) {
          setAllChecked(false)
          setSelectedUserIds([])
          const initialSrcData = {
            userName: '',
            userId: '',
            size: 20,
            page: 0,
            custCode: srcCustCode,
            useYn: 'Y'
          };
          setSrcData(initialSrcData);
          const fetchInitialData = async () => {
            try {
              const response = await axios.post('/api/v1/custuser/userListForCust', initialSrcData);
              setBidCustUserList(response.data.data);
            } catch (error) {
              Swal.fire('조회에 실패하였습니다.', '', 'error');
              console.log(error);
            }
          };
          fetchInitialData();
        }

        // 팝업이 업체 조회에서가 아니라 입찰참가 업체에서 클릭 시 
        if(type === 'edit'){

          const custUserInfoData = custUserInfo.filter(item => item.custCode == srcCustCode)
          setSelectedUserIds(custUserInfoData)
        }

      }, [isBidCustUserListModal]);


      const onAllCheck = (event) => {
        const isChecked = event.target.checked;
        setAllChecked(isChecked);
        if (isChecked) {
            const allUserIds = bidCustUserList.content.map((item) => item);
            setSelectedUserIds(allUserIds);
        } else {
            setSelectedUserIds([]);
        }
    };

    const onCheck = (event, item) => {
      const isChecked = event.target.checked;
      if (isChecked) {
          setSelectedUserIds([...selectedUserIds, item]);
      } else {
        setSelectedUserIds(selectedUserIds.filter((selectedItem) => selectedItem.userId !== item.userId));
      }
    };

    // 업체의 사용자 정보 저장 후 모달 닫기
    const onSaveCustUser = ()=> {
      
      if(selectedUserIds.length > 0){
        console.log(selectedUserIds)
        const custUserInfoData = selectedUserIds.map(item => ({ 
          userId: item.userId,
          userName: item.userName,
          custCode: srcCustCode
        }));
        
        const custCodeUserName = custUserInfoData.map(item => item.userName).join(', ')

        if(type === 'save'){

          setCustUserName(
            [...custUserName, 
              { custCode: srcCustCode, 
                userName: custCodeUserName 
              }
            ]
          )

          setCustContent(
            [...custContent, 
              { custCode: srcCustCode, 
                custName: srcCustName 
              }
            ]
          )

          setCustUserInfo(
            [...custUserInfo, ...custUserInfoData]
          )

        }else if(type === 'edit'){
          const resetCustUserInfo = custUserInfo.filter(item => item.custCode !== srcCustCode)
          const resetCustUserName = custUserName.filter(item => item.custCode !== srcCustCode)
          
          setCustUserInfo([...resetCustUserInfo, ...custUserInfoData]);


          setCustUserName(
            [...resetCustUserName, 
              { custCode: srcCustCode, 
                userName: custCodeUserName 
              }
            ]
          )

        }

       onBidCustUserListModalHide()
      }else{
        Swal.fire('공고 시 메일과 문자를 수신할 사용자를 선택해 주세요.', '', 'error');
      }

    }

  return (
    <div>
        <Modal className="modalStyle" show={isBidCustUserListModal} onHide={onBidCustUserListModalHide} size="xl">
            <Modal.Body>
                <button className="ModalClose"  title="닫기" onClick={()=>{onBidCustUserListModalHide()}}><i className="fa-solid fa-xmark"></i></button>
                <h2 className="modalTitle">협력사 사용자</h2>
                
                <div className="modalSearchBox mt20">
                    <div className="flex align-items-center">
                        <div className="sbTit mr30">사용자명</div>
                        <div className="width150px">
                            <input type="text" 
                            name="userName"
                            value={srcData.userName} 
                            onChange={onChangeSrcData}
                            className="inputStyle"
                            onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
                            autoComplete='off'
                            />
                        </div>
                        <div className="sbTit mr30 ml50">로그인 ID</div>
                        <div className="width150px">
                            <input type="text" 
                            name="userId"
                            value={srcData.userId} 
                            onChange={onChangeSrcData}
                            className="inputStyle"
                            onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
                            autoComplete='off'
                            />
                        </div>
                        <button className="btnStyle btnSearch"
                         onClick={()=>{onSearch()}}
                        >검색</button>
                    </div>
                </div>
                <table className="tblSkin1 mt30">
                    <colgroup>
                        <col/>
                    </colgroup>
                    <thead>
                        <tr>
                        {type && <th><input type="checkbox" checked={allChecked} onChange={onAllCheck} /></th>}
                            <th>사용자명</th>
                            <th>로그인ID</th>
                            <th>부서</th>
                            <th>직급</th>
                            <th>이메일</th>
                            <th>전화번호</th>
                            <th>휴대폰</th>
                            <th className="end">권한</th>
                        </tr>
                    </thead>
                    <tbody>

                    {
                bidCustUserList?.content?.length > 0 ? (
                    bidCustUserList.content.map((item) => (

                    <tr key={item.userId}>
                       {type && 
                       <td><input type="checkbox" checked={selectedUserIds.some((selectedItem) => selectedItem.userId === item.userId)} onChange={(e) => onCheck(e, item)} />
                        </td>}
                        <td>{ item.userName }</td>
                        <td>{ item.userId }</td>
                        <td>{ item.userBuseo }</td>
                        <td>{ item.userPosition }</td>
                        <td>{ item.userEmail }</td>
                        <td>{ onAddDashTel(item.userTel) }</td>
                        <td>{ onAddDashTel(item.userHp) }</td>
                        <td className="end">{ item.userType === '1' ? '업체관리자' : '사용자'}</td>
                    </tr>
                ))
                ) :
                (
                <tr>
                    <td className="end" colSpan="8">조회된 데이터가 없습니다.</td>
                </tr> 
                )
                }
                    </tbody>
                </table>

                <div className="row mt30">
                    <div className="col-xs-12">
                    <Pagination onChangeSrcData={onChangeSrcData} list={bidCustUserList} />
                    </div>
                </div>
                <div className="modalFooter">
                <button className="modalBtnClose" title="닫기" onClick={()=>{onBidCustUserListModalHide()}}>닫기</button>
                {type && <button className="btnStyle btnSecondary" title="저장" onClick={()=>{onSaveCustUser()}}>저장</button>}
                </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}

export default BidCustUserList
