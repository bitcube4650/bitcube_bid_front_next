import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import EnrollmentProcessPop from '../components/EnrollmentProcess';
import BiddingGuidePop from '../components/BiddingGuide';


const SignUp = () => {
    const [isAgree, setIsAgree] = useState(false); 

    // 업체등록절차 팝업
    const [enrollmentProcessPop, setEnrollmentProcessPop] = useState(false);

    // 입찰업무안내 실패 팝업
    const [biddingGuidePop, setBiddingGuidePop] = useState(false);

    return (
        <div>
            <Header />
            <div className="joinWrap">
                <div className="inner">
                    <div className="joinTop">
                        <ul className="conHeaderCate">
                            <li>회원가입</li>
                            <li>약관</li>
                        </ul>
                    </div>
                    <div className="conTopBox">
                        <ul className="dList">
                            <li><div>회원가입 하시기 전에 회원 약관을 잘 읽어 보시기 바랍니다.</div></li>
                            <li><div>회원 약관을 읽어보신 후 동의하셔야 회원 가입을 하실 수 있습니다.</div></li>
                        </ul>
                    </div>
                    <div className="provisionBox mt20">
                        <p className="provisionTit1">제 1장 (총칙)</p>

                        <p className="provisionTit2 mt30">제1조 (목적)</p>
                        <p className="mt5">이 약관은 일진전기㈜,일진머티리얼즈㈜, 일진다이아몬드㈜, 일진제강㈜, 일진유니스코㈜, 일진건설㈜, 일진디스플레이㈜, 일진하이솔루스, 일진LED, 일진씨앤에스, 일진파트너스, 일진디앤코, 트랜스넷 (이하 "회사"라 함)가 운영하는 전자입찰시스템(이하 "시스템"이라 함) 이용에 관한 제반사항을 규정함을 목적으로 합니다.</p>

                        <p className="provisionTit2 mt30">제2조 (정의)</p>
                        <ul className="listHangul mt5">
                            <li>"시스템"이란 회사가 컴퓨터등 정보통신설비를 이용하여 상품과 용역거래 및 문서교환등 관련 부가서비스를 제공하기 위하여 구축한 인터넷 입찰시스템을 말합니다.</li>
                            <li>"이용자"란 이 시스템에서 정한 절차에 따라 상품과 용역거래 또는 문서교환 및 정보교류하는 회사를 말합니다.</li>
                            <li>아이디(ID) : 시스템을 이용하기 위하여 이용자가 선정하고 회사가 승인한 문자와 숫자의 조합을 말합니다.</li>
                            <li>비밀번호(PW) : 이용자의 비밀보호를 위하여 자신이 설정한 문자와 숫자의 조합을 말합니다.</li>
                            <li>"공인인증기관" 이란 본 시스템에서 사용되는 인증업무를 취급하는 기관으로 전자서명법 제 4 조의 규정에 의한 공인인증기관을 의미합니다.</li>
                            <li>"전자인증" 이란 이용자가 시스템을 이용하기 위하여 회사가 인증기관을 통하여 전자서명 검증키를 부여하는 과정을 말합니다.</li>
                        </ul>

                        <p className="provisionTit2 mt30">제3조 (약관의 효력 및 변경)</p>
                        <ul className="listHangul mt5">
                            <li>본 약관은 시스템 이용자에게 시스템화면에 공지하고 이용자가 동의함으로써 효력이 발생합니다.</li>
                            <li>회사는 필요한 경우 약관의 규제에 관한 법률, 전자거래 기본법, 전자서명법, 정보통신망 이용 촉진등에 관한 법률, 소비자보호법등 관련법에 저촉되지 않는 범위에서 이 약관을 개정할 수 있으며, 변경 시에는 변경내용과 변경 후의 약관을 본 시스템에 공지하고, 변경된 약관은 전항과 같이 효력이 발생합니다.</li>
                            <li>이용자는 변경된 약관에 동의하지 아니하는 경우 탈퇴요청을 할 수 있습니다.</li>
                        </ul>

                        <p className="provisionTit2 mt30">제4조 (약관외 준칙 및 관계법령과의 관계)</p>
                        <p className="mt5">본 약관에 명시되지 않은 사항과 이 약관의 해석에 관하여는 정부가 제정한 전자거래 소비자 보호 지침 및 관계법령 또는 상관례에 의합니다.</p>

                        <p className="provisionTit2 mt30">제5조 (적용범위)</p>
                        <p className="mt5">이 약관은 본 시스템을 이용한 회사와 이용자간의 모든 거래와 문서교환 등 시스템을 이용한 일체의 사항에 적용됩니다.</p>

                        <p className="provisionTit2 mt30">제6조 (전자문서의 효력 및 서명)</p>
                        <ul className="listHangul mt5">
                            <li>본 약관에 따라 시스템 상에서 교환되는 모든 전자문서는 법률적으로 유효한 문서임을 회사와 이용자는 상호 인정합니다.</li>
                            <li>전자문서의 서명은 공인인증기관으로 부터 발급받은 것으로서, 개찰일시까지 유효한 공인인증서를 사용합니다.</li>
                        </ul>

                        <p className="provisionTit2 mt30">제7조 (서비스의 변경 및 중단)</p>
                        <ul className="listHangul mt5">
                            <li>불가피한 사정이 발생하거나, 필요한 경우 이용자들에게 제공하는 서비스의 내용은 변경될 수 있습니다.</li>
                            <li>시스템은 정보통신설비의 보수, 점검, 교체, 고장, 통신두절, 천재지변 기타 부득이한 사유가 발생한 경우 서비스제공을 일시적으로 중단할 수 있습니다. 이 경우, 이용자들에게 서비스의 중단사실과 중단사유를 공지합니다.</li>
                            <li>회사는 가.나.항의 사유로 서비스의 제공이 변경되거나 일시적인 중단으로 인하여 이용자 또는 제3자가 입은 손해에 대하여 배상할 의무를 부담하지 않습니다.</li>
                        </ul>



                        <p className="provisionTit1 mt50">제 2장 (입찰 방법 및 낙찰자 선정기준)</p>

                        <p className="provisionTit2 mt30">제8조 (입찰방법)</p>
                        <ul className="listHangul mt5">
                            <li>본 시스템 상에서 이루어지는 견적서 및 기타 첨부화일 등 제반 전자문서는 회사에 접수된 시간부터 유효하며, 입찰 참가 대상사는 입찰 개시시간 이후부터 입찰 마감시간 전까지 투찰 할 수 있습니다. 입찰과 관련하여 입찰참가사에게 투찰 내역이 비공개 되고, 마감시간 이후 회사는 낙찰조건에 가장 적합한 조건으로 입찰한 이용자를 낙찰자로 결정합니다. 단, 낙찰사가 없을 때는 경쟁력이 없는 투찰사들을 제외하고 재입찰을 진행할 수 있습니다.</li>
                            <li>다음 각 호에 해당하는 경우에는 이용자의 전자서명에도 불구하고 입찰이 성립되지 아니합니다. - 전자문서의 내용에 허위, 기재누락, 오류 등이 발생한 경우 - 시스템 기술상 또는 불가항력적 사유로 회사가 이용자의 서명을 확인할 수 없는 경우 - 이용자의 전자서명에 대한 회사의 최종 인증이 없는 경우 다. 회사가 통제할 수 없는 시스템의 장애로 입찰집행이 불가능하다고 판단될 경우 회사는 관련 입찰을 취소하거나 연기하는 등 필요한 조치를 취할 수 있습니다. 시스템 장애는 시스템의 다운, 시스템에 연결된 모든 네트워크의 장애 등으로 본 시스템에 접속이 불가능하거나 입찰서를 송수신 할 수 없는 경우 등을 말합니다.</li>
                        </ul>

                        <p className="provisionTit2 mt30">제9조 (시스템의 부가서비스)</p>
                        <p>입찰공고부터 낙찰자 선정까지 이루어지는 업무의 효율화를 위하여 회사는 이용자가 등록한 이메일 주소로 이메일을 발송할 수 있으며, 또한 등록된 이용자의 휴대전화번호로 SMS 발송을 할 수 있습니다. 단, 업무와 무관한 이메일 및 SMS 발송은 제외됩니다.</p>

                        <p className="provisionTit2 mt30">제10조 (낙찰)</p>
                        <ul className="listHangul mt5">
                            <li>매입의 경우, 유효한 입찰중 회사가 정한 예정가격이하이면서 최저가격을 투찰한 입찰자를 낙찰자로 선정함을 원칙으로 하나, 경우에 따라 내부적격심사 규정을 적용하여 선정할 수 있습니다.</li>
                            <li>매출(매각)의 경우, 유효한 입찰 중 회사가 정한 예정가격 이상이면서 최고가격을 투찰한 입찰자를 낙찰자로 선정함을 원칙으로 하나, 경우에 따라 내부적격심사 규정을 적용하여 선정할 수 있습니다.</li>
                            <li>이용자가 낙찰자로 최종 선정된 이후라도 도저히 낙찰예정자와 계약 체결을 할 수 없는 정당한 사유가 존재하는 경우 회사는 낙찰을 취소할 수 있습니다.</li>
                        </ul> 

                        <p className="provisionTit2 mt30">제11조 (이용자 등록신청)</p>
                        <ul className="listHangul mt5">
                            <li>입찰 참여를 희망하는 이용자는 시스템에 정해진 절차에 따라 등록을 신청하여야 합니다.</li>
                            <li>회사는 이용자가 다음 사항에 해당할 경우 이용자등록을 거부할 수 있습니다.<br />1. 다른 회사나 다른 사람의 명의를 사용하여 등록신청 하였을 경우.<br />2. 등록내용에 허위, 기재누락 또는 오기가 있는 경우.<br />3. 이용자로 등록하는 것이 업무성격상 적절하지 못하다고 판단되거나, 기술상 현저한 지장이 있다고 판단 되는 경우.</li>
                            <li>회사는 등록신청결과를 전자우편 또는 기타방법을 통하여 통지합니다.</li>
                            <li>이용자는 등록사항에 변경이 있는 경우, 즉시 변경 내용을 수정하여야 하고, 수정한 변경사항에 대하여는 전자우편 기타 방법으로 회사에 알려야 합니다. 이용자가 등록정보 등의 변경사항을 수정하지 않거나, 회사에 알리지 아니하여 발생한 손해에 대한 책임은 이용자에게 있으며, 회사는 이에 대하여 책임을 지지 않습니다.</li>
                        </ul>

                        <p className="provisionTit2 mt30">제12조 (이용자 자격상실)</p>
                        <p>
                            회사는 이용자가 다음 각 호의 사유에 해당하는 경우 입찰 참여 자격을 취소할 수 있습니다.<br />
                            1. 등록신청서의 기재내용이 허위인 경우.<br />
                            2. 시스템을 통해 이용자 스스로 결정한 의사결정에 대하여 정당한 사유없이 책임지지 아니한 경우.<br />
                            3. 시스템의 서비스 운영을 방해한 경우.<br />
                            4. 시스템을 이용하여 법령에 반하는 행위를 하는 경우.<br />
                            5. 시스템을 통하여 획득한 정보를 이용자의 입찰 참가외의 목적으로 이용하거나 회사의 사전 승인 없이 제 3 자에게 유출하는 경우.<br />
                            6. 회사와의 기존 계약 이행 실적이 불량하여 부정당 업체로 판정될 경우<br />
                            7. 기타 회사가 정한 평가기준에 미달된 경우.
                        </p>

                        <p className="provisionTit2 mt30">제13조 (이용자탈퇴)</p>
                        <p>이용자는 탈퇴를 요청할 수 있으며, 회사는 이용자 본인임을 확인한 후, 내부절차에 따라 탈퇴를 처리합니다. 이용자가 회사에 탈퇴를 요청하는 경우 이용자는 전자메일 또는 서면을 통하여 User ID, 패스워드, 성명, 이메일, 해지사유 등을 회사에 알려야 하며 등록된 정보와 일치하여야 합니다. 다만 이용자 탈퇴는 이미 성립된 거래에 대해서는 영향이 없습니다.</p>

                        <p className="provisionTit2 mt30">제14조 (이용자에 대한 통지)</p>
                        <ul className="listHangul mt5">
                            <li>회사는 이용자에게 통지할 사항이 있는 경우, 이용자가 제출한 전자우편 주소로 통지할 수 있습니다.</li>
                            <li>이용자가 제출한 전자우편 주소등이 잘못되어 발생한 손해에 대해서 회사는 책임을 지지 않습니다.</li>
                            <li>불특정 다수 이용자에 대한 통지의 경우, 회사는 서비스 화면의 공지사항에 7일 이상 게시함으로써 개별통지에 갈음할 수 있습니다.</li>
                        </ul> 
                            




                        <p className="provisionTit1 mt50">제 3장 책임과 의무</p>

                        <p className="provisionTit2 mt30">제15조 (이용자 및 등록신청자 정보의 보호)</p>
                        <ul className="listHangul mt5">
                            <li>회사는 이용자의 정보수집시 시스템 운영에 필요한 최소한의 정보를 수집합니다. 다음 사항을 필수사항으로 하며, 그 외 사항은 선택사항으로 합니다.<br />1. 회사명<br />2. 대표자명<br />3. 사업자등록번호<br />4. 법인번호<br />5. 자본금<br />6. 설립연도<br />7. 사업장 주소<br />8. 업체 유형<br />9. 전화번호<br />10. 팩스번호</li>
                            <li>회사가 이용자의 개인식별이 가능한 이용자 정보를 수집하는 때에는 반드시 당해 이용자의 동의를 받습니다.</li>
                            <li>제공된 이용자 정보는 당해 이용자의 동의없이 목적외의 이용 또는 제 3 자에게 제공할 수 없으며, 이에 대한 책임은 회사가 집니다. 단, 회사에 속한 일진그룹 계열사는 기타 업무를 위하여 이용자의 정보를 공유할 수 있습니다.</li>
                        </ul> 

                        <p className="provisionTit2 mt30">제16조 (회사의 책임과 의무)</p>
                        <ul className="listHangul mt5">
                            <li>회사는 이용자에 대하여 계속적·안정적으로 서비스를 제공합니다.</li>
                            <li>회사는 이용자로부터 제기되는 불만이 정당하다고 인정되는 경우에는 이를 지체없이 처리합니다. 다만, 즉시 처리가 곤란한 사정이 있는 경우 당해 이용자에게 그 사유를 통보합니다.</li>
                        </ul>

                        <p className="provisionTit2 mt30">제17조(이용자의 책임과 의무)</p>
                        <ul className="listHangul mt5">
                            <li>사용자ID와 비밀번호에 관한 모든 관리책임은 당해 이용자에게 있습니다.</li>
                            <li>이용자는 사용자ID 및 비밀번호를 타인에게 양도하거나 사용 승낙 할 수 없습니다. 회사는 이용자에 의한 사용자의 ID 또는 비밀번호의 유출, 사용승낙으로 인한 어떠한 손실이나 손해에 대해서도 책임을 지지 않습니다.</li>
                            <li>이용자는 사용자ID 또는 비밀번호를 도난당하거나 제 3 자가 무단사용하고 있음을 인지한 경우에는 즉시 회사 구매담당자에게 통보하여야 하고, 회사의 안내에 따라 사용자ID 및 비밀번호의 변경 등을 협의하여야 합니다. 이러한 도난 또는 무단사용에 따른 책임은 당해 이용자에게 있습니다.</li>
                            <li>전자인증서 설치 자격을 부여받은 이용자는 시스템에서 게시된 안내에 따라 전자인증서를 설치하여야하며, 유효 기간은 인증일로부터 1년이고, 설치후 1년이 지나면 갱신하여야 합니다.</li>
                            <li>본 약관 및 본 시스템 상에서 공지한 사용 요령 등을 숙지, 준수하여야 하며, 이를 위반함에 따라 발생하는 불이익에 대한 책임은 이용자에게 있습니다.</li>
                        </ul> 　 

                        <p className="provisionTit2 mt30">제18조 (저작권의 귀속 및 이용제한)</p>
                        <ul className="listHangul mt5">
                            <li>회사가 제공하는 시스템에 관한 저작권 및 기타 지적재산권은 회사에 귀속됩니다</li>
                            <li>이용자는 시스템을 이용함으로써 얻은 정보를 회사의 사전 승낙없이 복제, 송신, 출판, 배포, 방송, 기타 방법에 의하여 이용하거나 제3자에게 이용하게 하여서는 안됩니다.</li>
                        </ul>




                        <p className="provisionTit1 mt50">제5장 면책조항</p>

                        <p className="provisionTit2 mt30">제19조(회사의 면책)</p>
                        <ul className="listHangul mt5">
                            <li>회사는 천재지변, 폭동, 내란, 법령의 개폐 및 제정, 공권력에 의한 명령,처분,노동쟁의, 기간통신사업자의 전기통신 서비스의 중지,정전,번개,홍수,태풍,지진,공장의 사고, 기타 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 책임을 지지 아니합니다.</li>
                            <li>회사는 인터넷 이용자 또는 협력사의 귀책사유로 인한 서비스 이용장애에 대해서는 책임을 지지 않습니다.</li>
                            <li>회사는 이용자간에 자발적으로 이루어진 정보 및 서비스 교류 등으로 인하여 발생한 손해에 대해서는 일체의 책임을 지지 않습니다.</li>
                        </ul>

                        <p className="provisionTit2 mt30">제20조(관할법원)</p>
                        <p>본 약관과 관련하여 분쟁이 발생할 경우에는 쌍방이 합의하여 선정한 서울서부지방법원을 관할법원으로 합니다.</p>

                        <p className="provisionTit2 mt30">부칙(시행일)</p> 
                        <p>이 약관은 2005년 12월 1일부터 시행합니다.</p>
                    </div>

                    <div className="provisionAgree">
                        <input type="checkbox" id="isAgree" checked={ isAgree }  onChange={(e) => setIsAgree(e.target.checked)} className="loginCheckStyle" /><label for="isAgree">약관에 동의</label>
                        {isAgree ? (
                            <Link to="/SignUpMain" replace className="btnStyle btnOutlineBlue btnMd" title="동의하고 계속하기">동의하고 계속하기</Link>
                        ) : (
                            <button className="btnStyle btnOutlineBlue btnMd dimmed" title="동의하고 계속하기">동의하고 계속하기</button>
                        )}
                    </div>
                </div>
                <div className="subFooter mt50">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="subFooterUtill">
                        <a href="javascript:void(0)" title="공동인증서">공동인증서</a>
                        <a onClick={(e) => setEnrollmentProcessPop(true)} data-toggle="modal" title="업체등록절차">업체등록절차</a>
                        <a onClick={(e) => setBiddingGuidePop(true)} data-toggle="modal" title="입찰업무안내">입찰업무안내</a>
                    </div>
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

export default SignUp;