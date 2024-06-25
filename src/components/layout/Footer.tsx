import React from 'react';
import { useState } from 'react';
import EnrollmentProcessPop from '../../modules/signup/components/EnrollmentProcess';
import BiddingGuidePop from '../../modules/signup/components/BiddingGuidePop';


const Footer = () => {
    // 업체등록절차 팝업
    const [enrollmentProcessPop, setEnrollmentProcessPop] = useState<boolean>(false);

    // 입찰업무안내 실패 팝업
    const [biddingGuidePop, setBiddingGuidePop] = useState<boolean>(false);

    return (
        <div className="footer">
            <div className="subFooter">
                <span v-if="showSentence">
                    © BITCUBE ALL RIGHTS RESERVED. <br />
                    전자입찰 문의: IT HelpDesk ( 02 - 720 - 4650 ) &nbsp e-mail : bitcube@bitcube.co.kr
                </span>
                <div className="subFooterUtill">
                    <a href="#" title="공동인증서">공동인증서</a>
                    <a onClick={(e) => setEnrollmentProcessPop(true)} data-toggle="modal" title="업체등록절차">업체등록절차</a>
                    <a onClick={(e) => setBiddingGuidePop(true)} data-toggle="modal" title="입찰업무안내">입찰업무안내</a>
                </div>
            </div>

            {/* 업체등록절차 */}
            <EnrollmentProcessPop enrollmentProcessPop={enrollmentProcessPop} setEnrollmentProcessPop={setEnrollmentProcessPop} />
            {/* 업체등록절차 */}

            {/* 입찰업무안내 */}
            <BiddingGuidePop biddingGuidePop={biddingGuidePop} setBiddingGuidePop={setBiddingGuidePop} />
            {/* 입찰업무안내 */}
        </div>
    );
};

export default Footer;