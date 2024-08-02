import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Pagination from '../../../src/components/Pagination';
import Swal from 'sweetalert2'; // 공통 팝업창
import Ft from '../../../src/modules/bid/api/filters';
import { MapType } from '../../../src/components/types'
import SrcInput from '../../../src/components/input/SrcInput'
import SrcCheck from '../../../src/components/input/SrcCheckBox'
import DatePicker from '../../../src/components/input/SrcDatePicker'
import SelectListSize from '../../../src/components/SelectListSize'
import { useRouter } from 'next/router';

const Index = ({ initList }: { initList: MapType }) => {
    const router = useRouter();

    //useEffect 안에 onSearch 한번만 실행하게 하는 플래그
    const isMounted = useRef<boolean>(true);

    //조회 결과
    const [list, setList] = useState<MapType>(initList);

    //조회조건
    const [srcData, setSrcData] = useState<MapType>({
        biNo : ''						//조회조건 : 입찰번호
    ,	biName : ''						//조회조건 : 입찰명
    ,	succYn_Y : true					//조회조건 : 선정
    ,	succYn_N : true					//조회조건 : 비선정
    ,	size : 10						//10개씩 보기
    ,	page : 0						//클릭한 페이지번호
    ,   startDate : Ft.strDateAddDay(Ft.getCurretDate(), -365)                  //조회조건 : 입찰완료 - 시작일
    ,   endDate : Ft.getCurretDate()                 //조회조건 : 입찰완료 - 종료일
    });

    const onSearch = async() => {
        await axios.post("/api/v1/bidComplete/partnerList", srcData).then((response) =>{
            if (response.data.code === "OK") {
                setList(response.data.data);
            } else {
                Swal.fire('', '조회에 실패하였습니다.', 'error');
            }
        })
    };

    const onClickBidDetail = (biNo:string) => {
        localStorage.setItem("biNo", biNo);
        router.push('/bid/partnerComplete/detail');
    };

    function fnSuccYn(val:string){
        if(val === 'Y'){ return '선정(낙찰)'}
        else if(val === undefined || val === null || val === 'N'){ return '비선정'}
    }

    //메인화면에서 진입시 파라미터 분기처리
    useEffect(() => {
        if(!Ft.isEmpty(router.query)) {
            if(router.query.keyword == 'awarded'){
                setSrcData((prevState) => ({
                    ...prevState,
                    succYn_Y : true,
                    succYn_N : false
                }));
            }else if(router.query.keyword == 'unsuccessful'){
                setSrcData((prevState) => ({
                    ...prevState,
                    succYn_Y : false,
                    succYn_N : true
                }));
            }
        }
    }, [router.query.keyword]);

    useEffect(() => {
        if (isMounted.current) {
            isMounted.current = false;
        } else {
            onSearch();
        }
    },[srcData.size, srcData.page]);

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
                            <DatePicker name="startDate" selected={srcData.startDate} srcData={srcData} setSrcData={setSrcData} />
                            <span style={{margin:"0 10px"}}>~</span>
                            <DatePicker name="endDate" selected={srcData.endDate} srcData={srcData} setSrcData={setSrcData} />
                        </div>
                        <div className="sbTit mr30 ml50 width100px">완료상태</div>
                        <div className="flex align-items-center">
                            <SrcCheck id="progress1-1" name="succYn_Y" srcData={ srcData } setSrcData={ setSrcData } defaultChecked={srcData.succYn_Y} text="선정(낙찰)" />
                            <SrcCheck id="progress1-2" name="succYn_N" srcData={ srcData } setSrcData={ setSrcData } defaultChecked={srcData.succYn_N} text="비선정(유찰포함)" />
                        </div>
                    </div>
                    <div className="flex align-items-center height50px mt10">
                        <div className="sbTit mr30 width100px">입찰번호</div>
                        <div style={{ width:'320px'}}>
                            <SrcInput onSearch={onSearch} name="biNo" srcData={ srcData } setSrcData={ setSrcData }/>
                        </div>
                        <div className="sbTit mr30 ml50 width100px">입찰명</div>
                        <div style={{ width:'320px'}}>
                            <SrcInput onSearch={onSearch} name="biName" srcData={ srcData } setSrcData={ setSrcData }/>
                        </div>
                        <a onClick={onSearch} className="btnStyle btnSearch">검색</a>
                    </div>
                </div>
                {/* //searchBox  */}

                <div className="flex align-items-center justify-space-between mt40">
                    <div className="width100">
                        전체 : <span className="textMainColor"><strong>{ list.totalElements ? list.totalElements.toLocaleString() : 0 }</strong></span>건
                        <SelectListSize onSearch={ onSearch } srcData={ srcData } setSrcData={ setSrcData } />
                    </div>
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
                        { list.content?.map((data:MapType, idx:string) => 
                             <tr key={idx}>
                                <td><a onClick={()=>onClickBidDetail(data.biNo)} className="textUnderline" title="입찰번호">{ data.biNo }</a></td>
                                <td className="text-left"><a onClick={()=>onClickBidDetail(data.biNo)} className="textUnderline" title="입찰명">{ data.biName }</a></td>
                                <td>{ data.bidOpenDate }</td>
                                <td>{ Ft.ftBiMode(data.biMode) }</td>
                                <td style={data.succYn === 'Y' ? {color:'red'} : {}}>{ fnSuccYn(data.succYn) }</td>
                                <td>{ Ft.ftInsMode(data.insMode) }</td>
                                <td className="end"><i className="fa-light fa-paper-plane-top"></i> <a href={'mailto:' + data.userEmail} className="textUnderline" title="담당자">{ data.userName }</a></td>
                            </tr>
                        )}
                        { (list.content === undefined || list.content === null || list.content.length === 0)&&
                            <tr>
                                <td className="end" colSpan={7}>조회된 데이터가 없습니다.</td>
                            </tr> 
                        }
                    </tbody>
                </table>

                {/* pagination  */}
                <div className="row mt40">
                    <div className="col-xs-12">
                        <Pagination srcData={ srcData } setSrcData={ setSrcData } list={ list } />
                    </div>
                </div>
                {/* pagination  */}

            </div>
             {/* //contents  */}
        </div>
    )
}

export const getServerSideProps = async (context) => {
    let params = {
        biNo : ''						//조회조건 : 입찰번호
    ,	biName : ''						//조회조건 : 입찰명
    ,	succYn_Y : true					//조회조건 : 선정
    ,	succYn_N : true					//조회조건 : 비선정
    ,	size : 10						//10개씩 보기
    ,	page : 0						//클릭한 페이지번호
    ,   startDate : Ft.strDateAddDay(Ft.getCurretDate(), -365)                  //조회조건 : 입찰완료 - 시작일
    ,   endDate : Ft.getCurretDate()                 //조회조건 : 입찰완료 - 종료일
    }

    let query = context.query;
    if(query.keyword == 'awarded'){
        params.succYn_Y = true;
        params.succYn_N = false;
    }else if(query.keyword == 'unsuccessful'){
        params.succYn_Y = false;
        params.succYn_N = true;
    }

    const cookies = context.req.headers.cookie || '';
    try {
        axios.defaults.headers.cookie = cookies;
        const response = await axios.post("http://localhost:3000/api/v1/bidComplete/partnerList", params);
        return {
            props: {
                initList: response.data.data
            }
        };
    } catch (error) {
        console.error('Error fetching initial progress list:', error);
        return {
            props: {
                initList: { content: [], totalElements: 0 }
            }
        };
    }
}

export default Index