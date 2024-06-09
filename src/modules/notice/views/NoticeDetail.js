import React, { useEffect, useState }from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'; // 공통 팝업창

const NoticeDetail = () => {
    //세션 로그인 정보
    const loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
    const navigate = useNavigate();
    const { bno } = useParams();
    const [dataFromList, setDataFromList] = useState({});

    async function onSelectDetail() {
        try {
            const srcData = {bno: bno};
            const response = await axios.post('/api/v1/notice/noticeList', srcData);
            
            if(response.data.status == 200) {
                setDataFromList(response.data.data.content[0]);
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
        onSelectDetail();
    }, [bno]);

    function onNoticeEdit() {
        navigate('/noticeEdit/' + bno, {state: {updateInsert: "update"}});
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
                        <div className="width100">{ dataFromList.btitle }</div>
                    </div>
                    <div className="flex align-items-center mt20">
                        <div className="formTit flex-shrink0 width170px">공지대상</div>
                        <div className="flex width100">
                            <input type="radio" name="bm2" value="ALL" id="bm2_1" className="radioStyle" checked={ dataFromList.bco == "ALL" } disabled={ dataFromList.bco != 'ALL'?'disabled':'' } />
                            <label for="bm2_1" className={ dataFromList.bco != 'ALL'?'dimmed':'' }>공통</label>
                            <div>
                                <input type="radio" name= "bm2" value="CUST" id="bm2_2" className="radioStyle" checked={ dataFromList.bco == "CUST" } disabled={ dataFromList.bco != 'CUST'?'disabled':'' } />
                                <label for="bm2_2" className={ dataFromList.bco != 'CUST'?'dimmed':'' }>계열사</label>
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
                                {/* todo: downloadFile */}
                                <a click="downloadFile" id="file-download" className="textUnderline">{ dataFromList.bfile }</a>
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
                    {/* todo: 수정/삭제 */}
                    { ((loginInfo.custType == 'inter' && loginInfo.userAuth == '1') || dataFromList.buserId == loginInfo.userId) &&
                        <a onClick={ onNoticeEdit } className="btnStyle btnOutline" title="수정 이동">수정</a>
                    }
                    { ((loginInfo.custType == 'inter' && loginInfo.userAuth == '1') || dataFromList.buserId == loginInfo.userId) &&
                        <a data-toggle="modal" data-target="#notiDel" className="btnStyle btnOutlineRed" title="삭제">삭제</a>
                    }
                </div>
            </div>
        </div>
    );
};

export default NoticeDetail;