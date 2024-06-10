import React, { useImperativeHandle, forwardRef, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // 공통 팝업창
import Modal from 'react-bootstrap/Modal';

const ItemPop = forwardRef(({ isOpen, onClose, onSearch }, ref) => {
    const [itemId, setItemId] = useState('');
    const [detail, setDetail] = useState({ itemCode: '', itemGrpCd: '', itemName: '', useYn: 'Y' });
    const [itemGrpList, setItemGrpList] = useState([]);


    //품목 상세 조회
    const onSelectDetail = async (id) => {
        const searchParams = { itemCodeDetail: id, nonPopYn: 'Y' };
        try {
            const response = await axios.post("/api/v1/item/itemList", searchParams);
            if (response.data.code == 'OK') {
                setDetail(response.data.data.content[0]);
            }else{
                Swal.fire('', '품목 상세 조회에 실패하였습니다.', 'error');
                console.log(response.data.data);
            }
            
        } catch (error) {
            Swal.fire('', '품목 상세 조회에 실패하였습니다.', 'error');
            console.log(error);
        }
    };

    //품목 그룹 리스트 조회
    const onSelectItemGrpList = async () => {
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

    //팝업창 열었을때 데이터 조회 및 초기화
    const onOpenPop = (props) => {
        
        setItemId(props);
        onSelectItemGrpList();
        setDetail({ itemCode: '', itemGrpCd: '', itemName: '', useYn: 'Y' });
        
        if (props) {
            onSelectDetail(props);
        }
    };

    //등록 및 수정시 작성한 내용 detail에 담기
    const onChangeDetail = (e) => {
        let value1 = e.target.value;

        if (e.target.name === 'itemCode') {//품목코드 숫자만 입력 가능
            
            value1 = value1.replace(/\D/g, '');

        }
        setDetail(prevDetail => ({
            ...prevDetail,
            [e.target.name]: value1
        }));
    };

    //유효성 체크
    const onCheckValid = () => {

        let isValid = true;

        if (detail.itemCode == null || detail.itemCode == '') {
            Swal.fire('', '품목코드를 입력해주세요.', 'warning');
			isValid = false;
		}else if (detail.itemGrpCd == null || detail.itemGrpCd == '') {
            Swal.fire('', '품목그룹을 선택해주세요.', 'warning');
			isValid = false;
		}else if (detail.itemName == null || detail.itemName == '') {
            Swal.fire('', '품목명을 입력해주세요.', 'warning');
			isValid = false;
		}else if (detail.useYn == null || detail.useYn == '') {
            Swal.fire('', '사용여부를 선택해주세요.', 'warning');
			isValid = false;
		}

        if (isValid) {
            return Promise.resolve();
        } else {
            return Promise.reject('유효성 검사 실패');
        }
    }

    //등록 및 수정
    const onSave = async() => {

        try {
            //유효성 체크
            await onCheckValid();
            
            //등록
            if(!itemId){

                try {
                    const response = await axios.post("/api/v1/item/save", detail);
                
                    if (response.data.code == 'OK') {
                        Swal.fire('', '저장되었습니다.', 'success');
                    } else if(response.data.code == 'DUP'){
                        Swal.fire('', '이미 등록된 품목코드가 존재합니다.', 'warning');
                        return;
                    } else {
                        Swal.fire('', '저장 중 오류가 발생했습니다.', 'error');
                    }
                } catch (error) {
                    Swal.fire('', '저장 중 오류가 발생했습니다.', 'error');
                    console.log(error);
                }
                
            }
            //수정
            else{

                try {
                    const response = await axios.post("/api/v1/item/saveUpdate", detail);
                
                    if (response.data.code == 'OK') {
                        Swal.fire('', '저장되었습니다.', 'success');
                    } else if(response.data.code == 'DUP'){
                        Swal.fire('', '이미 등록된 품목코드가 존재합니다.', 'warning');
                        return;
                    } else {
                        Swal.fire('', '저장 중 오류가 발생했습니다.', 'error');
                    }
                } catch (error) {
                    Swal.fire('', '저장 중 오류가 발생했습니다.', 'error');
                    console.log(error);
                }
            }

            onClose();
            onSearch();
        } catch (error) {
            console.log(error); // "유효성 검사 실패"
        }


    };

    //부포 컴포넌트가 onOpenPop을 사용할 수 있도록
    useImperativeHandle(ref, () => ({
        onOpenPop
    }), [isOpen]);

    return (
        <Modal className="modalStyle" id="itemPop" show={isOpen} onHide={onClose} keyboard={true} >
            <Modal.Body className="modal-body">
                <a onClick={onClose} className="ModalClose" title="닫기"><i className="fas fa-times"></i></a>
                <h2 className="modalTitle">품목 {itemId ? '수정' : '등록'}</h2>
                <div className="flex align-items-center">
                    <div className="formTit flex-shrink0 width120px">품목코드 <span className="star">*</span></div>
                    <div className="width100"><input type="text" value={detail.itemCode} onChange={onChangeDetail} name="itemCode" readOnly={!!itemId} maxLength="10" className="inputStyle" placeholder="숫자만 입력하세요" /></div>
                </div>
                <div className="flex align-items-center mt20">
                    <div className="formTit flex-shrink0 width120px">품목그룹</div>
                    <div className="width100">
                        <select value={detail.itemGrpCd} onChange={onChangeDetail} name="itemGrpCd" className="selectStyle">
                            <option value="">선택</option>
                            {itemGrpList?.map((itemGrp) => <option key={itemGrp.itemGrpCd} value={itemGrp.itemGrpCd}>{itemGrp.grpNm}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex align-items-center mt20">
                    <div className="formTit flex-shrink0 width120px">품목명 <span className="star">*</span></div>
                    <div className="width100"><input type="text" value={detail.itemName} onChange={onChangeDetail} name="itemName" className="inputStyle" placeholder="품목명을 입력하세요" /></div>
                </div>
                <div className="flex align-items-center mt10">
                    <div className="formTit flex-shrink0 width120px">사용여부 <span className="star">*</span></div>
                    <div className="width100">
                        <select value={detail.useYn} onChange={onChangeDetail} name="useYn" className="selectStyle">
                            <option value="Y">사용</option>
                            <option value="N">미사용</option>
                        </select>
                    </div>
                </div>

                <div className="modalFooter">
                    <a onClick={onClose} className="modalBtnClose" title="취소">취소</a>
                    <a onClick={onSave} className="modalBtnCheck" title="저장">저장</a>
                </div>
            </Modal.Body>
        </Modal>
    )
});

export default ItemPop;