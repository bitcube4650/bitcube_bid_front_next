import React, { useCallback, useEffect, useState, useRef } from 'react'
import axios from 'axios';
import Pagination from 'components/Pagination';
import Swal from 'sweetalert2'; // 공통 팝업창
import ItemList from '../components/ItemList';
import ItemPop from '../components/ItemPop';

const Item = () => {

    //모달창 띄우기
    const [isModalOpen, setIsModalOpen] = useState(false);

    //품목그룹
    const [itemGrpList, setItemGrpList] = useState([]);

    //조회 결과
    const [itemList, setItemList] = useState([]);

    //조회조건
    const [srcData, setSrcData] = useState({
        itemCode: '',
        itemName: '',
        itemGrp: '',
        useYn: 'Y',
        nonPopYn :'Y',
        size    : 10,
        page    : 0
    });

    const onChangeSrcData = useCallback((e) => {
        
        setSrcData({
            ...srcData,
            [e.target.name]: e.target.value
        });
        
    },[srcData]);

    //품목그룹 조회
    const onSelectItemGrpList = async() => {
        try {
            const response = await axios.post("/api/v1/item/itemGrpList", {});
            if (response.data.code == 'OK') {
                setItemGrpList(response.data.data);
            }else{
                Swal.fire('', '품목그룹 조회에 실패하였습니다.', 'error');
                console.log(response.data.data);
            }
            
        } catch (error) {
            Swal.fire('', '품목그룹 조회에 실패하였습니다.', 'error');
            console.log(error);
        }
    };

    //품목 조회
    const onSearch = useCallback(async() => {
        try {
            setSrcData(srcData);
            const response = await axios.post("/api/v1/item/itemList", srcData);

            if (response.data.code == 'OK') {
                setItemList(response.data.data);
            }else{
                Swal.fire('', '조회에 실패하였습니다.', 'error');
                console.log(response.data.data);
            }
            
        } catch (error) {
            Swal.fire('', '조회에 실패하였습니다.', 'error');
            console.log(error);
        }
    }, [srcData]);

    const itemPopRef = useRef();

    //팝업창 띄우기
    const onCallPopMethod = useCallback((props) => {

        setIsModalOpen(true);
        if (itemPopRef.current) {
            itemPopRef.current.onOpenPop(props);
        }

    }, []);

    
    const onCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    useEffect(() => {
        onSelectItemGrpList();
        onSearch();
    },[srcData.size, srcData.page]);

    return (
        <div className="conRight">
            <div className="conHeader">
                <ul className="conHeaderCate">
                    <li>정보관리</li>
                    <li>품목정보관리</li>
                </ul>
            </div>
            <div className="contents">
                <div className="conTopBox">
                    <ul className="dList">
                        <li><div>협력사 등록(업체유형)과 입찰 생성(입찰 품목) 시 필요한 항목입니다.</div></li>
                        <li><div>품목코드 및 품목명을 클릭하면 품목을 수정할 수 있습니다. (등록된 품목 코드는 수정할 수 없습니다)</div></li>
                        <li><div>품목 코드는 중복될 수 없습니다.</div></li>
                    </ul>
                </div>
                <div className="searchBox mt20">
                    <div className="flex align-items-center">
                        <div className="sbTit width100px">품목그룹</div>
                        <div className="flex align-items-center width250px">
                            <select onChange={onChangeSrcData} name="itemGrp" className="selectStyle">
                                <option value="">전체</option>
                                { itemGrpList?.map((itemGrp) => <option key={itemGrp.itemGrpCd} value={itemGrp.itemGrpCd}>{itemGrp.grpNm}</option>) }
                            </select>
                        </div>
                        <div className="sbTit width100px ml50">사용여부</div>
                        <div className="flex align-items-center width250px">
                            <select onChange={onChangeSrcData} name="useYn" className="selectStyle">
                                <option value="">전체</option>
                                <option value="Y">사용</option>
                                <option value="N">미사용</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex align-items-center height50px mt10">
                        <div className="sbTit width100px">품목코드</div>
                        <div className="flex align-items-center width250px">
                            <input type="text" onChange={onChangeSrcData} name="itemCode" className="inputStyle" placeholder="" maxLength="300" onKeyDown={(e) => { if(e.key === 'Enter'){ srcData.page = 0; onSearch()}}}/>
                        </div>
                        <div className="sbTit width100px ml50">품목명</div>
                        <div className="width250px">
                            <input type="text" onChange={onChangeSrcData} name="itemName" className="inputStyle" placeholder="" maxLength="300" onKeyDown={(e) => { if(e.key === 'Enter'){ srcData.page = 0; onSearch()}}}/>
                        </div>
                        <a onClick={(e)=>{ srcData.page = 0; onSearch();}}  className="btnStyle btnSearch">검색</a>
                    </div>
                </div>

                <div className="flex align-items-center justify-space-between mt40">
                    <div className="width100">
                        전체 : <span className="textMainColor"><strong>{ itemList.totalElements ? itemList.totalElements.toLocaleString() : 0 }</strong></span>건
                        <select onChange={onChangeSrcData} name="size"  className="selectStyle maxWidth140px ml20">
                            <option value="10">10개씩 보기</option>
                            <option value="20">20개씩 보기</option>
                            <option value="30">30개씩 보기</option>
                            <option value="50">50개씩 보기</option>
                        </select>
                    </div>
                    <div className="flex-shrink0">
                        <a onClick={()=>onCallPopMethod()} data-toggle="modal" data-target="#itemInfoPop" className="btnStyle btnPrimary" title="품목 등록">품목 등록</a>
                    </div>
                </div>

                <table className="tblSkin1 mt10">
                    <colgroup>
                        <col style={{width:'7%'}} />
                        <col />
                        <col style={{width:'10%'}} />
                        <col style={{width:'10%'}} />
                        <col style={{width:'10%'}} />
                        <col style={{width:'13%'}} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>품목코드</th>
                            <th>품목명</th>
                            <th>품목그룹</th>
                            <th>사용여부</th>
                            <th>등록자</th>
                            <th className="end">등록일시</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemList.content?.map((item) => <ItemList  key={item.itemCode} item={item} onCallPopMethod={onCallPopMethod}/>)}
                        { itemList.totalElements == 0 &&
                            <tr>
                                <td className="end" colSpan="6">조회된 데이터가 없습니다.</td>
                            </tr> }
                    </tbody>
                </table>
                <div className="row mt40">
                    <div className="col-xs-12">
                        <Pagination onChangeSrcData={onChangeSrcData} list={itemList}/>
                    </div>
                </div>
            </div>
            <ItemPop ref={itemPopRef} isOpen={isModalOpen} onClose={onCloseModal} onSearch={onSearch} />
        </div>
    );

}

export default Item;