import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from "react-router-dom";
import List from '../components/BidPtCompleteList'
import axios from 'axios';
import Pagination from '../../../components/Pagination';
import Swal from 'sweetalert2'; // 공통 팝업창
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { ko } from "date-fns/locale";
import Ft from '../api/filters';

const PartnerBidComplete = () => {
    const { keyword } = useParams();

    //useEffect 안에 onSearch 한번만 실행하게 하는 플래그
    const isMounted = useRef(true);

    //조회 결과
    const [list, setList] = useState([]);

    //조회조건
    const [srcData, setSrcData] = useState({
        biNo : ''						//조회조건 : 입찰번호
    ,	biName : ''						//조회조건 : 입찰명
    ,	succYn_Y : true					//조회조건 : 선정
    ,	succYn_N : true					//조회조건 : 비선정
    ,	size : 10						//10개씩 보기
    ,	page : 0						//클릭한 페이지번호
    ,   startDate : Ft.strDateAddDay(Ft.getCurretDate(), -365)                  //조회조건 : 입찰완료 - 시작일
    ,   endDate : Ft.getCurretDate()                 //조회조건 : 입찰완료 - 종료일
    });

    const onChangeSrcData = (e) => {
        setSrcData({
            ...srcData,
            [e.target.name]: (e.target.className === 'checkStyle') ? e.target.checked : e.target.value
        });
    }

    const onSearch = useCallback(async() => {
        await axios.post("/api/v1/bidComplete/partnerList", srcData).then((response) =>{
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
            if(keyword == 'awarded'){
                setSrcData({
                    ...srcData,
                    succYn_Y : true,
                    succYn_N : false
                });
            }else if(keyword == 'unsuccessful'){
                setSrcData({
                    ...srcData,
                    succYn_Y : false,
                    succYn_N : true
                });
            }
        }
    }, []);

    useEffect(() => {
        if (isMounted.current) {
            isMounted.current = false;
        } else {
            onSearch();
        }
    },[srcData]);

    const onChgStartDate = (day) => {
        const selectedDate = new Date(day)
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        setSrcData({
            ...srcData,
            startDate: formattedDate
        });
    }

    const onChgEndDate = (day) => {
        const selectedDate = new Date(day)
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        setSrcData({
            ...srcData,
            endDate: formattedDate
        });
    }

    return (
        <div className="conRight">
             {/* conHeader  */}
            <div className="conHeader">
                <ul className="conHeaderCate">
                    <li>전자입찰</li>
                    <li>입찰완료</li>
                </ul>
            </div>
             {/* //conHeader  */}
             {/* contents  */}
            <div className="contents">
                <div className="conTopBox">
                    <ul className="dList">
                        <li><div>입찰완료는 결과가 선정 또는 비선정 된 입찰 목록을 보여줍니다. (입찰번호 또는 입찰명을 클릭하시면 상세내용을 확인할 수 있습니다)</div></li>
                    </ul>
                </div>

                 {/* searchBox  */}
                <div className="searchBox mt20">
                    <div className="flex align-items-center">
                        <div className="sbTit mr30 width100px">입찰완료일</div>
                        <div className="flex align-items-center" style={{ width:'320px'}}>
                            <DatePicker className="datepicker inputStyle" locale={ko} shouldCloseOnSelect selected={srcData.startDate} onChange={(date) => onChgStartDate(date)} dateFormat="yyyy-MM-dd"/>
                            <span style={{margin:"0 10px"}}>~</span>
                            <DatePicker className="datepicker inputStyle" locale={ko} shouldCloseOnSelect selected={srcData.endDate} onChange={(date) => onChgEndDate(date)} dateFormat="yyyy-MM-dd"/>
                        </div>
                        <div className="sbTit mr30 ml50 width100px">완료상태</div>
                        <div className="flex align-items-center width300px">
                            <input type="checkbox" id="progress1-1" onClick={onChangeSrcData} name="succYn_Y" defaultChecked={srcData.succYn_Y} checked={srcData.succYn_Y} className="checkStyle"/><label htmlFor="progress1-1">선정(낙찰)</label>
                            <input type="checkbox" id="progress1-2" onClick={onChangeSrcData} name="succYn_N" defaultChecked={srcData.succYn_N} checked={srcData.succYn_N} className="checkStyle"/><label htmlFor="progress1-2" className="ml50">비선정(유찰포함)</label>
                        </div>
                    </div>
                    <div className="flex align-items-center height50px mt10">
                        <div className="sbTit mr30 width100px">입찰번호</div>
                        <div style={{ width:'320px'}}>
                            <input type="text" onChange={onChangeSrcData} name="biNo" className="inputStyle" placeholder="" onKeyUp={(e) => { if(e.key === 'Enter') onSearch()}} />
                        </div>
                        <div className="sbTit mr30 ml50 width100px">입찰명</div>
                        <div style={{ width:'320px'}}>
                            <input type="text" onChange={onChangeSrcData} name="biName" className="inputStyle" placeholder="" onKeyUp={(e) => { if(e.key === 'Enter') onSearch()}} />
                        </div>
                        <a href={()=>false} onClick={onSearch} className="btnStyle btnSearch">검색</a>
                    </div>
                </div>
                 {/* //searchBox  */}

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
                        <col style={{width:'12%'}} />
                        <col style={{}} />
                        <col style={{width:'15%'}} />
                        <col style={{width:'10%'}} />
                        <col style={{width:'10%'}} />
                        <col style={{width:'10%'}} />
                        <col style={{width:'10%'}} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>입찰번호</th>
                            <th>입찰명</th>
                            <th>입찰공고일시</th>
                            <th>입찰방식</th>
                            <th>결과</th>
                            <th>내역</th>
                            <th className="end">담당자</th>
                        </tr>
                    </thead>
                    <tbody>
                        { list.content?.map((data) => <List key={data.biNo} data={data} />) }
                        { (list.content === undefined || list.content === null || list.content.length === 0)&&
                            <tr>
                                <td className="end" colSpan="7">조회된 데이터가 없습니다.</td>
                            </tr> 
                        }
                    </tbody>
                </table>

                 {/* pagination  */}
                 <div className="row mt40">
                    <div className="col-xs-12">
                        <Pagination onChangeSrcData={onChangeSrcData} list={list} />
                    </div>
                </div>
                {/* //  pagination  */}

            </div>
             {/* //contents  */}
        </div>
    )
}

export default PartnerBidComplete