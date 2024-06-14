import React, { useCallback, useEffect, useRef, useState } from 'react';
import List from '../components/BidHistoryList'
import axios from 'axios';
import Pagination from '../../../components/Pagination';
import Swal from 'sweetalert2'; // 공통 팝업창
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { ko } from "date-fns/locale";
import Ft from '../api/filters';
import BidJoinCustListPop from '../components/BidJoinCustListPop';

const BidHistory = () => {

    //useEffect 안에 onSearch 한번만 실행하게 하는 플래그
    const isMounted = useRef(true);

    //조회 결과
    const [list, setList] = useState([]);

    //롯데에너지머트리얼즈
    const [lotteMat, setLotteMat] = useState(false);
    const [lotteMatCode, setLotteMatCode] = useState({})

    //조회조건
    const [srcData, setSrcData] = useState({
        biNo : ''						//조회조건 : 입찰번호
    ,	biName : ''						//조회조건 : 입찰명
    ,   matDept: ""                     //조회조건 : 분류군 - 사업부
    ,   matProc: ""                     //조회조건 : 분류군 - 공정
    ,   matCls: ""                      //조회조건 : 분류군 - 분류
    ,	size : 10						//10개씩 보기
    ,	page : 0						//클릭한 페이지번호
    ,   startDate : Ft.strDateAddDay(Ft.getCurretDate(), -365)                  //조회조건 : 입찰완료 - 시작일
    ,   endDate : Ft.getCurretDate()                 //조회조건 : 입찰완료 - 종료일
    });

    const onChangeSrcData = (e) => {
        setSrcData({
            ...srcData,
            [e.target.name]: e.target.value
        });
    }

    const onSearch = useCallback(async() => {
        await axios.post("/api/v1/bidComplete/history", srcData).then((response) =>{
            if (response.data.code === "OK") {
                setList(response.data.data);
            } else {
                Swal.fire('', '조회에 실패하였습니다.', 'error');
            }
        })
    }, [srcData]);

    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));

    const onLotteMatCode = () => {
        axios.post("/api/v1/bidComplete/lotteMatCode", {}).then((response) => {
            if (response.data.code === "OK") {
                setLotteMatCode(response.data.data);
            } else {
                Swal.fire('', response.data.msg, 'error');
            }
        })
    }

    //엑셀다운로드
    const onExcelDown = useCallback(()=> {
        let time = Ft.formatDate(new Date(), "yyyy_mm_dd");
        let params = Object.assign({}, srcData);
        params.fileName = "입찰_이력_" + time;

        axios.post("/api/v1/excel/bid/completeList/downLoad", params, {responseType: "blob",}).then((response) => {
            if (response.status === 200) {
                // 응답이 성공적으로 도착한 경우
                const url = window.URL.createObjectURL(new Blob([response.data])); // 응답 데이터를 Blob 형식으로 변환하여 URL을 생성합니다.
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", params.fileName + ".xlsx"); // 다운로드할 파일명을 설정합니다.
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(url); // 임시 URL을 해제합니다.
            } else {
                Swal.fire('', '엑셀 다운로드 중 오류가 발생했습니다.', 'error');
            }
        }).catch((error) => {
            // 오류 처리
            console.error("Error:", error);
            Swal.fire('', '엑셀 다운로드 중 오류가 발생했습니다.', 'error');
        })
    }, [srcData])

    //투찰정보
    const [popBiNo, setPopBiNo] = useState('');
    const [joinCustPop, setJoinCustPop] = useState(false);

    const onSetPopData = (biNo)=> {
        setPopBiNo(biNo);
        setJoinCustPop(true);
    }

    //마운트 완료 후 검색
    useEffect(() => {
        if (isMounted.current) {
            isMounted.current = false;
        } else {
            onSearch();
        }
    },[srcData.size, srcData.page]);

    //접속 계열사 코드가 롯데에너지머트리얼즈일 때
    useEffect(()=>{
        const onLotteMatFlag = () => {
            if (loginInfo.custCode === "02") {
              setLotteMat(true);
              onLotteMatCode();
            }
        }

        onLotteMatFlag();
    }, [loginInfo.custCode]);


    //날짜 이벤트
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
            {/* conHeader */}
            <div className="conHeader">
                <ul className="conHeaderCate">
                    <li>전자입찰</li>
                    <li>낙찰이력</li>
                </ul>
            </div>
            {/* //conHeader */}
            {/* contents */}
            <div className="contents">
                <div className="conTopBox">
                    <ul className="dList">
                        <li><div>조회기간 입찰완료일 기준으로 소속사의 낙찰된 입찰정보와 투찰 정보를 확인할 수 있습니다.</div></li>
                        <li><div>참여업체수를 클릭하면 투찰 업체들의 투찰가 및 투찰 일시를 보실 수 있습니다.</div></li>
                    </ul>
                </div>

                {/* searchBox */}
                <div className="searchBox mt20">
                    <div className="flex align-items-center">
                        <div className="sbTit width100px">입찰완료일</div>
                        <div className="flex align-items-center" style={{ width:'320px'}}>
                            <DatePicker className="datepicker inputStyle" locale={ko} shouldCloseOnSelect selected={srcData.startDate} onChange={(date) => onChgStartDate(date)} dateFormat="yyyy-MM-dd"/>
                            <span style={{margin:"0 10px"}}>~</span>
                            <DatePicker className="datepicker inputStyle" locale={ko} shouldCloseOnSelect selected={srcData.endDate} onChange={(date) => onChgEndDate(date)} dateFormat="yyyy-MM-dd"/>
                        </div>
                        {lotteMat && 
                        <>
                        <div className="sbTit width80px ml50" >분류군</div>
                        <div className="flex align-items-center width300px" >
                            <select onChange={onChangeSrcData} name="matDept" className="selectStyle">
                                <option value="">사업부</option>
                                { lotteMatCode.matDept?.map((dept, idx) => 
                                <option value={dept.codeval} key={idx}>{ dept.codename }</option>
                                )}
                            </select>
                            <select onChange={onChangeSrcData} name="matProc" className="selectStyle ml10">
                                <option value="">공정</option>
                                { lotteMatCode.matProc?.map((proc, idx) => 
                                <option value={proc.codeval} key={idx}>{ proc.codename }</option>
                                )}
                            </select>
                            <select onChange={onChangeSrcData} name="matCls" className="selectStyle ml10">
                                <option value="">분류</option>
                                { lotteMatCode.matCls?.map((cls, idx) => 
                                <option value={cls.codeval} key={idx}>{ cls.codename }</option>
                                )}
                            </select>
                        </div>
                        </>
                        }
                    </div>
                    <div className="flex align-items-center height50px mt10">
                        <div className="sbTit width100px">입찰번호</div>
                        <div style={{ width:'320px'}}>
                            <input type="text" onChange={onChangeSrcData} name="biNo" className="inputStyle" placeholder="" onKeyUp={(e) => { if(e.key === 'Enter') onSearch()}} />
                        </div>
                        <div className="sbTit width80px ml50">입찰명</div>
                        <div style={{ width:'320px'}}>
                            <input type="text" onChange={onChangeSrcData} name="biName" className="inputStyle" placeholder="" onKeyUp={(e) => { if(e.key === 'Enter') onSearch()}} />
                        </div>
                        <a href="#!" onClick={onSearch} className="btnStyle btnSearch">검색</a>
                    </div>
                </div>
                {/* //searchBox */}

                <div className="flex align-items-center justify-space-between mt40">
                    <div className="width100 mt10">
                        전체 : <span className="textMainColor"><strong>{ list.totalElements ? list.totalElements.toLocaleString() : 0 }</strong></span>건
                        <select onChange={onChangeSrcData} name="size" className="selectStyle maxWidth140px ml20">
                            <option value="10">10개씩 보기</option>
                            <option value="20">20개씩 보기</option>
                            <option value="30">30개씩 보기</option>
                            <option value="50">50개씩 보기</option>
                        </select>
                    </div>
                    <div className="flex-shrink0">
                        <a href="#!" onClick={onExcelDown} className="btnStyle btnPrimary" title="엑셀 다운로드" >엑셀 다운로드 <i className="fa-light fa-arrow-down-to-line ml10"></i></a>
                    </div>
                </div>

                <div className="tblScroll">
                    <table className="tblSkin1 mt10">
                    <colgroup>
                        <col style={{}} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>입찰번호</th>
                            {lotteMat && 
                            <>
                            <th>사업부</th>
                            <th>공정</th>
                            <th>분류</th>
                            <th>공장동</th>
                            <th>라인</th>
                            <th>호기</th>
                            </>
                            }
                            <th>입찰명</th>
                            <th>예산금액</th>
                            <th>낙찰금액</th>
                            <th>낙찰사</th>
                            <th>참여업체수</th>
                            <th>제출시작일</th>
                            <th>제출마감일</th>
                            <th className="end">입찰담당자</th>
                        </tr>
                    </thead>
                    <tbody>
                        { list.content?.map((data) => <List key={data.biNo} data={data} lotteMat={lotteMat} onSetPopData={onSetPopData}/>) }
                        { (list.content === undefined || list.content === null || list.content.length === 0) &&
                            <tr>
                                <td className="end" colSpan={lotteMat ? '15' : '9'}>조회된 데이터가 없습니다.</td>
                            </tr> 
                        }
                    </tbody>
                    </table>
                </div>

                {/* pagination */}
                <div className="row mt40">
                    <div className="col-xs-12">
                        <Pagination onChangeSrcData={onChangeSrcData} list={list} />
                    </div>
                </div>
                {/* pagination */}
            </div>
            {/* //contents */}
            {joinCustPop && 
            <BidJoinCustListPop biNo={popBiNo} joinCustPop={joinCustPop} setJoinCustPop={setJoinCustPop} />
            }
        </div>
    )
}

export default BidHistory