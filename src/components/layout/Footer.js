import React from 'react';

//todo: 화면 대충 복붙해서 오류나는 부분 수정만 해서 다시 복붙해서 한줄씩 수정 필요...

const Footer = () => {
    return (
        <div className="footer">
            <div className="subFooter">
                <span v-if="showSentence">
                    © BITCUBE ALL RIGHTS RESERVED. <br />
                    전자입찰 문의: IT HelpDesk ( 02 - 720 - 4650 ) &nbsp e-mail : bitcube@bitcube.co.kr
                </span>
                <div className="subFooterUtill">
                    <a  click="clickCertificate" title="공동인증서">공동인증서</a>
                    <a  click="clickRegProcess" title="업체등록절차">업체등록절차</a>
                    <a  click="clickBiddingInfo" title="입찰업무안내">입찰업무안내</a>
                </div>
                
                {/*<EnrollmentProcess />

                <BiddingGuide />

                <div className="modal fade modalStyle" id="commonAlertPop" tabindex="-1" role="dialog" aria-hidden="true">
                    <div className="modal-dialog" style={{width: '100%', maxWidth: '420px'}}>
                    <div className="modal-content">
                        <div className="modal-body">
                        <a className="ModalClose" data-dismiss="modal" title="닫기"><i className="fa-solid fa-xmark"></i></a>
                        <div id="commonAlertMsg" className="alertText2"></div>
                        <div className="modalFooter">
                            <a className="modalBtnClose" data-dismiss="modal" title="닫기">닫기</a>
                        </div>
                        </div>				
                    </div>
                    </div>
                </div>
                */}
            </div>
        </div>
    );
};

export default Footer;