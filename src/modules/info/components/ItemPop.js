import React, { useImperativeHandle, forwardRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

const ItemPop = forwardRef(({ isOpen, onClose }, ref) => {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // 스크롤 비활성화
        } else {
            document.body.style.overflow = 'visible'; // 스크롤 다시 활성화
        }
    }, [isOpen]);

    const openPop = (props) => {
        console.log('props', props);
        console.log('isOpen', isOpen);
        if (props) {
            console.log('수정 메서드 호출됨!');
        } else {
            console.log('등록 메서드 호출됨!');
        }
    };

    useImperativeHandle(ref, () => ({
        openPop
    }), [isOpen]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <>
            <div className="modal-backdrop show"></div> {/* 모달 배경 */}
            <div className="modal" tabIndex="-1" style={{ display: 'block' }}>
                <div className="modal-dialog" style={{ width: '100%', maxWidth: '500px' }}>
                    <div className="modal-content">
                        <div className="modal-body">
                            <a onClick={onClose} className="ModalClose" title="닫기"><i className="fas fa-times"></i></a>
                            <h2 className="modalTitle">품목 등록</h2>
                            <div className="flex align-items-center">
                                <div className="formTit flex-shrink0 width120px">품목코드 <span className="star">*</span></div>
                                <div className="width100"><input type="text" maxLength="10" className="inputStyle" placeholder="숫자만" /></div>
                            </div>
                            <div className="flex align-items-center mt20">
                                <div className="formTit flex-shrink0 width120px">품목그룹</div>
                                <div className="width100">
                                    <select className="selectStyle">
                                        <option value="">선택</option>
                                        {/* itemGrpList를 사용하여 옵션을 생성하는 코드를 여기에 작성 */}
                                    </select>
                                </div>
                            </div>
                            <div className="flex align-items-center mt20">
                                <div className="formTit flex-shrink0 width120px">품목명 <span className="star">*</span></div>
                                <div className="width100"><input type="text" className="inputStyle" placeholder="" /></div>
                            </div>
                            <div className="flex align-items-center mt10">
                                <div className="formTit flex-shrink0 width120px">사용여부 <span className="star">*</span></div>
                                <div className="width100">
                                    <select className="selectStyle">
                                        <option value="Y">사용</option>
                                        <option value="N">미사용</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modalFooter">
                                <a onClick={onClose} className="modalBtnClose" title="취소">취소</a>
                                <a className="modalBtnCheck" title="저장">저장</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
});

export default ItemPop;