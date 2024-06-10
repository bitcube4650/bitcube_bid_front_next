import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import axios from 'axios';
import Header from '../components/layout/Header';
import ItemPop from '../components/login/ItemPop';
import AddrPop from '../components/AddrPop';
import * as CommonUtils from '../components/CommonUtils'

const SignUpMain = () => {
    const initDetail = {
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
    };

    const [interrelatedList, setInterrelatedList] = useState([]); 
    const [type, setType] = useState("type1");
    const [itemPop, setItemPop] = useState(false);
    const [addrPop, setAddrPop] = useState(false);
    const [detail, setDetail] = useState(initDetail); 
    const [showConfirm, setShowConfirm] = useState(false);
    const [successConfirm, setSuccessConfirm] = useState(false);

    const [regnumFile, setRegnumFile] = useState(null);
    const [regnumFileName, setRegnumFileName] = useState('');
    const regnumFileInputRef = useRef(null);

    const [bFile, setBFile] = useState(null);
    const [bFileName, setBFileName] = useState('');
    const bFileInputRef = useRef(null);

    const navigate = useNavigate();

    const init = async () => {
        setDetail(initDetail);
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

    const itemSelectCallback = (data) => {
        if("type1" === type) {
            setDetail((prevDetail) => ({
                ...prevDetail,
                custType1: data.itemCode,
                custTypeNm1 : data.itemName
            }));
        } else if("type2" === type) {
            setDetail((prevDetail) => ({
                ...prevDetail,
                custType2: data.itemCode,
                custTypeNm2 : data.itemName
            }));
        }
    }

    const addrPopCallback = (data) => {
        setDetail((prevDetail) => ({
            ...prevDetail,
            zipcode: data.zipcode,
            addr : data.addr
        }));
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDetail((prevState) => ({
          ...prevState,
          [name]: value
        }));
    };

    const openItemPop = (type) => {
        setType(type);
        setItemPop(true);
    }

    const openAddrPop = () => {
        setAddrPop(true);
    }

    const changeRegnumFile = (event) => {
        const file = event.target.files[0];
        if (file) {
            setRegnumFile(file);
            setRegnumFileName(file.name);
        }
    };

    const changeBFile = (event) => {
        const file = event.target.files[0];
        if (file) {
            setBFile(file);
            setBFileName(file.name);
        }
    };

    const fnRemoveAttachFile = (fileNm) => {
        if("reg" === fileNm) {
            setRegnumFile(null);
            setRegnumFileName('');
            if (regnumFileInputRef.current) {
                regnumFileInputRef.current.value = '';
            }
        } else if("bfile" === fileNm) {
            setBFile(null);
            setBFileName('');
            if (bFileInputRef.current) {
                bFileInputRef.current.value = '';
            }
        }   
    };

    const idcheck = (e) => {
        e.preventDefault();
        if (detail.userId == null || detail.userId == '') {
            Swal.fire('', '아이디를 입력해주세요.', 'warning');
            return;
        }
        axios.post("/login/idcheck", detail).then((response) => {
            const result = response.data;
            if(result.code == 'OK') {

                Swal.fire('', '입력한 아이디를 사용할 수 있습니다.', 'info');
                setDetail((prevDetail) => ({
                    ...prevDetail,
                    idcheck: true
                }));
            } else {
                Swal.fire('', '입력한 아이디를 사용할 수 없습니다.', 'warning');
                setDetail((prevDetail) => ({
                    ...prevDetail,
                    idcheck: false
                }));
            }
        });
    };

    const validate = (e) => {
        e.preventDefault();
        if (!detail.custType1) {
            Swal.fire('', '업체유형1을 선택해주세요.', 'warning');
            return;
        }
        if (!detail.custName) {
            Swal.fire('', '회사명을 입력해주세요.', 'warning');
            return;
        }
        if (!detail.presName) {
            Swal.fire('', '대표자명을 입력해주세요.', 'warning');
            return;
        }
        if (!detail.regnum1 || !detail.regnum2 || !detail.regnum3) {
            Swal.fire('', '사업자등록번호를 입력해주세요.', 'warning');
            return;
        }
        if (detail.regnum1.length !== 3 || detail.regnum2.length !== 2 || detail.regnum3.length !== 5) {
            Swal.fire('', '사업자등록번호를 정확히 입력해주세요.', 'warning');
            return;
        }
      
        const presJuminNo1 = detail.presJuminNo1 || '';
        const presJuminNo2 = detail.presJuminNo2 || '';
        if (presJuminNo1 || presJuminNo2) {
            if (presJuminNo1.length !== 6 || presJuminNo2.length !== 7) {
                Swal.fire('', '법인번호를 입력해주세요.', 'warning');
                return;
            }
        } 
      
        if (!detail.capital || detail.capital === 0) {
            Swal.fire('', '자본금을 입력해주세요.', 'warning');
            return;
        }
        if (!detail.foundYear) {
            Swal.fire('', '설립년도를 입력해주세요.', 'warning');
            return;
        }
        if (detail.foundYear.length !== 4) {
            Swal.fire('', '설립년도를 정확히 입력해주세요.', 'warning');
            return;
        }
        if (!detail.tel) {
            Swal.fire('', '대표전화를 입력해주세요.', 'warning');
            return;
        }
        if (!detail.addrDetail) {
            Swal.fire('', '회사주소를 입력해주세요.', 'warning');
            return;
        }
        if (!regnumFile) {
            Swal.fire('', '사업자등록증을 선택해주세요.', 'warning');
            return;
        }
        if (!detail.userName) {
            Swal.fire('', '이름을 입력해주세요.', 'warning');
            return;
        }
        if (!detail.userEmail) {
            Swal.fire('', '이메일을 입력해주세요.', 'warning');
            return;
        } else {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(detail.userEmail)) {
                Swal.fire('', '입력한 이메일 형식이 올바르지 않습니다.', 'warning');
                return;
            }
        }
      
        if (!detail.userId) {
            Swal.fire('', '아이디를 입력해주세요.', 'warning');
            return;
        }
        if (!detail.idcheck) {
            Swal.fire('', '아이디 중복확인을 확인해주세요.', 'warning');
            return;
        }
        if (!detail.userPwd) {
            Swal.fire('', '비밀번호를 입력해주세요.', 'warning');
            return;
        }
        if (!detail.userPwdConfirm) {
            Swal.fire('', '비밀번호 확인을 입력해주세요.', 'warning');
            return;
        }
        if (detail.userPwd !== detail.userPwdConfirm) {
            Swal.fire('', '비밀번호를 정확히 입력해주세요.', 'warning');
            return;
        }
          // 비밀번호 유효성 검사를 위한 함수 호출 (예시)
        if (!fnPwdvaildation(detail.userPwd)) {
            return;
        }
      
        if (!detail.userHp) {
            Swal.fire('', '휴대폰번호를 입력해주세요.', 'warning');
            return;
        } else {
            const phoneNumberRegex = /^\d{3}-\d{3,4}-\d{4}$/;
            if (!phoneNumberRegex.test(detail.userHp)) {
                Swal.fire('', '휴대폰번호 형식에 맞게 입력해주세요.', 'warning');
                return;
            }
        }
        if (!detail.userTel) {
            Swal.fire('', '유선전화를 입력해주세요.', 'warning');
            return;
        } else {
            const telNumberRegex = /^\d{2,3}-\d{3,4}-\d{4}$/;
            if (!telNumberRegex.test(detail.userTel)) {
                Swal.fire('', '유선전화 형식에 맞게 입력해주세요.', 'warning');
                return;
            }
        }
        setShowConfirm(true);
    };

    const fnPwdvaildation = (userPwd) => {
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

        formData.append('regnumFile', regnumFile);
        formData.append('bFile', bFile);
        formData.append('data', new Blob([JSON.stringify(detail)], { type: 'application/json' }));

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

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        setDetail((prevDetail) => ({
            ...prevDetail,
            idcheck: false,
            userId: prevDetail.userId.replace(/[^a-zA-Z0-9]/g, ''),
        }));
    }, [detail.userId]);
    
    useEffect(() => {
        setDetail((prevDetail) => ({
            ...prevDetail,
            tel: CommonUtils.onAddDashTel(prevDetail.tel),
        }));
    }, [detail.tel]);
    
    useEffect(() => {
        setDetail((prevDetail) => ({
            ...prevDetail,
            fax: CommonUtils.onAddDashTel(prevDetail.fax),
        }));
    }, [detail.fax]);
    
    useEffect(() => {
        setDetail((prevDetail) => ({
            ...prevDetail,
            userTel: CommonUtils.onAddDashTel(prevDetail.userTel),
        }));
    }, [detail.userTel]);
    
    useEffect(() => {
        setDetail((prevDetail) => ({
            ...prevDetail,
            userHp: CommonUtils.onAddDashTel(prevDetail.userHp),
        }));
    }, [detail.userHp]);
    
    useEffect(() => {
        setDetail((prevDetail) => ({
            ...prevDetail,
            capital: CommonUtils.onComma(prevDetail.capital),
        }));
    }, [detail.capital]);
    
    useEffect(() => {
        setDetail((prevDetail) => ({
            ...prevDetail,
            regnum1: prevDetail.regnum1.replace(/[^0-9]/g, '').trim(),
        }));
    }, [detail.regnum1]);
    
    useEffect(() => {
        setDetail((prevDetail) => ({
            ...prevDetail,
            regnum2: prevDetail.regnum2.replace(/[^0-9]/g, '').trim(),
        }));
    }, [detail.regnum2]);
    
    useEffect(() => {
        setDetail((prevDetail) => ({
            ...prevDetail,
            regnum3: prevDetail.regnum3.replace(/[^0-9]/g, '').trim(),
        }));
    }, [detail.regnum3]);
    
    useEffect(() => {
        setDetail((prevDetail) => ({
            ...prevDetail,
            presJuminNo1: prevDetail.presJuminNo1.replace(/[^0-9]/g, '').trim(),
        }));
    }, [detail.presJuminNo1]);
    
    useEffect(() => {
        setDetail((prevDetail) => ({
            ...prevDetail,
            presJuminNo2: prevDetail.presJuminNo2.replace(/[^0-9]/g, '').trim(),
        }));
    }, [detail.presJuminNo2]);
    
    useEffect(() => {
        setDetail((prevDetail) => ({
            ...prevDetail,
            foundYear: prevDetail.foundYear.replace(/[^0-9]/g, ''),
        }));
    }, [detail.foundYear]);
    
    useEffect(() => {
        if (detail.userPwd) {
            setDetail((prevDetail) => ({
                ...prevDetail,
                userPwd: prevDetail.userPwd.trim(),
            }));
        }
    }, [detail.userPwd]);
    
    useEffect(() => {
        if (detail.userPwdConfirm) {
            setDetail((prevDetail) => ({
                ...prevDetail,
                userPwdConfirm: prevDetail.userPwdConfirm.trim(),
            }));
        }
    }, [detail.userPwdConfirm]);
    
    return (
        <div>
            <Header />
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
                                <select name="interrelatedCustCode" value={detail.interrelatedCustCode} onChange={handleInputChange} className="selectStyle">
                                    <option value="">계열사를 선택해 주세요</option>
                                    {interrelatedList.map((val, idx) => (
                                    <option key={idx} value={val.interrelatedCustCode}>
                                        {val.interrelatedNm}
                                    </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">업체유형 1 <span className="star">*</span></div>
                            <div className="flex align-items-center width100">
                                <input type="text" name="custTypeNm1" value={detail.custTypeNm1} onChange={handleInputChange} className="inputStyle readonly" placeholder="우측 검색 버튼을 클릭해 주세요" readOnly />
                                <a onClick={() => openItemPop('type1')} className="btnStyle btnSecondary ml10" title="조회">조회</a>
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">업체유형 2 <span className="star">*</span></div>
                            <div className="flex align-items-center width100">
                                <input type="text" name="custTypeNm2" value={detail.custTypeNm2} onChange={handleInputChange} className="inputStyle readonly" placeholder="우측 검색 버튼을 클릭해 주세요" readOnly />
                                <a onClick={() => openItemPop('type2')} className="btnStyle btnSecondary ml10" title="조회">조회</a>
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">회사명 <span className="star">*</span></div>
                            <div className="width100"><input name="custName" type="text" value={detail.custName} onChange={handleInputChange} className="inputStyle" maxLength="100" /></div>
                        </div>
                       <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">대표자명 <span className="star">*</span></div>
                            <div className="width100"><input name="presName" type="text" value={detail.presName} onChange={handleInputChange} className="inputStyle" maxLength="50" /></div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">사업자등록번호 <span className="star">*</span></div>
                            <div className="flex align-items-center width100">
                                <input name="regnum1" type="text" value={detail.regnum1} maxLength="3" onChange={handleInputChange} className="inputStyle" />
                                <span style={{margin:"0 10px"}}>-</span>
                                <input name="regnum2" type="text" value={detail.regnum2} maxLength="2" onChange={handleInputChange} className="inputStyle" />
                                <span style={{margin:"0 10px"}}>-</span>
                                <input name="regnum3" type="text" value={detail.regnum3} maxLength="5" onChange={handleInputChange} className="inputStyle" />
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">법인번호</div>
                            <div className="flex align-items-center width100">
                                <input name="presJuminNo1" type="text" value={detail.presJuminNo1} maxLength="6" onChange={handleInputChange} className="inputStyle" />
                                <span style={{margin:"0 10px"}}>-</span>
                                <input name="presJuminNo2" type="text" value={detail.presJuminNo2} maxLength="7" onChange={handleInputChange} className="inputStyle" />
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">자본금 <span className="star">*</span></div>
                            <div className="flex align-items-center width100">
                                <input name="capital" type="text" value={detail.capital} maxLength="15" onChange={handleInputChange} className="inputStyle" placeholder="ex) 10,000,000" />
                                <div className="ml10">원</div>
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">설립년도 <span className="star">*</span></div>
                            <div className="flex align-items-center width100">
                                <input name="foundYear" type="text" value={detail.foundYear} maxLength="4" onChange={handleInputChange} className="inputStyle" placeholder="ex) 2021" />
                                <div className="ml10">년</div>
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">대표전화 <span className="star">*</span></div>
                            <div className="width100">
                                <input name="tel" type="text" value={detail.tel} maxLength="13" onChange={handleInputChange} className="inputStyle" />
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">팩스</div>
                            <div className="width100">
                                <input name="fax" type="text" value={detail.fax} maxLength="13" onChange={handleInputChange} className="inputStyle" />
                            </div>
                        </div>
                        <div className="flex mt10">
                            <div className="formTit flex-shrink0 width170px">회사주소 <span className="star">*</span></div>
                            <div className="width100">
                                <div className="flex align-items-center width100">
                                    <input name="zipcode" type="text" value={detail.zipcode} className="inputStyle readonly" placeholder="주소 조회 클릭" readOnly />
                                    <a onClick={openAddrPop} data-toggle="modal" data-target="#addrPop" className="btnStyle btnSecondary flex-shrink0 ml10" title="주소 조회">주소 조회</a>
                                </div>
                                <div className="mt5"><input name="addr" type="text" value={detail.addr} maxLength="100" onChange={handleInputChange} className="inputStyle readonly" readOnly /></div>
                                <div className="mt5"><input name="addrDetail" type="text" value={detail.addrDetail} maxLength="100" onChange={handleInputChange} className="inputStyle" placeholder="상세 주소 입력" /></div>
                            </div>
                        </div>
                        <div className="flex mt10">
                            <div className="formTit flex-shrink0 width170px">사업자등록증 <span className="star">*</span></div>
                            <div className="width100">
                                <div className="upload-boxWrap">
                                    {!regnumFileName && (
                                        <div className="upload-box">
                                            <input type="file" ref={regnumFileInputRef} id="file-input" onChange={changeRegnumFile} />
                                            <div className="uploadTxt">
                                                <i className="fa-regular fa-upload"></i>
                                                <div>클릭 혹은 파일을 이곳에 드롭하세요.(암호화 해제)<br />파일 최대 10MB (등록 파일 개수 최대 1개)</div>
                                            </div>
                                        </div>
                                    )}
                                     {regnumFileName && (
                                        <div className="uploadPreview">
                                            <p>
                                                { regnumFileName }
                                                <button className='file-remove' onClick={() => fnRemoveAttachFile("reg")}>삭제</button>
                                            </p>
                                        </div> 
                                    )} 
                                </div>
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
                                <div className="upload-boxWrap">
                                    {!bFileName && (
                                        <div className="upload-box">
                                            <input type="file" ref={bFileInputRef} id="file-input" onChange={changeBFile} />
                                            <div className="uploadTxt">
                                                <i className="fa-regular fa-upload"></i>
                                                <div>클릭 혹은 파일을 이곳에 드롭하세요.(암호화 해제)<br />파일 최대 10MB (등록 파일 개수 최대 1개)</div>
                                            </div>
                                        </div>
                                    )}
                                    {bFileName && (
                                        <div className="uploadPreview">
                                            <p>
                                                { bFileName }
                                                <button className='file-remove' onClick={() => fnRemoveAttachFile("bfile")}>삭제</button>
                                            </p>
                                        </div> 
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>

                    <h3 className="h3Tit mt50">관리자 정보</h3>
                    <div className="boxSt mt20">
                        <div className="flex align-items-center">
                            <div className="formTit flex-shrink0 width170px">이름 <span className="star">*</span></div>
                            <div className="width100">
                                <input name="userName" type="text" value={detail.userName} className="inputStyle" onChange={handleInputChange} maxLength="50" />
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">이메일 <span className="star">*</span></div>
                            <div className="width100">
                                <input name="userEmail" type="text" value={detail.userEmail} onChange={handleInputChange} maxLength="100" className="inputStyle" placeholder="ex) sample@iljin.co.kr" />
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">아이디 <span className="star">*</span></div>
                            <div className="flex align-items-center width100">
                                <input name="userId" type="text" value={detail.userId} onChange={handleInputChange} maxLength="10" className="inputStyle" placeholder="영문, 숫자 입력(10자 이내) 후 중복확인" />
                                <a href="#" onClick={idcheck} className="btnStyle btnSecondary flex-shrink0 ml10" title="중복 확인">중복 확인</a>
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">비밀번호 <span className="star">*</span></div>
                            <div className="width100">
                                <input name="userPwd" style={{WebkitTextSecurity:"disc"}} value={detail.userPwd} onChange={handleInputChange} maxLength="100" className="inputStyle" placeholder="대/소문자, 숫자, 특수문자 2 이상 조합(길이 8~16자리)" />
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">비밀번호 확인 <span className="star">*</span></div>
                            <div className="width100">
                                <input name="userPwdConfirm" style={{WebkitTextSecurity:"disc"}} value={detail.userPwdConfirm} onChange={handleInputChange} maxLength="100" className="inputStyle" placeholder="비밀번호와 동일해야 합니다." />
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">휴대폰 <span className="star">*</span></div>
                            <div className="width100">
                                <input name="userHp" type="text" value={detail.userHp} onChange={handleInputChange} maxLength="13" className="inputStyle" />
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">유선전화 <span className="star">*</span></div>
                            <div className="width100">
                                <input name="userTel" type="text" value={detail.userTel} onChange={handleInputChange}  maxLength="13" className="inputStyle" />
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">직급</div>
                            <div className="width100">
                                <input name="userPosition" type="text" value={detail.userPosition} onChange={handleInputChange}  maxLength="50" className="inputStyle" />
                            </div>
                        </div>
                        <div className="flex align-items-center mt10">
                            <div className="formTit flex-shrink0 width170px">부서</div>
                            <div className="width100">
                                <input name="userBuseo" type="text" value={detail.userBuseo} onChange={handleInputChange}  maxLength="50" className="inputStyle" />
                            </div>
                        </div>
                        
                        <div className="text-center mt50">
                            <a href="#" onClick={validate} className="btnStyle btnPrimary btnMd" title="회원가입 신청">회원가입 신청</a>
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