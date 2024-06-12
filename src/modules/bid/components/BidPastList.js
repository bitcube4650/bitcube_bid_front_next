import axios from 'axios';
import React, { useCallback, useContext } from 'react';
import Swal from 'sweetalert2';
import { BidContext } from '../context/BidContext';

function BidPastList({bidPastList,onBidPastModalHide}) {
  const { bidContent, setBidContent, custContent, setCustContent,tableContent, setTableContent,custUserInfo, setCustUserInfo,custUserName,setCustUserName} = useContext(BidContext);

    const onBidPastSelect = useCallback(async(biNo) => {
      
      try {
          const response = await axios.post("/api/v1/bid/progresslistDetail", {biNo});
          const data = response.data.data
          console.log(data)
          const bid = data[0][0]
          console.log(bid)
          const currentDate = new Date()
          let currentHours = currentDate.getHours()
          currentHours = currentHours < 10 ? '0' + currentHours : currentHours
          const hours = `${currentHours}:00`

          //지명경쟁입찰('A')일 때는 custContent를 가져와서 세팅. 아닐 때는 배열 초기화
          
          if(bid.biModeCode === 'A'){

            const custUSerInfoData = data[4]

            if(custUSerInfoData.length >0){
    
              const custCodeUserName = custUSerInfoData.reduce((acc, userInfo) => {
              const custCode = acc.find(item => item.custCode === userInfo.custCode);
    
                if (custCode) {
                  custCode.userName += ', ' + userInfo.userName;
                } else {
                    acc.push({ custCode: userInfo.custCode, userName: userInfo.userName });
                }
    
                  return acc;
                }, []);
                setCustContent(data[3])
                setCustUserName(custCodeUserName)
                setCustUserInfo(data[4])

            }else{
              setCustContent([])

            }
          }
          
          const loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
          const userCustCode = loginInfo.custCode;

          //과거입찰 선택 시 세팅
          const updatedBidContent = {
            ...bidContent,
            biName: bid.biName,
            itemCode: bid.itemCode,
            itemName: bid.itemName,
            biModeCode: bid.biModeCode,
            bidJoinSpec: bid.bidJoinSpec,
            specialCond: bid.specialCond,
            spotDay : '',
            spotTime: hours,
            //spotDate : '',
            spotArea: bid.spotArea,
            succDeciMethCode: bid.succDeciMethCode,
            amtBasis: bid.amtBasis,
            payCond: bid.payCond,
            bdAmt: bid.bdAmt ? bid.bdAmt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '',
            estStartDay : '',
            estStartTime: hours,
            //estStartDate: '',
            estCloseDay: '',
            estCloseTime: hours,
            //estCloseDate : '',
            estOpener: bid.estOpener,
            estOpenerCode: bid.estOpenerCode,
            gongoId: bid.gongoId,
            gongoIdCode: bid.gongoIdCode,
            estBidder: bid.estBidder,
            estBidderCode: bid.estBidderCode,
            openAtt1: bid.openAtt1,
            openAtt1Code: bid.openAtt1Code,
            openAtt2: bid.openAtt2,
            openAtt2Code: bid.openAtt2Code,
            insModeCode: bid.insModeCode,
            supplyCond: bid.supplyCond
          };

          if (userCustCode === '02') {
            updatedBidContent.matDept = bid.matDept;
            updatedBidContent.matProc = bid.matProc;
            updatedBidContent.matCls = bid.matCls;
            updatedBidContent.matFactory = bid.matFactory ? bid.matFactory : '';
            updatedBidContent.matFactoryLine = bid.matFactoryLine ? bid.matFactoryLine : '';
            updatedBidContent.matFactoryCnt = bid.matFactoryCnt ? bid.matFactoryCnt : '';
          }
    
          setBidContent(updatedBidContent);

          if(bid.insModeCode === '2'){
             setTableContent(data[1].map(item => {
                return { ...item, orderQty : item.orderQty.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),orderUc: item.orderUc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')};
            }))            
          }

          onBidPastModalHide()
          
      } catch (error) {
          Swal.fire('조회에 실패하였습니다.', '', 'error');
          console.log(error);
      }
  },[bidContent, setBidContent, setCustContent, setCustUserInfo, setCustUserName, setTableContent, onBidPastModalHide]);

    return (

        <tr>
         <td>{bidPastList.biNo}</td>
        <td>{bidPastList.biName}</td>
        <td>{bidPastList.estCloseDate}</td>
        <td>{bidPastList.biMode}</td>
        <td>{bidPastList.ingTag}</td>
        <td>{bidPastList.insMode}</td>
        <td className="end">
          <button className="btnStyle btnSecondary btnSm" title="선택" onClick={ () => {
              onBidPastSelect(bidPastList.biNo)
            }
          }>선택</button>
        </td>
      </tr> 

    );
};

export default BidPastList;