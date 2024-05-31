import React, { useContext, useEffect, useState } from 'react'
import BidSaveExtraFile from './BidSaveExtraFile'
import Calendar from '../../../components/Calendar'
import Swal from 'sweetalert2';
import { BidContext } from '../context/BidContext';

const BidSaveAddRegist = (props) => { 

  const {bidContent, setBidContent, insFile,setInsFile, tableContent, setTableContent} = useContext(BidContext);

  const onChangeAddRegist = (e) => {
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
      type: 'I'
    };

    setTableContent(tableContent => [...tableContent, newRow]);
  };

  const formatNumber = (value) => {
    if (!value) return '';
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const unformatNumber = (value) => {
    return value.replace(/,/g, '');
  };

  const onHandleInputChange = (index, field, value) => {
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

  const onDeleteRow = (index) => {
    setTableContent(tableContent.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (bidContent.insModeCode === '1') {
      setTableContent([]);
    }else{
      setInsFile(null)
    }

  }, [bidContent.insModeCode]);

  const onFileInputChangeInsFile = (e)=>{
    e.preventDefault()
    const fileData = e.target.files[0]

      if(fileData.size > 10485760){
        e.target.value = ''
        Swal.fire('', '파일 크기는 최대 10MB까지입니다.\n파일 크기를 확인해 주세요.', 'warning');
        return 
      }

      setInsFile(fileData)

  }

   const onRemovieInsFile = () => {
    setInsFile(null)
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
                <Calendar calendarId="startDate" className="datepicker inputStyle" minDate={bidContent.minDate}></Calendar>
                <select className="inputStyle ml10" style={{ background: "url('../../images/selectArw.png') no-repeat right 15px center", maxWidth: '110px' }}
                name="estStartTime" onChange={onChangeAddRegist}>
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
                <Calendar calendarId="closeDate" className="datepicker inputStyle" minDate={bidContent.minDate}></Calendar>
                <select className="inputStyle ml10" style={{ background: "url('../../images/selectArw.png') no-repeat right 15px center", maxWidth: '110px' }}
                name="estClosetime" onChange={onChangeAddRegist}>
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
                <input
                  type="text"
                  name="estOpener"
                  className="inputStyle"
                  placeholder=""
                  disabled
                  value={bidContent.estOpener}
                />
                <button
                  className="btnStyle btnSecondary ml10"
                  title="선택"
                  >선택</button
                >
              </div>
            </div>
            <div className="flex align-items-center width100 ml80">
              <div className="formTit flex-shrink0 width170px">입찰공고자 <span className="star">*</span></div>
              <div className="flex align-items-center width100">
                <input
                  type="text"
                  name="gongoId"
                  className="inputStyle"
                  placeholder=""
                 // v-model="bidContent.gongoId"
                  disabled
                  value={bidContent.gongoId}
                />
                <button
                  // data-toggle="modal"
                  // data-target="#bidUserPop"
                  className="btnStyle btnSecondary ml10"
                  title="선택"
                  >선택</button
                >
              </div>
            </div>
          </div>

          <div className="flex align-items-center mt10">
            <div className="flex align-items-center width100">
              <div className="formTit flex-shrink0 width170px">낙찰자 <span className="star">*</span></div>
              <div className="flex align-items-center width100">
                <input
                  type="text"
                  name="estBidder"
                  className="inputStyle"
                  placeholder=""
                  disabled
                  value={bidContent.estBidder}
                />
                <button
                  data-toggle="modal"
                  data-target="#biddingUserPop"
                  className="btnStyle btnSecondary ml10"
                  title="선택">선택
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
                  <input
                    type="text"
                    name="openAtt1"
                    className="inputStyle"
                    placeholder=""
                    value={bidContent.openAtt1}
                    style={{ marginRight: bidContent.openAtt1Code ? '5px' : '0' }}
                    disabled
                  />
                  
                  {bidContent.openAtt1Code && <i class="fa-regular fa-xmark textHighlight ml5"></i>}

                  <button className="btnStyle btnSecondary ml10" title="선택">선택</button>
                </div>
              </div>
              <div className="flex align-items-center width100 ml80">
                <div className="formTit flex-shrink0 width170px">입회자2</div>
                <div className="flex align-items-center width100">
                  <input
                    type="text"
                    name=""
                    className="inputStyle"
                    placeholder=""
                    value={bidContent.openAtt2}
                    style={{ marginRight: bidContent.openAtt2Code ? '5px' : '0' }}
                    disabled
                  />
                  {bidContent.openAtt2Code && <i class="fa-regular fa-xmark textHighlight ml5"></i>}
                  <button className="btnStyle btnSecondary ml10" title="선택">선택</button>
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
                  value="1"
                  id="bm2_1"
                  className="radioStyle"
                  checked={bidContent.insModeCode === '1'}
                  onChange={onChangeAddRegist}
                /><label htmlFor="bm2_1">파일등록</label>
                <input
                  type="radio"
                  name="insModeCode"
                  value="2"
                  id="bm2_2"
                  className="radioStyle"
                  checked={bidContent.insModeCode === '2'}
                  onChange={onChangeAddRegist}
                /><label htmlFor="bm2_2">내역직접등록</label>
              </div>
            </div>
            <div className="flex align-items-center width100 ml80">
              <div className="formTit flex-shrink0 width170px">납품조건 <span className="star">*</span></div>
              <div className="width100">
                <input
                  type="text"
                  name="supplyCond"
                  className="inputStyle"
                  placeholder=""
                  onChange={onChangeAddRegist}
                />
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
              <button title="추가" className="btnStyle btnSecondary ml10" onClick={onAddRow}>추가</button>
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
               <div className="uploadPreview" ><p style={{lineHeight:'80px'}}>{ insFile.name }<button onClick={onRemovieInsFile} className="file-remove">삭제</button></p></div> 
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
                  maxLength="100"
                />
              </td>
              <td>
                <input
                  type="text"
                  className="inputStyle inputSm"
                  value={val.ssize}
                  onChange={(e) => onHandleInputChange(idx, 'ssize', e.target.value)}
                  maxLength="25"
                />
              </td>
              <td>
                <input
                  type="text"
                  className="inputStyle inputSm"
                  value={val.unitcode}
                  onChange={(e) => onHandleInputChange(idx, 'unitcode', e.target.value)}
                  maxLength="25"
                />
              </td>
              <td>
                <input
                  type="text"
                  className="inputStyle inputSm text-right"
                  value={val.orderUc}
                  onChange={(e) => onHandleInputChange(idx, 'orderUc', e.target.value)}
                  maxLength="15"
                />
              </td>
              <td>
                <input
                  type="text"
                  className="inputStyle inputSm text-right"
                  value={val.orderQty}
                  onChange={(e) => onHandleInputChange(idx, 'orderQty', e.target.value)}
                  maxLength="15"
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
            <p className="text-right mt10">
              <strong>총합계 : {calculateTotalSum()}</strong>
            </p>
          </div>
          }


          </div>

        <BidSaveExtraFile/>
        </div>
    </div>
  )
}

export default BidSaveAddRegist