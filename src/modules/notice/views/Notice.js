import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import Pagination from '../../../components/Pagination';
import NoticeList from '../components/NoticeList';

const Notice = () => {
    //세션 로그인 정보
    const loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
    //조회 결과
    const [noticeList, setNoticeList] = useState({});
    //조회조건
    const [srcData, setSrcData] = useState({
        size: 10,
        page: 0
    });
    const onChangeSrcData = (e) => {
        setSrcData({
            ...srcData,
            [e.target.name]: e.target.value
        });
    }

    useEffect(() => {
        onSearch(0);
    }, [onSearch]);
    
    async function onSearch(page) {
        try {
            if(page){srcData.page = page};

            const response = await axios.post("/api/v1/notice/noticeList", srcData);
            setNoticeList(response.data);
        } catch (error) {
            console.log(error); //todo
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
                            <input type="text" onChange={onChangeSrcData} name="title" className="inputStyle" placeholder="" maxlength="300" />
                        </div>
                        <div className="sbTit mr30 ml50">내용</div>
                        <div className="width200px">
                            <input type="text" onChange={onChangeSrcData} name="content" className="inputStyle" placeholder="" maxlength="300" />
                        </div>
                        <div className="sbTit mr30 ml50">등록자</div>
                        <div className="width200px">
                            <input type="text" onChange={onChangeSrcData} name="userName" className="inputStyle" placeholder="" maxlength="50" />
                        </div>
                        <a onClick={() => {onSearch(0);}} className="btnStyle btnSearch">검색</a>
                    </div>
                </div>
                <div className="flex align-items-center justify-space-between mt40">
                <div className="width100">
                        전체 : <span className="textMainColor"><strong>{ noticeList.totalElements ? noticeList.totalElements.toLocaleString() : 0 }</strong></span>건
                        <select onChange={onChangeSrcData} name="size" className="selectStyle maxWidth140px ml20">
                            <option value="10">10개씩 보기</option>
                            <option value="20">20개씩 보기</option>
                            <option value="30">30개씩 보기</option>
                            <option value="50">50개씩 보기</option>
                        </select>
                    </div>
                    {loginInfo.userAuth == '1' || loginInfo.userAuth == '2'?
                    <div>
                        <Link to="/noticeEdit" className="btnStyle btnPrimary" title="공지등록">공지등록</Link>
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