import React, { useCallback } from 'react'
import Modal from 'react-bootstrap/Modal';

const BiddingGuide = ({biddingGuidePop, setBiddingGuidePop}) => {
    
    // 팝업 닫기
    const fnCloseBiddingGuidePop = useCallback(() => {
        setBiddingGuidePop(false);
    })

    return (
        <Modal className="modalStyle" id="biddingGuide" show={biddingGuidePop} onHide={fnCloseBiddingGuidePop} keyboard={true} dialogClassName="modal-lg">
            <Modal.Body>
                <a onClick={fnCloseBiddingGuidePop} className="ModalClose" data-bs-dismiss="modal" title="닫기"><i className="fa-solid fa-xmark"></i></a>
                <h2 className="modalTitle">업무(입찰)안내</h2>
                    <div className="modalTopBox">
                        <ul>
                            <li><div>그룹사(당사)에서 전자입찰을 공고/개찰/낙찰 처리 합니다.</div></li>
                            <li><div>협력업체는 공고된 입찰을 확인하고 개찰 및 입찰 결과를 확인할 수 있습니다.</div></li>
                            <li><div>입찰 진행중 그룹사 개찰담당자는 입찰을 유찰할 수 있습니다.<br />(입찰에 참여한 업체에게 메일 발송)</div></li>
                        </ul>
                    </div>
                    <table className="biddingInfoTbl mt20">						
                        <caption>업무(입찰)안내의 절차(그룹사,협력업체), 주요내용을 나타내는 표</caption>
                        <colgroup>
                            <col style={{ width: '23%'}} />
                            <col style={{ width: '23%'}} />
                            <col style={{ width: '64%'}} />
                            <col />
                        </colgroup>
                        <thead>
                            <tr>
                                <th colspan="2">절차</th>
                                <th rowspan="2" className="end">주요내용</th>
                            </tr>
                            <tr>
                                <th>그룹사</th>
                                <th>협력업체</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="2" style={{ position:'relative'}}><img src="/images/biddingInfo.png" className="img-responsive" alt="절차" style={{ position:'absolute', top:0, left:0}} /></td>
                                <td className="text-left end">
                                    <ul className="dList">
                                        <li><div>입찰 담당자는 입찰 계획을 등록합니다.</div></li>
                                        <li><div>입찰 공고자는 입찰 계획을 확인하고 입찰을 공고합니다.</div></li>
                                        <li><div>공고 시 지정업체 담당자에게 메일 발송됩니다.</div></li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2"></td>
                                <td className="text-left end">
                                    <ul className="dList">
                                        <li><div>공고된 입찰을 조회합니다.</div></li>
                                        <li><div>지명입찰 일 경우 담당자는 메일을 통해 확인할 수 있습니다.</div></li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2"></td>
                                <td className="text-left end">
                                    <ul className="dList">
                                        <li><div>입찰 세부내역을 확인하고 견적서를 제출합니다.</div></li>
                                        <li><div>투찰(견적서 제출) 시 공동인증서를 통해 인증을 합니다.</div></li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2"></td>
                                <td className="text-left end">
                                    <ul className="dList">
                                        <li><div>입찰의 제출마감일시가 지나면 개찰자는 업체의 투찰 내역을<br />확인할 수 있습니다.</div></li>
                                        <li><div>개찰 시 공동인증서 암호를 입력해야 합니다.</div></li>
                                        <li><div>진행 중인 입찰에 대해서 공고자는 입찰을 유찰 할 수 있습니다.</div></li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2"></td>
                                <td className="text-left end">
                                    <ul className="dList">
                                        <li><div>개찰자는 낙찰업체를 선정할 수 있습니다.<br />(선정된 업체에게는 낙찰 메일 발송)</div></li>
                                        <li><div>개찰자는 개찰 된 입찰에 유찰 또는 재입찰 할 수 있습니다.</div></li>
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2"></td>
                                <td className="text-left end">
                                    <ul className="dList">
                                        <li><div>낙찰된 내역을 확인할 수 있습니다.</div></li>
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <div className="modalFooter">
                        <a onClick={fnCloseBiddingGuidePop} className="modalBtnClose" data-dismiss="modal" title="닫기">닫기</a>
                    </div>
            </Modal.Body>
        </Modal>
    )
}

export default BiddingGuide