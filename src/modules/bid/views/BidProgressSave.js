import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BidSaveBasicInfo from '../components/BidSaveBasicInfo';
import BidSaveAddRegist from '../components/BidSaveAddRegist';
import { BidContext } from '../context/BidContext'; 
import Swal from 'sweetalert2';
import axios from 'axios';

const BidProgressSave = () => {
  const loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));

  const navigate = useNavigate();

  const {viewType, setViewType, bidContent, setBidContent,custContent,custUserInfo,tableContent, insFile,innerFiles, outerFiles} = useContext(BidContext);
  const onMoveBidProgress =()=>{
    navigate('/bid/progress');
  }

  useEffect(() => {
    if(!viewType){
      const sessionViewType = sessionStorage.getItem('viewType')
      setViewType(sessionViewType)
    }

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

  useEffect(() => {
    const spotDay = bidContent.spotDay
    const spotTime = bidContent.spotTime
    const estStartDay = bidContent.estStartDay
    const estStartTime = bidContent.estStartTime
    const estCloseDay = bidContent.estCloseDay
    const estCloseTime = bidContent.estCloseTime
    
    setBidContent({
      ...bidContent,
      spotDate : `${spotDay} ${spotTime}`,
      estStartDate : `${estStartDay} ${estStartTime}`,
      estCloseDate : `${estCloseDay} ${estCloseTime}`,
    })

  }, [bidContent.spotDay, bidContent.spotTime, bidContent.estStartDay, bidContent.estStartTime, bidContent.estCloseDay, bidContent.estCloseTime])
  

  const onSaveVali = ()=>{

    const spotDay = bidContent.spotDay
    const spotTime = bidContent.spotTime
    const estStartDay = bidContent.estStartDay
    const estStartTime = bidContent.estStartTime
    const estCloseDay = bidContent.estCloseDay
    const estCloseTime = bidContent.estCloseTime

    if (!bidContent.biName) {
      Swal.fire('', '입찰명을 입력해 주세요.', 'warning')
      return false;
    }
    if (!bidContent.itemCode) {
      Swal.fire('', '품목을 선택해 주세요.', 'warning')
      return false;
    }
    if (!bidContent.bidJoinSpec) {
      Swal.fire('', '입찰참가자격을 입력해 주세요.', 'warning')
      return false;
    }
    if (!spotDay) {
      Swal.fire('', '현장설명일시 날짜를 선택해 주세요.', 'warning')
      return false;
    }
    if (!spotTime) {
      Swal.fire('', '현장설명일시 시간을 선택해 주세요.', 'warning')
      return false;
    }

    const spotDateTime = new Date(`${spotDay} ${spotTime}`)

    const currentTime = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"}));

    if (currentTime > spotDateTime) {
        Swal.fire('', '현장설명일시는 현재 시간보다 큰 시간을 선택해야 합니다.', 'warning')
        return false
    } 

    if (!bidContent.spotArea) {
      Swal.fire('', '현장설명장소를 입력해 주세요.', 'warning')
      return false;
    }
    if(bidContent.biModeCode === 'A' && custContent.length === 0){
      Swal.fire('', '입찰 참가업체를 선택해 주세요.', 'warning')
      return false;
    }
    if (!bidContent.amtBasis) {

      Swal.fire('', '금액기준을 입력해 주세요.', 'warning')
      return false;
    }

    if (!estStartDay) {
      Swal.fire('', '제출시작일시 날짜를 선택해 주세요.', 'warning')
      return false;
    }
    if (!estStartTime) {
      Swal.fire('', '제출시작일시 시간을 선택해 주세요', 'warning')
      return false;
    }

    if (!estCloseDay) {
      Swal.fire('', '제출마감일시 날짜를 선택해 주세요.', 'warning')
      return false;
    }
    if (!estCloseTime) {
      Swal.fire('', '제출마감일시 시간을 선택해 주세요.', 'warning')
      return false;
    }

    const startDateTime = new Date(`${estStartDay}T${estStartTime}`)
    const closeDateTime = new Date(`${estCloseDay}T${estCloseTime}`);
    
    const closeDate = new Date(`${estCloseDay} ${estCloseTime}`)
    
    if (currentTime > closeDate) {
      Swal.fire('', '제출마감일시는 현재 시간보다 큰 시간을 선택해야 합니다.', 'warning')
      return false
    } 

    if (startDateTime > closeDateTime) {
      Swal.fire('', '제출시작일시가 제출마감일시보다 큽니다.', 'warning')
      return false;
    }

    if (!bidContent.estOpenerCode) {
      Swal.fire('', '개찰자를 선택해 주세요.', 'warning')
      return false;
    }
    if (!bidContent.gongoIdCode) {
      Swal.fire('', '입찰공고자를 선택해 주세요.', 'warning')
      return false;
    }
    if (!bidContent.estBidderCode) {
      Swal.fire('', '낙찰자를 선택해 주세요.', 'warning')
      return false;
    }
    if (!bidContent.supplyCond) {
      Swal.fire('', '납품조건을 입력해 주세요.', 'warning')
      return false;
    }

    //세부내역 파일등록 경우
    if (bidContent.insModeCode === "1") {
      if (!insFile) {
        Swal.fire('', '세부내역파일을 업로드해 주세요.', 'warning')
        return false;
      }
    }else{
      // 세부내역이 직접 입력인 경우
      if(tableContent.length === 0){
        Swal.fire('', '세부내역을 추가해 주세요.', 'warning')
        return false;
      }else{
        //내역직접등록에서 입력하지 않은 값이 있는지 확인
          const nameCheck = tableContent.filter(item => !item.name.trim())
          const ssizeCheck = tableContent.filter(item => !item.ssize.trim())
          const unitcodeCheck = tableContent.filter(item => !item.unitcode.trim())
          const orderUcCheck = tableContent.filter(item => !item.orderUc.trim())
          const orderQtyCheck = tableContent.filter(item => !item.orderQty.trim())

          if(nameCheck.length > 0){
            Swal.fire('', '세부내역 품목명을 입력해 주세요.', 'warning')
            return false;
          }
          if(ssizeCheck.length > 0){
            Swal.fire('', '세부내역 규격명을 입력해 주세요.', 'warning')
            return false;
          }
          if(unitcodeCheck.length > 0){
            Swal.fire('', '세부내역 단위를 입력해 주세요.', 'warning')
            return false;
          }
          if(orderUcCheck.length > 0){
            Swal.fire('', '세부내역 예정단가를 입력해 주세요.', 'warning')
            return false;
          }
          if(orderQtyCheck.length > 0){
            Swal.fire('', '세부내역 수량을 입력해 주세요.', 'warning')
            return false;
          }
      }

    }

    return true;

  }

  const onSaveConfirm = ()=>{
    if(onSaveVali()) {
      Swal.fire({
        title: '입찰 계획 저장',          
        text: '작성하신 내용으로 입찰계획을 저장합니다. 저장하시겠습니까?',  
        icon: 'question',                // success / error / warning / info / question
        confirmButtonColor: '#3085d6',  // 기본옵션
        confirmButtonText: '저장',      // 기본옵션
        showCancelButton: true,         // conrifm 으로 하고싶을떄
        cancelButtonColor: '#d33',      // conrifm 에 나오는 닫기버튼 옵션
        cancelButtonText: '취소'        // conrifm 에 나오는 닫기버튼 옵션
      }).then(result => {
        if (result.isConfirmed) { 
          onSaveBid()
        }
      })
    }
  }
  
  const onSaveBid = async () => {

    let custUserInfoData = {}

    if (bidContent.biModeCode === "A") {
      //등록되는 입찰 bino로 set

      const custUserInfoFilter = {};

      custUserInfo.forEach(info => {

          if (!custUserInfoFilter[info.custCode]) {

            custUserInfoFilter[info.custCode] = '';
          } else {

            custUserInfoFilter[info.custCode] += ',';
          }

          custUserInfoFilter[info.custCode] += info.userId;
      });


      custUserInfoData = Object.keys(custUserInfoFilter).map(custCode => ({
          custCode: custCode,
          usemailId: custUserInfoFilter[custCode]
      }));
      console.log(custUserInfoData)
    }


      let fd = new FormData()
      let tableContentData = []

      if(bidContent.insModeCode === "1"){
        fd.append("insFile", insFile)
      }else{
        tableContentData = tableContent.map((item, idx) => {
          return { ...item, seq: idx + 1, orderQty : Number(item.orderQty.replace(/,/g, '')),orderUc: Number(item.orderUc.replace(/,/g, ''))}
       });
      }
      if(innerFiles.length > 0){
        innerFiles.forEach(file => {
          fd.append("innerFiles", file)
        })
      }
      if(outerFiles.length > 0){
        outerFiles.forEach(file => {
          fd.append("outerFiles", file)
        })
      }


      const type = '등록' ? 'insert' : 'update'
      const updatedBidContent = {
        ...bidContent,
        custUserInfo: custUserInfoData,
        userId: loginInfo.userId,
        bdAmt : bidContent.bdAmt.replace(/[^\d-]/g, ''),
        type : type
      };

      setBidContent(updatedBidContent);

      const params = {
        bidContent : updatedBidContent,
        custContent : custContent,
        tableContent : tableContentData
      }

      console.log(params)

      fd.append("bidContent", JSON.stringify(params))
      
      
      try {
        await axios.post(`/api/v1/bid/${type}Bid`, fd);
        Swal.fire('입찰계획이 저장되었습니다.', '', 'success');
        onMoveBidProgress()
        
      } catch (error) {
          Swal.fire('입찰계획 저장을 실패하였습니다.', '', 'error');
          console.log(error);
      }

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
          <div className="text-center mt50">
            <button title="목록" className="btnStyle btnOutline" onClick={()=>{onMoveBidProgress()}}>목록 </button> 
            <button className="btnStyle btnPrimary" onClick={()=>onSaveConfirm()}>저장</button></div>
        </div>
      </div>
    </div>
  )
}

export default BidProgressSave;
