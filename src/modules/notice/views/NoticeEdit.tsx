import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from 'axios';
import Swal from 'sweetalert2'; // 공통 팝업창
import AffiliateSelectModal from 'components/modal/AffiliateSelectModal';
import EditInput from 'components/EditInput'
import EditInputRadio from 'components/EditInputRadio'
import EditInputFileBox from 'components/EditInputFileBox'
import EditTextArea from 'components/EditTextArea'
import { MapType } from 'components/types'

const NoticeEdit = () => {
    //세션 로그인 정보
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo") as string);

    const navigate = useNavigate();
    const { bno } = useParams();

    //계열사 팝업 정보
    const [affiliateSelectData, setAffiliateSelectData] = useState<MapType>({
        show: false
    });

    const [detailData, setDetailData] = useState<MapType>({
        btitle      : "",
        bco         : "CUST",
        buserName   : loginInfo.userName,
        buserid     : loginInfo.userId,
        bcount      : 0,
        bcontent    : ""
    });

    const [uploadFile, setUploadFile] = useState<File|null>();

    async function onSelectDetail() {
        try {
            const srcData = {bno: bno};
            const response = await axios.post('/api/v1/notice/noticeList', srcData);
            
            if(response.data.status == 200) {
                let responseData = response.data.data.content[0];

                setDetailData({
                    ...responseData,
                    ['fileName']: responseData.bfile
                });
                if(responseData.interrelatedCodes) {    //계열사 정보가 있는 경우
                    setDetailData({
                        ...responseData,
                        ['interrelatedCustCodeArr']: responseData.interrelatedCodes.split(",")
                    });
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

    useEffect(() => {
        if(!detailData.fileName) {
            setDetailData({
                ...detailData,
                ['bfile']: null,
                ['bfilePath']: null
            });
        }
    }, [detailData.fileName]);

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
            if(uploadFile) {
                formData.append('file', uploadFile);
            }

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
                            <EditInput name="btitle" maxLength={ 300 } editData={ detailData } setEditData={ setDetailData } defaultValue={ detailData.btitle } />
                        </div>
                    </div>
                    <div className="flex align-items-center mt20">
                        <div className="formTit flex-shrink0 width170px">공지대상</div>
                        <div className="flex width100">
                            <EditInputRadio editData={ detailData } setEditData={ setDetailData }
                                id="bm2_1" name="bco" value="ALL" label="공통"
                                checked={ detailData.bco == "ALL" } disabled={ loginInfo.userAuth != '1' ? true : false } />
                            <div onClick={(e) => setAffiliateSelectData({...affiliateSelectData, ["show"]: true})} data-toggle="modal" title="계열사 선택">
                                <EditInputRadio editData={ detailData } setEditData={ setDetailData }
                                    id="bm2_2" name="bco" value="CUST" label="계열사"
                                    checked={ detailData.bco == "CUST" } disabled={ loginInfo.userAuth != '1' ? true : false } />
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
                            <EditInputFileBox fileName={ detailData.fileName } setUploadFile={ setUploadFile } editData={ detailData } setEditData={ setDetailData } />
                        </div>
                    </div>
                    <div className="flex mt20">
                        <div className="formTit flex-shrink0 width170px">공지내용</div>
                        <div className="width100">
                            <EditTextArea editData={ detailData } setEditData={ setDetailData } name="bcontent" defaultValue={ detailData.bcontent } />
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