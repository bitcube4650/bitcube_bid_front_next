import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import BidCommonInfo from '../components/BidCommonInfo';
import BidProgressDel from '../components/BidProgressDel'


const BidProgressDetail = () => {

  const loginInfo = JSON.parse(localStorage.getItem("loginInfo"))

  const loginId = loginInfo.userId
  const interNm = loginInfo.custName
  const [data, setData] = useState({})
  const [isEditUser,setIsEditUser] = useState(false)
  const [isBidProgressDelModal, setIsBidProgressDelModal] = useState(false)
  const navigate = useNavigate();
  const location = useLocation();


  const biNo = localStorage.getItem('biNo')
  const onBidDetail = async()=>{

    const params = {
      biNo : biNo
    }
    try {
      const response = await axios.post(`/api/v1/bidstatus/statusDetail`, params);
      setData(response.data.data)
      const data = response.data.data

      setIsEditUser(loginId === data.createUser)

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
      // result : data[0][0],
      // tableContent : data[1],
      // fileContent : data[2],
      // custContent : data[3],
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

  const onBidProgressDelModal =()=>{
    setIsBidProgressDelModal(true)
  }


  const onBidNoticeConfirm = ()=>{
    Swal.fire({
      title: '입찰 공고',          
      text: '입찰공고를 하면 입찰 참가업체에게 입찰공고 메일이 발송되고 수정이 불가하게 됩니다.\n 입찰공고 하시겠습니까?',  
      icon: 'question',                // success / error / warning / info / question
      confirmButtonColor: '#3085d6',  // 기본옵션
      confirmButtonText: '입찰 공고',      // 기본옵션
      showCancelButton: true,         // conrifm 으로 하고싶을떄
      cancelButtonColor: '#d33',      // conrifm 에 나오는 닫기버튼 옵션
      cancelButtonText: '취소'        // conrifm 에 나오는 닫기버튼 옵션
    }).then(result => {
      if (result.isConfirmed) { 
        onBidNotice()
      }
    })
  }
  const onBidNotice = async ()=>{

    const params = {
        biNo : data.biNo,
        biName : data.biName,
        interNm : interNm,
        biModeCode : data.biMode,
        cuserCode : data.createUser,
    }

    if(data.biMode === 'A'){
      params.custCode = data.custList.map(item => item.custCode).join(',')
      const userIds = data.custUserInfo.map(item => item.userId);
      params.custUserIds = userIds
    }
    

    console.log(params)

    /*
    try {
      await axios.post(`/api/v1/bid/bidNotice`, params);
      Swal.fire('입찰 공고가 완료되었습니다.', '', 'success');
      navigate('/bid/progress');

    } catch (error) {
        Swal.fire('입찰 공고를 실패하였습니다.', '', 'error');
        console.log(error);
    }
    */


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
        
        { isEditUser &&
        <>
          <button
            className="btnStyle btnSecondary"
            title="삭제"
            onClick={()=>{onBidProgressDelModal()}}
            >삭제</button
          >

          <button
            className="btnStyle btnSecondary"
            title="수정"
            >수정</button
          >
          </>
        }
        { (isEditUser || data.gongoId === loginId) &&
          <button
            className="btnStyle btnPrimary"
            title="입찰공고"
            onClick={()=>{onBidNoticeConfirm()}}
            >입찰공고</button
          >
      }
      </div>


      </div>
      <BidProgressDel isBidProgressDelModal={isBidProgressDelModal} setIsBidProgressDelModal={setIsBidProgressDelModal} data={data} interNm={interNm}/>
    </div>
  )
}

export default BidProgressDetail;
