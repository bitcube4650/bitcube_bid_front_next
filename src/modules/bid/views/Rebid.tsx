import React, { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios';
import Ft from '../api/filters';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import { MapType } from 'components/types';
import DatePicker from 'components/input/EditDatePicker'

const Rebid = () => {

    //마운트 여부
    const isMounted = useRef<boolean>(true);

    const navigate = useNavigate();

    //재입찰 마감시간
    const [estCloseDay, setEstCloseDay] = useState<Date>();
    const [estCloseTime, setEstCloseTime] = useState<string>('');

    //데이터
    const [data, setData] = useState({} as MapType)

    //재입찰 대상업체 리스트
    const [reCustList, setReCustList] = useState([] as number[]);

    //재입찰 팝업 및 사유
    const [reBidPop, setReBidPop] = useState<boolean>(false);
    const [whyA3, setWhyA3] = useState<string>('');

    //재입찰 마감일 변경
    // const onChgEstCloseDay = (day) => {
    //     const selectedDate = new Date(day)
    //     const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    //     setEstCloseDay(formattedDate);
    // }

    //데이터 조회
    const onSearch = async() => {

        let params = {
            biNo : localStorage.getItem('biNo')
        }

        await axios.post('/api/v1/bidstatus/statusDetail', params).then((response) => {
            if(response.data.code === 'OK'){
                let result = response.data.data;

                let spotDate = result.spotDate;
                let estStartDate = result.estStartDate;
                let estCloseDate = result.estCloseDate;

                result = {...result 
                    ,   spotDay : spotDate.substring(0, 10)
                    ,   spotTime : spotDate.substring(11, 16)
                    ,   estStartDay : estStartDate.substring(0, 10)
                    ,   estStartTime : estStartDate.substring(11, 16)
                    ,   estCloseDay : estCloseDate.substring(0, 10)
                    ,   estCloseTime : estCloseDate.substring(11, 16)
                }
                setData(result);
                setEstCloseDay(estCloseDate.substring(0, 10));
                setEstCloseTime(estCloseDate.substring(11, 16));
            }else{
                Swal.fire('', '조회에 실패하였습니다.', 'error');
            }
        });
    };
    
    useEffect(() => {
        if (isMounted.current) {
            onSearch();
            let reCustCodeStr = localStorage.getItem('reCustCode');
            setReCustList((reCustCodeStr as string).split(",").map(Number))
            isMounted.current = false;
          }
    },[]);

    //재입찰 제출마감일시 변경 확인 validation 
    const onValidation = useCallback( () =>{
        let estCloseDate = estCloseDay + " " + estCloseTime + ":00"
        let setDate = new Date(estCloseDate);
        let currDate = new Date();

        if(setDate.getTime() <= currDate.getTime()){
            Swal.fire('', '제출마감일시는 현재 날짜/시간 이후로 설정해주세요.', 'warning');
            return false;
        }

        setReBidPop(true);
    },[estCloseDay, estCloseTime])

    //재입찰 저장
    const onSave = useCallback(() =>{
        let estCloseDate = estCloseDay + " " + estCloseTime + ":00"
        let setDate = new Date(estCloseDate);
        let currDate = new Date();

        if(setDate.getTime() <= currDate.getTime()){
            Swal.fire('', '제출마감일시는 현재 날짜/시간 이후로 설정해주세요.', 'warning');
            setReBidPop(false);
            return false;
        }

        if(Ft.isEmpty(whyA3)){
            Swal.fire('', '재입찰 사유를 입력해주세요.', 'warning');
            return false;
        }

        if(whyA3.length > 200){
            Swal.fire('', '재입찰 사유를 200자 이내로 입력해주세요.', 'warning');
            return false;
        }

        let params = {
            biNo : data.biNo
        ,   whyA3 : whyA3
        ,   estCloseDate : estCloseDate
        ,   reCustList : reCustList
        ,   biName : data.biName
        }

        axios.post("/api/v1/bidstatus/rebid", params).then((response) => {
            if (response.data.code === "OK") {
                setReBidPop(false);
                Swal.fire('', '재입찰 처리 하였습니다.', 'success');
                onMovePage();
            } else {
                setReBidPop(false);
                Swal.fire('', '재입찰 중 오류가 발생했습니다.', 'error');
            }
        });
    },[estCloseDay, estCloseTime, data, whyA3, reCustList])

    //페이지 이동
    const onMovePage = () => {
        navigate('/bid/status');
    }

    return (
        <>
            {/* 본문 */}
            <div className="conRight">
                {/* conHeader  */}
                <div className="conHeader">
                    <ul className="conHeaderCate">
                        <li>전자입찰</li>
                        <li>재입찰</li>
                    </ul>
                </div>
                {/* //conHeader  */}
                {/* contents  */}
                <div className="contents">
                    <div className="formWidth">
                        <h3 className="h3Tit">입찰기본정보</h3>
                        <div className="boxSt mt20">
                            <div className="flex align-items-center">
                                <div className="formTit flex-shrink0 width170px">입찰번호</div>
                                <div className="width100">{ data.biNo }</div>
                            </div>
                            <div className="flex align-items-center mt10">
                                <div className="formTit flex-shrink0 width170px">입찰명</div>
                                <div className="width100">
                                    <input type="text" className="inputStyle" defaultValue={data.biName} maxLength={50} disabled/>
                                </div>
                            </div>
                            <div className="flex align-items-center mt10">
                                <div className="formTit flex-shrink0 width170px">품목</div>
                                <div className="flex align-items-center width100">
                                    <input type="text" className="inputStyle" defaultValue={data.itemName} disabled/>
                                </div>
                            </div>
                            <div className="flex align-items-center mt20">
                                <div className="formTit flex-shrink0 width170px">입찰방식</div>
                                <div className="width100">
                                    <input type="radio" className="radioStyle" defaultChecked={true} id="bm1_1" />
                                    <label htmlFor="bm1_1">지명경쟁입찰</label>
                                </div>
                            </div>
                            <div className="flex align-items-center mt20">
                                <div className="formTit flex-shrink0 width170px">입찰참가자격</div>
                                <div className="width100">
                                    <input type="text" className="inputStyle" defaultValue={data.bidJoinSpec} disabled/>
                                </div>
                            </div>
                            <div className="flex mt20">
                                <div className="formTit flex-shrink0 width170px">특수조건</div>
                                <div className="width100">
                                    <div className="width100">
                                        <textarea className="textareaStyle boxOverflowY" defaultValue={data.specialCond} disabled></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="flex align-items-center mt20">
                                <div className="formTit flex-shrink0 width170px">현장설명일시</div>
                                <div className="width100">
                                    <input type="text" className="inputStyle maxWidth140px" defaultValue={data.spotDay} disabled/>
                                    <input type="time" className="inputStyle maxWidth140px ml10" defaultValue={data.spotTime} disabled />
                                </div>
                            </div>
                            <div className="flex align-items-center mt10">
                                <div className="formTit flex-shrink0 width170px">현장설명장소</div>
                                <div className="width100">
                                    <input type="text" className="inputStyle" defaultValue={data.spotArea} disabled/>
                                </div>
                            </div>
                            <div className="flex align-items-center mt10">
                                <div className="formTit flex-shrink0 width170px">낙찰자결정방법</div>
                                <div className="width100">
                                    <input type="text" className="inputStyle maxWidth200px" defaultValue={data.succDeciMeth} disabled />
                                </div>
                            </div>
                            <div className="flex align-items-center mt20">
                                <div className="formTit flex-shrink0 width170px">입찰참가업체</div>
                                <div className="flex align-items-center width100">
                                <div className="overflow-y-scroll boxStSm width100" style={{display: 'inline'}} >
                                { data.custList?.map((val:MapType) =>
                                    <div>
                                        { reCustList?.map((data, idx2) =>
                                        <div>
                                            {data === val.custCode &&
                                            <>
                                            <a>{ val.custName }</a>
                                            {(data === val.custCode && idx2 !== reCustList.length - 1) &&
                                                <span>,</span>
                                            }
                                            </>
                                            }
                                        </div>
                                        )}
                                    </div>
                                )}
                                </div>
                                </div>
                            </div>
                            <div className="flex align-items-center mt20">
                                <div className="formTit flex-shrink0 width170px">금액기준</div>
                                <div className="width100">
                                    <input type="text" className="inputStyle" defaultValue={data.amtBasis} disabled/>
                                </div>
                            </div>
                            <div className="flex align-items-center mt10">
                                <div className="formTit flex-shrink0 width170px">결제조건</div>
                                <div className="width100">
                                    <input type="text" className="inputStyle" defaultValue={data.payCond} disabled/>
                                </div>
                            </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">예산금액</div>
                            <div className="flex align-items-center width100">
                                <input type="text" className="inputStyle maxWidth200px" defaultValue={Ft.ftRoundComma(data.bdAmt)} disabled/>
                                <div className="ml10">원</div>
                            </div>
                        </div>
                        <div className="flex align-items-center mt20">
                            <div className="formTit flex-shrink0 width170px">입찰담당자</div>
                                <div className="width100">{ data.damdangName }</div>
                            </div>
                        </div>

                        {data.interrelatedCustCode === '02' &&
                        <>
                        <h3 className="h3Tit mt50" >입찰분류</h3>
                        <div className="boxSt mt20" >
                            <div className="flex align-items-center">
                                <div className="formTit flex-shrink0 width170px">분류군</div>
                                <div className="flex align-items-center width100">
                                    <input type="text" className="selectStyle" defaultValue={data.matDept} disabled />
                                    <input type="text" className="selectStyle ml5" defaultValue={data.matProc} disabled />
                                    <input type="text" className="selectStyle ml5" defaultValue={data.matCls} disabled />
                                </div>
                            </div>
                            <div className="flex align-items-center mt10">
                                <div className="formTit flex-shrink0 width170px">공장동</div>
                                <div className="width100">
                                    <input type="text" className="inputStyle" defaultValue={data.matFactory} disabled/>
                                </div>
                            </div>
                            <div className="flex align-items-center mt10">
                                <div className="flex align-items-center width100">
                                    <div className="formTit flex-shrink0 width170px">라인</div>
                                    <div className="width100">
                                        <input type="text" className="inputStyle" defaultValue={data.matFactoryLine} disabled/>
                                    </div>
                                </div>
                                <div className="flex align-items-center width100 ml80">
                                    <div className="formTit flex-shrink0 width170px">호기</div>
                                    <div className="width100">
                                        <input type="text" className="inputStyle" defaultValue={data.matFactoryCnt} disabled/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </>
                        }

                        <h3 className="h3Tit mt50">입찰공고 추가등록 사항</h3>
                        <div className="boxSt mt20">
                            <div className="flex align-items-center">
                                <div className="flex align-items-center width100">
                                    <div className="formTit flex-shrink0 width170px">제출시작일시</div>
                                    <div className="flex align-items-center width100">
                                        <input type="text" className="inputStyle readonly" defaultValue={data.estStartDay} disabled />
                                        <input type="time" className="readonly inputStyle ml10" defaultValue={data.estStartTime} disabled />
                                    </div>
                                </div>
                                <div className="flex align-items-center width100 ml80">
                                    <div className="formTit flex-shrink0 width170px">제출마감일시 <span className="star">*</span></div>
                                    <div className="flex align-items-center width100">
                                        <DatePicker name="startDate" selected={estCloseDay} data={estCloseDay} setData={setEstCloseDay} />
                                        {/* <DatePicker className="datepicker inputStyle" locale={ko} shouldCloseOnSelect selected={estCloseDay} onChange={(date) => onChgEstCloseDay(date)} dateFormat="yyyy-MM-dd"/> */}
                                        <select className="inputStyle ml10" key={estCloseTime} defaultValue={estCloseTime} onChange={(e)=>setEstCloseTime(e.target.value)} style={{background:"url('/images/selectArw.png') no-repeat right 15px center",maxWidth: "110px"}}>
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
                                    <div className="formTit flex-shrink0 width170px">개찰자</div>
                                    <div className="flex align-items-center width100">
                                        <input type="text" className="inputStyle" defaultValue={data.estOpener} disabled />
                                    </div>
                                </div>
                                <div className="flex align-items-center width100 ml80">
                                    <div className="formTit flex-shrink0 width170px">입찰공고자</div>
                                    <div className="flex align-items-center width100">
                                        <input type="text" className="inputStyle" defaultValue={data.gongoName} disabled />
                                    </div>
                                </div>
                            </div>
                            <div className="flex align-items-center mt10">
                                <div className="flex align-items-center width100">
                                    <div className="formTit flex-shrink0 width170px">낙찰자</div>
                                    <div className="flex align-items-center width270px">
                                        <input type="text" className="inputStyle" defaultValue={data.estBidder} disabled />
                                    </div>
                                </div>
                            </div>
                            <div className="flex align-items-center mt10">
                                <div className="flex align-items-center width100">
                                    <div className="formTit flex-shrink0 width170px">입회자1</div>
                                    <div className="flex align-items-center width100">
                                        <input type="text" className="inputStyle" defaultValue={data.openAtt1} disabled />
                                    </div>
                                </div>
                                <div className="flex align-items-center width100 ml80">
                                    <div className="formTit flex-shrink0 width170px">입회자2</div>
                                    <div className="flex align-items-center width100">
                                        <input type="text" className="inputStyle" defaultValue={data.openAtt2} disabled />
                                    </div>
                                </div>
                            </div>
                            <div className="flex align-items-center mt10">
                                <div className="flex align-items-center width100">
                                    <div className="formTit flex-shrink0 width170px">내역방식</div>
                                    <div className="width100">
                                        <input type="radio" name="bm2" value="data.insMode" id="bm2_1" className="radioStyle" defaultChecked={true} /><label htmlFor="bm2_1">{ Ft.ftInsMode(data.insMode) }</label>
                                    </div>
                                </div>
                                <div className="flex align-items-center width100 ml80">
                                    <div className="formTit flex-shrink0 width170px">납품조건</div>
                                    <div className="width100">
                                        <input type="text" className="inputStyle" defaultValue={data.supplyCond} disabled/> 
                                    </div>
                                </div>
                            </div>
                            {data.insMode === '1' &&
                            <div className="flex mt10">
                                <div className="formTit flex-shrink0 width170px">세부내역
                                    {/* 툴팁  */}
                                    <i className="fas fa-question-circle toolTipSt ml5">
                                        <div className="toolTipText" style={{width: "370px"}}>
                                            <ul className="dList">
                                                <li><div>내역방식이 파일등록 일 경우 필수로 파일을 등록해야합니다.</div></li>
                                                <li><div>파일이 암호화 되어 있는지 확인해 주십시오</div></li>
                                            </ul>
                                        </div>
                                    </i>
                                    {/* //툴팁  */}
                                </div>
                                <div className="width100">
                                    {/* 다중파일 업로드  */}
                                    <div className="upload-boxWrap">
                                        <div className="upload-box">
                                            <div className="uploadTxt">
                                                {data.specFile?.map((file:MapType)=>
                                                <>
                                                <i className="fa-regular fa-upload"></i> 
                                                <div>{ file.fileNm }</div>
                                                </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="uploadPreview" id="preview"></div>
                                    </div>
                                    {/* //다중파일 업로드  */}
                                </div>
                            </div>
                            }
                            {data.insMode === '2' &&
                            <div className="flex mt10">
                                <div className="formTit flex-shrink0 width170px">세부내역 <span className="star">*</span>
                                </div>
                                <div className="width100">
                                    <table className="tblSkin1">
                                        <colgroup>
                                            <col style={{width:"17%"}} />
                                            <col style={{width:"16%"}} />
                                            <col style={{width:"16%"}} />
                                            <col style={{width:"16%"}} />
                                            <col style={{width:"17%"}} />
                                            <col style={{width:"18%"}} />
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th>품목명</th>
                                                <th>규격</th>
                                                <th>수량</th>
                                                <th>단위</th>
                                                <th>예정단가</th>
                                                <th className="end">합계</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.specInput?.map((val:MapType, idx:string)=>
                                            <tr key={idx}>
                                                <td><input type="text" className="inputStyle inputSm" defaultValue={val.name} disabled/> </td>
                                                <td><input type="text" className="inputStyle inputSm" defaultValue={val.ssize} disabled/></td>
                                                <td><input type="text" className="inputStyle inputSm" defaultValue={val.orderQty} disabled/></td>
                                                <td><input type="text" className="inputStyle inputSm" defaultValue={val.unitcode} disabled/></td>
                                                <td><input type="text" className="inputStyle inputSm text-right" defaultValue={val.orderUc} disabled/></td>
                                                <td className="text-right">{ Ft.numberWithCommas(val.orderQty * val.orderUc) }</td>
                                            </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    <p className="text-right mt10">
                                        <strong>{ Ft.ftAllSum(data.specInput) }</strong>
                                    </p>
                                </div>
                            </div>
                            }
                            <div className="flex mt10">
                                <div className="formTit flex-shrink0 width170px">첨부파일(대내용)
                                    {/* 툴팁  */}
                                    <i className="fas fa-question-circle toolTipSt ml5">
                                        <div className="toolTipText" style={{width: "320px"}}>
                                            <ul className="dList">
                                                <li><div>그룹사 내부 입찰관계자가 확인하는 첨부파일 입니다.</div></li>
                                                <li><div>파일이 암호화 되어 있는지 확인해 주십시오</div></li>
                                            </ul>
                                        </div>
                                    </i>
                                    {/* //툴팁  */}
                                </div>
                                <div className="width100">
                                    {/* 다중파일 업로드  */}
                                    <div className="upload-boxWrap">
                                        <div className="upload-box">
                                            <div className="uploadTxt">
                                            {data.fileList?.map((file:MapType, idx:string) => {
                                                if(file.fileFlag === '0') {return <><i className="fa-regular fa-upload"></i><div key={idx}>{ file.fileNm }</div></>} else { return <></>}
                                            })}
                                            </div>
                                        </div>
                                        <div className="uploadPreview" id="preview2"></div>
                                    </div>
                                    {/* //다중파일 업로드  */}
                                </div>
                            </div>
                            <div className="flex mt10">
                                <div className="formTit flex-shrink0 width170px">첨부파일(대외용)
                                    {/* 툴팁  */}
                                    <i className="fas fa-question-circle toolTipSt ml5">
                                        <div className="toolTipText" style={{width: "300px"}}>
                                            <ul className="dList">
                                                <li><div>입찰 참가업체들이 확인하는 첨부파일 입니다.</div></li>
                                                <li><div>파일이 암호화 되어 있는지 확인해 주십시오</div></li>
                                            </ul>
                                        </div>
                                    </i>
                                    {/* //툴팁  */}
                                </div>
                                <div className="width100">
                                    {/* 다중파일 업로드  */}
                                    <div className="upload-boxWrap">
                                        <div className="upload-box">
                                            <div className="uploadTxt">
                                                {data.fileList?.map((file:MapType, idx:string)=> {
                                                    if(file.fileFlag === '1') {return <><i className="fa-regular fa-upload"></i><div key={idx}>{ file.fileNm }</div></>} else { return <></>}
                                                })}
                                            </div>
                                        </div>
                                        <div className="uploadPreview" id="preview3"></div>
                                    </div>
                                    {/* //다중파일 업로드  */}
                                </div>
                            </div>
                        </div>
                        <div className="text-center mt50">
                            <a className="btnStyle btnOutline" title="목록" onClick={onMovePage}>목록</a>
                            <a onClick={onValidation} className="btnStyle btnPrimary" title="재입찰" >재입찰</a>
                        </div>
                    </div>
                </div>
                {/* //contents  */}

                {/* 재입찰  */}
                <Modal className="modalStyle" id="reBidding" show={reBidPop} onHide={()=>setReBidPop(false)} keyboard={true}>
                    <Modal.Body>
                        <a className="ModalClose" onClick={()=>setReBidPop(false)} data-dismiss="modal" title="닫기"><i className="fa-solid fa-xmark"></i></a>
                        <h2 className="modalTitle">재입찰</h2>
                        <div className="modalTopBox">
                            <ul>
                                <li>
                                    <div>
                                        재입찰 처리 합니다.<br/>재입찰 시 선택한 참가업체에게 재입찰 메일이 발송됩니다.<br />재입찰 하시겠습니까?
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <textarea className="textareaStyle height150px mt20" placeholder="재입찰 사유 필수 입력 (200자 이내)" defaultValue={whyA3} onChange={(e)=>setWhyA3(e.target.value)}></textarea>
                        <div className="modalFooter">
                            <a className="modalBtnClose" onClick={()=>setReBidPop(false)} data-dismiss="modal" title="취소">취소</a>
                            <a className="modalBtnCheck" title="재입찰" onClick={onSave}>재입찰</a>
                        </div>
                    </Modal.Body>
                </Modal>
                {/* //재입찰  */}
            </div>
            {/* // 본문 */}
        </>
    )
}

export default Rebid
