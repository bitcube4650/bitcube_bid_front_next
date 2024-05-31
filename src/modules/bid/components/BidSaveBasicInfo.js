import React, { useCallback, useContext, useEffect, useState } from 'react'
import Calendar from '../../../components/Calendar';
import BidPast from './BidPast';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BidContext } from '../context/BidContext';

const BidSaveBasicInfo = (props) => {

  //세션 로그인 정보
  const loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
  const userCustCode = loginInfo.custCode

  const {viewType, bidContent, setBidContent, custContent, setCustContent} = useContext(BidContext);

    //로그인 정보에서 custCode가 롯데일 때 롯데 분류군 데이터 가져오기
    const getLotteCodeList = useCallback(async() => {
      try {
  
          const response = await axios.post('/api/v1/bid/progressCodeList');
          
          const data = response.data.data
          setBidContent({
            ...bidContent,
            lotteDeptList : data.filter(list => list.colCode === 'MAT_DEPT'),
            lotteProcList : data.filter(item => item.colCode === 'MAT_PROC'), 
            lotteClsList	: data.filter(item => item.colCode === 'MAT_CLS')
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

    useEffect(() => {
      if(viewType === '등록'){

        //등록할 때는 loginInfo에서 정보를 가져 옴
        setBidContent({
          ...bidContent,
          createUserName : loginInfo.userName,
          createUser : loginInfo.userId, 
          gongoId : loginInfo.userName, 
          gongoIdCode : loginInfo.userId,
        })
      }else{

      }
    },[])

  const onChangeBasicInfo = (e) => {
    setBidContent({
        ...bidContent,
        [e.target.name]: e.target.value
    });
  }

  const onChangeNumberFormmat = (e) => {
    const value = e.target.value.replace(/,/g, ''); 
    if (!isNaN(value) && /^[0-9]*$/.test(value)) { 
      const formattedValue = Number(value).toLocaleString(); 
      setBidContent({
        ...bidContent,
        [e.target.name]: formattedValue
      });
    }
  };

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
                >과거입찰 가져오기
                </button>
              :
              ''
            }


            </div>
          </div>

          <div className="flex align-items-center mt10">
            <div className="formTit flex-shrink0 width170px">
              입찰명 <span className="star">*</span>
            </div>
            <div className="width100">
              <input
                type="text"
                name="biName"
                className="inputStyle"
                onChange={onChangeBasicInfo}
                maxLength="50"
              />
            </div>
          </div>

          <div className="flex align-items-center mt10">
            <div className="formTit flex-shrink0 width170px">
              품목 <span className="star">*</span>
            </div>
            <div className="flex align-items-center width100">
              <input
                type="text"
                name="itemName"
                className="inputStyle"
                onChange={onChangeBasicInfo}
                disabled
              />
              <button
                className="btnStyle btnSecondary ml10"
                title="조회"
                >조회</button
              >
            </div>
          </div>

          <div className="flex align-items-center mt20">
            <div className="formTit flex-shrink0 width170px">
              입찰방식 <span className="star">*</span>
            </div>
            <div className="width100">
              <input
                type="radio"
                value='A'
                id="bm1_1"
                name="biModeCode"
                className="radioStyle"
                checked={bidContent.biModeCode === 'A'}
                onChange={onChangeBasicInfo}
                // v-model="bidContent.biModeCode"
                // v-bind:data-target="
                //   bidContent.biModeCode === 'B' ? '#bmGeneral' : ''
                // "
              /><label htmlFor="bm1_1">지명경쟁입찰</label>
              <input
                type="radio"
                value='B'
                id="bm1_2"
                name="biModeCode"
                className="radioStyle"
                onChange={onChangeBasicInfo}
                checked={bidContent.biModeCode === 'B'}
                // v-model="bidContent.biModeCode"
                // data-toggle="modal"
                // v-bind:data-target="
                //   bidContent.biModeCode === 'A' ? '#bmGeneral' : ''
                // "
              /><label htmlFor="bm1_2">일반경쟁입찰</label>
            </div>
          </div>

          <div className="flex align-items-center mt20">
            <div className="formTit flex-shrink0 width170px">
              입찰참가자격 <span className="star">*</span>
            </div>
            <div className="width100">
              <input
                type="text"
                name="bidJoinSpec"
                className="inputStyle"
                onChange={onChangeBasicInfo}
                maxLength="100"
              />
            </div>
          </div>

          <div className="flex mt20">
            <div className="formTit flex-shrink0 width170px">특수조건</div>
            <div className="width100">
              <textarea
                className="textareaStyle boxOverflowY"
                name="specialCond"
                onChange={onChangeBasicInfo}
              ></textarea>
            </div>
          </div>
          

          <div className="flex align-items-center mt20">
            <div className="formTit flex-shrink0 width170px">
              현장설명일시 <span className="star">*</span>
            </div>
            <div className="flex align-items-center width100">
              <Calendar
                onUpdateDate={onChangeBasicInfo}
                //name="spotDate"
                //calendarId="spotDate"
                className="datepicker inputStyle maxWidth140px"
                initDate={bidContent.spotDate}
                minDate={bidContent.minDate}
              />
              <select
                className="inputStyle ml10"
                name="spotTime"
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
              <input
                type="text"
                name="spotArea"
                className="inputStyle"
                onChange={onChangeBasicInfo}
                maxLength="80"
              />
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
              bidContent.custContent.length === 0 
              ? <button>선택된 참가업체 없음</button>
              : <button>데이터 있음</button>

              : <button>가입회원사 전체</button>}
   

                    

                <div 
                // v-for="(val, idx) in custContent" :key="idx"
                >   
                  
                <button
                    className="textUnderline"
                    >
                      {/* { val.custName } */}
                    </button>
                  <span>
                  
                  {/* v-for="(data,idx) in custUserName" :key="idx"{{ val.custCode == data.custCode ? ` ${data.userName}` : '' }} */}
                  </span>
                  {/* <i className="fa-regular fa-xmark textHighlight ml5"></i> */}
                </div>
                </div>
              <button
                data-toggle="modal"
                data-target="#custPop"
                className="btnStyle btnSecondary ml10"
                title="업체선택"
                >업체선택</button
              >
            </div>
          </div>
          {/* <div className="flex align-items-center mt20">
            <div className="formTit flex-shrink0 width170px">입찰참가업체</div>
            <div className="flex align-items-center width100">
              <div
                className="overflow-y-scroll boxStSm width100"
                style={{height: '50px'}}
              >
                <a>가입회원사 전체</a>
              </div>
            </div>
          </div> */}

          <div className="flex align-items-center mt20">
            <div className="formTit flex-shrink0 width170px">
              금액기준 <span className="star">*</span>
            </div>
            <div className="width100">
              <input
                type="text"
                name="amtBasis"
                className="inputStyle"
                onChange={onChangeBasicInfo}
                maxLength="100"
              />
            </div>
          </div>
          <div className="flex align-items-center mt10">
            <div className="formTit flex-shrink0 width170px">결제조건</div>
            <div className="width100">
              <input
                type="text"
                name="payCond"
                className="inputStyle"
                onChange={onChangeBasicInfo}
                maxLength="50"
              />
            </div>
          </div>
          <div className="flex align-items-center mt10">
            <div className="formTit flex-shrink0 width170px">예산금액</div>
            <div className="flex align-items-center width100">
              <input
                type="text"
                name="bdAmt"
                className="inputStyle maxWidth200px"
                onChange={onChangeNumberFormmat}
                value={bidContent.bdAmt || ''}
              />
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
              <select name="matDept" className="selectStyle" onChange={onChangeBasicInfo}>
                <option value=''>사업부를 선택 하세요.</option>
                {bidContent.lotteDeptList.map((data) => (
                  <option key={data.codeVal} value={data.codeVal}>{data.codeName}</option>
                ))}
              </select>
              <select name="matProc" className="selectStyle" onChange={onChangeBasicInfo} style={{margin: '0 10px'}}>
                <option value=''>공정을 선택 하세요.</option>
                {bidContent.lotteProcList.map((data) => (
                  <option key={data.codeVal} value={data.codeVal}>{data.codeName}</option>
                ))}
              </select>
              <select name="matCls" className="selectStyle" onChange={onChangeBasicInfo}>
                <option value=''>분류를 선택 하세요.</option>
                {bidContent.lotteClsList.map((data) => (
                  <option key={data.codeVal} value={data.codeVal}>{data.codeName}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex align-items-center mt10">
            <div className="formTit flex-shrink0 width170px">공장동</div>
            <div className="width100">
              <input
                type="text"
                name="matFactory"
                className="inputStyle"
                onChange={onChangeBasicInfo}
                maxLength="50"
              />
            </div>
          </div>
          <div className="flex align-items-center mt10">
            <div className="flex align-items-center width100">
              <div className="formTit flex-shrink0 width170px">라인</div>
              <div className="width100">
                <input
                  type="text"
                  name="matFactoryLine"
                  className="inputStyle"
                  onChange={onChangeBasicInfo}
                  maxLength="25"
                />
              </div>
            </div>
            <div className="flex align-items-center width100 ml80">
              <div className="formTit flex-shrink0 width170px">호기</div>
              <div className="width100">
                <input
                  type="text"
                  name="matFactoryCnt"
                  className="inputStyle"
                  onChange={onChangeBasicInfo}
                  maxLength="25"
                />
              </div>
            </div>
          </div>
        </div>
    </>

        }

    </div>
  )
}

export default BidSaveBasicInfo;
