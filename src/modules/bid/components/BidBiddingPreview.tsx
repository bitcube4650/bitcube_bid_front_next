import React from 'react'
import { Modal } from 'react-bootstrap'
import Api from '../api/api'
import { MapType } from 'components/types';

interface BidBiddingPreviewPropsType {
    isBidBiddingPreviewModal : boolean;
    setIsBidBiddingPreviewModal : React.Dispatch<React.SetStateAction<boolean>>;
    data : MapType
}

const BidBiddingPreview : React.FC<BidBiddingPreviewPropsType> = ({isBidBiddingPreviewModal,setIsBidBiddingPreviewModal, data}) => {

    const onIsBiddingPreviewHide = () =>{
        setIsBidBiddingPreviewModal(false)
    }
    const onPrint = ()=>{
    const printContents = document.querySelector(".printDiv")?.innerHTML || "";
    const html = document.querySelector("html");
    const printDiv = document.createElement("div");
    printDiv.className = "print-div modalStyle";
    html?.appendChild(printDiv);
    printDiv.innerHTML = printContents;

    const modalFooter = printDiv.querySelector(".modalFooter") as HTMLElement;
    if (modalFooter) {
        modalFooter.style.display = "none";
    }

    const modalClose = printDiv.querySelector(".ModalClose") as HTMLElement;
    if (modalClose) {
        modalClose.style.display = "none";
    }

    const modalDialog = printDiv.querySelector(".modal-dialog") as HTMLElement;
    if (modalDialog) {
        modalDialog.style.cssText = "width:100%; max-width:700px";
    }

    document.body.style.display = "none";
    window.print();
    document.body.style.display = "block";

    const printDivs = document.querySelectorAll('.print-div');
    printDivs.forEach(element => element.remove());
    }

  return (
    <div>
        <Modal className="modalStyle printDiv" show={isBidBiddingPreviewModal} onHide={onIsBiddingPreviewHide} size='lg'>
            <Modal.Body>
            <button className="ModalClose" onClick={()=>{onIsBiddingPreviewHide()}} title="닫기">
            <i className="fa-solid fa-xmark"></i>
            </button>
            <h2 className="modalTitle">입찰공고</h2>
                <h4 className="h4Tit mt20">가. 입찰에 부치는 사항</h4>
                <div className="modalBoxSt mt10">
                    <div className="flex align-items-center">
                        <div className="formTit flex-shrink0 width170px">입찰번호</div>
                        <div className="width100">{ data.biNo }</div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width170px">입찰명</div>
                        <div style={{width:'550px',wordWrap: 'break-word'}}>{ data.biName }</div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width170px">품명</div>
                        <div className="width100">{ data.itemName } 품목류</div>
                    </div>
                </div>
                <h4 className="h4Tit mt20">나. 입찰 및 낙찰자 결정방식</h4>
                <div className="modalBoxSt mt10">
                    <div className="flex align-items-center">
                        <div className="formTit flex-shrink0 width170px">입찰방식</div>
                        <div className="width100">{ data.biMode === 'A' ? '지명경쟁입찰' : '일반경쟁입찰'}</div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width170px">낙찰자결정방법</div>
                        <div className="width100">{ data.succDeciMeth }</div>
                    </div>
                </div>
                <h4 className="h4Tit mt20">다. 입찰참가정보</h4>
                <div className="modalBoxSt mt10">
                    <div className="flex align-items-center">
                        <div className="formTit flex-shrink0 width170px">입찰참가자격</div>
                        <div style={{ width: '550px', wordWrap: 'break-word' }}>{data.bidJoinSpec}</div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width170px">현장설명일시</div>
                        <div style={{ width: '550px', wordWrap: 'break-word' }}>{data.spotDate}</div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width170px">현장설명장소</div>
                        <div style={{ width: '550px', wordWrap: 'break-word' }}>{data.spotArea}</div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width170px">특수조건</div>
                        <div style={{ width: '550px', wordWrap: 'break-word' }}>
                            <pre style={{ backgroundColor: 'white' }}>{data.specialCond}</pre>
                        </div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width170px">납품조건</div>
                        <div style={{ width: '550px', wordWrap: 'break-word' }}>{data.supplyCond}</div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width170px">금액기준</div>
                        <div className="width100">{data.amtBasis}</div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width170px">결제조건</div>
                        <div style={{ width: '550px', wordWrap: 'break-word' }}>{data.payCond}</div>
                    </div>
                </div>
                <h4 className="h4Tit mt20">라. 참고사항</h4>
                <div className="modalBoxSt mt10">
                    <div className="flex align-items-center">
                        <div className="formTit flex-shrink0 width170px">입찰담당자</div>
                        <div className="width100">{ data.damdangName ? data.damdangName : data.cuser  }</div>
                    </div>
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width170px">입찰담당부서</div>
                        <div className="width100">{ data.deptName}</div>
                    </div>
                </div>

                <h4 className="h4Tit mt20">마. 전자입찰 등록서류</h4>
            <div className="modalBoxSt mt10">
                <div className="flex align-items-center">
                    <div className="formTit flex-shrink0 width170px">제출시작일시</div>
                    <div className="width100">{data.estStartDate}</div>
                </div>
                <div className="flex align-items-center mt10">
                    <div className="formTit flex-shrink0 width170px">제출마감일시</div>
                    <div className="width100">{data.estCloseDate}</div>
                </div>
                { (data.insMode === '2') && (
                    <div className="flex mt10">
                        <div className="formTit flex-shrink0 width170px">세부내역</div>
                        <div className="width100">
                            <table className="tblSkin1">
                                <colgroup>
                                    <col style={{}} />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>품목명</th>
                                        <th>규격</th>
                                        <th>수량</th>
                                        <th>단위</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                    data.specInput &&
                                    (
                                        data.specInput.map((val : any, idx: number) => (
                                            <tr key={idx}>
                                                <td className="text-left">{val.name}</td>
                                                <td className="text-left">{val.ssize}</td>
                                                <td className="text-right">{val.orderQty.toLocaleString()}</td>
                                                <td className="text-left">{val.unitcode}</td>
                                            </tr>
                                        ))
                                    )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                { data.insMode === '1' && 
                    <div className="flex align-items-center mt10">
                        <div className="formTit flex-shrink0 width170px">세부내역</div>
                        <div className="width100">
                            { data.specFile && 
                                (
                                    data.specFile.map((val : any, idx : number) => (
                                        <div key={idx} onClick={ () => Api.downloadFile(val)} >
                                            {val.fileFlag === 'K' && <button className="textUnderline">{val.fileNm}</button>}
                                        </div>
                                    ))
                                )
                            }
                        </div>
                    </div>
                }
                <div className="flex mt10">
                    <div className="formTit flex-shrink0 width170px">첨부파일</div>
                    <div className="width100">
                        { data.fileList &&
                            (
                                data.fileList.map((val : any, idx: number) => (
                                    <div key={`outer${idx}`} onClick={ () => Api.downloadFile(val)} >
                                        {val.fileFlag === '1' && 
                                            <>
                                                <span>대외용 </span> 
                                                <button className="textUnderline mt5">{val.fileNm}</button>
                                            </>
                                        }
                                    </div>
                                ))
                            )
                        }
                    </div>
                </div>
            </div>
            <div className="modalFooter">
                <button className="modalBtnClose" onClick={()=>{onIsBiddingPreviewHide()}} title="닫기">닫기</button>
                <button className="modalBtnCheck" title="인쇄하기" onClick={()=>{onPrint()}}>인쇄하기</button>
            </div>

            </Modal.Body>
        </Modal>
    </div>
  )
}

export default BidBiddingPreview
