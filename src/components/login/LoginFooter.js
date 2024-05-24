import React from 'react';

function LoginFooter(props) {
    return (
        <div class="loginFooter">
            <div class="inner">
                {/* <div class="loginFootLeft"><img src={props.logoUrl} class="img-responsive" alt="일진그룹 로고" /></div> */}
                <div class="loginFootCenter">
                <a href="#"  click="clickCertificate" title="공동인증서">공동인증서</a>
                <a href="#" data-toggle="modal" data-target="#regProcess" title="업체등록절차">업체등록절차</a>
                <a href="#" data-toggle="modal" data-target="#biddingInfo" title="입찰업무안내">입찰업무안내</a>
                </div>
                <div class="loginFootRight" v-if="showIljin">
                <div class="loginSelectStyle">
                    <button class="selLabel">ILJIN FAMILY</button>
                    <ul class="optionList">
                    <li class="optionItem"><a href="http://www.iljin.co.kr" target="_blank">일진홀딩스</a></li>
                    <li class="optionItem"><a href="http://www.iljinelec.co.kr" target="_blank">일진전기</a></li>
                    <li class="optionItem"><a href="http://www.iljindiamond.co.kr" target="_blank">일진다이아몬드</a></li>
                    <li class="optionItem"><a href="http://www.iljindisplay.co.kr" target="_blank">일진디스플레이</a></li>
                    <li class="optionItem"><a href="http://www.iljinsteel.co.kr" target="_blank">일진제강</a></li>
                    <li class="optionItem"><a href="http://alpinion.co.kr/" target="_blank">알피니언 메디칼시스템</a></li>
                    <li class="optionItem"><a href="http://www.jtv.co.kr" target="_blank">전주방송</a></li>
                    <li class="optionItem"><a href="http://www.hysolus.co.kr/" target="_blank">일진하이솔루스</a></li>
                    <li class="optionItem"><a href="http://www.iljincns.com" target="_blank">일진C&amp;S</a></li>
                    </ul>
                </div>
                </div>
            </div>
            <div class="footAddr" v-if="showIljin">
                전자입찰 문의: IT HelpDesk ( 080 - 707 - 9100 ) &nbsp e-mail : ithelpdesk@iljin.co.kr<br />
                서울특별시 마포구 마포대로 45(도화동) 일진빌딩<br />© ILJIN ALL RIGHTS RESERVED.
            </div>
            <div class="footAddr" v-else>
                전자입찰 문의: IT HelpDesk ( 080 - 707 - 9100 ) &nbsp e-mail : ithelpdesk@iljin.co.kr
            </div>
        </div>
    )
}

export default LoginFooter;