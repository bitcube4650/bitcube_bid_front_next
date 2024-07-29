import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
//import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { BidContext } from '../../../src/modules/bid/context/BidContext';
import { useRouter } from 'next/router';
import BidCommonInfo from '../../../src/modules/bid/components/BidCommonInfo';
import BidBiddingPreview from '../../../src/modules/bid/components/BidBiddingPreview';
import BidProgressDel from '../../../src/modules/bid/components/BidProgressDel';

const Detail = () => {

  const loginInfo :any = JSON.parse(localStorage.getItem("loginInfo") || '{}')

  const loginId = loginInfo.userId
  const interNm = loginInfo.custName
  const [data, setData] = useState<any>({})
  const [isEditUser,setIsEditUser] = useState<boolean>(false)
  const [isBidProgressDelModal, setIsBidProgressDelModal] = useState<boolean>(false)
  const [isBidBiddingPreviewModal,setIsBidBiddingPreviewModal] = useState<boolean>(false)
  //const navigate = useNavigate();
  const router = useRouter();

  const {setViewType, bidContent, setBidContent, setCustContent, setCustUserName, setCustUserInfo, setTableContent, setInsFile, setInnerFiles, setOuterFiles} = useContext(BidContext);

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
    router.push('/bid/progress');
  }

  const onExcel = async() => {
    
    interface ParamsType {
      fileName : string,
      result : any,
      tableContent : any[],
      fileContent : any[],
      custContent : any[],
    }

    const params : ParamsType = {
      fileName : `${biNo}_전자입찰요청서`,
      result : data,
      tableContent: data.specInput ?? [],
      fileContent: [...data.fileList, ...(data.specFile ?? [])], 
      custContent: data.custList ?? [], 
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

  const onBidBiddingPreviewModal = () =>{
    setIsBidBiddingPreviewModal(true)
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
        custCode : [] as string[],
        custUserIds : [] as string[]
    }

    if(data.biMode === 'A'){
      const custCodes: string[] = data.custList.map((item: { custCode: string }) => item.custCode);
      const userIds: string[] = data.custUserInfo.map((item: { userId: string }) => item.userId);
      
      params.custCode = custCodes
      params.custUserIds = userIds
    }
    
    try {
      await axios.post(`/api/v1/bid/bidNotice`, params);
      Swal.fire('입찰 공고가 완료되었습니다.', '', 'success');
      router.push('/bid/progress');

    } catch (error) {
        Swal.fire('입찰 공고를 실패하였습니다.', '', 'error');
        console.log(error);
    }

  }

  const onMoveSave = () =>{

    setViewType('수정')
    localStorage.setItem("viewType", '수정');

    const [spotDay, spotTime] = data.spotDate.split(' ');
    const [estStartDay, estStartTime] = data.estStartDate.split(' ');
    const [estCloseDay, estCloseTime] = data.estCloseDate.split(' ');
    //등록으로 이동 시 state 초기화
    setBidContent({
      ...bidContent,

      //밑에 4개의 변수는 등록 시 로그인 정보로 세팅
      createUserName : data.damdangName, // 입찰담당자
      createUser : data.createUser, // 입찰담당자 및 입찰계획 생성자 ID
      gongoId : data.gongoName, // 입찰공고자 이름
      gongoIdCode : data.gongoId, // 입찰공고자 ID

      biNo : data.biNo, // 입찰번호
      biName : data.biName,  // 입찰명
      itemCode : data.itemCode, // 품목 Code
      itemName : data.itemName, // 품목 이름
      biModeCode : data.biMode, // 입찰방식
      bidJoinSpec : data.bidJoinSpec, // 입찰참가자격 
      specialCond : data.specialCond, // 특수조건
      spotDay : spotDay, // 현장설명 일시
      spotTime : spotTime, // 현장설명 시간
      spotData : data.spotDate, // 현장설명 일시 및 시간
      spotArea : data.spotArea, // 현장설명장소
      succDeciMethCode : data.succDeciMethCode, // 낙찰자결정방법
      amtBasis : data.amtBasis, // 금액기준
      payCond : data.payCond, //결제조건
      bdAmt : data.bdAmt ? data.bdAmt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '', // 예산금액
      // 롯데일 때만 사용하는 변수들 loginInfo.custCode == '02', custName == '롯데에너지머티리얼즈'
      lotteDeptList: [], // 롯데 분류군 사업부 리스트
      lotteProcList: [], // 롯데 분류군 공정 리스트
      lotteClsList: [], // 롯데 분류군 분류 리스트
      matDept : data.matDept, // 사업부
      matProc : data.matProc, // 공정
      matCls : data.matCls, // 분류
      matFactory : data.matFactory, // 공장동
      matFactoryLine : data.matFactoryLine, // 라인
      matFactoryCnt : data.matFactoryCnt, // 호기

      //BidSaveAddRegist에서 사용

      estStartDay : estStartDay, // 제출시작 일시
      estStartTime : estStartTime, // 제출시작 시간
      estStartDate : data.estStartDate, // 제출시작 일시 + 시간
      estCloseDay : estCloseDay, // 제출시작 일시
      estCloseTime : estCloseTime, // 제출시작 시간
      estCloseDate : data.estCloseDate, // 제출시작 일시 + 시간
      estOpener : data.estOpener, // 개찰자 이름
      estOpenerCode : data.estOpenerId, // 개찰자ID
      estBidder : data.estBidder, // 낙찰자 이름
      estBidderCode : data.estBidderId, // 낙찰자 ID
      openAtt1 : data.openAtt1 ? data.openAtt1 : '', // 입회자1 이름
      openAtt1Code : data.openAtt1Id, // 입회자1 ID
      openAtt2 : data.openAtt2 ? data.openAtt2 : '', // 입회자2 이름
      openAtt2Code : data.openAtt2Id, // 입회자2 ID
      insModeCode : data.insMode, // 내역방식
      supplyCond : data.supplyCond,  // 납품조건
      interrelatedCustCode : loginInfo.custCode, // 로그인한 계정의 custCode
      insFileCheck : 'Y',
    })
    
    const custUserInfo = data.custUserInfo

    if(custUserInfo && custUserInfo.length > 0){
    
      interface UserInfo {
        custCode: string;
        userName: string;
      }

      const custCodeUserName: UserInfo[] = custUserInfo.reduce((acc: UserInfo[], userInfo: UserInfo) => {
      const custCode = acc.find((item: UserInfo) => item.custCode === userInfo.custCode);

        if (custCode) {
          custCode.userName += ', ' + userInfo.userName;
        } else {
            acc.push({ custCode: userInfo.custCode, userName: userInfo.userName });
        }

          return acc;
        }, []);
        setCustContent(data.custList) // 입찰참가업체
        setCustUserName(custCodeUserName) // 입찰참가업체 뒤에 표시할 사용자 이름
        setCustUserInfo(custUserInfo) // 입찰참가업체 클릭 시 표시할 데이터 정보

    }else{
      setCustContent([])
      setCustUserName([])
      setCustUserInfo([])
    }

    //세부내역 1 : 파일등록. 2 : 직접 입력
    if(data.insMode ==='1'){
      const insFileData = data.specFile[0]
      setInsFile(insFileData) // 세부내역 파일등록
    }else{
      setTableContent(data.specInput.map((item : any) => {
        return { ...item, 
          orderQty : item.orderQty.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          orderUc: item.orderUc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
    })) // 세부내역 직접입력
      setInsFile(null)  
    }

    const fileList = data.fileList
    if(fileList.length > 0){
      const innerFilesData = fileList.filter((item : {fileFlag : string}) => item.fileFlag === '0')
      const outerFilesData = fileList.filter((item : {fileFlag : string}) => item.fileFlag === '1')

      setInnerFiles(innerFilesData) // 첨부파일 (대내용)
      setOuterFiles(outerFilesData) // 첨부파일 (대외용)
    }else{
      setInnerFiles([]) 
      setOuterFiles([]) 
    }
    
    router.push('/bid/progress/save');    
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
            onClick={()=>{onBidBiddingPreviewModal()}}
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
            onClick={()=>{onMoveSave()}}
            >수정</button
          >
          </>
        }
        { (isEditUser || data.gongoId=== loginId) &&
          <button
            className="btnStyle btnPrimary"
            title="입찰공고"
            onClick={()=>{onBidNoticeConfirm()}}
            >입찰공고</button
          >
      }
      </div>


      </div>
      <BidBiddingPreview isBidBiddingPreviewModal={isBidBiddingPreviewModal} setIsBidBiddingPreviewModal={setIsBidBiddingPreviewModal} data={data}/>
      <BidProgressDel isBidProgressDelModal={isBidProgressDelModal} setIsBidProgressDelModal={setIsBidProgressDelModal} data={data} interNm={interNm}/>
    </div>
  )
}

export default Detail;
