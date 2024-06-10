import React, { useCallback, useState, useEffect, useRef } from 'react';
import Pagination from 'components/Pagination';
import axios from 'axios';
import Swal from 'sweetalert2'; // 공통 팝업창
import FaqList from '../components/faqList';
import FaqPop from '../components/faqPop';

const AdminFaq = () => {
    
    //모달창 띄우기
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    //조회 결과
    const [faqList, setFaqList] = useState({
        content: [],
        totalElements: 0,
        number: 0,
        totalPages: 0
    });

    //조회조건
    const [srcData, setSrcData] = useState({
        title: '',
        faqType: '',
        admin: 'Y',
        useYn: 'Y',
        size    : 10,
        page    : 0
    });

    const onChangeSrcData = useCallback((e) => {
        
        setSrcData({
            ...srcData,
            [e.target.name]: e.target.value
        });

    },[srcData]);

    //faq 조회
    const onSearch = useCallback(async() => {
        try {
            const response = await axios.post("/api/v1/faq/faqList", srcData);

            if (response.data.code == 'OK') {
                setFaqList(response.data.data);
            }else{
                Swal.fire('', '조회에 실패하였습니다.', 'error');
                console.log(response.data.data);
            }
        } catch (error) {
            Swal.fire('', '조회에 실패하였습니다.', 'error');
            console.log(error);
        }
    }, [srcData]);

    const faqPopRef = useRef();

    //팝업창 띄우기
    const onCallPopMethod = useCallback((props) => {

        setIsModalOpen(true);
        if (faqPopRef.current) {
            faqPopRef.current.onOpenPop(props);
        }

    }, []);

    //팝업창 닫기
    const onCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    useEffect(() => {
        onSearch();
    },[srcData.size, srcData.page]);

    
    return (

        <div className="conRight">
            <div className="conHeader">
                <ul className="conHeaderCate">
                    <li>공지</li>
                    <li>FAQ</li>
                </ul>
            </div>

            <div className="contents">
                <div className="searchBox">
                    <div className="flex align-items-center">
                        <div className="sbTit mr30">제목</div>
                        <div className="width200px">
                            <input
                                type="text"
                                onChange={onChangeSrcData}
                                name="title"
                                className="inputStyle"
                                placeholder=""
                                maxLength="300"
                                onKeyDown={(e) => { if(e.key === 'Enter'){ srcData.page = 0; onSearch()}}}
                            />
                        </div>
                        <div className="sbTit mr30 ml50">구분</div>
                        <div className="width200px">
                            <select
                                onChange={onChangeSrcData}
                                name="faqType"
                                className="selectStyle"
                            >
                                <option value="">전체</option>
                                <option value="1">가입관련</option>
                                <option value="2">입찰관련</option>
                                <option value="3">인증서관련</option>
                            </select>
                        </div>
                        <a onClick={(e)=>{ srcData.page = 0; onSearch();}} className="btnStyle btnSearch">검색</a>
                    </div>
                </div>

                <div className="flex align-items-center justify-space-between mt40">
                    <div className="width100">
                        전체 : <span className="textMainColor"><strong>{ faqList.totalElements ? faqList.totalElements.toLocaleString() : 0 }</strong></span>건
                        <select
                        name="size"
                        className="selectStyle maxWidth140px ml20"
                        >
                            <option value="10">10개씩 보기</option>
                            <option value="20">20개씩 보기</option>
                            <option value="30">30개씩 보기</option>
                            <option value="50">50개씩 보기</option>
                        </select>
                    </div>
                    <div className="flex-shrink0" >
                        <a onClick={()=>onCallPopMethod()} data-toggle="modal" data-target="#faqReg" className="btnStyle btnPrimary" title="FAQ 등록">FAQ 등록</a>
                    </div>
                </div>

                <table className="tblSkin1 mt10">
                    <colgroup>
                        <col style={{ width: '15%' }} />
                        <col style={{}} />
                        <col style={{ width: '15%' }} />
                        <col style={{ width: '15%' }} />
                    </colgroup>
                    <thead>
                        <tr>
                        <th>구분</th>
                        <th>제목</th>
                        <th>등록자</th>
                        <th className="end">등록일시</th>
                        </tr>
                    </thead>
                    <tbody>
                        {faqList.content?.map((faq) => <FaqList key={faq.faqId} faq={faq} onCallPopMethod={onCallPopMethod}/>)}
                        { faqList.totalElements == 0 &&
                            <tr>
                                <td className="end" colSpan="4">조회된 데이터가 없습니다.</td>
                            </tr> }
                    </tbody>
                </table>

                <div className="row mt40">
                    <div className="col-xs-12">
                        <Pagination onChangeSrcData={onChangeSrcData} list={faqList}/>
                    </div>
                </div>
            </div>
            <FaqPop ref={faqPopRef} isOpen={isModalOpen} onClose={onCloseModal} onSearch={onSearch} />
        </div>
    );
}

export default AdminFaq;