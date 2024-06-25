import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from "react-router-dom";
import Swal from 'sweetalert2';
import axios from 'axios';
import ItemPop from '../components/ItemPop';
import AddrPop from '../../../components/AddrPop';
import * as CommonUtils from '../../../components/CommonUtils'
import { MapType } from '../../../components/types';
import SrcInput from '../../../components/input/SrcInput';
import SrcSelectBox from '../../../components/input/SrcSelectBox';
import EditInputFileBox from '../../../components/input/EditInputFileBox';

const SignUpMain = () => {
    const srcInit = {
        regnumFileName : "",
        bFileName : "",
        interrelatedCustCode: '',
        custTypeNm1: '',
        custType1: '',
        custTypeNm2: '',
        custType2: '',
        custName: '',
        presName: '',
        regnum1: '',
        regnum2: '',
        regnum3: '',
        presJuminNo1: '',
        presJuminNo2: '',
        capital: '',
        foundYear: '',
        tel: '',
        fax: '',
        zipcode: '',
        addr: '',
        addrDetail: '',
        userName: '',
        userEmail: '',
        userId: '',
        idcheck: false,
        userPwd: '',
        userPwdConfirm: '',
        userHp: '',
        userTel: ''
    }

    const [srcData, setSrcData] = useState<MapType>(srcInit);
    const [interrelatedList, setInterrelatedList] = useState([]); 
    const [type, setType] = useState("type1");
    const [itemPop, setItemPop] = useState(false);
    const [addrPop, setAddrPop] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [successConfirm, setSuccessConfirm] = useState(false);
    const [regnumFile, setRegnumFile] = useState<File|null>();
    const [bFile, setBFile] = useState<File|null>();

    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;

    useEffect(() => {
        if(!state) {
            Swal.fire('', '올바르지 못한 접근입니다.', 'warning');
            navigate('/');
        }
        init();
    }, []);

    const init = async () => {
        setSrcData(srcInit);
        const params = {};
        axios.post("/login/interrelatedList", params).then((response) => {
            const result = response.data;
            if(response.status === 200) {
                setInterrelatedList(result);
            } else {
                Swal.fire('', '계열사 불러오기에 실패하였습니다.', 'error');
            }
        });
    };

    const itemSelectCallback = (data:MapType) => {
        if("type1" === type) {
            setSrcData((prevDetail) => ({
                ...prevDetail,
                custType1: data.itemCode,
                custTypeNm1 : data.itemName
            }));
        } else if("type2" === type) {
            setSrcData((prevDetail) => ({
                ...prevDetail,
                custType2: data.itemCode,
                custTypeNm2 : data.itemName
            }));
        }
    }

    const addrPopCallback = (data:MapType) => {
        setSrcData((prevDetail) => ({
            ...prevDetail,
            zipcode: data.zipcode,
            addr : data.addr
        }));
    }

    const openItemPop = (type:string) => {
        setType(type);
        setItemPop(true);
    }

    const openAddrPop = () => {
        setAddrPop(true);
    }

    const fnIdcheck = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (srcData.userId == null || srcData.userId == '') {
            Swal.fire('', '아이디를 입력해주세요.', 'warning');
            return;
        }
        axios.post("/login/idcheck", srcData).then((response) => {
            const result = response.data;
            if(result.code == 'OK') {

                Swal.fire('', '입력한 아이디를 사용할 수 있습니다.', 'info');
                setSrcData((prevDetail) => ({
                    ...prevDetail,
                    idcheck: true
                }));
            } else {
                Swal.fire('', '입력한 아이디를 사용할 수 없습니다.', 'warning');
                setSrcData((prevDetail) => ({
                    ...prevDetail,
                    idcheck: false
                }));
            }
        });
    };

    const validate = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (!srcData.custType1) {
            Swal.fire('', '업체유형1을 선택해주세요.', 'warning');
            return;
        }
        if (!srcData.custName) {
            Swal.fire('', '회사명을 입력해주세요.', 'warning');
            return;
        }
        if (!srcData.presName) {
            Swal.fire('', '대표자명을 입력해주세요.', 'warning');
            return;
        }
        if (!srcData.regnum1 || !srcData.regnum2 || !srcData.regnum3) {
            Swal.fire('', '사업자등록번호를 입력해주세요.', 'warning');
            return;
        }
        if (srcData.regnum1.length !== 3 || srcData.regnum2.length !== 2 || srcData.regnum3.length !== 5) {
            Swal.fire('', '사업자등록번호를 정확히 입력해주세요.', 'warning');
            return;
        }
      
        const presJuminNo1 = srcData.presJuminNo1 || '';
        const presJuminNo2 = srcData.presJuminNo2 || '';
        if (presJuminNo1 || presJuminNo2) {
            if (presJuminNo1.length !== 6 || presJuminNo2.length !== 7) {
                Swal.fire('', '법인번호를 입력해주세요.', 'warning');
                return;
            }
        } 
      
        if (!srcData.capital || srcData.capital === 0) {
            Swal.fire('', '자본금을 입력해주세요.', 'warning');
            return;
        }
        if (!srcData.foundYear) {
            Swal.fire('', '설립년도를 입력해주세요.', 'warning');
            return;
        }
        if (srcData.foundYear.length !== 4) {
            Swal.fire('', '설립년도를 정확히 입력해주세요.', 'warning');
            return;
        }
        if (!srcData.tel) {
            Swal.fire('', '대표전화를 입력해주세요.', 'warning');
            return;
        }
        if (!srcData.addrDetail) {
            Swal.fire('', '회사주소를 입력해주세요.', 'warning');
            return;
        }
        if (!regnumFile) {
            Swal.fire('', '사업자등록증을 선택해주세요.', 'warning');
            return;
        }
        if (!srcData.userName) {
            Swal.fire('', '이름을 입력해주세요.', 'warning');
            return;
        }
        if (!srcData.userEmail) {
            Swal.fire('', '이메일을 입력해주세요.', 'warning');
            return;
        } else {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(srcData.userEmail)) {
                Swal.fire('', '입력한 이메일 형식이 올바르지 않습니다.', 'warning');
                return;
            }
        }
      
        if (!srcData.userId) {
            Swal.fire('', '아이디를 입력해주세요.', 'warning');
            return;
        }
        if (!srcData.idcheck) {
            Swal.fire('', '아이디 중복확인을 확인해주세요.', 'warning');
            return;
        }
        if (!srcData.userPwd) {
            Swal.fire('', '비밀번호를 입력해주세요.', 'warning');
            return;
        }
        if (!srcData.userPwdConfirm) {
            Swal.fire('', '비밀번호 확인을 입력해주세요.', 'warning');
            return;
        }
        if (srcData.userPwd !== srcData.userPwdConfirm) {
            Swal.fire('', '비밀번호를 정확히 입력해주세요.', 'warning');
            return;
        }
          // 비밀번호 유효성 검사를 위한 함수 호출 (예시)
        if (!fnPwdvaildation(srcData.userPwd)) {
            return;
        }

        if (!srcData.userHp) {
            Swal.fire('', '휴대폰번호를 입력해주세요.', 'warning');
            return;
        } else {
            const phoneNumberRegex = /^\d{3}-\d{3,4}-\d{4}$/;
            if (!phoneNumberRegex.test(CommonUtils.onAddDashTel(srcData.userHp))) {
                Swal.fire('', '휴대폰번호 형식에 맞게 입력해주세요.', 'warning');
                return;
            }
        }
        if (!srcData.userTel) {
            Swal.fire('', '유선전화를 입력해주세요.', 'warning');
            return;
        } else {
            const telNumberRegex = /^\d{2,3}-\d{3,4}-\d{4}$/;
            if (!telNumberRegex.test(CommonUtils.onAddDashTel(srcData.userTel))) {
                Swal.fire('', '유선전화 형식에 맞게 입력해주세요.', 'warning');
                return;
            }
        }
        setShowConfirm(true);
    };

    const fnPwdvaildation = (userPwd:string) => {
        const password = userPwd;
        const hasUpperCase = /[A-Z]/.test(password);//대문자
        const hasLowerCase = /[a-z]/.test(password);//소문자
        const hasDigit = /\d/.test(password);//숫자
        const hasSpecialChar = /[!@#$%^&*()\-_=+{};:,<.>]/.test(password);//특수문자

        var isValidPassword = (hasUpperCase && hasLowerCase && hasDigit) || (hasUpperCase && hasLowerCase && hasSpecialChar) || (hasDigit && hasSpecialChar);
        var isValidLength = password.length >= 8 && password.length <= 16;

        if (!isValidPassword) {
            Swal.fire('', '비밀번호는 대/소문자, 숫자, 특수문자중에서 2가지 이상 조합되어야 합니다.', 'warning');
            return;
        } else if (!isValidLength) {
            Swal.fire('', '비밀번호는 8자 이상 16자 이하로 작성해주세요.', 'warning');
            return;
        }
		return true;
    };

    const save = () => {
        
        var formData = new FormData();

        if(regnumFile) {
            formData.append('regnumFile', regnumFile);
        }
        if(bFile) {
            formData.append('bFile', bFile);
        }
        formData.append('data', new Blob([JSON.stringify(srcData)], { type: 'application/json' }));

        axios.post("/login/custSave", formData).then((response) => {
            const result = response.data;
            if(result.code === "OK") {
                setShowConfirm(false);
                setSuccessConfirm(true);
                setTimeout(function () {
                    navigate("/");
                }, 2000)
            } else {
                Swal.fire('', response.data.msg, 'error');
            }
        });
    }

    return (
        <div>
            <div className="joinWrap">
                <div className="inner">
                    <div className="joinTop">
                        <ul className="conHeaderCate">
                            <li>회원가입</li>
                            <li>회원가입</li>
                        </ul>
                    </div>
                    <div className="conTopBox">
                        <ul className="dList">
                            <li><div>회원가입은 가입 신청 후 승인과정을 통해 정식으로 가입이 됩니다. (가입 승인은 최대 3일 소요됩니다)</div></li>
                            <li><div>가입 승인이 완료되면 관리자에게 이메일로 승인 되었음을 알려드립니다.</div></li>
                            <li><div>회원가입 <span className="star">*</span> 부분은 필수 입력 정보 입니다.</div></li>
                        </ul>
                    </div>

                    <h3 className="h3Tit mt50">회사 정보</h3>
                    <div className="boxSt mt20">
                        <div className="flex align-items-center">
                            <div className="formTit flex-shrink0 width170px">가입희망 계열사 <span className="star">*</span></div>
                            <div className="width100">
                                <SrcSelectBox name='interrelatedCustCode' optionList={interrelatedList} valueKey='interrelatedCustCode' nameKey='interrelatedNm' onSearch={ validate } srcData={ srcData } setSrcData={ setSrcData }/>
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">업체유형 1 <span className="star">*</span></div>
                            <div className="flex align-items-center width100">
                                <SrcInput name="custTypeNm1" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate }  value={srcData.custTypeNm1} className="readonly" placeholder='우측 검색 보튼을 클릭해 주세요.' readOnly />
                                <a onClick={() => openItemPop('type1')} className="btnStyle btnSecondary ml10" title="조회">조회</a>
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">업체유형 2 <span className="star">*</span></div>
                            <div className="flex align-items-center width100">
                                <SrcInput name="custTypeNm2" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate }  value={srcData.custTypeNm2} className="readonly" placeholder='우측 검색 보튼을 클릭해 주세요.' readOnly />
                                <a onClick={() => openItemPop('type2')} className="btnStyle btnSecondary ml10" title="조회">조회</a>
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">회사명 <span className="star">*</span></div>
                            <div className="width100">
                                <SrcInput name="custName" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate }  maxLength={100} />
                            </div>
                        </div>
                       <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">대표자명 <span className="star">*</span></div>
                            <div className="width100">
                                <SrcInput name="presName" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate }  maxLength={50} />
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">사업자등록번호 <span className="star">*</span></div>
                            <div className="flex align-items-center width100">
                                <SrcInput name="regnum1" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate }  maxLength={3} value={ CommonUtils.onNumber(srcData.regnum1) || ''} />
                                <span style={{margin:"0 10px"}}>-</span>
                                <SrcInput name="regnum2" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate }  maxLength={2} value={ CommonUtils.onNumber(srcData.regnum2) || ''} />
                                <span style={{margin:"0 10px"}}>-</span>
                                <SrcInput name="regnum3" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate }  maxLength={5} value={ CommonUtils.onNumber(srcData.regnum3) || ''} />
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">법인번호</div>
                            <div className="flex align-items-center width100">
                                <SrcInput name="presJuminNo1" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate }  maxLength={6} value={ CommonUtils.onNumber(srcData.presJuminNo1) || ''} />
                                <span style={{margin:"0 10px"}}>-</span>
                                <SrcInput name="presJuminNo2" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate }  maxLength={7} value={ CommonUtils.onNumber(srcData.presJuminNo2) || ''} />
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">자본금 <span className="star">*</span></div>
                            <div className="flex align-items-center width100">
                                <SrcInput name="capital" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate }  placeholder='ex) 10,000,000' value={ CommonUtils.onComma(srcData.capital) || ''} />
                                <div className="ml10">원</div>
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">설립년도 <span className="star">*</span></div>
                            <div className="flex align-items-center width100">
                                <SrcInput name="foundYear" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate }  maxLength={4} placeholder='ex) 2021' value={ CommonUtils.onNumber(srcData.foundYear) || ''} />
                                <div className="ml10">년</div>
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">대표전화 <span className="star">*</span></div>
                            <div className="width100">
                                <SrcInput name="tel" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate } maxLength={13} value={ CommonUtils.onAddDashTel(srcData.tel) || ''} />
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">팩스</div>
                            <div className="width100">
                                <SrcInput name="fax" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate } maxLength={13} value={ CommonUtils.onAddDashTel(srcData.fax) || ''} />
                            </div>
                        </div>
                        <div className="flex mt10">
                            <div className="formTit flex-shrink0 width170px">회사주소 <span className="star">*</span></div>
                            <div className="width100">
                                <div className="flex align-items-center width100">
                                    <SrcInput name="zipcode" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate } placeholder="주소 조회 클릭" value={srcData.zipcode} readOnly />
                                    <a onClick={openAddrPop} data-toggle="modal" data-target="#addrPop" className="btnStyle btnSecondary flex-shrink0 ml10" title="주소 조회">주소 조회</a>
                                </div>
                                <div className="mt5">
                                    <SrcInput name="addr" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate } className="readonly" value={srcData.addr} readOnly />
                                </div>
                                <div className="mt5">
                                    <SrcInput name="addrDetail" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate } maxLength={100} placeholder="상세 주소 입력" value={srcData.addrDetail} />
                                </div>
                            </div>
                        </div>
                        <div className="flex mt10">
                            <div className="formTit flex-shrink0 width170px">사업자등록증 <span className="star">*</span></div>
                            <div className="width100">
                                {/* 사업자등록증 업로드 */}
                                <EditInputFileBox name='regnumFileName' fileName={ srcData.regnumFileName } setUploadFile={ setRegnumFile } editData={ srcData } setEditData={ setSrcData }/>
                                {/* 사업자등록증 업로드 */}
                            </div>
                        </div>
                        <div className="flex mt10">
                            <div className="formTit flex-shrink0 width170px">회사소개 및 기타자료
                                <i className="fas fa-question-circle toolTipSt ml5">
                                    <div className="toolTipText" style={{width:"420px"}}>
                                        <ul className="dList">
                                            <li><div>첨부파일은 간단한 업체 소개 자료 등의 파일을 첨부해 주십시오.</div></li>
                                            <li><div>1개  이상의 파일을 첨부하실 경우 Zip으로 압축하여 첨부해 주십시오</div></li>
                                            <li><div>파일은 10M 이상을 초과할 수 없습니다.</div></li>
                                        </ul>
                                    </div>
                                </i>
                            </div>
                            <div className="width100">
                                {/* 회사소개 및 기타자료 업로드 */}
                                <EditInputFileBox name='bFileName' fileName={ srcData.bFileName } setUploadFile={ setBFile } editData={ srcData } setEditData={ setSrcData }/>
                                {/* 회사소개 및 기타자료 업로드 */}
                            </div>
                        </div>
                    </div>

                    <h3 className="h3Tit mt50">관리자 정보</h3>
                    <div className="boxSt mt20">
                        <div className="flex align-items-center">
                            <div className="formTit flex-shrink0 width170px">이름 <span className="star">*</span></div>
                            <div className="width100">
                                <SrcInput name="userName" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate } maxLength={50} />
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">이메일 <span className="star">*</span></div>
                            <div className="width100">
                                <SrcInput name="userEmail" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate } maxLength={100} placeholder="ex) sample@iljin.co.kr" />
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">아이디 <span className="star">*</span></div>
                            <div className="flex align-items-center width100">
                                <SrcInput name="userId" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate } maxLength={100} placeholder="영문, 숫자 입력(10자 이내) 후 중복확인" value={CommonUtils.onEngNumber(srcData.userId) || ''} />
                                <a onClick={(e) => fnIdcheck(e)} className="btnStyle btnSecondary flex-shrink0 ml10" title="중복 확인">중복 확인</a>
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">비밀번호 <span className="star">*</span></div>
                            <div className="width100">
                                <SrcInput name="userPwd" type="password" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate } maxLength={100} placeholder="대/소문자, 숫자, 특수문자 2 이상 조합(길이 8~16자리)" />
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">비밀번호 확인 <span className="star">*</span></div>
                            <div className="width100">
                            {/* style={{WebkitTextSecurity:"disc"}}  */}
                                <SrcInput name="userPwdConfirm" type="password" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate } maxLength={100} placeholder="비밀번호와 동일해야 합니다" />
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">휴대폰 <span className="star">*</span></div>
                            <div className="width100">
                                <SrcInput name="userHp" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate } maxLength={13} value={ CommonUtils.onAddDashTel(srcData.userHp) || ''} />
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">유선전화 <span className="star">*</span></div>
                            <div className="width100">
                                <SrcInput name="userTel" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate } maxLength={13} value={ CommonUtils.onAddDashTel(srcData.userTel) || ''} />
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">직급</div>
                            <div className="width100">
                                <SrcInput name="userPosition" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate } maxLength={50} />
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">부서</div>
                            <div className="width100">
                                <SrcInput name="userBuseo" srcData={ srcData } setSrcData={ setSrcData } onSearch={ validate } maxLength={50} />
                            </div>
                        </div>
                        
                        <div className="text-center mt50">
                            <a onClick={(e) => validate(e)} className="btnStyle btnPrimary btnMd" title="회원가입 신청">회원가입 신청</a>
                        </div>

                    </div>
                </div>

                <Modal show={showConfirm} onHide={() => setShowConfirm(false)} className="modalStyle" >
                    <Modal.Body>
                    <Button variant="close" className="ModalClose" onClick={() => setShowConfirm(false)}>&times;</Button>
                    <div className="alertText2">
                        입력하신 정보로 회원가입을 신청합니다.<br/>신정 후 승인까지 최대 3일 소요됩니다.<br/><br/>회원가입을 신청하시겠습니까?
                    </div>
                    <div className="modalFooter">
                        <Button variant="secondary" onClick={() => setShowConfirm(false)} style={{ marginRight: '10px'}}>취소</Button>
                        <Button variant="primary" onClick={() => save()}>신청</Button>
                    </div>
                    </Modal.Body>
                </Modal>

                <Modal show={successConfirm} onHide={() => setSuccessConfirm(false)} className="modalStyle" >
                    <Modal.Body>
                    <Button variant="close" className="ModalClose" onClick={() => setShowConfirm(false)}>&times;</Button>
                    <div className="alertText2">
                        회원가입을 신청하였습니다.
                    </div>
                    <div className="modalFooter">
                        <Button variant="secondary" onClick={() => setSuccessConfirm(false)} >닫기</Button>
                    </div>
                    </Modal.Body>
                </Modal>
            </div>
            {/* 업체유형 팝업 호출 */}
            <ItemPop itemPop={itemPop} setItemPop={setItemPop} popClick={itemSelectCallback} />
            {/* 업체유형 팝업 호출 */}

            {/* 주소 팝업 호출 */}
            <AddrPop addrPop={addrPop} setAddrPop={setAddrPop} addrPopClick={addrPopCallback} />
            {/* 주소 팝업 호출 */}
        </div>
    );
}

export default SignUpMain;