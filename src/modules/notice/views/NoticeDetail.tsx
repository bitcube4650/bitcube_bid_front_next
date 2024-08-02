import React, { useEffect, useState }from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'; // 공통 팝업창
import { MapType } from '../../../components/types';
import { useRouter } from 'next/router';

const NoticeDetail = () => {
    //세션 로그인 정보
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo") as string);
    //const navigate = useNavigate();
    const router = useRouter()
    const { bno } = router.query
    console.log(bno)
    const [dataFromList, setDataFromList] = useState<MapType>({});

    async function onSelectDetail() {
        try {
            const srcData = {bno: bno};
            console.log(srcData)
            const response = await axios.post('/api/v1/notice/noticeList', srcData);
            console.log(response)
            if(response.data.status == 200) {
                setDataFromList(response.data.data.content[0]);
            } else {
                Swal.fire('', '조회에 실패하였습니다.', 'error');
                router.push("/notice");
            }
        } catch (error) {
            Swal.fire('', '조회에 실패하였습니다.', 'error');
            console.log(error);
            router.push("/notice");
        }
    };

    useEffect(() => {
        onSelectDetail();
    }, []);

    function onNoticeEdit() {
        router.push('/noticeEdit', {query: {updateInsert: "update"}});
    }

    function onNoticeDelConfirm() {
        Swal.fire({
            title: '공지사항 삭제',          // 타이틀
            text: '공지를 삭제합니다. 삭제 하시겠습니까?',  // 내용
            icon: 'warning',                // success / error / warning / info / question
            confirmButtonColor: '#3085d6',  // 기본옵션
            confirmButtonText: '삭제',      // 기본옵션
            showCancelButton: true,         // conrifm 으로 하고싶을떄
            cancelButtonColor: '#d33',      // conrifm 에 나오는 닫기버튼 옵션
            cancelButtonText: '닫기'        // conrifm 에 나오는 닫기버튼 옵션
        }).then(result => {
            // 만약 Promise리턴을 받으면,
            if (result.isConfirmed) { // 만약 모달창에서 confirm 버튼을 눌렀다면
                onNoticeDelete();
            }
         });
    }

    async function onNoticeDelete() {
        try {
            const response = await axios.post('/api/v1/notice/deleteNotice', { 'bno': bno });
            if(response.data.status == 200) {
                Swal.fire('', '삭제되었습니다.', 'success');
                router.push("/notice");
            } else {
                Swal.fire('', response.data.msg, 'error');
            }
        } catch (error) {
            Swal.fire('', '삭제에 실패하였습니다.', 'error');
            console.log(error);
        }
    }

    async function onDownloadFile() {
        const response = await axios.post('/api/v1/notice/downloadFile',
            { fileId: dataFromList.bfilePath },
            { responseType : 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", dataFromList.bfile); // 다운로드될 파일명 설정
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className="conRight">
            <div className="conHeader">
                <ul className="conHeaderCate">
                    <li>공지사항</li>
                    <li>공지사항 상세</li>
                </ul>
            </div>
            <div className="contents">
                <h3 className="h3Tit">공지사항</h3>
                <div className="boxSt mt20">
                    <div className="flex align-items-center">
                        <div className="formTit flex-shrink0 width170px">제목</div>
                        <div className="width100">{ dataFromList ? dataFromList.btitle : ''}</div>
                    </div>
                    <div className="flex align-items-center mt20">
                        <div className="formTit flex-shrink0 width170px">공지대상</div>
                        <div className="flex width100">
                            <input type="radio" name="bm2" value="ALL" id="bm2_1" className="radioStyle" checked={ dataFromList.bco == "ALL" } disabled={ dataFromList.bco != 'ALL'?true:false } />
                            <label htmlFor="bm2_1" className={ dataFromList.bco != 'ALL'?'dimmed':'' }>공통</label>
                            <div>
                                <input type="radio" name= "bm2" value="CUST" id="bm2_2" className="radioStyle" checked={ dataFromList.bco == "CUST" } disabled={ dataFromList.bco != 'CUST'?true:false } />
                                <label htmlFor="bm2_2" className={ dataFromList.bco != 'CUST'?'dimmed':'' }>계열사</label>
                                { dataFromList.bco == 'CUST' &&
                                    <p className="mt5 ml30">{ dataFromList.interrelatedNms }</p>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="flex align-items-center mt20">
                        <div className="formTit flex-shrink0 width170px">작성자</div>
                        <div className="width100">{ dataFromList.buserName }</div>
                    </div>
                    <div className="flex align-items-center mt20">
                        <div className="formTit flex-shrink0 width170px">공지일시</div>
                        <div className="width100">{ dataFromList.bdate }</div>
                    </div>
                    <div className="flex align-items-center mt20">
                        <div className="formTit flex-shrink0 width170px">조회수</div>
                        <div className="width100">{ dataFromList.bcount }</div>
                    </div>
                    <div className="flex align-items-center mt20">
                        <div className="formTit flex-shrink0 width170px">첨부파일</div>
                        { dataFromList.bfilePath != null && dataFromList.bfilePath != '' &&
                            <div className="width100">
                                <a onClick={ onDownloadFile } id="file-download" className="textUnderline">{ dataFromList.bfile }</a>
                            </div>
                        }
                    </div>
                    <div className="flex mt20">
                        <div className="formTit flex-shrink0 width170px">공지내용</div>
                        <div style={{width: 'calc(100% - 170px)'}}>
                            <pre className="overflow-y-auto notiBox" style={{height:'400px', backgroundColor: 'white'}}>
                                { dataFromList.bcontent }
                            </pre>
                        </div>
                    </div>
                </div>

                <div className="text-center mt50">
                    <Link to="/notice" className="btnStyle btnOutline" title="목록">목록</Link>
                    { ((loginInfo.custType == 'inter' && loginInfo.userAuth == '1') || dataFromList.buserId == loginInfo.userId) &&
                        <a onClick={ onNoticeEdit } className="btnStyle btnOutline" title="수정 이동">수정</a>
                    }
                    { ((loginInfo.custType == 'inter' && loginInfo.userAuth == '1') || dataFromList.buserId == loginInfo.userId) &&
                        <a onClick={ onNoticeDelConfirm } className="btnStyle btnOutlineRed" title="삭제">삭제</a>
                    }
                </div>
            </div>
        </div>
    );
};

export default NoticeDetail;