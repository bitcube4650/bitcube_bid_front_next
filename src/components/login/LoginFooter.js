import React from 'react';

function LoginFooter(props) {
    return (
        <div className="loginFooter">
            <div className="inner">
                {/* <div className="loginFootLeft"><img src={props.logoUrl} className="img-responsive" alt="일진그룹 로고" /></div> */}
                <div className="loginFootCenter">
                <a href="/#"  click="clickCertificate" title="공동인증서">공동인증서</a>
                <a href="/#" data-toggle="modal" data-target="#regProcess" title="업체등록절차">업체등록절차</a>
                <a href="/#" data-toggle="modal" data-target="#biddingInfo" title="입찰업무안내">입찰업무안내</a>
                </div>
                <div className="loginFootRight">
                <div className="loginSelectStyle">
                    <button className="selLabel">BITCUBE FAMILY</button>
                    <ul className="optionList">
                    <li className="optionItem"><a href="http://www.iljin.co.kr" target="_blank">일진홀딩스</a></li>
                    <li className="optionItem"><a href="http://www.iljinelec.co.kr" target="_blank">일진전기</a></li>
                    <li className="optionItem"><a href="http://www.iljindiamond.co.kr" target="_blank">일진다이아몬드</a></li>
                    <li className="optionItem"><a href="http://www.iljindisplay.co.kr" target="_blank">일진디스플레이</a></li>
                    <li className="optionItem"><a href="http://www.iljinsteel.co.kr" target="_blank">일진제강</a></li>
                    <li className="optionItem"><a href="http://alpinion.co.kr/" target="_blank">알피니언 메디칼시스템</a></li>
                    <li className="optionItem"><a href="http://www.jtv.co.kr" target="_blank">전주방송</a></li>
                    <li className="optionItem"><a href="http://www.hysolus.co.kr/" target="_blank">일진하이솔루스</a></li>
                    <li className="optionItem"><a href="http://www.iljincns.com" target="_blank">일진C&amp;S</a></li>
                    </ul>
                </div>
                </div>
            </div>
            <div className="footAddr">
                전자입찰 문의: IT HelpDesk ( 02 - 720 - 4650 ) &nbsp e-mail : bitcube@bitcube.co.kr<br />
                서울특별시 강동구 강동U1빌딩 1613호<br />
                © BITCUBE ALL RIGHTS RESERVED.
            </div>
            {/* <div className="footAddr" v-else>
                전자입찰 문의: IT HelpDesk ( 02 - 720 - 4650 ) &nbsp e-mail : bitcube@bitcube.co.kr
            </div> */}
        </div>
    )
}

export default LoginFooter;