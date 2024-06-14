import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Ft from '../api/filters';
import PartnerCmmnInfo from '../components/PartnerBidCommonInfo'

const PartnerBidStatusDetail = () => {

    //useEffect 안에 onSearch 한번만 실행하게 하는 플래그
    const isMounted = useRef(true);

    //조회 결과
    const [data, setData] = useState({});

    //업체 직접입력
    const [submitData, setSubmitData] = useState([]);

    //총 견적금액 자동입력
    const [totalAmt, setTotalAmt] = useState(0);

    //총 견적금액 직접입력
    const [amt, setAmt] = useState("");
    const [amtHangle, setAmtHangle] = useState("");
    const onChangeAmt = (val)=>{
        let letAmt = val.toString().replace(/[^-0-9]/g, '');
        setAmt(letAmt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        onConvertToKoreanNumber(letAmt);
    }

    //첨부파일
    const [detailFile, setDetailFile] = useState("");
    const [etcFile, setEtcFile] = useState("");

    //견적금액 단위
    const [esmtCurr, setEsmtCurr] = useState("");
    const [currList, setCurrList] = useState([]);

    //데이터 조회
    const onSearch = async() => {
        let biNo = localStorage.getItem('biNo');
        let searchParams = {
            biNo : biNo
        }
        await axios.post('/api/v1/bidPtStatus/bidStatusDetail', searchParams).then((response) => {
            if(response.data.code === 'OK'){
                setData(response.data.data);
                setSubmitData(response.data.data.specInput);

                let currDate = new Date();
                let currDateTime = currDate.getTime();
                let estCloseDate = new Date(response.data.data.estCloseDate);
                let estCloseTime = estCloseDate.getTime();
                
                if(estCloseTime < currDateTime){
                    setEsmtPossible(false);
                }
            }else{
                Swal.fire('', '조회에 실패하였습니다.', 'error');
            }
        });
    };

    //페이지 이동
    const navigate = useNavigate();
    const onMovePage = useCallback(() => {
        navigate('/bid/partnerStatus');
    }, [navigate])

    //필수요소 값 확인
    function validationCheck() {
        //파일 등록
        if(data.insMode === '1'){
            if(esmtCurr === ''){
                Swal.fire('', '견적금액 단위를 선택해주세요.', 'warning');
                return false;
            }
            if(amt === ''){
                Swal.fire('', '견적금액을 입력해주세요.', 'warning');
                return false;
            }
            if(detailFile === ''){
                Swal.fire('', '견적내역파일을 등록해주세요.', 'warning');
                return false;
            }

            return true;

        //직접 입력
        }else if(data.insMode === '2'){
            let bool = false;
            for(let i = 0 ; i < submitData.length ; i++){
                let esmtUc = submitData[i].esmtUc;
                if(Ft.isEmpty(esmtUc)){
                    bool = true;
                    break;
                }
            }

            if(bool){
                Swal.fire('', '품목의 견적금액을 모두 입력해주세요.', 'warning');
                return false;
            }

            if(esmtCurr === ''){
                Swal.fire('', '견적금액 단위를 선택해주세요.', 'warning');
                return false;
            }

            return true;
        }
    }

    //투찰 전 체크
    const onCheck = useCallback(() => {
        if(!validationCheck()){
            return false;
        }

        let currDate = new Date();
        let currDateTime = currDate.getTime();
        let estStartDate = new Date(data.estStartDate);
        let estStartTime = estStartDate.getTime();
        let estCloseDate = new Date(data.estCloseDate);
        let estCloseTime = estCloseDate.getTime();
        
        if(estStartTime > currDateTime || estCloseTime < currDateTime){
            Swal.fire('', '견적제출시간이 아닙니다. 제출시작일시 및 제출마감일시를 확인해주세요.', 'warning');
            return false;
        }

        let letAmt = esmtCurr +" "+ (data.insMode === '1' ? amt : totalAmt);

        Swal.fire({
            title: '',              // 타이틀
            text: "총 견적금액 "+letAmt+" 으로 견적서를 제출하시겠습니까?",  // 내용
            icon: 'question',                        // success / error / warning / info / question
            confirmButtonColor: '#3085d6',  // 기본옵션
            confirmButtonText: '투찰',      // 기본옵션
            showCancelButton: true,         // conrifm 으로 하고싶을떄
            cancelButtonColor: '#d33',      // conrifm 에 나오는 닫기버튼 옵션
            cancelButtonText: '취소',       // conrifm 에 나오는 닫기버튼 옵션
        }).then((result) => {
            if(result.value){
                signData();
            }
        });
    }, [esmtCurr, amt, totalAmt, data])

    //직접입력 총 금액 견적
    const onTotalAmt = useCallback((e, idx) => {
        let total = 0;
        
        let letSubmitData = Object.assign([], submitData);
        letSubmitData[idx].esmtUc = e.target.value;

        for(let i = 0 ; i < letSubmitData.length ; i++){
            let esmtUc = letSubmitData[i].esmtUc;
            if(esmtUc !== undefined && esmtUc !== null){
                esmtUc = esmtUc.replace(/[^-0-9]/g, '');
                total += Number(esmtUc);

                letSubmitData[i].esmtUc = Ft.ftRoundComma(esmtUc);
            }
        }

        setSubmitData([...letSubmitData]);
        setTotalAmt(Ft.ftRoundComma(total));
    }, [submitData])

    //투찰
    const bidSubmitting = useCallback((formData) => {
        axios.post("/api/v1/bidPtStatus/bidSubmitting", formData).then((response) => {
            if (response.data.code === "OK") {
                Swal.fire('', '투찰했습니다.', 'success');
                onMovePage();
            } else if(response.data.code === 'LESSTIME'){
                Swal.fire('', '견적제출시간이 아닙니다. 제출시작일시를 확인해주세요.', 'warning');
            } else if(response.data.code === 'TIMEOUT'){
                Swal.fire('', '견적제출시간이 지났습니다. 제출마감일시를 확인해주세요.', 'warning');
            } else {
                if(response.data.msg !== undefined && response.data.msg !== null && response.data.msg !== ''){
                    Swal.fire('', response.data.msg, 'error');
                }else{
                    Swal.fire('', '투찰 중 오류가 발생했습니다.', 'error');
                }
                
            }
        });
    }, [onMovePage])

    const fileInputChange = (event) => {//견적세부파일
        setDetailFile(event.target.files[0]);
    }

    const fileInput2Change = (event) => {//기타파일
        setEtcFile(event.target.files[0]);
    }

    const signData = useCallback(() =>{//인증서 서명
        var formData = new FormData();

        let letSubmitData = Object.assign([], submitData);

        var itemData = '';
        for(let i = 0 ; i < letSubmitData.length ; i++){
            let esmtUc = letSubmitData[i].esmtUc;
            if(esmtUc !== undefined && esmtUc !== null){
                if(i > 0 && itemData.length > 0){
                    itemData += '$';
                }
                itemData += i + '=' + esmtUc.replace(/[^-0-9]/g, '');
                letSubmitData[i].esmtUc = esmtUc.replace(/[^-0-9]/g, '');
            }
        }

        setSubmitData([...letSubmitData]);

        var totalPrice = '';
        if(data.insMode === '2'){//직접입력
            totalPrice = itemData;

        }else{//파일입력
            totalPrice = amt.replace(/[^-0-9]/g, '');
        }

        /* TradeSign 라이센스 문제로 데이터 서명 부분 주석
        =====================================주석처리 시작======================================
        nxTSPKI.signData(totalPrice, //암호화 하는 데이터
          {ssn:true}, //인증서 정보 포함 여부
          async function(res){//인증후 콜백

            if(res.code ==0){//인증완료

                //인증서 유효기간 체크
                var validFrom = res.data.certInfo.validFrom
                var validTo = res.data.certInfo.validTo//시작일
                var validDate = await vm.checkCertDate(validFrom, validTo);//만료일
                if(!validDate){
                    vm.$swal({
                        type: "warning",
                        text: "인증서 유효기간이 아닙니다.",
                    });

                    return false;
                }

                let params = {
                    biNo : vm.biNo
                ,   submitData : vm.submitData
                ,   amt : res.data.signedData
                ,   certInfo : res.data.certInfo
                ,   esmtCurr : vm.esmtCurr 
                ,   insModeCode : vm.data.insMode
                }

                formData.append('data', JSON.stringify(params));
                formData.append('detailFile', vm.detailFile);
                formData.append('etcFile', vm.etcFile);
                await vm.bidSubmitting(formData);
              
            }else{//실패
                vm.$swal({
                    type: "warning",
                    text: res.errorMessage,
                });
          }}
        )
        =====================================주석처리 끝======================================
        */

        //==============================위에 주석처리 된 부분 대체되는 소스=========================
        let biNo = localStorage.getItem('biNo');

        let params = {
            biNo : biNo
        ,   submitData : submitData
        ,   amt : totalPrice
        ,   certInfo : ''
        ,   esmtCurr : esmtCurr 
        ,   insModeCode : data.insMode
        }

        formData.append('data', JSON.stringify(params));
        formData.append('detailFile', detailFile);
        formData.append('etcFile', etcFile);
        bidSubmitting(formData);
        //==============================위에 주석처리 된 부분 대체되는 소스/=========================
    }, [submitData, amt, esmtCurr, detailFile, etcFile, data])

    //파일등록 견적 총 금액 한글표기
    const onConvertToKoreanNumber = useCallback((number) => {
        const koreanNumber = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
        const tenUnit = ['', '십', '백', '천'];
        const tenThousandUnit = ['해', '경', '조', '억', '만', ''];
        const unit = 10000;

        let answer = '';

        while (number > 0) {
            const mod = number % unit;
            const modToArray = mod.toString().split('');
            const length = modToArray.length - 1;

            const modToKorean = modToArray.reduce((acc, value, index) => {
                const valueToNumber = +value;
                if (!valueToNumber) return acc;
                // 단위가 십 이상인 '일'글자는 출력하지 않는다. ex) 일십 -> 십
                const numberToKorean = koreanNumber[valueToNumber];
                return `${acc}${numberToKorean}${tenUnit[length - index]}`;
            }, '');

            answer = `${modToKorean}${tenThousandUnit.pop()} ${answer}`;
            number = Math.floor(number / unit);
        }

        setAmtHangle(answer);
    }, [])

    //투찰가능 플래그
    const [esmtPossible, setEsmtPossible] = useState(true);

    useEffect(() => {
        // 공인인증서 관련 nxTSPKI 초기화
        // nxTSPKI.init(true);

        if (isMounted.current) {
            const onCodeInit = async() => {
                await axios.post('/api/v1/bidPtStatus/currList', {}).then((response) => {
                    if(response.data.code === 'OK'){
                        setCurrList(response.data.data);
                        if(esmtCurr === ''){
                            setEsmtCurr(response.data.data[0].codeVal);
                        }
                    }else{
                        Swal.fire('', response.data.msg, 'error');
                    }
                });
        
            }

            onCodeInit();

            //업체 공고확인
            const checkBid = async() => {
                let params = {
                    biNo : localStorage.getItem('biNo')
                }
                axios.post("/api/v1/bidPtStatus/checkBid", params);
            }

            checkBid();

            onSearch();
            isMounted.current = false;
        }

    },[]);

    //공인인증서 관련
    // const checkCertDate = (startDate , endDate) => {
    //     // 현재 날짜 객체 생성
    //     var currentDate = new Date();

    //     // 비교 대상 날짜 객체 생성
    //     var start = new Date(startDate);
    //     var end = new Date(endDate);

    //     if(currentDate < start || end < currentDate ){//인증서 유효기간이 아닌 경우
    //         return false;
    //     }else{
    //         return true;
    //     }
    // }

    return (
        <div className="conRight">
            {/* conHeader */}
            <div className="conHeader">
                <ul className="conHeaderCate">
                    <li>전자입찰</li>
                    <li>입찰진행 상세</li>
                </ul>
            </div>
            {/* //conHeader */}
            {/* contents */}
            <div className="contents">
                <div className="formWidth">
                    { !Ft.isEmpty(data) &&
                    <PartnerCmmnInfo key={'info_'+data.biNo} data={data} attSign="Y" />
                    }
                    
                    {/* // 견적을 제출 했을 경우 */}
                    { data.custEsmtYn === '2' && 
                        <>
                        <h3 className="h3Tit mt50">견적 제출 정보</h3>
                        <div className="boxSt mt20">
                            <div className="flex align-items-center">
                                <div className="flex align-items-center width100">
                                    <div className="formTit flex-shrink0 width170px">견적제출일시</div>
                                    <div className="width100">{ data.custEsmtUpdateDate }</div>
                                </div>
                            </div>
                        </div>
                        </>
                    }
                    {/* 견적을 제출 했을 경우 */}

                    {/* 견적을 아직 제출 안한 경우 */}
                    { data.custEsmtYn === '1' && 
                    <>
                        <h3 className="h3Tit mt50">견적 제출</h3>
                        <div className="conTopBox mt20">
                            <ul className="dList">
                                <li><div>견적 제출 후 수정할 수 없으니 꼼꼼히 확인하시고 제출하시기 바랍니다.</div></li>
                            </ul>
                        </div>
                        <div className="boxSt mt20">
                            {data.insMode === '2' && 
                            <>
                            <table className="tblSkin1">
                                <colgroup>
                                    <col />
                                </colgroup>
                                <thead>
                                <tr>
                                    <th>품목명</th>
                                    <th>규격</th>
                                    <th>단위</th>
                                    <th>수량</th>
                                    <th>견적단가</th>
                                    <th className="end">견적금액</th>
                                </tr>
                                </thead>
                                <tbody>
                                { submitData?.map((spec, idx) => 
                                    <tr key={idx}>
                                        <td className="text-left">{ spec.name }</td>
                                        <td className="text-right">{ spec.ssize }</td>
                                        <td className="text-right">{ spec.unitcode }</td>
                                        <td className="text-right">{ Ft.numberWithCommas(spec.orderQty) }</td>
                                        <td className="text-right">
                                            <div className="inputStyle readonly"><span>{ Ft.ftCalcOrderUc(spec.esmtUc, spec.orderQty) }</span></div>
                                        </td>
                                        <td className="text-right end">
                                            <input type="text" className="inputStyle inputSm text-right" defaultValue={ spec.esmtUc } onKeyUp={(e)=>onTotalAmt(e, idx)} /> 
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>

                            <div className="flex align-items-center justify-space-end mt10" >
                                <div className="flex align-items-center">
                                <div className="formTit flex-shrink0 mr20">총 견적금액</div>
                                    <div className="flex align-items-center width100">
                                        <select className="selectStyle maxWidth140px" defaultValue={esmtCurr} onChange={(e)=>{setEsmtCurr(e.target.value)}} >
                                            { currList?.map((val, idx) =>
                                            <option value={val.codeVal} key={idx} >{ val.codeName }</option>
                                            )}
                                        </select>
                                        <input type="text" className="inputStyle readonly ml10" value={totalAmt} readOnly />
                                    </div>
                                </div>
                            </div>
                            </>
                            }

                            {data.insMode === '1' && 
                            <>
                            <div className="flex align-items-center width100 mt10">
                                <div className="formTit flex-shrink0 width170px">견적금액 <span className="star">*</span></div>
                                <div className="flex align-items-center width100">
                                    <select className="selectStyle maxWidth140px" defaultValue={esmtCurr} onChange={(e)=>{setEsmtCurr(e.target.value)}} >
                                        { currList?.map((val, idx) =>
                                        <option value={val.codeVal} key={idx} >{ val.codeName }</option>
                                        )}
                                    </select>
                                    <input type="text" className="inputStyle" placeholder="숫자만 입력" style={{margin: "0 10px"}} defaultValue={amt} onChange={(e)=>{onChangeAmt(e.target.value)}} /> 
                                    <input type="text" className="inputStyle readonly" value={amtHangle} readOnly />
                                </div>
                            </div>
                            <div className="flex mt10">
                                <div className="formTit flex-shrink0 width170px">견적내역파일 <span className="star">*</span>
                                    {/* 툴팁 */}
                                    <i className="fas fa-question-circle toolTipSt ml5">
                                        <div className="toolTipText" style={{width: "370px"}}>
                                            <ul className="dList">
                                                <li><div>전자입찰 등록서류의 세부내역 파일을 다운받아 내역 작성후 첨부해 주십시오</div></li>
                                                <li className="textHighlight"><div>파일형식은 세부내역과 같은 형식으로 작성해 주십시오</div></li>
                                            </ul>
                                        </div>
                                    </i>
                                    {/* //툴팁 */}
                                </div>
                                <div className="width100">
                                    {/* 다중파일 업로드 */}
                                    <div className="upload-boxWrap">
                                        { detailFile === '' &&
                                        <div className="upload-box">
                                            <input type="file" id="file-input" onChange={fileInputChange} />
                                            <div className="uploadTxt">
                                                <i className="fa-regular fa-upload"></i>
                                                <div>클릭 혹은 파일을 이곳에 드롭하세요.(암호화 해제)<br />파일 최대 10MB (등록 파일 개수 최대 1개)</div>
                                            </div>
                                        </div>
                                        }
                                        { detailFile !== '' &&
                                        <div className="uploadPreview" id="preview">
                                            <p style={{lineHeight:"80px"}}>{ detailFile.name }<button id="removeBtn" className="file-remove" onClick={()=>{setDetailFile("")}}>삭제</button></p>
                                        </div>
                                        }
                                    </div>
                                    {/* 다중파일 업로드 */}
                                </div>
                            </div>
                            </>
                            }
                            <div className="flex mt10">
                                <div className="formTit flex-shrink0 width170px">기타첨부</div>
                                <div className="width100">
                                    {/* 다중파일 업로드 */}
                                    <div className="upload-boxWrap">
                                        { etcFile === '' &&
                                        <div className="upload-box">
                                            <input type="file" id="file-input2" onChange={fileInput2Change} />
                                            <div className="uploadTxt">
                                                <i className="fa-regular fa-upload"></i>
                                                <div>클릭 혹은 파일을 이곳에 드롭하세요.(암호화 해제)<br />파일 최대 10MB (등록 파일 개수 최대 1개)</div>
                                            </div>
                                        </div>
                                        }
                                        { etcFile !== '' &&
                                        <div className="uploadPreview" id="preview2">
                                            <p style={{lineHeight:"80px"}}>{ etcFile.name }<button id="removeBtn" className="file-remove" onClick={()=>{setEtcFile("")}}>삭제</button></p>
                                        </div>
                                        }
                                    </div>
                                    {/* 다중파일 업로드 */}
                                </div>
                            </div>
                        </div>
                    </>
                    }
                    {/* // 견적을 아직 제출 안한 경우 */}

                    <div className="text-center mt50">
                        <a href="#!" className="btnStyle btnOutline" title="목록" onClick={()=>onMovePage()}> 목록 </a>
                        { (esmtPossible && data.custEsmtYn === '1' && (data.ingTag === 'A1' || (data.ingTag === 'A3' && data.custRebidYn === 'Y'))) &&
                        <a href="#!" onClick={()=>onCheck()} className="btnStyle btnPrimary" title="견적서 제출">견적서 제출</a>
                        }
                        { ( esmtPossible && data.custEsmtYn === '1' && data.ingTag === 'A3' && data.custRebidYn === 'N' ) &&
                        <a href="#!" onClick={()=>{Swal.fire('', '재입찰 대상이 아닙니다.', 'warning')}} className="btnStyle btnPrimary" style={{opacity: "0.5", cursor: "not-allowed"}} title="견적서 제출">견적서 제출</a>
                        }
                    </div>
                </div>
            </div>
            {/* //contents */}

            {/* <!--공고문 미리보기 팝업--> */}
            {/* <BidAdvertisement data="data"/> */}
        </div>
    )
}

export default PartnerBidStatusDetail