import React, { useState } from 'react'
import Ft from '../api/filters';
import Api from '../api/api';
import CustUserPop from './BidCustUserList';
import Swal from 'sweetalert2';
import BidAttSignPop from './BidAttSignPop';

const BidCommonInfo = (props) => {
    
    //세션 로그인 정보
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
    const userId = loginInfo.userId;

    //협력사 사용자 조회 팝업
    const [custUserPop, setCustUserPop] = useState(false);
    const [custCode, setCustCode] = useState("");
    const [custName, setCustName] = useState("");
    
    //입회자 서명
    const [whoAtt, setWhoAtt] = useState("");
    const [attSignId, setAttSignId] = useState("");
    const [attPop, setAttPop] = useState(false);

    //협력사 사용자 조회 팝업 오픈
    const onOpenCustUserPop = (cust) => {
        setCustUserPop(true);
        setCustCode(cust.custCode);
        setCustName(cust.custName);
    }

    //입회자 서명 팝업 오픈
    const onOpenAttSignPop = (att, attSignId, signYn) => {
        if(signYn === 'N'){
            let currDate = new Date();
            let currDateTime = currDate.getTime();
            let estStartDate = new Date(props.data.estStartDate);
            let estStartTime = estStartDate.getTime();
            let estCloseDate = new Date(props.data.estCloseDate);
            let estCloseTime = estCloseDate.getTime();
            
            if(estStartTime > currDateTime || estCloseTime > currDateTime){
                Swal.fire('', '입회자 서명은 제출마감일시 이후에 가능합니다.', 'error');
                return false;
            }

            setWhoAtt(att);
            setAttSignId(attSignId);
            setAttPop(true);
        }
    }

    const onAttSignUpdate = (whoAtt) => {
        if(whoAtt === '1'){
            props.data.openAtt1Sign ='Y'
        }else if(whoAtt === '2'){
            props.data.openAtt2Sign ='Y'
        }
    }

    return (
        <div>
            <h3 className="h3Tit">입찰기본정보</h3>
            <div className="boxSt mt20">
                <div className="flex align-items-center">
                    <div className="formTit flex-shrink0 width170px">입찰번호</div>
                    <div className="width100">{ props.data.biNo }</div>
                </div>
                <div className="flex align-items-center mt20">
                    <div className="formTit flex-shrink0 width170px">입찰명</div>
                    <div className="width100">{ props.data.biName }</div>
                </div>
                <div className="flex align-items-center mt20">
                    <div className="formTit flex-shrink0 width170px">품목</div>
                    <div className="width100">{ props.data.itemName }</div>
                </div>
                <div className="flex align-items-center mt20">
                    <div className="formTit flex-shrink0 width170px">입찰방식</div>
                    <div className="width100">{ Ft.ftBiMode(props.data.biMode) }</div>
                </div>
                <div className="flex align-items-center mt20">
                    <div className="formTit flex-shrink0 width170px">입찰참가자격</div>
                    <div className="width100">{ props.data.bidJoinSpec }</div>
                </div>
                <div className="flex mt20">
                    <div className="formTit flex-shrink0 width170px">특수조건</div>
                    <div className="width100">
                        <div className="boxStSm width100 boxOverflowY" style={{height:"100px"}}><pre style={{backgroundColor: "white"}}>{ props.data.specialCond }</pre></div>
                    </div>
                </div>
                <div className="flex align-items-center mt20">
						<div className="formTit flex-shrink0 width170px">현장설명일시</div>
						<div className="width100">{ props.data.spotDate }</div>
					</div>
					<div className="flex align-items-center mt20">
						<div className="formTit flex-shrink0 width170px">현장설명장소</div>
						<div className="width100">{ props.data.spotArea }</div>
					</div>
					<div className="flex align-items-center mt20">
						<div className="formTit flex-shrink0 width170px">낙찰자결정방법</div>
						<div className="width100">{ props.data.succDeciMeth }</div>
					</div>
                <div className="flex align-items-center mt20">
                    <div className="formTit flex-shrink0 width170px">입찰참가업체</div>

                    { props.data.biMode === 'A' &&
                    <div className="width100">
                        <div className="overflow-y-scroll boxStSm width100" style={{height:"50px"}}>
                            { props.data.custList?.map((cust, idx) => 
                                <a href="#!" key={idx} onClick={()=>onOpenCustUserPop(cust)} className="textUnderline">{ cust.custName }
                                {props.data.custList.length !== (idx+1) &&
                                <span>, </span>
                                }
                                </a>
                            ) }
                        </div>
                    </div>
                    }
                    
                    { props.data.biMode === 'B' &&
                        <div className="flex align-items-center width100">
                            <div className="boxStSm width100 boxOverflowY">
                                <a href="#!">가입회원사 전체</a>
                            </div>
                        </div>
                    }
                </div>
                <div className="flex align-items-center mt20">
                    <div className="formTit flex-shrink0 width170px">금액기준</div>
                    <div className="width100">{ props.data.amtBasis }</div>
                </div>
                <div className="flex align-items-center mt20">
                    <div className="formTit flex-shrink0 width170px">결제조건</div>
                    <div className="width100">{ props.data.payCond }</div>
                </div>
                <div className="flex align-items-center mt20">
                    <div className="formTit flex-shrink0 width170px">예산금액</div>
                    <div className="width100">{ Ft.numberWithCommas(props.data.bdAmt) } 
                    { (props.data.bdAmt !== undefined && props.data.bdAmt !== null &&props.data.bdAmt !== '') &&
                        <span>원</span>
                    }
                    { (props.data.realAmt !== undefined && props.data.realAmt !== null && props.data.realAmt !== '' && props.data.ingTag === 'A5' && ( props.data.createUser === userId || props.data.gongoId === userId)) &&
                    <span> ( 실제 계약금액 : { Ft.numberWithCommas(props.data.realAmt) } 원 )</span>
                    }
                    </div>
                </div>
                <div className="flex align-items-center mt20">
                    <div className="formTit flex-shrink0 width170px">입찰담당자</div>
                    <div className="width100">{ props.data.damdangName }</div>
                </div>
            </div>

            { props.data.interrelatedCustCode === '02' &&
                <>
                <h3 className="h3Tit mt50">입찰분류</h3>
                <div className="boxSt mt20" >
                    <div className="flex align-items-center">
                        <div className="formTit flex-shrink0 width170px">분류군</div>
                        <div className="flex align-items-center width100">
                            <select className="selectStyle" disabled>
                                <option value="">{ props.data.matDept }</option>
                            </select>
                            <select className="selectStyle" style={{margin: "0 10px"}} disabled>
                                <option value="">{ props.data.matProc }</option>
                            </select>
                            <select className="selectStyle" disabled>
                                <option value="">{ props.data.matCls }</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex align-items-center mt20">
                        <div className="formTit flex-shrink0 width170px">공장동</div>
                        <div className="width100">{ props.data.matFactory }</div>
                    </div>
                    <div className="flex align-items-center mt20">
                        <div className="flex align-items-center width100">
                            <div className="formTit flex-shrink0 width170px">라인</div>
                            <div className="width100">{ props.data.matFactoryLine }</div>
                        </div>
                        <div className="flex align-items-center width100 ml80">
                            <div className="formTit flex-shrink0 width170px">호기</div>
                            <div className="width100">{ props.data.matFactoryCnt }</div>
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
                    <div className="width100">{ props.data.estStartDate }</div>
                    </div>
                    <div className="flex align-items-center width100 ml80">
                    <div className="formTit flex-shrink0 width170px">제출마감일시</div>
                    <div className="width100">{ props.data.estCloseDate }</div>
                    </div>
                </div>
                <div className="flex align-items-center mt20">
                    <div className="flex align-items-center width100">
                    <div className="formTit flex-shrink0 width170px">개찰자</div>
                    <div className="width100">{ props.data.estOpener }</div>
                    </div>
                    <div className="flex align-items-center width100 ml80">
                    <div className="formTit flex-shrink0 width170px">입찰공고자</div>
                    <div className="width100">{ props.data.gongoName }</div>
                    </div>
                </div>
                <div className="flex align-items-center mt20">
                    <div className="flex align-items-center width100">
                    <div className="formTit flex-shrink0 width170px">낙찰자</div>
                    <div className="width100">{ props.data.estBidder }</div>
                    </div>
                </div>
                <div className="flex align-items-center mt20">
                    <div className="flex align-items-center width100">
                        <div className="formTit flex-shrink0 width170px">입회자1</div>
                        { props.attSign === 'N' &&
                        <div className="width100">{ props.data.openAtt1 }</div>
                        }

                        { props.attSign === 'Y' &&
                        <div className="width100">{ props.data.openAtt1 }
                            { props.data.openAtt1Id === userId && 
                            <span style={ props.data.openAtt1Sign !== 'Y' ? {color: 'red',cursor: 'pointer', textDecoration: 'underline'} : {} } onClick={() => onOpenAttSignPop('1', props.data.openAtt1Id, props.data.openAtt1Sign)}>{ Ft.ftOpenAttSign(props.data.openAtt1Sign) }</span>
                            }
                            { (props.data.openAtt1Id !== userId && props.data.openAtt1Id != null && props.data.openAtt1Id !== '' ) &&
                            <span style={{ color:props.data.openAtt1Sign !== 'Y' ? 'red' : '' }}>{ Ft.ftOpenAttSign(props.data.openAtt1Sign) }</span>
                            }
                        </div>
                        }
                    </div>
                    <div className="flex align-items-center width100 ml80">
                        <div className="formTit flex-shrink0 width170px">입회자2</div>
                        { props.attSign === 'N' &&
                        <div className="width100">{ props.data.openAtt2 }</div>
                        }

                        { props.attSign === 'Y' &&
                        <div className="width100">{ props.data.openAtt2 }
                            { props.data.openAtt2Id === userId &&
                            <span style={ props.data.openAtt2Sign !== 'Y' ? {color: 'red',cursor: 'pointer', textDecoration: 'underline'} : {} } onClick={ () => onOpenAttSignPop('2', props.data.openAtt2Id, props.data.openAtt2Sign)}>{ Ft.ftOpenAttSign(props.data.openAtt2Sign) }</span>
                            }
                            { (props.data.openAtt2Id !== userId && props.data.openAtt2Id !== null && props.data.openAtt2Id !== '') &&
                            <span style={{ color:props.data.openAtt2Sign !== 'Y' ? 'red' : '' }}>{ Ft.ftOpenAttSign(props.data.openAtt2Sign) }</span>
                            }
                        </div>
                        }
                    </div>
                </div>
                <div className="flex align-items-center mt20">
                    <div className="flex align-items-center width100">
                        <div className="formTit flex-shrink0 width170px">내역방식</div>
                        <div className="width100">{ Ft.ftInsMode(props.data.insMode) }</div>
                    </div>
                    <div className="flex align-items-center width100 ml80">
                        <div className="formTit flex-shrink0 width170px">납품조건</div>
                        <div className="width100">{ props.data.supplyCond }</div>
                    </div>
                </div>
                <div className="flex align-items-center mt20">
                    <div className="formTit flex-shrink0 width170px">세부내역</div>
                    
                    { props.data.insMode === '1' && 
                    <div className="width100">
                        { props.data.specFile?.map((specFile, idx) => <a href="#!" key={idx} onClick={ () => Api.downloadFile(specFile)} className="textUnderline">{ specFile.fileNm }</a>) }
                    </div>
                    }

                    { props.data.insMode === '2' && 
                    <div className="width100">
                        <table className="tblSkin1">
                            <colgroup>
                                <col />
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
                            { props.data.specInput?.map((spec, idx) => 
                                <tr key={idx}>
                                    <td className="text-left">{ spec.name }</td>
                                    <td className="text-right">{ spec.ssize }</td>
                                    <td className="text-right">{ Ft.numberWithCommas(spec.orderQty) }</td>
                                    <td className="text-right">{ spec.unitcode }</td>
                                    <td className="text-right">{ Ft.numberWithCommas(spec.orderUc) }</td>
                                    <td className="text-right end">{ Ft.numberWithCommas(spec.orderQty * spec.orderUc) }</td>
                                </tr>
                            ) }
                            </tbody>
                        </table>
                        <p className="text-right mt10"><strong v-text="onAllSum(data.specInput)"></strong></p>
                    </div>
                    }
                </div>
                <div className="flex mt20">
                    <div className="formTit flex-shrink0 width170px">첨부파일</div>
                    <div className="width100">
                        { props.data.fileList?.map((file, idx) => 
                            <div key={idx} className={file.fileFlag === '1' ? 'textHighlight' : ''}>
                                <span className="mr20">{ Ft.ftFileFlag(file.fileFlag) }</span><a href="#!" onClick={ () => Api.downloadFile(file)} className="textUnderline">{ file.fileNm }</a>
                            </div>) }
                    </div>
                </div>
                { (props.data.ingTag === 'A3' && props.data.whyA3 !== '' ) &&
                <div className="flex align-items-center mt20">
                    <div className="formTit flex-shrink0 width170px">재입찰사유</div>
                    <div className="width100">{ props.data.whyA3 }</div>
                </div>
                }
                { (props.data.ingTag === 'A7' && props.data.whyA7 !== '' ) &&
                <div className="flex align-items-center mt20">
                    <div className="formTit flex-shrink0 width170px">유찰사유</div>
                    <div className="width100">{ props.data.whyA7 }</div>
                </div>
                }
            </div>

            {/* 입회자 서명 */}
            <BidAttSignPop key={'att_'+props.data.biNo} biNo={props.data.biNo} whoAtt={whoAtt} attSignId={attSignId} setAttPop={setAttPop} attPop={attPop} onAttSignUpdate={onAttSignUpdate} />
            {/* 입회자 서명 */}

            {/* 협력사 사용자 */}
            {custUserPop && 
            <CustUserPop key={'cust_'+props.data.biNo} srcCustCode={custCode} isBidCustUserListModal={custUserPop} setIsBidCustUserListModal={setCustUserPop} srcCustName={custName}/>
            }
            {/* 협력사 사용자 */}
            
        </div>
    )
}

export default BidCommonInfo
