import React from 'react'
import { useLocation } from 'react-router-dom';


const BidProgressDetail = () => {

  const location = useLocation();
  const viewType = location.state.viewType;

  console.log(location)
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

      </div>
    </div>
  )
}

export default BidProgressDetail;
