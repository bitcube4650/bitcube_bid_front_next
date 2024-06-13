import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Ft from '../api/filters';
import Api from '../api/api';
import PartnerCmmnInfo from '../components/PartnerBidCommonInfo'
import Modal from 'react-bootstrap/Modal';

const PartnerBidCompleteDetail = () => {

    const navigate = useNavigate();

    //마운트 여부
    const isMounted = useRef(true);

    //조회 결과
    const [data, setData] = useState({});

    const [custEsmtYnTitle, setCustEsmtYnTitle] = useState("");
    const [custEsmtYnContent, setCustEsmtYnContent] = useState("")

    //낙찰확인 팝업
    const [bidConfirmPop, setBidConfirmPop] = useState(false);

    //데이터 조회
    const onSearch = async() => {
        let biNo = localStorage.getItem('biNo');
        let searchParams = {
            biNo : biNo
        }
        await axios.post('/api/v1/bidComplete/partnerDetail', searchParams).then((response) => {
            if(response.data.code === 'OK'){
                let data = response.data.data;
                setData(data);

                if(data.ingTag === 'A5' && data.custList[0].succYn === 'Y'){
                    setCustEsmtYnTitle('낙찰 정보');
                    setCustEsmtYnContent('입찰에 선정 되셨습니다. 입찰에 참여하셨던 내역 정보를 확인해 주십시오.');
                }else if(data.ingTag === 'A5' && data.custList[0].succYn === 'N'){
                    setCustEsmtYnTitle('견적 정보');
                    setCustEsmtYnContent('입찰에 선정되지 못했습니다.');
                }else if(data.ingTag === 'A7'){
                    setCustEsmtYnTitle('유찰');
                    setCustEsmtYnContent('아쉽게도 이번 입찰에는 선정되지 못했습니다. 아래 유찰사유 내용을 확인하십시오.');
                }
            }else{
                Swal.fire('', '조회에 실패하였습니다.', 'error');
            }
        });
    };

    //낙찰확인
    const onSave = useCallback(() => {
        let params = {
            biNo : localStorage.getItem('biNo')
        ,   esmtYn : '3'
        }
        axios.post("/api/v1/bidComplete/updBiCustFlag", params).then((response) => {
            if(response.data.code === 'OK'){
                Swal.fire('', '승인하였습니다.', 'success');
                onMovePage();
            }else{
                Swal.fire('', response.data.msg, 'error');
            }
        });
    }, []);

    useEffect(() => {
        if (isMounted.current) {
            onSearch();
            isMounted.current = false;
        }
    },[]);

    //페이지 이동
    const onMovePage = ()=>{
        navigate('/bid/partnerComplete');
    }

    return (
        <div className="conRight">
            {/* conHeader  */}
            <div className="conHeader">
                <ul className="conHeaderCate">
                    <li>전자입찰</li>
                    <li>입찰완료 상세</li>
                </ul>
            </div>
            {/* //conHeader  */}
            {/* contents  */}
            <div className="contents">
                <div className="formWidth">
                    { !Ft.isEmpty(data) &&
                    <PartnerCmmnInfo key={'info_'+data.biNo} data={data} attSign="Y" />
                    }
                    <h3 className="h3Tit mt50">{ custEsmtYnTitle }</h3>
                    <div className="conTopBox mt20">
                        <ul className="dList">
                            <li className="textHighlight">
                                <div>{ custEsmtYnContent }</div>
                            </li>
                        </ul>
                    </div>

                    {data.ingTag === 'A5' && 
                    <>
                    {data.insMode === '1' && 
                    <div className="boxSt mt20">
                        <div className="flex align-items-center width100">
                            <div className="formTit flex-shrink0 width170px">견적금액 <span className="star">*</span></div>
                            <div className="flex align-items-center width100">
                                <select className="selectStyle maxWidth140px" disabled>
                                    <option value="">{ data.custList[0].esmtCurr }</option>
                                </select>
                                <input type="text" className="inputStyle readonly maxWidth-max-content ml10" defaultValue={ Ft.fnRoundComma(data.custList[0].esmtAmt)} readOnly />
                            </div>
                        </div>
                        <div className="flex mt20">
                            <div className="formTit flex-shrink0 width170px">견적내역파일</div>
                            <div className="width100">
                                <a href="#!" onClick={ () => Api.fnCustSpecFileDown(data.custList[0].fileNm, data.custList[0].filePath) } className="textUnderline">{ data.custList[0].fileNm }</a>
                            </div>
                        </div>
                        <div className="flex mt20">
                            <div className="formTit flex-shrink0 width170px">기타첨부</div>
                            <div className="width100">
                                <a href="#!" onClick={ () => Api.fnCustSpecFileDown(data.custList[0].etcFile, data.custList[0].etcPath) } className="textUnderline">{ data.custList[0].etcFile }</a>
                            </div>
                        </div>
                        {(data.ingTag === 'A5' && data.custList[0].succYn === 'Y' ) && 
                        <div className="flex mt20">
                            <div className="formTit flex-shrink0 width170px">낙찰 추가 합의사항</div>
                            <div className="width100">{ data.addAccept }</div>
                        </div>
                        }
                    </div>
                    }
                    {data.insMode === '2' && 
                    <div className ="boxSt mt20">
                        <table className ="tblSkin1">
                            <colgroup>
                                <col style={{}} />
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
                                { data.custList[0].bidSpec?.map( (spec, index) =>
                                <tr key={index}>
                                    <td className="text-left">{ spec.name }</td>
                                    <td className="text-left">{ spec.ssize }</td>
                                    <td className="text-left">{ spec.unitcode }</td>
                                    <td className="text-right">{ Ft.numberWithCommas(spec.orderQty) }</td>
                                    <td><input type="text" className="inputStyle inputSm text-right readonly" defaultValue={ Ft.fnRoundComma(spec.esmtUc/spec.orderQty) } readOnly /></td>
                                    <td className="end"><input type="text" className="inputStyle inputSm text-right readonly" defaultValue={ Ft.fnRoundComma(spec.esmtUc) } readOnly /></td>
                                </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="flex align-items-center justify-space-end mt10">
                            <div className="flex align-items-center">
                                <div className="formTit flex-shrink0 mr20">총 견적금액</div>
                                <div className="flex align-items-center width100">
                                    <select className="selectStyle maxWidth140px" disabled>
                                        <option value="">{ data.custList[0].esmtCurr }</option>
                                    </select>
                                    <input type="text" className="inputStyle readonly maxWidth-max-content ml10" defaultValue={ Ft.fnRoundComma(data.custList[0].esmtAmt) } readOnly />
                                </div>
                            </div>
                        </div>

                        <div className="flex mt20">
                            <div className="formTit flex-shrink0 width170px">기타첨부</div>
                            <div className="width100">
                                <a href="#!" onClick={ () => Api.fnCustSpecFileDown(data.custList[0].etcFile, data.custList[0].etcPath) } className="textUnderline">{ data.custList[0].etcFile }</a>
                            </div>
                        </div>
                        { (data.ingTag === 'A5' && data.custList[0].succYn === 'Y' ) && 
                        <div className="flex mt20">
                            <div className="formTit flex-shrink0 width170px">낙찰 추가 합의사항</div>
                            <div className="width100">{ data.addAccept }</div>
                        </div>
                        }
                    </div>
                    }
                    </>
                    }
                    {data.ingTag === 'A7' && 
                        <div className="boxSt mt20">
                            <div className="flex align-items-center width100">
                                <div className="formTit flex-shrink0 width170px">유찰사유</div>
                                <div className="width100">{ data.whyA7 }</div>
                            </div>
                        </div>
                    }

                    <div className="text-center mt50">
                        <a href="#!" onClick={onMovePage} className="btnStyle btnOutline" title="목록">목록</a>
                        { (data.ingTag === 'A5' && data.custList[0].succYn === 'Y' && data.custList[0].esmtYn === '2' ) && 
                        <a href="#!" onClick={()=>setBidConfirmPop(true)} className="btnStyle btnPrimary" title="낙찰확인">낙찰확인</a>
                        }
                    </div>
                </div>
            </div>
            {/* // contents  */}

            {/* //  낙찰확인  */}
            <Modal className="modalStyle" id="biddingCheck" show={bidConfirmPop} onHide={()=>setBidConfirmPop(false)} keyboard={true}>
                <Modal.Body>
                    <a href="#!" className="ModalClose" data-dismiss="modal" onClick={()=>setBidConfirmPop(false)} title="닫기"><i className="fa-solid fa-xmark"></i></a>
                    <div className="alertText2">본 입찰의 업체선정 됨을 확인합니다.<br/>낙찰된 건에 대해 승인하시겠습니까?</div>
                    <div className="modalFooter">
                        <a href="#!" className="modalBtnClose" data-dismiss="modal" onClick={()=>setBidConfirmPop(false)} title="취소">취소</a>
                        <a href="#!" onClick={onSave} className="modalBtnCheck" data-toggle="modal" title="승인">승인</a>
                    </div>
                </Modal.Body>				
            </Modal>
            {/* //  낙찰확인  */}
    </div>
    )
}

export default PartnerBidCompleteDetail