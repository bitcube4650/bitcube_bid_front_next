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
    const [groupList, setGroupList] = useState([]);

    async function onSelectDetail() {
        try {
            let srcData = {bno: bno};
            const response = await axios.post('/api/v1/notice/noticeList', srcData);
            //const groupResponse = await axios.post('/api/v1/notice/selectGroupList', srcData);
            const groupResponse = {
                status : 200,
                data : ["1", "2", "3"]
            }
            
            if(response.status == 200 && groupResponse.status == 200) {
                setDataFromList(response.data.content[0]);
                setGroupList(groupResponse.data);
            } else {
                Swal.fire('조회에 실패하였습니다.', '', 'error');
                navigate("/notice");
            }
        } catch (error) {
            Swal.fire('조회에 실패하였습니다.', '', 'error');
            console.log(error);
            navigate("/notice");
        }
    };

    useEffect(() => {
        onSelectDetail();
    }, bno);

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
                            <input type="radio" name="bm2" value="ALL" id="bm2_1" className="radioStyle" checked={ dataFromList.bco == "ALL" } disabled={ dataFromList.bco != 'ALL' && 'true' } />
                            <label for="bm2_1" className={ dataFromList.bco != 'ALL' && 'dimmed' }>공통</label>
                            <div>
                                <input type="radio" name= "bm2" value="CUST" id="bm2_2" className="radioStyle" checked={ dataFromList.bco == "CUST" } disabled={ dataFromList.bco != 'CUST' && 'true' } />
                                <label for="bm2_2" className={ dataFromList.bco != 'CUST' && 'dimmed' }>계열사</label>
                                <p className="mt5 ml30" v-if="dataFromList.bco == 'CUST'">
                                    { groupList?.map((group, index) => (<span>{ group }{ index < groupList.length - 1 && ', ' }</span>)) }
                                </p>
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
                        <div className="width100">
                            <pre className="overflow-y-auto notiBox width100" style={{height:'400px', backgroundColor: 'white'}}>
                                { dataFromList.bcontent }
                            </pre>
                        </div>
                    </div>
                </div>

                <div className="text-center mt50">
                    <Link to="/notice" className="btnStyle btnOutline" title="목록">목록</Link>
                    {/* todo: 수정/삭제 */}
                    {
                        ((loginInfo.custType == 'inter' && loginInfo.userAuth == '1') || dataFromList.buserId == loginInfo.userId) &&
                        <a click="clickUpdate" className="btnStyle btnOutline" title="수정 이동">수정 이동</a>
                    }
                    {
                        ((loginInfo.custType == 'inter' && loginInfo.userAuth == '1') || dataFromList.buserId == loginInfo.userId) &&
                        <a data-toggle="modal" data-target="#notiDel" className="btnStyle btnOutlineRed" title="삭제">삭제</a>
                    }
                </div>
            </div>
        </div>
    );
};

export default NoticeDetail;