import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BidSaveBasicInfo from '../components/BidSaveBasicInfo';
import BidSaveAddRegist from '../components/BidSaveAddRegist';
import { BidContext } from '../context/BidContext'; 

const BidProgressSave = () => {
  const navigate = useNavigate();

  const {viewType, bidContent,setBidContent} = useContext(BidContext);

  const moveBidProgress =()=>{
    navigate('/bid/progress');
  }

  useEffect(() => {
    if (viewType === '등록') {
      const currentDate = new Date();
      let currentHours = currentDate.getHours();
      currentHours = currentHours < 10 ? '0' + currentHours : currentHours;

      const hours = `${currentHours}:00`;

      setBidContent({
        ...bidContent,
        spotTime: hours,
        estStartTime: hours,
        estCloseTime: hours,
      });
    }
  }, []);
  
  return (
    <div className="conRight">

      {/* conHeader  */}
      <div className="conHeader">
        <ul className="conHeaderCate">
          <li>전자입찰</li>
          <li>입찰계획 {viewType} </li>
        </ul>
      </div>
      {/* conHeader */}
      
      {/* contents  */}
      <div className="contents">
        <div className="formWidth">
          <BidSaveBasicInfo/>
          <BidSaveAddRegist/>
          <div className="text-center mt50"><button title="목록" className="btnStyle btnOutline" onClick={moveBidProgress}>목록 </button> <button className="btnStyle btnPrimary">저장</button></div>
        </div>
      </div>
    </div>
  )
}

export default BidProgressSave;
