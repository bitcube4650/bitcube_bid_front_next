import React, { createContext, useState } from 'react';

export const BidContext = createContext();

export const BidProvider = ({ children }) => {

  //세션 로그인 정보

  const [viewType, setViewType] = useState('');

  const [bidContent, setBidContent] = useState(
    {
      //BidBasicInfo.js에서 사용

      biName : '',  // 입찰명
      itemCode : '', // 품목 Code
      itemName : '', // 품목 이름
      biModeCode : 'A', // 입찰방식
      bidJoinSpec : '', // 입찰참가자격 
      specialCond : '', // 특수조건
      spotDay : '', // 현장설명 일시
      spotTime : '', // 현장설명 시간
      spotDate : '', // 현장설명 일시 + 시간
      spotArea : '', // 현장설명장소
      succDeciMethCode : '', // 낙찰자결정방법
      amtBasis : '', // 금액기준
      payCond : '', //결제조건
      bdAmt : '', // 예산금액
      createUserName : '', // 입찰담당자
      createUser : '', // 입찰담당자 및 입찰계획 생성자 ID
      // 롯데일 때만 사용하는 변수들 loginInfo.custCode == '02', custName == '롯데에너지머티리얼즈'
      lotteDeptList: [], // 롯데 분류군 사업부 리스트
      lotteProcList: [], // 롯데 분류군 공정 리스트
      lotteClsList: [], // 롯데 분류군 분류 리스트
      matDept : '', // 사업부
      matProc : '', // 공정
      matCls : '', // 분류
      matFactory : '', // 공장동
      matFactoryLine : '', // 라인
      matFactoryCnt : '', // 호기
  
      minDate : new Date().toISOString().slice(0, 10), // 캘린더 오늘 날짜 설정. 오늘 날짜부터 선택 가능하게 하기 위한 변수

      //BidSaveAddRegist에서 사용

      estStartDay : '', // 제출시작 일시
      estStartTime : '', // 제출시작 시간
      estStartDate : '', // 제출 시간 일시 + 시간
      estCloseDay : '', // 제출마감 일시
      estCloseTime : '', // 제출마감 시간
      estCloseDate : '', // 제출마감 일시 + 시간
      estOpener : '', // 개찰자 이름
      estOpenerCode : '', // 개찰자ID
      gongoId :'', // 입찰공고자 이름
      gongoIdCode : '', // 입찰공고자 ID
      estBidder : '', // 낙찰자 이름
      estBidderCode : '', // 낙찰자 ID
      openAtt1 : '', // 입회자1 이름
      openAtt1Code : '', // 입회자1 ID
      openAtt2 : '', // 입회자2 이름
      openAtt2Code : '', // 입회자2 ID
      insModeCode : '1', // 내역방식
      supplyCond : '',  // 납품조건
      interrelatedCustCode : '' // 로그인 사용자의 custCode
    }
  )

  const [custContent, setCustContent] = useState([]) // 입찰참가업체

  const [custUserName,setCustUserName] = useState([]) // 입찰참가업체 뒤에 표시할 사용자 이름

  const [custUserInfo,setCustUserInfo] = useState([]) // 입찰참가업체 클릭 시 표시할 데이터 정보

  const [tableContent, setTableContent] = useState([]) // 세부내역 직접입력

  const [insFile, setInsFile] = useState(null) // 세부내역 파일등록

  const [innerFiles, setInnerFiles] = useState([]) // 첨부파일 (대내용)

  const [outerFiles, setOuterFiles] = useState([]) // 첨부파일 (대외용)

  


  return (
    <BidContext.Provider value={{viewType, setViewType, bidContent, setBidContent, custContent, setCustContent, custUserName, setCustUserName, custUserInfo, setCustUserInfo, tableContent, setTableContent, insFile, setInsFile, innerFiles, setInnerFiles, outerFiles, setOuterFiles}}>
      {children}
    </BidContext.Provider>
  );
};