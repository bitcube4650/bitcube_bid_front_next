import axios from 'axios';
import React, { useCallback, useContext } from 'react';
import Swal from 'sweetalert2';
import { BidContext } from '../context/BidContext';

function BidPastList({bidPastList,onBidPastModalHide}) {
  const { bidContent, setBidContent, custContent, setCustContent,tableContent, setTableContent} = useContext(BidContext);

    const onBidPastSelect = useCallback(async(biNo) => {
      
      try {
          const response = await axios.post("/api/v1/bid/progresslistDetail", {biNo});
          const data = response.data.data
          const bid = data[0][0]
          const currentDate = new Date()
          let currentHours = currentDate.getHours()
          currentHours = currentHours < 10 ? '0' + currentHours : currentHours
          const hours = `${currentHours}:00`

          //과거입찰 선택 시 세팅
          setBidContent({
            ...bidContent, 
            biName : bid.biName,
            itemCode : bid.itemCode,
            itemName : bid.itemName,
            biModeCode : bid.biModeCode,
            bidJoinSpec : bid.bidJoinSpec,
            specialCond : bid.specialCond,
            spotTime : hours,
            spotArea : bid.spotArea,
            succDeciMethCode : bid.succDeciMethCode,
            amtBasis : bid.amtBasis,
            payCond : bid.payCond,
            bdAmt : bid.bdAmt,
            estStartTime : hours,
            estCloseTime :hours,
            estOpener : bid.estOpener,
            estOpenerCode : bid.estOpeerCode,
            gongoId : bid.gongoId,
            gongoIdCode : bid.gongoIdCode,
            estBidder : bid.estBidder,
            estBidderCode : bid.estBidderCode,
            openAtt1 : bid.openAtt1,
            openAtt1Code : bid.openAtt1Code,
            openAtt2 : bid.openAtt2,
            openAtt2Code : bid.openAtt2Code,
            supplyCond : bid.supplyCond

          });
          //지명경쟁입찰('A')일 때는 custContent를 가져와서 세팅. 아닐 때는 배열 초기화
          
          if(data.biModeCode === 'A'){

            setCustContent({
              ...custContent,  
              custContent : data[3]
            })

          }else{

            setCustContent([])

          }

          //세션 로그인 정보
          const loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
          const userCustCode = loginInfo.custCode
          //로그인 정보가 롯데일 때만 세팅
/*
          if(userCustCode === '02'){
            setBidContent({
              ...bidContent,  
              matDept : bid.matDept,
              matProc : bid.matProc, 
              matCls : bid.matCls, 
              matFactory : bid.matFactory,
              matFactoryLine : bid.matFactoryLine,
              matFactoryCnt : bid.matFactoryCnt 
            })
          }
*/
          if(bid.insModeCode === '2'){
            setTableContent(data[1])
          }

          onBidPastModalHide()
          
      } catch (error) {
          Swal.fire('조회에 실패하였습니다.', '', 'error');
          console.log(error);
      }
  });

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