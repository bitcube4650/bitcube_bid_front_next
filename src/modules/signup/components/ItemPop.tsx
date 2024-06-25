import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import { MapType } from '../../../components/types';
import Pagination from '../../../components/Pagination';
import SrcInput from '../../../components/input/SrcInput';
import SrcSelectBox from '../../../components/input/SrcSelectBox';

interface ItemPopProps {
    itemPop : boolean;
    setItemPop : React.Dispatch<React.SetStateAction<boolean>>;
    popClick: (val: any) => void;
}

interface ListPage {
    content?: Array<{ itemCode: string; itemName: string }>;
}

const ItemPop: React.FC<ItemPopProps> = ({itemPop, setItemPop, popClick}) => {

    const initSearchParams = {
        size: 5,
		itemGrp: '',
		useYn : 'Y',
		itemName : '',
        page : 0
    };

    const [srcData, setSrcData] = useState<MapType>({
        size: 5,
		itemGrp: '',
		useYn : 'Y',
		itemName : '',
        page : 0
    });

    const [itemGrpList, setItemGrpList] = useState<MapType[]>([]); 
    const [listPage, setListPage] = useState<ListPage>({});

    const init = () => {
        setSrcData(initSearchParams);
        axios.post("/login/itemGrpList", initSearchParams).then((response) => {
            const result = response.data;
            if(response.status === 200) {
                setItemGrpList(result);
                onSearch();
            } else {
                Swal.fire('', '품목 불러오기에 실패하였습니다.', 'error');
            }
        });
    }

    useEffect(() => {
        if(itemPop) {
            init();
        }
    }, [itemPop]);

    useEffect(() => {
        onSearch();
    },[srcData.size, srcData.page]);

    const selectData = (val: any) => {
        popClick(val);
        setItemPop(false);
    }  

    const onSearch = useCallback(async () => {
        try {
          const response = await axios.post('/login/itemList', srcData);
          setListPage(response.data.data);
        } catch (error) {
            Swal.fire('', '품목 불러오기에 실패하였습니다.', 'error');
        }
      }, [srcData]);

    return (
        <div>
            <Modal show={itemPop} onHide={() => {setItemPop(false)}} className="modalStyle" size="lg">
                <Modal.Body>
                    <a onClick={() => {setItemPop(false)}} className="ModalClose" data-bs-dismiss="modal" title="닫기"><i className="fa-solid fa-xmark"></i></a>
                    <h2 className="modalTitle">품목 선택</h2>
                    <div className="modalTopBox">
                        <ul>
                        <li><div>검색 창에 품목명 또는 품목코드를 입력하시고 엔터 또는 [품목조회] 버튼을 클릭하시고 폼목을 선택해 주십시오.</div></li>
                        <li><div>품목코드는 2017년부터 적용되는 한국표준산업분류 10차 개정 자료를 기준으로 합니다.</div></li>
                        </ul>
                    </div>

                    <div className="modalSearchBox mt20">						
						<div className="flex align-items-center">
							<div style={{ width:'calc(100% - 120px)'}}>
                                <SrcSelectBox name='itemGrp' optionList={itemGrpList} valueKey='value' nameKey='name' onSearch={ onSearch } srcData={ srcData } setSrcData={ setSrcData }/>
                                <SrcInput name="itemName" srcData={ srcData } setSrcData={ setSrcData } onSearch={ onSearch } className="mt10" />
							</div>
							<a onClick={onSearch} className="btnStyle btnSearch">검색</a>
						</div>
					</div>

                    <table className="tblSkin1 mt30">
						<colgroup>
							<col style={{}} />
						</colgroup>
						<thead>
							<tr>
								<th>품목코드</th>
								<th>품목명</th>
								<th className="end" style={{width: "106px"}}>선택</th>
							</tr>
						</thead>
						<tbody>
                            {listPage.content?.map((val, idx) => (
                                <tr key={idx}>
                                    <td>{val.itemCode}</td>
                                    <td className="text-left">{val.itemName}</td>
                                    <td className="end">
                                        <button onClick={(e) => { e.preventDefault(); selectData(val); }} className="btnStyle btnSecondary btnSm" title="선택">선택</button>
                                    </td>
                                </tr>
                            ))}
						</tbody>
					</table>

                    {/* pagination */}
                    <div className="row mt30">
                        <div className="col-xs-12">
                            <Pagination srcData={ srcData } setSrcData={ setSrcData } list={ listPage } />
                            {/* <Pagination srcData={onChangeSrcData} list={listPage} /> */}
                        </div>
                    </div>
                    {/* //pagination */}
                    
                    <div className="modalFooter">
                        <Button variant="secondary" onClick={() => {setItemPop(false)}} style={{ marginRight: '10px'}}>닫기</Button>
                    </div>

                </Modal.Body>
            </Modal>
        </div>
    );
}

export default ItemPop;
