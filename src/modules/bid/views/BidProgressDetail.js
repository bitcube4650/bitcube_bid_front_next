import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import BidCommonInfo from '../components/BidCommonInfo';


const BidProgressDetail = () => {

  const [data, setData] = useState({})
  const navigate = useNavigate();
  const location = useLocation();

  const biNo = localStorage.getItem('biNo')
  const onBidDetail = async()=>{

    try {
      const response = await axios.post(`/api/v1/bid/progresslistDetail`, {biNo});
      setData(response.data.data)
    } catch (error) {
        Swal.fire('입찰계획 상세 조회를 실패하였습니다.', '', 'error');
        console.log(error);
    }
  }

  useEffect(() => {
    onBidDetail()
  }, [])
  
  const onMoveBidProgress =()=>{
    navigate('/bid/progress');
  }

  const onExcel = async() => {

    const params = {
      fileName : `${biNo}_전자입찰요청서`,
      result : data[0][0],
      tableContent : data[1],
      fileContent : data[2],
      custContent : data[3],
    }

    try {
      const response = await axios.post(`/api/v1/excel/bid/progressDetail/downLoad`, params);
      const url = window.URL.createObjectURL(new Blob([response.data])); // 응답 데이터를 Blob 형식으로 변환하여 URL을 생성합니다.
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${biNo}_전자입찰요청서.xlsx`); // 다운로드할 파일명을 설정합니다.
      document.body.appendChild(link);
      link.click(); window.URL.revokeObjectURL(url)
    } catch (error) {
        Swal.fire('입찰계획 엑셀 변환을 실패하였습니다.', '', 'error');
        console.log(error);
    }
    
  }
  
  return (
    <div className="conRight">

      {/* conHeader  */}
      <div className="conHeader">
        <ul className="conHeaderCate">
          <li>전자입찰</li>
          <li>입찰계획 상세 </li>
        </ul>
      </div>

      <div className="contents">
      <BidCommonInfo key={`info_${biNo}`} data={data} BidProgressDetail="Y"/>



      <div className="text-center mt50">
          <button className="btnStyle btnOutline" title="목록" onClick={()=>{onMoveBidProgress()}}
            >목록
          </button>
          <button className="btnStyle btnOutline" title="엑셀변환" onClick={()=>{onExcel()}}
            >엑셀변환</button
          >
          <button
            className="btnStyle btnOutline"
            title="공고문 미리보기"
            >공고문 미리보기</button
          >
          <button

            className="btnStyle btnSecondary"
            title="삭제"
            >삭제</button
          >
          <button
            className="btnStyle btnSecondary"
            title="수정"
            >수정</button
          >
          <button

            className="btnStyle btnPrimary"
            title="입찰공고"
            >입찰공고</button
          >
        </div>


      </div>
    </div>
  )
}

export default BidProgressDetail;
