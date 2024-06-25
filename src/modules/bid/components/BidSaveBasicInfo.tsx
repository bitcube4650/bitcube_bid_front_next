import React, { useCallback, useContext, useEffect, useState } from 'react'
import BidPast from './BidPast';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BidContext } from '../context/BidContext';
import BidCustList from './BidCustList';
import BidCustUserList from './BidCustUserList';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from "date-fns/locale";
import { format } from 'date-fns';
import ItemPop from 'modules/signup/components/ItemPop';
import SrcInput from '../../../components/input/SrcInput';
import { MapType } from 'components/types';
import EditTextArea from 'components/input/EditTextArea';
import * as CommonUtils from 'components/CommonUtils';
import SrcDatePicker from 'components/input/SrcDatePicker';

const BidSaveBasicInfo = () => {

  //세션 로그인 정보
  const loginInfo : any = JSON.parse(localStorage.getItem("loginInfo") || '{}')
  const userCustCode = loginInfo.custCode

  const {viewType, bidContent, setBidContent, custContent, setCustContent, custUserName, setCustUserName, custUserInfo, setCustUserInfo} = useContext(BidContext);

  const [isBidPastModal, setIsBidPastModal] = useState<boolean>(false);
  const [isBidCustListModal, setIsBidCustListModal] = useState<boolean>(false);
  const [isBidCustUserListModal, setIsBidCustUserListModal] = useState<boolean>(false);
  const [itemPop, setItemPop] = useState<boolean>(false);		
  const [custCode, setcustCode] = useState<string>('');

  //로그인 정보에서 custCode가 롯데일 때 롯데 분류군 데이터 가져오기
  const getLotteCodeList = useCallback(async() => {
    try {
      
        const response = await axios.post('/api/v1/bid/progressCodeList');
        
        const data = response.data.data
        setBidContent({
          ...bidContent,
          lotteDeptList : data.filter((item :{colCode : string}) => item.colCode === 'MAT_DEPT'),
          lotteProcList : data.filter((item :{colCode : string}) => item.colCode === 'MAT_PROC'), 
          lotteClsList	: data.filter((item :{colCode : string}) => item.colCode === 'MAT_CLS')
      })

    } catch (error) {
      Swal.fire('조회에 실패하였습니다.', '', 'error');
      console.log(error);
    }
  },[])
  
  useEffect(() => {
    if(userCustCode === '02'){
      getLotteCodeList()
    }
  },[])

  const onChangeBasicInfo = (e : React.ChangeEvent<HTMLSelectElement>) => {
    setBidContent({
        ...bidContent,
        [e.target.name]: e.target.value
    });
  }

  const onChangeNumberFormmat = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, ''); 
    const numValue = Number(value); // Parse the value to a number

    if (!isNaN(numValue) && /^[0-9]*$/.test(value)) {
      const formattedValue = numValue.toLocaleString();
      setBidContent({
        ...bidContent,
        [e.target.name]: formattedValue
      });
    }
  };

  const onChangeBiModeCode= ()=> {
    if(bidContent.biModeCode === 'A'){
      Swal.fire({
          title: '입찰방식 변경',          
          text: '일반경쟁입찰을 선택하면 입찰 등록되어 있는 \n모든 협력업체를 대상으로 하고 선택된 입찰참가업체가 초기화 됩니다.\n일반경쟁입찰으로 변경하시겠습니까?',  
          icon: 'question',                // success / error / warning / info / question
          confirmButtonColor: '#3085d6',  // 기본옵션
          confirmButtonText: '변경',      // 기본옵션
          showCancelButton: true,         // conrifm 으로 하고싶을떄
          cancelButtonColor: '#d33',      // conrifm 에 나오는 닫기버튼 옵션
          cancelButtonText: '취소'        // conrifm 에 나오는 닫기버튼 옵션
      }).then(result => {
          // 만약 Promise리턴을 받으면,
          if (result.isConfirmed) { // 만약 모달창에서 confirm 버튼을 눌렀다면
              setBidContent({
                ...bidContent,
                biModeCode : 'B'
            })
          }
          //지명경쟁입찰에서 일반경쟁입찰로 변경 시 입찰참가업체 정보 초기화
          setCustUserName([])

          setCustContent([])
    
          setCustUserInfo([])
      });
    }else{
      setBidContent({
        ...bidContent,
        biModeCode : 'A'
      })
    
   }
  }

  const onBidPastModal = ()=>{
    setIsBidPastModal(true)
  }


  const onBidCustListModal = ()=>{
    setIsBidCustListModal(true)
  }

  const onRemoveCust = ( custCode : any)=>{
    
    setCustUserInfo(custUserInfo.filter(item => item.custCode != custCode));
    setCustUserName(custUserName.filter(item => item.custCode != custCode));
    setCustContent(custContent.filter(item => item.custCode != custCode));
  }

  const onCustUserDetail = (custCode : any)=>{
    setcustCode(custCode.toString())
    setIsBidCustUserListModal(true)
  }

  const onUpdateSpotDay = (day: Date | null) => {
    if (day) { 
      const formattedDate = format(day, 'yyyy-MM-dd');
      setBidContent({
        ...bidContent,
        spotDay: formattedDate,
      });
    }
  }

  const itemSelectCallback = (data : MapType)=>{
    setBidContent({
      ...bidContent,
      itemCode : data.itemCode,
      itemName : data.itemName
    });
  }

  const onItemPopModal = ()=>{
    setItemPop(true)
  }


  return (
    <div>
        <h3 className="h3Tit">입찰 기본 정보</h3>
        <div className="boxSt mt20">
          <div className="flex align-items-center">
            <div className="formTit flex-shrink0 width170px">{viewType === '등록' ? '과거입찰': '입찰번호'}</div>
            <div className="width100">
            { viewType === '등록' ? 
              <button
                className="btnStyle btnOutlineBlue"
                title="과거입찰 가져오기"
                style={{marginLeft:'0px'}}
                onClick={()=>{
                    onBidPastModal()
                  }
                }
                >과거입찰 가져오기
                </button>
              :
              <div>
                {bidContent.biNo}
              </div>
            }
            </div>
          </div>

          <div className="flex align-items-center mt10">
            <div className="formTit flex-shrink0 width170px">
              입찰명 <span className="star">*</span>
            </div>
            <div className="width100">
              <SrcInput name="biName" srcData={ bidContent } setSrcData={ setBidContent } value={bidContent.biName} maxLength={10}/>
            </div>
          </div>

          <div className="flex align-items-center mt10">
            <div className="formTit flex-shrink0 width170px">
              품목 <span className="star">*</span>
            </div>
            <div className="flex align-items-center width100">
            <SrcInput name="itemName" srcData={ bidContent } setSrcData={ setBidContent } value={bidContent.itemName}/>
              <button
                className="btnStyle btnSecondary ml10"
                title="조회"
                onClick={()=>{onItemPopModal()}}
                >조회</button
              >
            </div>
          </div>

          <div className="flex align-items-center mt20">
            <div className="formTit flex-shrink0 width170px">
              입찰방식 <span className="star">*</span>
            </div>
            <div className="width100">
              <input type="radio" value={bidContent.biModeCode} id="bm1_1" name="biModeCode" className="radioStyle" checked={bidContent.biModeCode === 'A'} onChange={onChangeBiModeCode}/>
              <label htmlFor="bm1_1">지명경쟁입찰</label>
              <input  type="radio" value={bidContent.biModeCode} id="bm1_2" name="biModeCode" className="radioStyle" onChange={onChangeBiModeCode} checked={bidContent.biModeCode === 'B'}/>
              <label htmlFor="bm1_2">일반경쟁입찰</label>
            </div>
          </div>

          <div className="flex align-items-center mt20">
            <div className="formTit flex-shrink0 width170px">
              입찰참가자격 <span className="star">*</span>
            </div>
            <div className="width100">
            <SrcInput name="bidJoinSpec" srcData={ bidContent } setSrcData={ setBidContent } value={bidContent.bidJoinSpec} maxLength={100}/>
            </div>
          </div>

          <div className="flex mt20">
            <div className="formTit flex-shrink0 width170px">특수조건</div>
            <div className="width100">
             <EditTextArea className='boxOverflowY' editData={ bidContent } setEditData={ setBidContent } name="specialCond" value={bidContent.specialCond}/>
            </div>
          </div>
          <div className="flex align-items-center mt20">
            <div className="formTit flex-shrink0 width170px">
              현장설명일시 <span className="star">*</span>
            </div>
            <div className="flex align-items-center width100">
            {/* <DatePicker className="datepicker inputStyle" locale={ko} shouldCloseOnSelect selected={bidContent.spotDay} onChange={(day) => onUpdateSpotDay(day)} dateFormat="yyyy-MM-dd" minDate={bidContent.minDate}/> */}
            <SrcDatePicker name={"spotDay"} selected={bidContent.spotDay} srcData={bidContent} setSrcData={setBidContent} minDate={bidContent.minDate}/>
              <select
                className="inputStyle ml10"
                name="spotTime"
                value={bidContent.spotTime}
                onChange={onChangeBasicInfo}
                style={{ background: "url('../../images/selectArw.png') no-repeat right 15px center", maxWidth: '110px' }}
              >
                <option value="">시간 선택</option>
                <option value="01:00">01:00</option>
                <option value="02:00">02:00</option>
                <option value="03:00">03:00</option>
                <option value="04:00">04:00</option>
                <option value="05:00">05:00</option>
                <option value="06:00">06:00</option>
                <option value="07:00">07:00</option>
                <option value="08:00">08:00</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="12:00">12:00</option>
                <option value="13:00">13:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="17:00">17:00</option>
                <option value="18:00">18:00</option>
                <option value="19:00">19:00</option>
                <option value="20:00">20:00</option>
                <option value="21:00">21:00</option>
                <option value="22:00">22:00</option>
                <option value="23:00">23:00</option>
              </select>
            </div>
          </div>
          
          <div className="flex align-items-center mt10">
            <div className="formTit flex-shrink0 width170px">
              현장설명장소 <span className="star">*</span>
            </div>
            <div className="width100">
            <SrcInput name="spotArea" srcData={ bidContent } setSrcData={ setBidContent } value={bidContent.spotArea} maxLength={100}/>
            </div>
          </div>

          <div className="flex align-items-center mt10">
            <div className="formTit flex-shrink0 width170px">
              낙찰자결정방법 <span className="star">*</span>
            </div>
            <div className="width100">
              <select
                name="succDeciMethCode"
                className="selectStyle maxWidth200px"
                onChange={onChangeBasicInfo}
                value={bidContent.succDeciMethCode}
              >
                <option value="1">최저가</option>
                <option value="2">최고가</option>
                <option value="3">내부적격심사</option>
                <option value="4">최고가&내부적격심사</option>
                <option value="5">최저가&내부적격심사</option>
              </select>
            </div>
          </div>

          <div className="flex align-items-center mt20" v-if="bidContent.biModeCode==='A'">
            <div className="formTit flex-shrink0 width170px">
              입찰참가업체 <span className="star">*</span>
            </div>
            <div className="flex align-items-center width100">
              <div className="overflow-y-scroll boxStSm width100" style={{display: 'inline'}}>

              {bidContent.biModeCode === 'A'
              ? 
              //입찰방식이 지명경쟁입찰일 때
              custContent.length === 0 
              ? 
              <button>선택된 참가업체 없음</button>

              : 
              <div>
              {
                custContent.map((val, idx) => (
                  <div key={idx}>
                    <button
                      onClick={() => {
                        onCustUserDetail(val.custCode);
                      }}
                      className="textUnderline"
                    >
                      {val.custName}
                    </button>
                    {custUserName
                      .filter((data) => data.custCode == val.custCode)
                      .map((filteredData, dataIdx) => (
                        <span key={dataIdx}>{` ${filteredData.userName}`}</span>
                      ))}
                    <i
                      className="fa-regular fa-xmark textHighlight ml5"
                      onClick={() => onRemoveCust(val.custCode)}
                    ></i>
                  </div>
                ))
            }
            </div>
              : <button>가입회원사 전체</button>}
                <div 
                >   
                  
                <button
                    className="textUnderline"
                    >
                    </button>
                  <span>
                  </span>
                </div>
                </div>
              {bidContent.biModeCode === 'A'
              &&
              <button
                className="btnStyle btnSecondary ml10"
                title="업체선택"
                onClick={()=>{onBidCustListModal()}}
                >업체선택
                </button>
                }
            </div>
          </div>
          <div className="flex align-items-center mt20">
            <div className="formTit flex-shrink0 width170px">
              금액기준 <span className="star">*</span>
            </div>
            <div className="width100">
            <SrcInput name="amtBasis" srcData={ bidContent } setSrcData={ setBidContent } value={bidContent.amtBasis} maxLength={100}/>
            </div>
          </div>
          <div className="flex align-items-center mt10">
            <div className="formTit flex-shrink0 width170px">결제조건</div>
            <div className="width100">
            <SrcInput name="payCond" srcData={ bidContent } setSrcData={ setBidContent } value={bidContent.payCond} maxLength={50}/>
            </div>
          </div>
          <div className="flex align-items-center mt10">
            <div className="formTit flex-shrink0 width170px">예산금액</div>
            <div className="flex align-items-center width100">
            <SrcInput name="bdAmt" className="maxWidth200px" srcData={ bidContent } setSrcData={ setBidContent } value={ CommonUtils.onComma(bidContent.bdAmt) || ''}/>
              <div className="ml10">원</div>
            </div>
          </div>
          <div className="flex align-items-center mt20">
            <div className="formTit flex-shrink0 width170px">입찰담당자</div>
            <div className="width100">{bidContent.createUserName}</div>
          </div>
        </div>

    {/* 롯데일 때만 입력 가능 */}
    { userCustCode === '02' &&
     <>
        <h3 className="h3Tit mt50" >입찰분류</h3>
        <div className="boxSt mt20" >
          <div className="flex align-items-center">
            <div className="formTit flex-shrink0 width170px">
              분류군 <span className="star">*</span>
            </div>
            <div className="flex align-items-center width100">
              <select name="matDept" className="selectStyle" value={bidContent.matDept} onChange={onChangeBasicInfo}>
                <option value=''>사업부를 선택 하세요.</option>
                {bidContent.lotteDeptList.map((data : MapType) => (
                  <option key={data.codeVal} value={data.codeVal}>{data.codeName}</option>
                ))}
              </select>
              <select name="matProc" className="selectStyle" value={bidContent.matProc} onChange={onChangeBasicInfo} style={{margin: '0 10px'}}>
                <option value=''>공정을 선택 하세요.</option>
                {bidContent.lotteProcList.map((data : MapType) => (
                  <option key={data.codeVal} value={data.codeVal}>{data.codeName}</option>
                ))}
              </select>
              <select name="matCls" className="selectStyle" value={bidContent.matCls} onChange={onChangeBasicInfo}>
                <option value=''>분류를 선택 하세요.</option>
                {bidContent.lotteClsList.map((data : MapType) => (
                  <option key={data.codeVal} value={data.codeVal}>{data.codeName}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex align-items-center mt10">
            <div className="formTit flex-shrink0 width170px">공장동</div>
            <div className="width100">
            <SrcInput name="matFactory" srcData={ bidContent } setSrcData={ setBidContent } value={bidContent.matFactory} maxLength={50}/>
            </div>
          </div>
          <div className="flex align-items-center mt10">
            <div className="flex align-items-center width100">
              <div className="formTit flex-shrink0 width170px">라인</div>
              <div className="width100">.
              <SrcInput name="matFactoryLine" srcData={ bidContent } setSrcData={ setBidContent } value={bidContent.matFactoryLine} maxLength={25}/>
              </div>
            </div>
            <div className="flex align-items-center width100 ml80">
              <div className="formTit flex-shrink0 width170px">호기</div>
              <div className="width100">
              <SrcInput name="matFactoryCnt" srcData={ bidContent } setSrcData={ setBidContent } value={bidContent.matFactoryCnt} maxLength={25}/>
              </div>
            </div>
          </div>
        </div>
    </>

        }
          {/* 과거입찰 가져오기  */}
          <BidPast isBidPastModal={isBidPastModal} setIsBidPastModal={setIsBidPastModal}/>

          {/* 품목 조회 */}
          <ItemPop itemPop={itemPop} setItemPop={setItemPop} popClick={itemSelectCallback} />

          {/* 업체 조회 */}
          <BidCustList isBidCustListModal={isBidCustListModal} setIsBidCustListModal={setIsBidCustListModal}/>

          {/* 협력사 사용자 */}
          <BidCustUserList isBidCustUserListModal={isBidCustUserListModal} setIsBidCustUserListModal={setIsBidCustUserListModal} srcCustCode={custCode} type="edit"/> 
    </div>
  )
}

export default BidSaveBasicInfo;
