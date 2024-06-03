import React, { useCallback, useEffect, useState } from 'react';
import List from '../components/PartnerBidStatusList'
import axios from 'axios';
import Pagination from '../../../components/Pagination';
import Swal from 'sweetalert2'; // 공통 팝업창

const PartnerBidStatus = () => {

    //조회 결과
    const [list, setList] = useState([]);

    //조회조건
    const [srcData, setSrcData] = useState({
        bidNo : ''
    ,   bidName : ''
    ,   bidModeA : true
    ,   bidModeB : true
    ,   esmtYnN : true
    ,   esmtYnY : true
    ,	size : 10						//10개씩 보기
    ,	page : 0						//클릭한 페이지번호
    });

    const onChangeSrcData = (e) => {
        setSrcData({
            ...srcData,
            [e.target.name]: (e.target.className == 'checkStyle') ? e.target.checked : e.target.value
        });
    }

    const onSearch = useCallback(async() => {
        try {
            const response = await axios.post("/api/v1/bidPtStatus/statuslist", srcData);
            setList(response.data.data);
        } catch (error) {
            Swal.fire('', '조회에 실패하였습니다.', 'error');
            console.log(error);
        }
    });

    useEffect(() => {
        onSearch();
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
                            <input type="text" className="inputStyle" placeholder="" onChange={onChangeSrcData} name="bidNo" onKeyUp={(e) => { if(e.key === 'Enter') onSearch()}} maxLength="10" />
                        </div>
                        <div className="sbTit mr30 ml50">입찰명</div>
                        <div className="width250px">
                            <input type="text" className="inputStyle" placeholder="" onChange={onChangeSrcData} name="bidName" onKeyUp={(e) => { if(e.key === 'Enter') onSearch()}} maxLength="50" />
                        </div>
                    </div>
                    <div className="flex align-items-center height50px mt10">
                        <div className="sbTit mr30">입찰방식</div>
                        <div className="flex align-items-center width100">
                            <input type="checkbox" id="progress1-1" className="checkStyle" onClick={onChangeSrcData} name="bidModeA" defaultChecked={srcData.bidModeA} /><label htmlFor="progress1-1">지명</label>
                            <input type="checkbox" id="progress1-2" className="checkStyle" onClick={onChangeSrcData} name="bidModeB" defaultChecked={srcData.bidModeB} /><label htmlFor="progress1-2" className="ml50">일반</label>
                        </div>
                        <div className="sbTit mr30 ml50">투찰상태</div>
                        <div className="flex align-items-center width100">
                            <input type="checkbox" id="s1-1" className="checkStyle" onClick={onChangeSrcData} name="esmtYnN" defaultChecked={srcData.esmtYnN} /><label htmlFor="s1-1">미투찰(재입찰 포함)</label>
                            <input type="checkbox" id="s1-2" className="checkStyle" onClick={onChangeSrcData} name="esmtYnY" defaultChecked={srcData.esmtYnY} /><label htmlFor="s1-2" className="ml50">투찰</label>
                        </div>
                        <a className="btnStyle btnSearch" onClick={onSearch}>검색</a>
                    </div>
                </div>
                {/* //searchBox */}

                <div className="width100">
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
                        { list.content?.map((data) => <List key={data.biNo} data={data} />) }
                        { (list.content == null || list.content.length == 0)&&
                        <tr>
                            <td className="end" colSpan="8">조회된 데이터가 없습니다.</td>
                        </tr> }
                    </tbody>
                </table>

                {/* pagination */}
                <div className="row mt40">
                    <div className="col-xs-12">
                        <Pagination onChangeSrcData={onChangeSrcData} list={list} />
                    </div>
                </div>
                {/* //pagination */}
            </div>
            {/* //contents */}
        </div>
    )
}

export default PartnerBidStatus