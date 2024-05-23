import React, { useEffect, useState } from 'react';
import axios from "axios";
import NoticeList from '../components/NoticeList';

const Notice = () => {
    {/* input value 처리 */}
    const [value, setValue] = useState({});
    function onChangeInputValue(e) {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        });
    }

    const [noticeList, setNoticeList] = useState([]);
    const searchParams = {
        size: '10'
    };

    useEffect(() => {
        onSearch(0);
    }, []);
    
    async function onSearch(page) {
        try {
            searchParams.page       = page;
            searchParams.title      = value.title;
            searchParams.content    = value.content;
            searchParams.userName   = value.userName;

            const response = await axios.post("/api/v1/notice/noticeList", searchParams);
            setNoticeList(response.data.content);
        } catch (error) {
            console.log(error);
        }
    }

    const onEnterSearch = (e) => {
        if(e.key === "Enter") {
            onSearch(0);
        }
    }

    return (
        <div className="conRight">
            <div className="conHeader">
                <ul className="conHeaderCate">
                    <li>공지</li>
                    <li>공지사항</li>
                </ul>
            </div>
            <div className="contents">
                <div className="searchBox">
                    <div className="flex align-items-center">
                        <div className="sbTit mr30">제목</div>
                        <div className="width200px">
                            <input type="text" onKeyDown={onEnterSearch} onChange={onChangeInputValue} name="title" className="inputStyle" placeholder="" maxlength="300" />
                        </div>
                        <div className="sbTit mr30 ml50">내용</div>
                        <div className="width200px">
                            <input type="text" onKeyDown={onEnterSearch} onChange={onChangeInputValue} name="content" className="inputStyle" placeholder="" maxlength="300" />
                        </div>
                        <div className="sbTit mr30 ml50">등록자</div>
                        <div className="width200px">
                            <input type="text" onKeyDown={onEnterSearch} onChange={onChangeInputValue} name="userName" className="inputStyle" placeholder="" maxlength="50" />
                        </div>
                        <a onClick={() => {onSearch(0);}} className="btnStyle btnSearch">검색</a>
                    </div>
                </div>
                <div className="flex align-items-center justify-space-between mt40">
                    <div className="width100">
                        전체 : <span className="textMainColor"><strong>{ noticeList.totalElements ? noticeList.totalElements.toLocaleString() : 0 }</strong></span>건
                        <select name="" change="onSearch(0)" v-model="searchParams.size" className="selectStyle maxWidth140px ml20">
                            <option value="10">10개씩 보기</option>
                            <option value="20">20개씩 보기</option>
                            <option value="30">30개씩 보기</option>
                            <option value="50">50개씩 보기</option>
                        </select>
                    </div>
                    <div v-if="insertButton">
                        <router-link to="{ path: '/notice/noticeUpdateInsert', query: { updateInsert: 'insert' } }" className="btnStyle btnPrimary" title="공지등록">공지등록</router-link>
                    </div>
                </div>
                <table className="tblSkin1 mt10">
                    <colgroup>
                        <col style={{width:'7%'}} />
                        <col />
                        <col style={{width:'10%'}} />
                        <col style={{width:'10%'}} />
                        <col style={{width:'10%'}} />
                        <col style={{width:'10%'}} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>순번</th>
                            <th>제목</th>
                            <th>첨부파일</th>
                            <th>등록자</th>
                            <th>등록일시</th>
                            <th className="end">조회수</th>
                        </tr>
                    </thead>
                    <tbody>
                        {noticeList.map((notice) => <NoticeList key={notice.bno} notice={notice} />)}
                        
                        {/*
                        <tr v-if="listPage.content == undefined || listPage.content == null || listPage.content.length == 0">
                            <td className="end" colspan="6">조회된 데이터가 없습니다.</td>
                        </tr>
                        */}
                    </tbody>
                </table>
                <div className="row mt40">
                    <div className="col-xs-12">
                        <pagination searchFunc="search" page="listPage"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notice;