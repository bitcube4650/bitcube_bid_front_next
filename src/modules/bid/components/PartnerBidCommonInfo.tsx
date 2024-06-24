import React from 'react'
import Ft from '../api/filters';
import Api from '../api/api';
import { MapType } from 'components/types'

interface props {
    data: MapType;
}

const PartnerBidCommonInfo:React.FC<props> = ({ data }) => {
    return (
        <div>
            <h3 className="h3Tit">입찰에 부치는 사람</h3>
            <div className="boxSt mt20">
                <div className="flex align-items-center">
                    <div className="formTit flex-shrink0 width170px">입찰번호</div>
                    <div className="width100">{ data.biNo }</div>
                </div>
                <div className="flex align-items-center mt20">
                    <div className="formTit flex-shrink0 width170px">입찰명</div>
                    <div className="width100">{ data.biName }</div>
                </div>
                <div className="flex align-items-center mt20">
                    <div className="formTit flex-shrink0 width170px">품목</div>
                    <div className="width100">{ data.itemName } 품목류</div>
                </div>
            </div>

            <h3 className="h3Tit mt50">입찰방식 및 낙찰자 결정방법</h3>
            <div className="boxSt mt20">
                <div className="flex align-items-center">
                    <div className="formTit flex-shrink0 width170px">입찰방식</div>
                    <div className="width100">{ Ft.ftBiMode(data.biMode) }</div>
                </div>
                <div className="flex align-items-center mt20">
                    <div className="formTit flex-shrink0 width170px">낙찰자 결정방법</div>
                    <div className="width100">{ data.succDeciMeth }</div>
                </div>
            </div>

            <h3 className="h3Tit mt50">입찰 참가정보</h3>
            <div className="boxSt mt20">
                <div className="flex align-items-center">
                    <div className="formTit flex-shrink0 width170px">입찰참가자격</div>
                    <div className="width100">{ data.bidJoinSpec }</div>
                </div>
                <div className="flex align-items-center mt20">
                    <div className="formTit flex-shrink0 width170px">현장설명일시</div>
                    <div className="width100">{ data.spotDate }</div>
                </div>
                <div className="flex align-items-center mt20">
                    <div className="formTit flex-shrink0 width170px">현장설명장소</div>
                    <div className="width100">{ data.spotArea }</div>
                </div>
                <div className="flex mt20">
                    <div className="formTit flex-shrink0 width170px">특수조건</div>
                    <div className="width100">
                        <div className="overflow-y-scroll boxStSm width100" style={{height:"100px"}}>
                            <pre style={{backgroundColor: "white"}}>{ data.specialCond }</pre>
                        </div>
                    </div>
                </div>
                <div className="flex align-items-center mt20">
                    <div className="formTit flex-shrink0 width170px">납품조건</div>
                    <div className="width100">{ data.supplyCond }</div>
                </div>
                <div className="flex align-items-center mt20">
                    <div className="formTit flex-shrink0 width170px">금액기준</div>
                    <div className="width100">{ data.amtBasis }</div>
                </div>
                <div className="flex align-items-center mt20">
                    <div className="formTit flex-shrink0 width170px">결제조건</div>
                    <div className="width100">{ data.payCond }</div>
                </div>
            </div>

            <h3 className="h3Tit mt50">참고사항</h3>
            <div className="boxSt mt20">
                <div className="flex align-items-center">
                    <div className="flex align-items-center width100">
                        <div className="formTit flex-shrink0 width170px">입찰담당자</div>
                        <div className="width100">{ data.damdangName }</div>
                    </div>
                    <div className="flex align-items-center width100 ml80">
                        <div className="formTit flex-shrink0 width170px">입찰담당부서</div>
                        <div className="width100">{ data.deptName }</div>
                    </div>
                </div>
                { ( data.ingTag == 'A3' && data.whyA3 ) &&
                <div className="flex align-items-center mt20">
                    <div className="formTit flex-shrink0 width170px">재입찰사유</div>
                    <div className="width100">{ data.whyA3 }</div>
                </div>
                }
            </div>

            <h3 className="h3Tit mt50">전자입찰 제출 내역</h3>
            <div className="conTopBox mt20">
                <ul className="dList">
                    <li><div>세부내역파일을 다운받아 내역 작성 후 제출기한 내 등록해 주시기 바랍니다.</div></li>
                    <li><div>첨부파일은 세부내역 작성에 참고 될 자료들입니다.</div></li>
                </ul>
            </div>
            <div className="boxSt mt20">
                <div className="flex align-items-center">
                    <div className="flex align-items-center width100">
                        <div className="formTit flex-shrink0 width170px">제출시작일시</div>
                        <div className="width100">{ data.estStartDate }</div>
                    </div>
                    <div className="flex align-items-center width100 ml80">
                        <div className="formTit flex-shrink0 width170px">제출마감일시</div>
                        <div className="width100">{ data.estCloseDate }</div>
                    </div>
                </div>
                <div className="flex align-items-center mt20">
                    <div className="formTit flex-shrink0 width170px">세부내역</div>
                    { data.insMode == '1' && 
                    <div className="width100">
                        { data.specFile?.map((specFile:MapType, idx:string) => 
                        <a key={idx} onClick={ () => Api.downloadFile(specFile)} className="textUnderline">{ specFile.fileNm }</a>)
                        }
                    </div>
                    }

                    { data.insMode == '2' && 
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
                                <th className="end">수량</th>
                            </tr>
                            </thead>
                            <tbody>
                            { data.specInput?.map((spec:MapType, idx:string) => 
                                <tr key={idx}>
                                    <td className="text-left">{ spec.name }</td>
                                    <td className="text-right">{ spec.ssize }</td>
                                    <td className="text-right">{ spec.unitcode }</td>
                                    <td className="text-right end">{ Ft.numberWithCommas(spec.orderQty) }</td>
                                </tr>
                            ) }
                            </tbody>
                        </table>
                    </div>
                    }
                </div>
                
                <div className="flex align-items-center mt20">
                    <div className="formTit flex-shrink0 width170px">첨부파일</div>
                    <div className="width100">
                        { data.fileList?.map((file:MapType, idx:string) => 
                        <div key={idx} className={file.fileFlag == '1' ? 'textHighlight' : ''}>
                            <span className="mr20">{ Ft.ftFileFlag(file.fileFlag) }</span><a onClick={ () => Api.downloadFile(file)} className="textUnderline">{ file.fileNm }</a><br/>
                        </div>) 
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}

export default PartnerBidCommonInfo