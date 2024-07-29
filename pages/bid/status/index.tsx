import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // 공통 팝업창
import { MapType } from '../../../src/components/types';
import SrcInput from '../../../src/components/input/SrcInput';
import SrcCheck from '../../../src/components/input/SrcCheckBox'
import SelectListSize from '../../../src/components/SelectListSize';
import Pagination from '../../../src/components/Pagination';
import List from '../../../src/modules/bid/components/BidStatusList';

const Index = () => {

    //useEffect 안에 onSearch 한번만 실행하게 하는 플래그
    const isMounted = useRef<Boolean>(true);

    //조회 결과
    const [list, setList] = useState<MapType>({
        totalElements   : 0,
        val         : [{}]
    });

    //조회조건
    const [srcData, setSrcData] = useState<MapType>({
        bidNo : ''
    ,   bidName : ''
    ,   rebidYn: true
    ,   dateOverYn: true
    ,   openBidYn: true
    ,	size : 10
    ,	page : 0
    });

    const onSearch = useCallback(async() => {
        await axios.post("/api/v1/bidstatus/statuslist", srcData).then((response) =>{
            if (response.data.code === "OK") {
                setList(response.data.data);
            } else {
                Swal.fire('', '조회에 실패하였습니다.', 'error');
            }
        })
    }, [srcData]);

    //마운트 완료 후 검색
    useEffect(() => {
        if (isMounted.current) {
            isMounted.current = false;
        } else {
            onSearch();
        }
    },[srcData.size, srcData.page]);

    const onPageInit = () => {
		if(srcData.page === 0){
			onSearch()
		} else {
			setSrcData({
				...srcData,
				page : 0
			})
		}
    }

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
                                <SrcInput onSearch={onPageInit} name="bidNo" srcData={ srcData } setSrcData={ setSrcData } maxLength={ 10 } />
                            </div>
                            <div className="sbTit mr30 ml50">입찰명</div>
                            <div className="width250px">
                                <SrcInput onSearch={onPageInit} name="bidName" srcData={ srcData } setSrcData={ setSrcData } maxLength={ 50 }/>
                            </div>
                        </div>
                        <div className="flex align-items-center height50px mt10">
                            <div className="sbTit mr30">진행상태</div>
                            <div className="flex align-items-center width100">
                                <SrcCheck id="progress1-1" name="rebidYn" srcData={ srcData } setSrcData={ setSrcData } defaultChecked={srcData.rebidYn} text="입찰공고(재입찰 포함)" />
                                <SrcCheck id="progress1-2" name="dateOverYn" srcData={ srcData } setSrcData={ setSrcData } defaultChecked={srcData.dateOverYn} text="입찰공고(개찰대상)" />
                                <SrcCheck id="progress1-3" name="openBidYn" srcData={ srcData } setSrcData={ setSrcData } defaultChecked={srcData.openBidYn} text="개찰(업체선정대상)" />
                            </div>
                            <a className="btnStyle btnSearch" onClick={onPageInit}>검색</a>
                        </div>
                    </div>
                    {/* searchBox  */}

                    <div className="flex align-items-center justify-space-between mt40">
                        <div className="width100">
                            전체 : <span className="textMainColor"><strong>{ list.totalElements ? list.totalElements.toLocaleString() : 0 }</strong></span>건
                            <SelectListSize onSearch={ onPageInit } srcData={ srcData } setSrcData={ setSrcData } />
                        </div>
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
                            { list.content?.map((data: MapType) => <List key={data.biNo} val={data} />) }
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
                 {/* contents  */}
            </div>
             {/* 본문  */}
        </div>
    )
}

export default Index
