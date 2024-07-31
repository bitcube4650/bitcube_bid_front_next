import React, { useCallback, useEffect, useState } from 'react';
//import { useNavigate  } from "react-router-dom";
import axios from 'axios';

import Swal from 'sweetalert2'; // 공통 팝업창
import SrcInput from '../../src/components/input/SrcInput';
import { MapType } from '../../src/components/types';
import SelectListSize from '../../src/components/SelectListSize';
import Pagination from '../../src/components/Pagination';
import NoticeList from '../../src/modules/notice/components/NoticeList';
import { useRouter } from 'next/router';


const Index = () => {
    //const navigate = useNavigate();
    const router = useRouter()

    //세션 로그인 정보
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo") as string);
    //조회 결과
    const [noticeList, setNoticeList] = useState<MapType>({
        totalElements   : 0,
        content         : [{bno: 0}]
    });
    //조회조건
    const [srcData, setSrcData] = useState<MapType>({
        title   : "",
        content : "",
        userName: "",
        size    : 10,
        page    : 0
    });
    
    const onSearch = async() => {
        try {
            const response = await axios.post("/api/v1/notice/noticeList", srcData);
            setNoticeList(response.data.data);
        } catch (error) {
            Swal.fire('', '조회에 실패하였습니다.', 'error');
            console.log(error);
        }
    };

    useEffect(() => {
        onSearch();
    },[srcData.size, srcData.page]);

    const onNoticeEdit = ()=> {
        if (typeof window === 'undefined') {
            console.error("Running on the server. Router context is unavailable.");
            return;
        }
    
        if (!router) {
            console.error("Router context is not available.");
            return;
        }
        router.push('/notice/noticeEdit');
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
                            <SrcInput name="title" onSearch={ onSearch } srcData={ srcData } setSrcData={ setSrcData } maxLength={ 300 } />
                        </div>
                        <div className="sbTit mr30 ml50">내용</div>
                        <div className="width200px">
                            <SrcInput name="content" onSearch={ onSearch } srcData={ srcData } setSrcData={ setSrcData } maxLength={ 300 } />
                        </div>
                        <div className="sbTit mr30 ml50">등록자</div>
                        <div className="width200px">
                            <SrcInput name="userName" onSearch={ onSearch } srcData={ srcData } setSrcData={ setSrcData } maxLength={ 50 } />
                        </div>
                        <a onClick={ onSearch } className="btnStyle btnSearch">검색</a>
                    </div>
                </div>
                <div className="flex align-items-center justify-space-between mt40">
                <div className="width100">
                        전체 : <span className="textMainColor"><strong>{ noticeList.totalElements ? noticeList.totalElements.toLocaleString() : 0 }</strong></span>건
                        <SelectListSize onSearch={ onSearch } srcData={ srcData } setSrcData={ setSrcData } />
                    </div>
                    { (loginInfo.userAuth == '1' || loginInfo.userAuth == '2') &&
                    <div>
                        <a onClick={onNoticeEdit} className="btnStyle btnPrimary" title="공지등록">공지등록</a>
                    </div> }
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
                        { noticeList.content?.map((notice: MapType) => <NoticeList key={notice.bno} content={notice} />) }
                        { noticeList.content == null &&
                            <tr>
                                <td className="end" colSpan={6}>조회된 데이터가 없습니다.</td>
                            </tr> }
                    </tbody>
                </table>
                <div className="row mt40">
                    <div className="col-xs-12">
                        <Pagination srcData={ srcData } setSrcData={ setSrcData } list={ noticeList } />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;