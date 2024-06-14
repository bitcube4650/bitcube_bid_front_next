import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from 'axios';
import Swal from 'sweetalert2'; // 공통 팝업창
import AffiliateSelectModal from 'components/modal/AffiliateSelectModal';

const NoticeEdit = () => {
    //세션 로그인 정보
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

    const navigate = useNavigate();
    const { bno } = useParams();

    //계열사 팝업 정보
    const [affiliateSelectData, setAffiliateSelectData] = useState({
        show: false
    });

    const [detailData, setDetailData] = useState({
        btitle      : "",
        bco         : "CUST",
        buserName   : loginInfo.userName,
        buserid     : loginInfo.userId,
        bcount      : 0,
        bcontent    : ""
    });

    const [uploadFile, setUploadFile] = useState();

    async function onSelectDetail() {
        try {
            const srcData = {bno: bno};
            const response = await axios.post('/api/v1/notice/noticeList', srcData);
            
            if(response.data.status == 200) {
                let responseData = response.data.data.content[0];

                setDetailData({
                    ...responseData,
                    ['fileName']: responseData.bfile,
                    ['interrelatedCustCodeArr']: responseData.interrelatedCodes.split(",")
                });
                if(responseData.interrelatedCodes) {    //계열사 정보가 있는 경우
                    setAffiliateSelectData({
                        ...affiliateSelectData.show,
                        ["interrelatedCodes"] : responseData.interrelatedCodes.split(",")
                    })
                }
            } else {
                Swal.fire('', '조회에 실패하였습니다.', 'error');
                navigate("/notice");
            }
        } catch (error) {
            Swal.fire('', '조회에 실패하였습니다.', 'error');
            console.log(error);
            navigate("/notice");
        }
    };

    useEffect(() => {
        if(bno) {
            onSelectDetail();
        }
    }, [bno]);

    useEffect(() => {
        if(affiliateSelectData.isChange) {
            setDetailData({
                ...detailData,
                ['interrelatedCustCodeArr']: affiliateSelectData.interrelatedCodes,
                ['interrelatedNms']: affiliateSelectData.interrelatedNms
            });
        }
    }, [affiliateSelectData.isChange]);

    const onChangeDetailData = (e) => {
        setDetailData({
            ...detailData,
            [e.target.name]: e.target.value
        });
    }

    function onCheckVali() {
        if(!detailData.btitle) {
            Swal.fire('', '제목을 입력해주세요.', 'warning');
            return false;
        }
        if(!detailData.bcontent) {
            Swal.fire('', '내용을 입력해주세요.', 'warning');
            return false;
        }
        if(!detailData.bco) {
            Swal.fire('', '공지대상을 선택해주세요.', 'warning');
            return false;
        }
        if(detailData.bco == 'CUST' && (!detailData.interrelatedCustCodeArr || detailData.interrelatedCustCodeArr.length == 0)) {
            Swal.fire('', '공지할 계열사를 선택해주세요.', 'warning');
            return false;
        }

        return true;
    }

    //저장
    function onSaveCheckNotice(){
        if(!onCheckVali()) {
            return false;
        }

        Swal.fire({
            title: '공지사항 등록',          // 타이틀
            text: '공지일시는 현재 처리되는 기준으로 저장됩니다. 저장 하시겠습니까?',  // 내용
            icon: 'warning',                // success / error / warning / info / question
            confirmButtonColor: '#3085d6',  // 기본옵션
            confirmButtonText: '확인',      // 기본옵션
            showCancelButton: true,         // conrifm 으로 하고싶을떄
            cancelButtonColor: '#d33',      // conrifm 에 나오는 닫기버튼 옵션
            cancelButtonText: '닫기'        // conrifm 에 나오는 닫기버튼 옵션
        }).then(result => {
            // 만약 Promise리턴을 받으면,
            if (result.isConfirmed) { // 만약 모달창에서 confirm 버튼을 눌렀다면
                onSaveNotice();
            }
         });
    };

    async function onSaveNotice() {
        let url = ''
        let saveText = ''

        if(bno) {
            url = '/api/v1/notice/updateNotice'
            saveText = '수정'
        } else {
            url = '/api/v1/notice/insertNotice'
            saveText = '등록'
        }

        try {
            let formData = new FormData();
            formData.append('file', uploadFile);
            formData.append('data', JSON.stringify(detailData));

            const response = await axios.post(url, formData);
            if(response.data.status == 200) {
                Swal.fire('', saveText + '되었습니다.', 'success');
                navigate("/notice");
            } else {
                Swal.fire('', response.data.msg, 'error');
            }
        } catch (error) {
            Swal.fire('', saveText + '에 실패하였습니다.', 'error');
            console.log(error);
        }
    }

    function onRemoveAttachFile() {
        setDetailData({
            ...detailData,
            ['fileName']: null
        });
    }

    function onChangeFile(e) {
        setUploadFile(
            e.target.files[0]
        );
        setDetailData({
            ...detailData,
            ['fileName']: e.target.files[0].name
        });
    }

    return (
        <div className="conRight">
            <div className="conHeader">
                <ul className="conHeaderCate">
                    <li>공지사항</li>
                    <li>공지사항 등록/수정</li>
                </ul>
            </div>
            <div className="contents">
                <h3 className="h3Tit">{ bno ? '공지사항 수정' : '공지사항 등록' }</h3>
                <div className="boxSt mt20">
                    <div className="flex align-items-center">
                        <div className="formTit flex-shrink0 width170px">제목</div>
                        <div className="width100">
                            <input type="text" className="inputStyle" placeholder="" onChange={ onChangeDetailData } value={detailData.btitle} name="btitle" maxLength="300" />
                        </div>
                    </div>
                    <div className="flex align-items-center mt20">
                        <div className="formTit flex-shrink0 width170px">공지대상</div>
                        <div className="flex width100">
                            <input type="radio" id="bm2_1" className="radioStyle" onChange={ onChangeDetailData } name="bco" value="ALL" checked={ detailData.bco == "ALL" } disabled={loginInfo.userAuth != '1' ? true : false} />
                            <label for="bm2_1">공통</label>
                            <div onClick={(e) => setAffiliateSelectData({...affiliateSelectData, ["show"]: true})} data-toggle="modal" title="계열사 선택">
                                <input type="radio" name= "bco" value="CUST" id="bm2_2" className="radioStyle" onChange={ onChangeDetailData } checked={ detailData.bco == "CUST" } />
                                <label for="bm2_2">계열사</label>
                                { detailData.bco == 'CUST' &&
                                    <p className="mt5 ml30">{ detailData.interrelatedNms }</p>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="flex align-items-center mt20">
                        <div className="formTit flex-shrink0 width170px">작성자</div>
                        <div className="width100">{ detailData.buserName }</div>
                    </div>
                    <div className="flex align-items-center mt20">
                        <div className="formTit flex-shrink0 width170px">공지일시</div>
                        <div className="width100">{ bno?detailData.bdate : "등록 또는 수정한 날짜로 저장됩니다." }</div>
                    </div>
                    <div className="flex align-items-center mt20">
                        <div className="formTit flex-shrink0 width170px">조회수</div>
                        <div className="width100">{ detailData.bcount }</div>
                    </div>
                    <div className="flex mt20">
                        <div className="formTit flex-shrink0 width170px">첨부파일</div>
                        <div className="width100">
                            <div className="upload-boxWrap">
                                { !detailData.fileName &&
                                <div className="upload-box">
                                    <input type="file" id="file-input" onChange={ onChangeFile } />
                                    <div className="uploadTxt">
                                        <i className="fa-regular fa-upload"></i>
                                        <div>클릭 혹은 파일을 이곳에 드롭하세요.(암호화 해제)<br />파일 최대 10MB (등록 파일 개수 최대 1개)</div>
                                    </div>
                                </div> }
                                { detailData.fileName &&
                                <div className="uploadPreview">
                                    <p>
                                        { detailData.fileName }
                                        <button className='file-remove' onClick={ onRemoveAttachFile }>삭제</button>
                                    </p>
                                </div> }
                            </div>
                        </div>
                    </div>
                    <div className="flex mt20">
                        <div className="formTit flex-shrink0 width170px">공지내용</div>
                        <div className="width100">
                            <textarea className="textareaStyle notiBox overflow-y-auto" style={{height:'400px'}} onChange={ onChangeDetailData } name="bcontent" defaultValue={ detailData.bcontent } />
                        </div>
                    </div>
                    <div className="text-center mt50">
                        <Link to="/notice" className="btnStyle btnOutline" title="목록">목록</Link>
                        <a onClick={ onSaveCheckNotice } className="btnStyle btnPrimary" title="저장">저장</a>
                    </div>
                </div>
            </div>

            <AffiliateSelectModal affiliateSelectData={ affiliateSelectData } setAffiliateSelectData={ setAffiliateSelectData } />
        </div>
    );
};

export default NoticeEdit;