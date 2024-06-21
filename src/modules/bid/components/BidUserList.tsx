import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import Pagination from '../../../components/Pagination'
import axios from 'axios';
import Swal from 'sweetalert2';
import { BidContext } from '../context/BidContext';
import SrcInput from 'components/input/SrcInput';
import { MapType } from 'components/types';

interface BidUserListPropsType{
    isBidUserListModal : boolean;
    setIsBidUserListModal : React.Dispatch<React.SetStateAction<boolean>>
    type : string
}

const BidUserList : React.FC<BidUserListPropsType> = ({isBidUserListModal, setIsBidUserListModal, type}) => {
    
    const {bidContent,setBidContent} = useContext(BidContext);

    const [bidUserList, setBidUserList] = useState<any>({})

    const loginInfo: any = JSON.parse(localStorage.getItem("loginInfo") || '{}');
    
    const userCustCode = loginInfo.custCode

    const [srcData, setSrcData] = useState<MapType>({
        userName: '',
        deptName: '',
        size: 5,
        page: 0,
        interrelatedCD : userCustCode,
        type : type === '개찰자' ? 'openBidUser' : type === '낙찰자' ? 'biddingUser' : 'normalUser'
    });

    const onBidUserListModalHide = ()=>{
        setIsBidUserListModal(false)
    }
        

        const onSearch = useCallback(async () => {
        try {
            const response = await axios.post('/api/v1/bid/userList', srcData);
            setBidUserList(response.data.data);
        } catch (error) {
            Swal.fire('조회에 실패하였습니다.', '', 'error');
            console.log(error);
        }
        }, [srcData]);
    
    useEffect(() => {
        if (isBidUserListModal) {

            const initialSrcData = {
                userName: '',
                deptName: '',
                size: 5,
                page: 0,
                interrelatedCD : userCustCode,
                type : type === '개찰자' ? 'openBidUser' : type === '낙찰자' ? 'biddingUser' : 'normalUser'
            };
            setSrcData(initialSrcData);
            const fetchInitialData = async () => {
            try {
                const response = await axios.post('/api/v1/bid/userList', initialSrcData);
                setBidUserList(response.data.data);
            } catch (error) {
                Swal.fire('조회에 실패하였습니다.', '', 'error');
                console.log(error);
            }
            };
            fetchInitialData();
        }    
    }, [isBidUserListModal,srcData.size, srcData.page]);

    const onUserSelect = (userData : any)=>{
        console.log(userData)

        //개찰자 선택시 낙찰자도 동일하게 세팅
        if(type === '개찰자'){

            setBidContent({
                ...bidContent,
                estOpener : userData.userName,
                estOpenerCode : userData.userId,
                estBidder : userData.userName,
                estBidderCode : userData.userId
            })

        }else if(type === '입찰공고자'){

            setBidContent({
                ...bidContent,
                gongoId : userData.userName,
                gongoIdCode : userData.userId
            })

        }else if(type === '낙찰자'){

            setBidContent({
                ...bidContent,
                estBidder : userData.userName,
                estBidderCode : userData.userId
            })

        }else if(type === '입회자1'){

            setBidContent({
                ...bidContent,
                openAtt1 : userData.userName,
                openAtt1Code : userData.userId
            })
            
        }else if(type === '입회자2'){

            setBidContent({
                ...bidContent,
                openAtt2 : userData.userName,
                openAtt2Code : userData.userId
            })

        }
        onBidUserListModalHide()
    }
        
  return (
    <div>
        <Modal className="modalStyle" show={isBidUserListModal} onHide={onBidUserListModalHide} size="lg">
            <Modal.Body>
                <button className="ModalClose"  title="닫기" onClick={()=>{onBidUserListModalHide()}}><i className="fa-solid fa-xmark"></i></button>
                <h2 className="modalTitle">{type} 조회</h2>
                <div className="modalTopBox">

                        {type === '개찰자' && 
                            <ul>
                                <li>
                                    소속사의 낙찰권한을 가진 사용자만 조회됩니다. (사용자 조회 후 선택버튼을 누르십시오)
                                </li>
                                <li>
                                    개찰자가 조회되지 않을 경우 관리자에게 연락해 주십시오
                                </li>
                            </ul>
                        }

                        {type === '낙찰자' && 
                            <ul>
                                <li>
                                 소속사의 낙찰권한을 가진 사용자만 조회됩니다. (사용자 조회 후 선택버튼을 누르십시오)
                                </li>
                            </ul>
                        }

                        
                    {(type !== '개찰자' && type !== '낙찰자') && 
                            <ul>
                                <li>
                                    소속사 사용자를 조회합니다. (사용자 조회 후 선택버튼을 누르십시오)
                                </li>
                            </ul>
                        }

                </div>

                <div className="modalSearchBox mt20">
                    <div className="flex align-items-center">
                    <div className="sbTit mr30">사원명</div>
                    <div className="width150px">
                        <SrcInput
                            name="userName"
                            srcData={ srcData } 
                            setSrcData={ setSrcData }
                            onSearch={ onSearch }
                        />
                    </div>
                    <div className="sbTit mr30 ml50">부서명</div>
                    <div className="width150px">
                        <SrcInput
                            name="deptName"
                            srcData={ srcData } 
                            setSrcData={ setSrcData }
                            onSearch={ onSearch }
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
                            <th>부서명</th>
                            <th>사원명</th>
                            <th className="end">선택</th>
                        </tr>
                    </thead>
                    <tbody>

                    {
                bidUserList?.content?.length > 0 ? (
                    bidUserList.content.map((item :any) => (

                    <tr key={item.userId}>
                        <td>{ item.deptName }</td>
                        <td>{ item.userName }</td>
                        <td className="end">
                            <button
                                className="btnStyle btnSecondary btnSm"
                                title="선택"
                                onClick={()=>{onUserSelect(item)}}
                            >선택
                            </button>
                        </td>
                    </tr>
                ))
                ) :
                (
                <tr>
                    <td className="end" colSpan={8}>조회된 데이터가 없습니다.</td>
                </tr> 
                )
                }
                    </tbody>
                </table>
                <div className="row mt30">
                    <div className="col-xs-12">
                    <Pagination srcData={ srcData } setSrcData={ setSrcData } list={ bidUserList } />

                    </div>
                </div>
                <div className="modalFooter">
                    <button className="modalBtnClose" title="닫기" onClick={()=>{onBidUserListModalHide()}}>닫기</button>
                </div>



            </Modal.Body>
        </Modal>
    </div>
  )
}

export default BidUserList;
