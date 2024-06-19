import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from "react-router-dom";
import List from '../components/BidStatusList'
import axios from 'axios';
import Pagination from '../../../components/Pagination';
import Swal from 'sweetalert2'; // 공통 팝업창

const BidStatus = () => {
    const { keyword } = useParams();

    //useEffect 안에 onSearch 한번만 실행하게 하는 플래그
    const isMounted = useRef(true);

    //조회 결과
    const [list, setList] = useState([]);

    //조회조건
    const [srcData, setSrcData] = useState({
        bidNo : ''
    ,   bidName : ''
    ,   rebidYn: true
    ,   dateOverYn: true
    ,   openBidYn: true
    ,	size : 10
    ,	page : 0
    });

    const onChangeSrcData = (e) => {
        setSrcData({
            ...srcData,
            [e.target.name]: (e.target.className === 'checkStyle') ? e.target.checked : e.target.value
        });
    }

    const onSearch = useCallback(async() => {
        await axios.post("/api/v1/bidstatus/statuslist", srcData).then((response) =>{
            if (response.data.code === "OK") {
                setList(response.data.data);
            } else {
                Swal.fire('', '조회에 실패하였습니다.', 'error');
            }
        })
    }, [srcData]);

    //메인화면에서 진입시 파라미터 분기처리
    useEffect(() => {
        if(keyword) {
            if(keyword == 'noticing'){
                setSrcData((prevState) => ({
                    ...prevState,
                    rebidYn : true,
                    dateOverYn : false,
                    openBidYn : false
                }));
            }else if(keyword == 'beforeOpening'){
                setSrcData((prevState) => ({
                    ...prevState,
                    rebidYn : false,
                    dateOverYn : true,
                    openBidYn : false
                }));
            } else if(keyword == 'opening') {
                setSrcData((prevState) => ({
                    ...prevState,
                    dateOverYn : false,
                    rebidYn : false,
                    openBidYn : true
                }));
            }
        }
    }, [keyword]);

    useEffect(() => {
        if (isMounted.current) {
            isMounted.current = false;
        } else {
            onSearch();
        }
    },[srcData]);

    return (
        <div>
             {/* 본문  */}
            <div className="conRight">
                 {/* conHeader  */}
                <div className="conHeader">
                    <ul className="conHeaderCate">
                        <li>전자입찰</li>
                        <li>입찰진행</li>
                    </ul>
                </div>
                 {/* conHeader  */}
                 {/* contents  */}
                <div className="contents">
                    <div className="conTopBox">
                        <ul className="dList">
                        <li>
                            <div>
                            입찰진행은 입찰공고 되고 입찰 완료되기 전까지의 상태를 가진 입찰입니다. (입찰번호 또는 입찰명을 클릭하시면 상세내용을 확인할 수 있습니다)
                            </div>
                        </li>
                        <li>
                            <div>
                            입찰이 마감되면 개찰자는 개찰 후 업체선정을 해 주십시오.(개찰대상은 상태가 빨간색으로, 개찰 후 업체선정대상은 상태가 파란색으로 표기됩니다.)
                            </div>
                        </li>
                        <li className="textHighlight">
                            <div>
                            입찰마감 후 30일이 지나도록 업체 선정되지 않으면 자동으로 유찰처리 됩니다
                            </div>
                        </li>
                        </ul>
                    </div>

                     {/* searchBox  */}
                    <div className="searchBox mt20">
                        <div className="flex align-items-center">
                            <div className="sbTit mr30">입찰번호</div>
                            <div className="width250px">
                                <input type="text" className="inputStyle" onChange={onChangeSrcData} name="bidNo" maxLength="10" onKeyUp={(e) => { if(e.key === 'Enter') onSearch()}} />
                            </div>
                            <div className="sbTit mr30 ml50">입찰명</div>
                            <div className="width250px">
                                <input type="text" className="inputStyle" onChange={onChangeSrcData} name="bidName" maxLength="50" onKeyUp={(e) => { if(e.key === 'Enter') onSearch()}} />
                            </div>
                        </div>
                        <div className="flex align-items-center height50px mt10">
                            <div className="sbTit mr30">진행상태</div>
                            <div className="flex align-items-center width100">
                                <input type="checkbox" id="progress1-1" className="checkStyle" onClick={onChangeSrcData} name="rebidYn" defaultChecked={srcData.rebidYn} checked={srcData.rebidYn} /><label htmlFor="progress1-1">입찰공고(재입찰 포함)</label>
                                <input type="checkbox" id="progress1-2" className="checkStyle" onClick={onChangeSrcData} name="dateOverYn" defaultChecked={srcData.dateOverYn} checked={srcData.dateOverYn} /><label htmlFor="progress1-2" className="ml50">입찰공고(개찰대상)</label>
                                <input type="checkbox" id="progress1-3" className="checkStyle" onClick={onChangeSrcData} name="openBidYn" defaultChecked={srcData.openBidYn} checked={srcData.openBidYn} /><label htmlFor="progress1-3" className="ml50">개찰(업체선정대상)</label>
                            </div>
                            <a href={()=>false} className="btnStyle btnSearch" onClick={onSearch}>검색</a>
                        </div>
                    </div>
                    {/* searchBox  */}

                    <div className="width100 mt10">
                        전체 : <span className="textMainColor"><strong>{ list.totalElements ? list.totalElements.toLocaleString() : 0 }</strong></span>건
                        <select onChange={onChangeSrcData} name="size" className="selectStyle maxWidth140px ml20">
                            <option value="10">10개씩 보기</option>
                            <option value="20">20개씩 보기</option>
                            <option value="30">30개씩 보기</option>
                            <option value="50">50개씩 보기</option>
                        </select>
                    </div>
                    
                    <table className="tblSkin1 mt10">
                        <colgroup>
                            <col style={{width: "12%"}} />
                            <col  />
                            <col style={{width: "15%"}} />
                            <col style={{width: "10%"}} />
                            <col style={{width: "10%"}} />
                            <col style={{width: "10%"}} />
                            <col style={{width: "10%"}} />
                            <col style={{width: "10%"}} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>입찰번호</th>
                                <th>입찰명</th>
                                <th>제출마감일시</th>
                                <th>입찰방식</th>
                                <th>상태</th>
                                <th>내역</th>
                                <th>담당자</th>
                                <th className="end">개찰자</th>
                            </tr>
                        </thead>
                        <tbody>
                            { list.content?.map((data) => <List key={data.biNo} val={data} />) }
                            { (list.content === undefined || list.content === null || list.content.length === 0)&&
                                <tr>
                                    <td className="end" colSpan="8">조회된 데이터가 없습니다.</td>
                                </tr> }
                        </tbody>
                    </table>

                     {/* pagination  */}
                     <div className="row mt40">
                        <div className="col-xs-12">
                            <Pagination onChangeSrcData={onChangeSrcData} list={list} />
                        </div>
                    </div>
                 {/* pagination  */}
                </div>
                 {/* contents  */}
            </div>
             {/* 본문  */}
        </div>
    )
}

export default BidStatus
