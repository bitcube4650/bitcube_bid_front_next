import React from 'react';
import { useParams, Link } from 'react-router-dom';

const NoticeDetail = () => {
    const { bno } = useParams();
    const dataFromList = {};
    const val = "";
    const index = "";
    const groupList = "";

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
                            <input type="radio" name="bm2" v-model="dataFromList.bco" value="ALL" id="bm2_1" className="radioStyle" disabled="dataFromList.bco == 'ALL' ? false : true" />
                            <label for="bm2_1" className="dataFromList.bco == 'ALL' ? '' : 'dimmed'">공통</label>
                            <div>
                                <input type="radio" name= "bm2" v-model="dataFromList.bco" value="CUST" id="bm2_2" className="radioStyle" disabled="dataFromList.bco == 'CUST' ? false : true" />
                                <label for="bm2_2" className="dataFromList.bco == 'CUST' ? '' : 'dimmed'">계열사</label>
                                <p className="mt5 ml30" v-if="dataFromList.bco == 'CUST'">
                                    <span v-for="(val, index) in groupList" key="index">
                                        {/* val.interrelated.interrelatedNm }{ index < groupList.length - 1 ? ', ' : '' */}
                                    </span>
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
                        <div className="width100" v-if="dataFromList.bfilePath != null && dataFromList.bfilePath != ''">
                            <a click="downloadFile" id="file-download" className="textUnderline">{ dataFromList.bfile }</a>
                        </div>
                    </div>
                    <div className="flex mt20">
                        <div className="formTit flex-shrink0 width170px">공지내용</div>
                        <div className="width100">
                            <pre v-html="content" className="overflow-y-auto notiBox width100" style={{height:'400px', backgroundColor: 'white'}}>
                            </pre>
                        </div>
                    </div>
                </div>

                <div className="text-center mt50">
                    <Link to="/notice" className="btnStyle btnOutline" title="목록">목록</Link>
                    <a v-if="(custType == 'inter' && userAuth == '1') || (dataFromList.buserid == userId)" click="clickUpdate" className="btnStyle btnOutline" title="수정 이동">수정 이동</a>
                    <a v-if="(custType == 'inter' && userAuth == '1') || (dataFromList.buserid == userId)" data-toggle="modal" data-target="#notiDel" className="btnStyle btnOutlineRed" title="삭제">삭제</a>
                </div>
            </div>
        </div>
    );
};

export default NoticeDetail;