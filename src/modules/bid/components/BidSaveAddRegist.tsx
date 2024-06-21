import React, { useContext, useEffect, useState } from 'react'
import BidSaveExtraFile from './BidSaveExtraFile'
import Swal from 'sweetalert2';
import { BidContext } from '../context/BidContext';
import BidUserList from './BidUserList';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from "date-fns/locale";
import { format } from 'date-fns';
import SrcInput from 'components/input/SrcInput';

const BidSaveAddRegist = () => { 

  const {bidContent, setBidContent, insFile,setInsFile, tableContent, setTableContent} = useContext(BidContext);


  const [userType, setUserType] = useState<string>('');
  const [isBidUserListModal, setIsBidUserListModal] = useState<boolean>(false);

  const onChangeAddRegist = (e : React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setBidContent({
        ...bidContent,
        [e.target.name]: e.target.value
    });
  }
  const onAddRow = () => {
    const newRow = {
      biNo: '',
      name: '',
      ssize: '',
      orderQty: '',
      unitcode: '',
      orderUc: '',
      seq: 0
    };

    setTableContent(tableContent => [...tableContent, newRow]);
  };

  const formatNumber = (value : string) => {
    if (!value) return '';
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const unformatNumber = (value : string) => {
    return value.replace(/,/g, '');
  };

  const onHandleInputChange = (index : number, field : string, value : string) => {
    if (field === 'orderUc' || field === 'orderQty') {
      value = value.replace(/^0+(?!$)/, '');
      value = value.replace(/[^0-9]/g, '');
      const unformattedValue = unformatNumber(value);
      const formattedValue = formatNumber(unformattedValue);
      const updatedTableContent = tableContent.map((row, i) =>
        i === index ? { ...row, [field]: formattedValue } : row
      );
      setTableContent(updatedTableContent);
    } else {
      const updatedTableContent = tableContent.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      );
      setTableContent(updatedTableContent);
    }
  };

  const calculateTotalSum = () => {
    return tableContent.reduce((total, row) => {
      const orderQty = Number(row.orderQty.replace(/,/g, '')) || 0;
      const orderUc = Number(row.orderUc.replace(/,/g, '')) || 0;
      return total + (orderQty * orderUc);
    }, 0).toLocaleString();
  };

  const onDeleteRow = (index : number) => {
    setTableContent(tableContent.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (bidContent.insModeCode === '1') {
      setTableContent([]);
    }else{
      setInsFile(null)
    }

  }, [bidContent.insModeCode]);

  const onFileInputChangeInsFile = (e: React.ChangeEvent<HTMLInputElement>)=>{
    e.preventDefault();

    const fileData = e.target.files?.[0]; 

    if (!fileData) {
      return; 
    }

    if (fileData.size > 10485760) {
      e.target.value = ''; 
      Swal.fire('', '파일 크기는 최대 10MB까지입니다.\n파일 크기를 확인해 주세요.', 'warning');
      return;
    }

      setInsFile(fileData)
      setBidContent({
        ...bidContent,
        insFileCheck : 'C'
      })

  }

   const onRemovieInsFile = () => {
    setInsFile(null)
   }

   const onUserListSelect = (type : string) =>{
    setUserType(type)
    setIsBidUserListModal(true)
   }

  const onChangeInsModeCode = ()=> {
      Swal.fire({
          title: '내역방식 변경',          
          text: '내역방식을 변경하면 이전에 선택한 세부내역이 초기화됩니다.\n 변경 하시겠습니까?',  
          icon: 'question',                // success / error / warning / info / question
          confirmButtonColor: '#3085d6',  // 기본옵션
          confirmButtonText: '변경',      // 기본옵션
          showCancelButton: true,         // conrifm 으로 하고싶을떄
          cancelButtonColor: '#d33',      // conrifm 에 나오는 닫기버튼 옵션
          cancelButtonText: '취소'        // conrifm 에 나오는 닫기버튼 옵션
      }).then(result => {
          // 만약 Promise리턴을 받으면,
          if (result.isConfirmed) { // 만약 모달창에서 confirm 버튼을 눌렀다면
            if(bidContent.insModeCode === '1'){
              setBidContent({
                ...bidContent,
                insModeCode : '2'
            })
            }else{
              setBidContent({
                ...bidContent,
                insModeCode : '1'
            })
            }
          }
      });
    };

    const onRemoveOpenAtt = (num : number) =>{

      if(num === 1){

        setBidContent({
          ...bidContent,
          openAtt1 : '',
          openAtt1Code : ''
        })

      }else{

        setBidContent({
          ...bidContent,
          openAtt2 : '',
          openAtt2Code : ''
        })

      }

    }

    
  const onUpdateEstStartDay = (day : Date | null) =>{
    if (day) { 
      const selectedDate = new Date(day)
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      setBidContent({
        ...bidContent,
        estStartDay : formattedDate
      });
    }
  }

  const onUpdateEstEstCloseDay = (day : Date | null) =>{
    if (day) { 
      const selectedDate = new Date(day)
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      setBidContent({
        ...bidContent,
        estCloseDay : formattedDate
      });
    }
  }

  return (
    <div>
        <h3 className="h3Tit mt50">입찰공고 추가 등록 사항</h3>
        <div className="boxSt mt20">

        <div className="flex align-items-center">
            <div className="flex align-items-center width100">
              <div className="formTit flex-shrink0 width170px">
                제출시작일시 <span className="star">*</span>
              </div>
              <div className="flex align-items-center width100">
                <DatePicker className="datepicker inputStyle" locale={ko} shouldCloseOnSelect selected={bidContent.estStartDay} onChange={(day) => onUpdateEstStartDay(day)} dateFormat="yyyy-MM-dd" minDate={bidContent.minDate}/>
                <select className="inputStyle ml10" style={{ background: "url('../../images/selectArw.png') no-repeat right 15px center", maxWidth: '110px' }}
                name="estStartTime" onChange={onChangeAddRegist} value={bidContent.estStartTime}>
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
            <div className="flex align-items-center width100 ml80">
              <div className="formTit flex-shrink0 width170px">
                제출마감일시 <span className="star">*</span>
              </div>
              <div className="flex align-items-center width100">
              <DatePicker className="datepicker inputStyle" locale={ko} shouldCloseOnSelect selected={bidContent.estCloseDay} onChange={(day) => onUpdateEstEstCloseDay(day)} dateFormat="yyyy-MM-dd" minDate={bidContent.minDate}/>
                <select className="inputStyle ml10" style={{ background: "url('../../images/selectArw.png') no-repeat right 15px center", maxWidth: '110px' }}
                name="estCloseTime" onChange={onChangeAddRegist} value={bidContent.estCloseTime}>
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
          </div>

          <div className="flex align-items-center mt10">
            <div className="flex align-items-center width100">
              <div className="formTit flex-shrink0 width170px">개찰자 <span className="star">*</span></div>
              <div className="flex align-items-center width100">
              <SrcInput name="estOpener" srcData={ bidContent } setSrcData={ setBidContent } value={bidContent.estOpener} disabled/>
                <button
                  className="btnStyle btnSecondary ml10"
                  title="선택"
                  onClick={()=>{onUserListSelect('개찰자')}}
                  >선택</button
                >
              </div>
            </div>
            <div className="flex align-items-center width100 ml80">
              <div className="formTit flex-shrink0 width170px">입찰공고자 <span className="star">*</span></div>
              <div className="flex align-items-center width100">
              <SrcInput name="gongoId" srcData={ bidContent } setSrcData={ setBidContent } value={bidContent.gongoId} disabled/>
                <button
                  className="btnStyle btnSecondary ml10"
                  title="선택"
                  onClick={()=>{onUserListSelect('입찰공고자')}}
                  >선택</button
                >
              </div>
            </div>
          </div>

          <div className="flex align-items-center mt10">
            <div className="flex align-items-center width100">
              <div className="formTit flex-shrink0 width170px">낙찰자 <span className="star">*</span></div>
              <div className="flex align-items-center width100">
              <SrcInput name="estBidder" srcData={ bidContent } setSrcData={ setBidContent } value={bidContent.estBidder} disabled/>
                <button
                  className="btnStyle btnSecondary ml10"
                  title="선택"
                  onClick={()=>{onUserListSelect('낙찰자')}}
                  >선택
                  </button>
              </div>
            </div>
              <div className="flex align-items-center width100 ml80">
              </div> 
            </div>

            <div className="flex align-items-center mt10">
              <div className="flex align-items-center width100">
                <div className="formTit flex-shrink0 width170px">입회자1</div>
                <div className="flex align-items-center width100">
                <SrcInput name="openAtt1" srcData={ bidContent } setSrcData={ setBidContent } value={bidContent.openAtt1} style={{ marginRight: bidContent.openAtt1Code ? '5px' : '0' }} disabled/>
                  {bidContent.openAtt1Code && <i onClick={()=>onRemoveOpenAtt(1)} className="fa-regular fa-xmark textHighlight ml5"></i>}
                  <button 
                  className="btnStyle btnSecondary ml10" 
                  title="선택"
                  onClick={()=>{onUserListSelect('입회자1')}}
                  >선택</button>
                </div>
              </div>
              <div className="flex align-items-center width100 ml80">
                <div className="formTit flex-shrink0 width170px">입회자2</div>
                <div className="flex align-items-center width100">
                <SrcInput name="openAtt2" srcData={ bidContent } setSrcData={ setBidContent } value={bidContent.openAtt2} style={{ marginRight: bidContent.openAtt2Code ? '5px' : '0' }} disabled/>
                  {bidContent.openAtt2Code && <i onClick={()=>onRemoveOpenAtt(2)}  className="fa-regular fa-xmark textHighlight ml5"></i>}
                  <button 
                  className="btnStyle btnSecondary ml10" 
                  title="선택"
                  onClick={()=>{onUserListSelect('입회자2')}}
                  >선택</button>
                </div>
              </div>
            </div>

            <div className="flex align-items-center mt10">
            <div className="flex align-items-center width100">
              <div className="formTit flex-shrink0 width170px">
                내역방식 <span className="star">*</span>
              </div>
              <div className="width100">
                <input
                  type="radio"
                  name="insModeCode"
                  value={bidContent.insModeCode}
                  id="bm2_1"
                  className="radioStyle"
                  checked={bidContent.insModeCode === '1'}
                  onChange={onChangeInsModeCode}
                /><label htmlFor="bm2_1">파일등록</label>
                <input
                  type="radio"
                  name="insModeCode"
                  value={bidContent.insModeCode}
                  id="bm2_2"
                  className="radioStyle"
                  checked={bidContent.insModeCode === '2'}
                  onChange={onChangeInsModeCode}
                /><label htmlFor="bm2_2">내역직접등록</label>
              </div>
            </div>
            <div className="flex align-items-center width100 ml80">
              <div className="formTit flex-shrink0 width170px">납품조건 <span className="star">*</span></div>
              <div className="width100">
              <SrcInput name="supplyCond" srcData={ bidContent } setSrcData={ setBidContent } value={bidContent.supplyCond} disabled/>
              </div>
            </div>
          </div>


         {/* <div className="flex mt10" v-show="bidContent.insModeCode==='1'"> */}
         <div className="flex mt10">
           <div className="formTit flex-shrink0 width170px">
              세부내역 <span className="star">*</span>
              { bidContent.insModeCode === '1' 
              ?
              <i className="fas fa-question-circle toolTipSt ml5">
                <div className="toolTipText" style={{width: '370px'}}>
                  <ul className="dList">
                    <li>
                      <div>
                        내역방식이 파일등록 일 경우 필수로 파일을 등록해야
                        합니다.
                      </div>
                    </li>
                    <li>
                      <div>파일이 암호화 되어 있는지 확인해 주십시오</div>
                    </li>
                  </ul>
                </div>
              </i>
              : 
              <button title="추가" className="btnStyle btnSecondary ml10" onClick={()=>onAddRow()}>추가</button>
              }
              
            </div>

          {bidContent.insModeCode === '1'
            ?
            <div className="width100">
            <div className="upload-boxWrap">

            {
            !insFile 
            ?
              <div className="upload-box">
                <input type="file" 
                onChange={onFileInputChangeInsFile}
                />
                <div className="uploadTxt">
                  <i className="fa-regular fa-upload"></i>
                  <div>
                    클릭 혹은 파일을 이곳에 드롭하세요.(암호화 해제) <br/>
                    파일 최대 10MB (등록 파일 개수 최대 1개)
                  </div>
                </div>
              </div>
              :
               <div className="uploadPreview" ><p style={{lineHeight:'80px'}}>{ insFile.name ? insFile.name :insFile.fileNm }<button onClick={onRemovieInsFile} className="file-remove">삭제</button></p></div> 
               }
            </div>
          </div>
          :
          <div className="width100">
            <table className="tblSkin1">
              <colgroup>
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th>품목명</th>
                  <th>규격</th>
                  <th>단위</th>
                  <th>예정단가</th>
                  <th>수량</th>
                  <th>합계</th>
                  <th className="end">삭제</th>
                </tr>
              </thead>
              <tbody>
              {tableContent.map((val, idx) => (
            <tr key={idx}>
              <td>
                <input
                  type="text"
                  className="inputStyle inputSm"
                  value={val.name}
                  onChange={(e) => onHandleInputChange(idx, 'name', e.target.value)}
                  maxLength={100}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="inputStyle inputSm"
                  value={val.ssize}
                  onChange={(e) => onHandleInputChange(idx, 'ssize', e.target.value)}
                  maxLength={25}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="inputStyle inputSm"
                  value={val.unitcode}
                  onChange={(e) => onHandleInputChange(idx, 'unitcode', e.target.value)}
                  maxLength={25}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="inputStyle inputSm text-right"
                  value={val.orderUc}
                  onChange={(e) => onHandleInputChange(idx, 'orderUc', e.target.value)}
                  maxLength={15}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="inputStyle inputSm text-right"
                  value={val.orderQty}
                  onChange={(e) => onHandleInputChange(idx, 'orderQty', e.target.value)}
                  maxLength={15}
                />
              </td>
              <td className="text-right">
                {(Number(val.orderQty.replace(/,/g, '')) * Number(val.orderUc.replace(/,/g, ''))).toLocaleString()}
              </td>
              <td className="text-right end">
                <button
                  className="btnStyle btnSecondary btnSm"
                  onClick={() => onDeleteRow(idx)}
                >
                  삭제
                </button>
              </td>
            </tr>
            ))}
              </tbody>
            </table>
            <p className="mt10" style={{textAlign: 'right'}}>
              <strong>총합계 : {calculateTotalSum()}</strong>
            </p>
          </div>
          }
          </div>

        <BidSaveExtraFile/>
          {/* 개찰자,입찰공고자,낙찰자,입회자1,입회자2 공통 사용자 조회*/}
          <BidUserList isBidUserListModal={isBidUserListModal} setIsBidUserListModal={setIsBidUserListModal} type={userType}/> 
        </div>
    </div>
  )
}

export default BidSaveAddRegist
