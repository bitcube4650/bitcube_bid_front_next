import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate  } from "react-router-dom";
import axios from 'axios';
import Pagination from '../../../components/Pagination';
import Swal from 'sweetalert2'; // 공통 팝업창
import BidProgressList from '../components/BidProgressList';
import { BidContext } from '../context/BidContext';

const BidProgress = () => {

  //세션 로그인 정보
  const loginInfo = JSON.parse(localStorage.getItem("loginInfo"))

  const navigate = useNavigate();
  const {viewType, setViewType, bidContent, setBidContent, setCustContent, setCustUserName, setCustUserInfo, setTableContent, setInsFile, setInnerFiles, setOuterFiles} = useContext(BidContext);

  const moveSave = (type)=>{
    setViewType(type)
    localStorage.setItem("viewType", type);
    if(type === '등록'){

      //등록으로 이동 시 state 초기화
      setBidContent({
        ...bidContent,

        //밑에 4개의 변수는 등록 시 로그인 정보로 세팅
        createUserName : loginInfo.userName, // 입찰담당자
        createUser : loginInfo.userId, // 입찰담당자 및 입찰계획 생성자 ID
        gongoId : loginInfo.userName, // 입찰공고자 이름
        gongoIdCode : loginInfo.userId, // 입찰공고자 ID

        biName : '',  // 입찰명
        itemCode : '01', // 품목 Code
        itemName : '농업', // 품목 이름
        biModeCode : 'A', // 입찰방식
        bidJoinSpec : '', // 입찰참가자격 
        specialCond : '', // 특수조건
        spotDay : '', // 현장설명 일시
        spotTime : '', // 현장설명 시간
        spotArea : '', // 현장설명장소
        succDeciMethCode : '', // 낙찰자결정방법
        amtBasis : '', // 금액기준
        payCond : '', //결제조건
        bdAmt : '', // 예산금액
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
        estCloseDay : '', // 제출시작 일시
        estCloseTime : '', // 제출시작 시간
        estOpener : '', // 개찰자 이름
        estOpenerCode : '', // 개찰자ID
        estBidder : '', // 낙찰자 이름
        estBidderCode : '', // 낙찰자 ID
        openAtt1 : '', // 입회자1 이름
        openAtt1Code : '', // 입회자1 ID
        openAtt2 : '', // 입회자2 이름
        openAtt2Code : '', // 입회자2 ID
        insModeCode : '1', // 내역방식
        supplyCond : '',  // 납품조건
        interrelatedCustCode : loginInfo.custCode // 로그인한 계정의 custCode
  
      })
      
      setCustContent([]) // 입찰참가업체
      setCustUserName([]) // 입찰참가업체 뒤에 표시할 사용자 이름
      setCustUserInfo([]) // 입찰참가업체 클릭 시 표시할 데이터 정보
      setTableContent([]) // 세부내역 직접입력
      setInsFile(null)  // 세부내역 파일등록
      setInnerFiles([]) // 첨부파일 (대내용)
      setOuterFiles([]) // 첨부파일 (대외용)
    }else{

    }

        navigate('/bid/progress/save');
  }


     //조회 결과
     const [progressList, setProgressList] = useState({});
     //조회조건
     const [srcData, setSrcData] = useState({
         biNo   : "",
         biName : "",
         size    : 10,
         page    : 0
     });
 
     const onChangeSrcData = (e) => {
         setSrcData({
             ...srcData,
             [e.target.name]: e.target.value
         });
     }
 
     const onSearch = useCallback(async() => {
         try {
             const response = await axios.post("/api/v1/bid/progressList", srcData);
             setProgressList(response.data.data)
         } catch (error) {
             Swal.fire('조회에 실패하였습니다.', '', 'error');
             console.log(error);
         }
     });
 
     useEffect(() => {
         onSearch();
     },[srcData.size, srcData.page]);



  return (
    <div className="conRight">
      {/* header */}
      <div className="conHeader">
        <ul className="conHeaderCate">
          <li>전자입찰</li>
          <li>입찰계획</li>
        </ul>
      </div>

    {/* contents */}
      <div className="contents">
        {/* headerContents */}
        <div className="conTopBox">
          <ul className="dList">
            <li>
              <div>입찰담당자가 생성한 입찰목록입니다. 입찰 공고자는 입찰계획 내용을 상세히 확인하시고 공고 하십시오.(입찰번호 또는 입찰명을 클릭하시면 상세내용을 확인할 수 있습니다)</div>
            </li>
            <li className="textHighlight">
              <div>입찰공고자는 제출마감일시 전에 입찰공고 하지 않으면 해당 입찰은 자동으로 삭제됩니다.</div>
            </li>
            <li>
              <div>담당자 또는 공고자를 클릭하면 해당인에게 메일을 보낼 수 있습니다.</div>
            </li>
          </ul>
        </div>
        
      {/* searchBox */}
        <div className="searchBox mt20">
          <div className="flex align-items-center">
            <div className="sbTit mr30">입찰번호</div>
            <div className="width250px">
              <input
                type="text"
                name="biNo"
                onChange={onChangeSrcData}
                onKeyDown={ (e) => { 
                    if(e.key === 'Enter') onSearch()
                  }
                }
                className="inputStyle"
                maxLength="10"
                autoComplete="off"
              />
            </div>
            <div className="sbTit mr30 ml50">입찰명</div>
            <div className="width250px">
              <input
                type="text"
                name="biName"
                onChange={onChangeSrcData}
                onKeyDown={ (e) => { 
                  if(e.key === 'Enter') onSearch()
                }
              }
                className="inputStyle"        
                maxLength="50"
                autoComplete="off"
              />
            </div>
            <button 
            className="btnStyle btnSearch" 
            onClick={ ()=>{
                onSearch()
              }
            }
              >검색
            </button>
          </div>
        </div>

      {/* 건수 */}
        <div className="flex align-items-center justify-space-between mt40">
        <div className="width100">
          전체 : <span className="textMainColor"><strong>{progressList?.totalElements ? progressList.totalElements.toLocaleString() : 0 }</strong>
          </span>건
          <select onChange={onChangeSrcData} name="size" className="selectStyle maxWidth140px ml20">
            <option value="10">10개씩 보기</option>
            <option value="20">20개씩 보기</option>
            <option value="30">30개씩 보기</option>
            <option value="50">50개씩 보기</option>
          </select>
        </div>
        <div>
           <button
              onClick={()=>moveSave('등록')}
              className="btnStyle btnPrimary"
              title="입찰계획등록"
              >입찰계획등록
            </button> 
        </div>
      </div>
      <table className="tblSkin1 mt10">
        <colgroup>
            <col style={{width:'12%'}} />
            <col />
            <col style={{width:'15%'}} />
            <col style={{width:'15%'}} />
            <col style={{width:'10%'}} span={4}/>
        </colgroup>
        <thead>
            <tr>
              <th>입찰번호</th>
              <th>입찰명</th>
              <th>제출시작일시</th>
              <th>제출마감일시</th>
              <th>입찰방식</th>
              <th>내역</th>
              <th>담당자</th>
              <th className="end">공고자</th>
            </tr>
        </thead>
        <tbody>
          {progressList?.content?.length > 0 ? (
            progressList.content.map((item) => (
              <BidProgressList key={item.biNo} progressList={item} />
            ))
          ) : (
            <tr>
              <td className="end" colSpan="8">조회된 데이터가 없습니다.</td>
            </tr>
          )}
        </tbody>
    </table>
    <div className="row mt40">
          <div className="col-xs-12">
              <Pagination onChangeSrcData={onChangeSrcData} list={progressList} />
          </div>
    </div>        
      </div>
    </div>
  )
}

export default BidProgress;