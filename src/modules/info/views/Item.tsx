import React, { useCallback, useEffect, useState, useRef } from 'react'
import axios from 'axios';
import Pagination from '../../../../src/components/Pagination';
import Swal from 'sweetalert2'; // 공통 팝업창
import ItemList from '../components/ItemList';
import ItemPop from '../components/ItemPop';
import { MapType } from '../../../../src/components/types'
import SrcInput from '../../../../src/components/input/SrcInput'
import SelectListSize from '../../../../src/components/SelectListSize'
import SrcSelectBox from '../../../../src/components/input/SrcSelectBox'
import { Button } from 'react-bootstrap';

interface PopUpRef {
    onOpenPop: (props: any) => void;
}

const Item = () => {

    //모달창 띄우기
    const [isModalOpen, setIsModalOpen] = useState(false);

    //품목그룹
    const [itemGrpList, setItemGrpList] = useState([{} as MapType]);

    //조회 결과
    const [itemList, setItemList] = useState({
        totalElements   : 0,
        content         : [{}]
    });

    //조회조건
    const [srcData, setSrcData] = useState<MapType>({
        itemCode: '',
        itemName: '',
        itemGrp: '',
        useYn: 'Y',
        nonPopYn :'Y',
        size    : 10,
        page    : 0
    });

    const [useYnOptionList, setUseYnOptionList] = useState([{"value" : "Y", "name" : "사용"}, {"value" : "N", "name" : "미사용"}])

    //품목그룹 조회
    const onSelectItemGrpList = async() => {
        try {
            const response = await axios.post("/api/v1/item/itemGrpList", {});
            if (response.data.code === 'OK') {
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
            const response = await axios.post("/api/v1/item/itemList", srcData);

            if (response.data.code === 'OK') {
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

    const itemPopRef = useRef<PopUpRef | null>(null);

    //팝업창 띄우기
    const onCallPopMethod = useCallback((props: any) => {
        setIsModalOpen(true);
        if (itemPopRef.current) {
            itemPopRef.current.onOpenPop(props);
        }
    }, []);


    //팝업창 닫기
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
                            <SrcSelectBox   name={"itemGrp"} optionList={itemGrpList} valueKey="itemCode" nameKey="itemName" onSearch={ onSearch } srcData={ srcData } setSrcData={ setSrcData } />
                        </div>
                        <div className="sbTit width100px ml50">사용여부</div>
                        <div className="flex align-items-center width250px">
                            <SrcSelectBox   name={"useYn"} optionList={useYnOptionList} valueKey="value" nameKey="name" onSearch={ onSearch } srcData={ srcData } setSrcData={ setSrcData } />
                        </div>
                    </div>
                    <div className="flex align-items-center height50px mt10">
                        <div className="sbTit width100px">품목코드</div>
                        <div className="flex align-items-center width250px">
                            <SrcInput name="itemCode" onSearch={ onSearch } srcData={ srcData } setSrcData={ setSrcData } maxLength={ 300 } />
                        </div>
                        <div className="sbTit width100px ml50">품목명</div>
                        <div className="width250px">
                            <SrcInput name="itemName" onSearch={ onSearch } srcData={ srcData } setSrcData={ setSrcData } maxLength={ 300 } />
                        </div>
                        <Button onClick={(e)=>{ srcData.page = 0; onSearch();}}  className="btnStyle btnSearch">검색</Button>
                    </div>
                </div>

                <div className="flex align-items-center justify-space-between mt40">
                    <div className="width100">
                        전체 : <span className="textMainColor"><strong>{ itemList.totalElements ? itemList.totalElements.toLocaleString() : 0 }</strong></span>건
                        <SelectListSize onSearch={ onSearch } srcData={ srcData } setSrcData={ setSrcData } />
                    </div>
                    <div className="flex-shrink0">
                        <Button onClick={()=>onCallPopMethod("")} data-toggle="modal" data-target="#itemInfoPop" className="btnStyle btnPrimary" title="품목 등록">품목 등록</Button>
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
                        { itemList.content?.map((item, index) => <ItemList  key={index} item={item} onCallPopMethod={onCallPopMethod}/>)}
                        { itemList.totalElements == 0 &&
                            <tr>
                                <td className="end" colSpan={6}>조회된 데이터가 없습니다.</td>
                            </tr> }
                    </tbody>
                </table>
                <div className="row mt40">
                    <div className="col-xs-12">
                        <Pagination srcData={ srcData } setSrcData={ setSrcData } list={itemList} />
                    </div>
                </div>
            </div>
            <ItemPop ref={itemPopRef} isOpen={isModalOpen} onClose={onCloseModal} onSearch={onSearch} />
        </div>
    );

}

export default Item;