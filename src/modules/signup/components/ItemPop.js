import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import Pagination from '../../../components/Pagination';

const ItemPop = ({itemPop, setItemPop, popClick}) => {

    const initSearchParams = {
        size: 5,
		itemGrp: '',
		useYn : 'Y',
		itemName : '',
        page : 0
    };

    const [searchParams, setSearchParams] = useState(initSearchParams);
    const [itemGrpList, setItemGrpList] = useState([]); 
    const [checkInput, setCheckInput] = useState(false); 
    const [listPage, setListPage] = useState({});

    const init = () => {
        axios.post("/login/itemGrpList", initSearchParams).then((response) => {
            const result = response.data;
            if(response.status === 200) {
                setItemGrpList(result);
                search(0);
            } else {
                Swal.fire('', '품목 불러오기에 실패하였습니다.', 'error');
            }
        });
    }

    useEffect(() => {
        if(itemPop) {
            setSearchParams(initSearchParams);
            setCheckInput(false);
            init();
        }
    }, []);

    useEffect(() => {
        // input에서 파라미터가 세팅되는경우 자동검색이 되어 checkInput 으로 케이스 처리함
        if(!checkInput) {
            retrieve();
        }
    }, [searchParams]);

    const selectData = (val) => {
        popClick(val);
        setItemPop(false);
    }  

    const itemGrpChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prevState) => ({
            ...prevState,
            [name]: value,
            page : 0
        }));
    };

    const onChangeSrcData = (e) => {
        setSearchParams((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    }

    const onChangeInput = (e) => {
        setSearchParams((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
        setCheckInput(true);
    }

    const search = (page) => {
        setCheckInput(false);
        setSearchParams((prevState) => ({
            ...prevState,
            page : page
        }));
    }

    const retrieve = () => {
        const params = searchParams;
        axios.post("/login/itemList", params).then((response) => {
            const result = response.data;
            if(response.status === 200) {
                setListPage(result.data);
            } else {
                Swal.fire('', '품목 불러오기에 실패하였습니다.', 'error');
            }
        });
    };
    const handleKeyDown = (e) => {
        if(e.key === "Enter") {
            e.preventDefault();
            search(0);
        }
    }

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
                                <select name="itemGrp" value={searchParams.itemGrp} onChange={itemGrpChange} className="selectStyle">
									<option value="">품목그룹 전체</option>

                                    {itemGrpList.map((val, idx) => (
                                    <option key={idx} value={val.itemGrpCd}>
                                        {val.grpNm}
                                    </option>
                                    ))}
								</select>
								<input name="itemName" type="text" value={searchParams.itemName} onChange={onChangeInput} onKeyDown={handleKeyDown} className="inputStyle mt10" placeholder="품목명 또는 품목코드 입력 조회" />
							</div>
							<a onClick={() => search(0)} className="btnStyle btnSearch">검색</a>
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
                            <Pagination onChangeSrcData={onChangeSrcData} list={listPage} />
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
