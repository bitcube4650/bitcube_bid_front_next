import React, { useState } from 'react';
import { useLocation } from "react-router-dom";

const NoticeEdit = () => {
    const location = useLocation();

    const [detailData, setDetailData] = useState({
        btitle: "test"
    });
    const onChangeDetailData = (e) => {
        setDetailData({
            ...detailData,
            [e.target.name]: e.target.value
        });
    }

    const updateInsert = location.state.updateInsert;
    const val = {interrelated:{}};
    const index = '';
    const groupList = [];
    const selectedFileName = '';

    return (
        <div className="conRight">
            <div class="conHeader">
                <ul class="conHeaderCate">
                    <li>공지사항</li>
                    <li>공지사항 등록/수정</li>
                </ul>
            </div>
            <div class="contents">
                <h3 class="h3Tit">{ updateInsert == 'update' ? '공지사항 수정' : '공지사항 등록' }</h3>
                <div class="boxSt mt20">
                    <div class="flex align-items-center">
                        <div class="formTit flex-shrink0 width170px">제목</div>
                        <div class="width100">
                            <input type="text" class="inputStyle" placeholder="" onChange={ onChangeDetailData } value={detailData.btitle} name="btitle" maxlength="300" />
                        </div>
                    </div>
                    <div class="flex align-items-center mt20">
                        <div class="formTit flex-shrink0 width170px">공지대상</div>
                        <div class="flex width100">
                            <input type="radio" name="bm2"  v-model="detailData.bco" value="ALL" id="bm2_1" class="radioStyle" disabled="userAuth != '1' ? true : false" />
                            <label for="bm2_1">공통</label>
                            <div click="openModal">
                                <input type="radio" name="bm2"  v-model="detailData.bco" value="CUST" id="bm2_2" class="radioStyle" />
                                    <label for="bm2_2" data-toggle="modal">계열사</label>
                                <p class="mt5 ml30" v-if="detailData.bco == 'CUST'">
                                    <span v-for="(val, index) in groupList" key="index">
                                        { val.interrelated.interrelatedNm }{ index < groupList.length - 1 ? ', ' : '' }
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="flex align-items-center mt20">
                        <div class="formTit flex-shrink0 width170px">작성자</div>
                        <div class="width100">{ detailData.buserName }</div>
                    </div>
                    <div class="flex align-items-center mt20">
                        <div class="formTit flex-shrink0 width170px">공지일시</div>
                        <div class="width100">등록 또는 수정한 날짜로 저장됩니다.</div>
                    </div>
                    <div class="flex align-items-center mt20">
                        <div class="formTit flex-shrink0 width170px">조회수</div>
                        <div class="width100">{ detailData.bcount }</div>
                    </div>
                    {/*
                    <div class="flex mt20">
                        <div class="formTit flex-shrink0 width170px">첨부파일</div>
                        <div class="width100">
                            <div class="upload-boxWrap">
                                <div class="upload-box" v-show="!selectedFile">
                                    <input type="file" ref="uploadedFile" id="file-input" change="changeFile" />
                                    <div class="uploadTxt">
                                        <i class="fa-regular fa-upload"></i>
                                        <div>클릭 혹은 파일을 이곳에 드롭하세요.(암호화 해제)<br />파일 최대 10MB (등록 파일 개수 최대 1개)</div>
                                    </div>
                                </div>
                                <div class="uploadPreview" v-if="selectedFile">
                                    <p>
                                        {{ selectedFileName }}
                                        <button class='file-remove' click="fnRemoveAttachFile()">삭제</button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    */}
                    <div class="flex mt20">
                        <div class="formTit flex-shrink0 width170px">공지내용</div>
                        <div class="width100">
                            <textarea v-model="detailData.bcontent" class="textareaStyle notiBox overflow-y-auto" placeholder="" style={{height:'400px'}}>
                            </textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoticeEdit;