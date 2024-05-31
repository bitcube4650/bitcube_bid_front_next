import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import BidSaveBasicInfo from '../components/BidSaveBasicInfo';
import BidSaveAddRegist from '../components/BidSaveAddRegist';
import { BidContext } from '../context/BidContext'; 

const BidProgressSave = () => {
  const navigate = useNavigate();

  const {viewType} = useContext(BidContext);

  const moveBidProgress =()=>{
    navigate('/bid/progress');
  }
  
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
