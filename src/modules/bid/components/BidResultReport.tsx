import React from 'react'
import Ft from '../api/filters';
import Api from '../api/api';
import Modal from 'react-bootstrap/Modal';
import { MapType } from 'components/types';

interface props {
    title : string;
    data : MapType;
    reportPop : boolean;
    setReportPop : any;
}

const BidResultReport:React.FC<props> = ({ title, data, reportPop, setReportPop}) => {

    const onClosePop = () => {
        setReportPop(false);
    }

    return (
        // 입찰결과 보고서
        <Modal className="modalStyle printDiv" id="resultsReport" show={reportPop} onHide={onClosePop} keyboard={true} size="lg">
            <Modal.Body>
                <a className="ModalClose" onClick={onClosePop} data-dismiss="modal" title="닫기"><i className="fa-solid fa-xmark"></i></a>
                <h2 className="modalTitle">{ title }</h2>
                <h4 className="h4Tit mt20">입찰정보</h4>
                <div className="modalBoxSt mt10">
                    <div className="flex align-items-center">
                        <div className="formTit flex-shrink0 width170px">입찰번호</div>
                        <div className="width100">{ data.biNo }</div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width170px">입찰명</div>
                        <div className="width100">{ data.biName }</div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width170px">입찰방식</div>
                        <div className="width100">{ Ft.ftBiMode(data.biMode) }</div>
                    </div>
                    <div className="flex align-items-center mt10" v-if="flag == 'progress'">
                        <div className="formTit flex-shrink0 width170px">입찰참가자격</div>
                        <div className="width100">{ data.bidJoinSpec }</div>
                    </div>
                    <div className="flex mt10">
                        <div className="formTit flex-shrink0 width170px">특수조건</div>
                        <div className="width100">
                            <pre style={{backgroundColor: 'white'}}>{ data.specialCond }</pre>
                        </div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width170px">현장설명일시</div>
                        <div className="width100">{ data.spotDate }</div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width170px">현장설명장소</div>
                        <div className="width100">{ data.spotArea }</div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width170px">낙찰자결정방법</div>
                        <div className="width100">{ data.succDeciMeth }</div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width170px">입찰일시</div>
                        <div className="width100">{ data.estStartDate } ~ { data.estCloseDate }</div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width170px">납품조건</div>
                        <div className="width100">{ data.supplyCond }</div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width170px">금액기준</div>
                        <div className="width100">{ data.amtBasis }</div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width170px">예산금액</div>
                        <div className="width100">{ Ft.numberWithCommas(data.bdAmt) } 원</div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width170px">입찰담당자</div>
                        <div className="width100">{ data.damdangName }</div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width170px">계열사공유</div>
                        <div className="width100">비공유</div>
                    </div>
                </div>

                <h4 className="h4Tit mt20">투찰 내역</h4>
                <table className="tblSkin1 mt10">
                    <colgroup>
                        <col />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>순위</th>
                            <th>업체명</th>
                            <th>대표자</th>
                            <th>낙찰금액</th>
                            <th>예산대비</th>
                            <th className="end">구분</th>
                        </tr>
                    </thead>
                    <tbody>
                        { data.custList?.map((cust:MapType, idx:string) => 
                            <tr key={idx}>
                                <td>{ idx+1 }</td>
                                <td className="text-left">{ cust.custName }</td>
                                <td>{ cust.presName }</td>
                                <td className="text-right">{ cust.esmtCurr } { Ft.numberWithCommas(cust.esmtAmt) }</td>
                                <td className="text-right">{ Ft.ftBdComp(data, cust.esmtAmt) }</td>
                                <td className="end">{ Ft.ftSuccYn(cust.succYn) }</td>
                            </tr>
                        ) }
                    </tbody>
                </table>

                <div className="modalFooter">
                    <a className="modalBtnClose" onClick={onClosePop} data-dismiss="modal" title="닫기">닫기</a>
                    <a onClick={()=>Api.fnPrint()} className="modalBtnCheck" title="인쇄하기">인쇄하기</a>
                </div>
            </Modal.Body>
        </Modal>
        //입찰결과 보고서
    )
}

export default BidResultReport
