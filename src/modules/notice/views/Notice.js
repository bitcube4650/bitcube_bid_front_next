import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import Pagination from '../../../components/Pagination';
import ListSizeSelect from '../../../components/ListSizeSelect';
import NoticeList from '../components/NoticeList';

const Notice = () => {
    {/* input value 처리 */}
    const [value, setValue] = useState({});
    function onChangeInputValue(e) {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        });
    };

    const loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
    const [noticeList, setNoticeList] = useState({});
    const searchParams = {
        size: '10'
    };

    useEffect(() => {
        onSearch(0);
    }, []);
    
    async function onSearch(page, size) {
        try {
            if(page){searchParams.page = page};
            if(size){searchParams.size = size};
            searchParams.title      = value.title;
            searchParams.content    = value.content;
            searchParams.userName   = value.userName;

            const response = await axios.post("/api/v1/notice/noticeList", searchParams);
            setNoticeList(response.data);
        } catch (error) {
            console.log(error); //todo
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
                        <ListSizeSelect onSearch={onSearch} />
                    </div>
                    {loginInfo.userAuth == '1' || loginInfo.userAuth == '2'?
                    <div>
                        <Link to="/noticeUpdateInsert" className="btnStyle btnPrimary" title="공지등록">공지등록</Link>
                    </div>
                    :""}
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
                        { noticeList.content?.map((notice) => <NoticeList key={notice.bno} notice={notice} />) }
                        { noticeList.content == null?
                            <tr>
                                <td className="end" colspan="6">조회된 데이터가 없습니다.</td>
                            </tr>:"" }
                    </tbody>
                </table>
                <div className="row mt40">
                    <div className="col-xs-12">
                        <Pagination onSearch={onSearch} list={noticeList} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notice;