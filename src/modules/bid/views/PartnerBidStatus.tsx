import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from "react-router-dom";
import List from '../components/PartnerBidStatusList'
import axios from 'axios';
import Pagination from 'components/Pagination';
import Swal from 'sweetalert2'; // 공통 팝업창
import { MapType } from 'components/types'
import SrcInput from 'components/input/SrcInput'
import SrcCheck from 'components/input/SrcCheckBox'
import DatePicker from 'components/input/SrcDatePicker'
import SelectListSize from 'components/SelectListSize'

const PartnerBidStatus = () => {
    const { keyword } = useParams();

    //useEffect 안에 onSearch 한번만 실행하게 하는 플래그
    const isMounted = useRef<boolean>(true);

    //조회 결과
    const [list, setList] = useState<MapType>({
        totalElements   : 0,
        val         : [{}]
    });

    //조회조건
    const [srcData, setSrcData] = useState<MapType>({
        bidNo : ''
    ,   bidName : ''
    ,   bidModeA : true
    ,   bidModeB : true
    ,   esmtYnN : true
    ,   esmtYnY : true
    ,	size : 10						//10개씩 보기
    ,	page : 0						//클릭한 페이지번호
    });

    const onSearch = async() => {
        await axios.post("/api/v1/bidPtStatus/statuslist", srcData).then((response) =>{
            if (response.data.code === "OK") {
                setList(response.data.data);
            } else {
                Swal.fire('', '조회에 실패하였습니다.', 'error');
            }
        })
    };

    //메인화면에서 진입시 파라미터 분기처리
    useEffect(() => {
        if(keyword) {
            if(keyword == 'noticing'){
                setSrcData((prevState) => ({
                    ...prevState,
                    esmtYnN : true,
                    esmtYnY : false
                }));
            }else if(keyword == 'submitted'){
                setSrcData((prevState) => ({
                    ...prevState,
                    esmtYnN : false,
                    esmtYnY : true
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
    },[srcData.size, srcData.page]);

    return (
        <div className="conRight">
            {/* conHeader */}
            <div className="conHeader">
                <ul className="conHeaderCate">
                    <li>전자입찰</li>
                    <li>입찰진행</li>
                </ul>
            </div>
            {/* //conHeader */}
            {/* contents */}
            <div className="contents">
                <div className="conTopBox">
                    <ul className="dList">
                        <li><div>입찰진행은 입찰공고 되고 입찰 완료되기 전까지의 상태를 가진 입찰입니다. (입찰번호 또는 입찰명을 클릭하시면 상세내용을 확인할 수 있습니다)</div></li>
                        <li><div>견적 제출이 가능한 입찰은 입찰번호, 입찰명 그리고 제출시작일시가 파란색으로 표기 됩니다.(견적 가능은 미투찰 상태에서 제출시작시간이 지난 입찰입니다.)</div></li>
                    </ul>
                </div>

                {/* searchBox */}
                <div className="searchBox mt20">
                    <div className="flex align-items-center">
                        <div className="sbTit mr30">입찰번호</div>
                        <div className="width250px">
                            <SrcInput onSearch={onSearch} name="bidNo" srcData={ srcData } setSrcData={ setSrcData }/>
                        </div>
                        <div className="sbTit mr30 ml50">입찰명</div>
                        <div className="width250px">
                            <SrcInput onSearch={onSearch} name="bidName" srcData={ srcData } setSrcData={ setSrcData }/>
                        </div>
                    </div>
                    <div className="flex align-items-center height50px mt10">
                        <div className="sbTit mr30">입찰방식</div>
                        <div className="flex align-items-center width100">
                            <SrcCheck id="progress1-1" name="bidModeA" srcData={ srcData } setSrcData={ setSrcData } defaultChecked={srcData.bidModeA} text="지명" />
                            <SrcCheck id="progress1-2" name="bidModeB" srcData={ srcData } setSrcData={ setSrcData } defaultChecked={srcData.bidModeB} text="일반" />
                        </div>
                        <div className="sbTit mr30 ml50">투찰상태</div>
                        <div className="flex align-items-center width100">
                            <SrcCheck id="progress2-1" name="esmtYnN" srcData={ srcData } setSrcData={ setSrcData } defaultChecked={srcData.esmtYnN} text="미투찰(재입찰 포함)" />
                            <SrcCheck id="progress2-2" name="esmtYnY" srcData={ srcData } setSrcData={ setSrcData } defaultChecked={srcData.esmtYnY} text="투찰" />
                        </div>
                        <a className="btnStyle btnSearch" onClick={onSearch}>검색</a>
                    </div>
                </div>
                {/* //searchBox */}

                <div className="flex align-items-center justify-space-between mt40">
                    <div className="width100">
                        전체 : <span className="textMainColor"><strong>{ list.totalElements ? list.totalElements.toLocaleString() : 0 }</strong></span>건
                        <SelectListSize onSearch={ onSearch } srcData={ srcData } setSrcData={ setSrcData } />
                    </div>
                </div>
                
                <table className="tblSkin1 mt10">
                    <colgroup>
                        <col style={{width: "12%" }} />
                        <col />
                        <col style={{width: "14%" }} />
                        <col style={{width: "14%" }} />
                        <col style={{width: "10%" }} />
                        <col style={{width: "10%" }} />
                        <col style={{width: "10%" }} />
                        <col style={{width: "10%" }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>입찰번호</th>
                            <th>입찰명</th>
                            <th>제출시작일시</th>
                            <th>제출마감일시</th>
                            <th>입찰방식</th>
                            <th>투찰상태</th>
                            <th>내역</th>
                            <th className="end">담당자</th>
                        </tr>
                    </thead>
                    <tbody>
                        { list.content?.map((data:MapType) => <List key={data.biNo} data={data} />) }
                        { (list.content === undefined || list.content === null || list.content.length === 0)&&
                        <tr>
                            <td className="end" colSpan={8}>조회된 데이터가 없습니다.</td>
                        </tr> }
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
            {/* //contents */}
        </div>
    )
}

export default PartnerBidStatus