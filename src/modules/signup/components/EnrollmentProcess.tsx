import React, { useCallback } from 'react'
import Modal from 'react-bootstrap/Modal';

interface EnrollmentProcessProps {
    enrollmentProcessPop : boolean;
    setEnrollmentProcessPop : React.Dispatch<React.SetStateAction<boolean>>;
} 

const EnrollmentProcess: React.FC<EnrollmentProcessProps> = ({enrollmentProcessPop, setEnrollmentProcessPop}) => {
    
    // 팝업 닫기
    const fnCloseEnrollmentProcessPop = () => {
        setEnrollmentProcessPop(false);
    }

    return (
        <Modal className="modalStyle" id="enrollmentProcess" show={enrollmentProcessPop} onHide={fnCloseEnrollmentProcessPop} keyboard={true}>
            <Modal.Body>
                <a onClick={fnCloseEnrollmentProcessPop} className="ModalClose" data-bs-dismiss="modal" title="닫기"><i className="fa-solid fa-xmark"></i></a>
                    <h2 className="modalTitle">업체등록 절차</h2>
                    <div className="modalTopBox">
                        <ul>
                            <li><div>업체 등록신청 후 서류심사로 인해 최대 3일 소요할 수 있습니다.</div></li>
                            <li><div>서류심사 결과는 작성된 담당자 이메일로 전달됩니다.</div></li>
                        </ul>
                    </div>
                    <dl className="regProList mt20">
                        <dt><i className="fa-light fa-message-pen"></i></dt>
                        <dd>
                            <h3>Step.1  <span className="textMainColor">[업체등록신청]</span></h3>
                            <ul className="dList mt10">
                                <li><div>로그인 페이지에서 [회원가입] 버튼을 이용, 약관동의 및 회원가입을 신청합니다.</div></li>
                            </ul>
                        </dd>
                    </dl>
                    <dl className="regProList mt10">
                        <dt><i className="fa-light fa-ballot-check"></i></dt>
                        <dd>
                            <h3>Step.2  <span className="textMainColor">[업체심사(서류,실사)]</span></h3>
                            <ul className="dList mt10">
                                <li><div>계열사 업체관리 담당자는 신청 정보를 확인합니다.</div></li>
                                <li><div>업체 규모, 납품실적, 품질인증, 신용평가자료 등 서류 검토</div></li>
                                <li><div>필요시 실사 병행합니다.</div></li>
                            </ul>
                        </dd>
                    </dl>
                    <dl className="regProList mt10">
                        <dt><i className="fa-light fa-file-check"></i></dt>
                        <dd>
                            <h3>Step.3  <span className="textMainColor">[업체등록]</span></h3>
                            <ul className="dList mt10">
                                <li><div>심사 후 요구조건에 적합한 업체 등록을 확정합니다.</div></li>
                                <li><div>등록된 이메일로 심사결과를 통보합니다.</div></li>
                            </ul>
                        </dd>
                    </dl>
                    <dl className="regProList mt10">
                        <dt><i className="fa-light fa-rectangle-history-circle-user"></i></dt>
                        <dd>
                            <h3>Step.4  <span className="textMainColor">[업체평가(사후관리)]</span></h3>
                            <ul className="dList mt10">
                                <li><div>연간 거래실적을 바탕으로 업체를 평가합니다.</div></li>
                                <li><div>계열사 간 협력업체 등록 시 평가자료로 반영됩니다.</div></li>
                            </ul>
                        </dd>
                    </dl>
                    <div className="modalFooter">
                        <a onClick={fnCloseEnrollmentProcessPop} className="modalBtnClose" data-dismiss="modal" title="닫기">닫기</a>
                    </div>
            </Modal.Body>
        </Modal>
    )
}

export default EnrollmentProcess