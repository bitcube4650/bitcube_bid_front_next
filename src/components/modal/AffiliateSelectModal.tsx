import React, { useCallback, useState, useEffect } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2'; // 공통 팝업창
import Modal from 'react-bootstrap/Modal';
import { affiliateProps } from 'components/types'
import { MapType } from 'components/types'

/*
계열사 선택 modal

사용할 화면에

const [affiliateSelectData, setAffiliateSelectData] = useState({
    show: false
});

...

<AffiliateSelectModal affiliateSelectData={ affiliateSelectData } setAffiliateSelectData={ setAffiliateSelectData } />

해당 코드를 넣어준다.

계열사 체크 후 선택 버튼을 누르면
affiliateSelectData.interrelatedCodes = 체크한 계열사 코드 리스트
affiliateSelectData.interrelatedNms = 체크한 계열사명 String
affiliateSelectData.isChange = true
로 변경된다.
*/

const AffiliateSelectModal = (props: affiliateProps) => {
    const affiliateSelectData = props.affiliateSelectData;
    const setAffiliateSelectData = props.setAffiliateSelectData;

    const onCloseAffiliateSelectModal = useCallback(() => {
        setAffiliateSelectData({...affiliateSelectData, ["show"]: false});
    }, [])

    const loginInfo = JSON.parse(localStorage.getItem("loginInfo") as string);

    const [allAffiliateList, setAllAffiliateList] = useState<MapType>([]);
    const [affiliateList, setAffiliateList] = useState<MapType>([]);
    const [selectAffiliateList, setSelectAffiliateList] = useState<Array<String>>([]);

    async function onSelecAffiliate() {
        if(loginInfo.custType == 'inter' && loginInfo.userAuth == '1') {    //시스템관리자인 경우
            onSelectAffiliateList();
        } else {
            //자신이 속한 계열사만 선택 가능
			setAllAffiliateList([{
                interrelatedCustCode: loginInfo.custCode,
                interrelatedNm: loginInfo.custName
            }]);
        }
    };

    async function onSelectAffiliateList() {
        try {
            const response = await axios.post('/login/interrelatedList');
            if(response.status == 200) {
                setAllAffiliateList(response.data);

                let interrelatedCodes = [''];
                if(affiliateSelectData && affiliateSelectData.interrelatedCodes) {
                    interrelatedCodes = affiliateSelectData.interrelatedCodes;
                    setSelectAffiliateList(interrelatedCodes);
                    for(let i = 0; i < interrelatedCodes.length; i++) {
                        for(let j = 0; j < response.data.length; j++) {
                            if(interrelatedCodes[i] == response.data[j].interrelatedCustCode) {
                                response.data[j].checked = true;
                            }
                        }
                    }
                }

                setAffiliateList(response.data);
            } else {
                Swal.fire('계열사 조회에 실패하였습니다.', '', 'error');
            }
        } catch (error) {
            Swal.fire('계열사 조회에 실패하였습니다.', '', 'error');
            console.log(error);
        }
    };

    useEffect(() => {
        onSelecAffiliate();
        setAffiliateSelectData({
            ...affiliateSelectData,
            ['isChange']: false
        });
    }, [affiliateSelectData.show]);

    function onSelectAffiliate() {
        let interrelatedNms = "";

        for(let i = 0; i < selectAffiliateList.length; i++) {
            for(let j = 0; j < allAffiliateList.length; j++) {
                if(selectAffiliateList[i] == allAffiliateList[j].interrelatedCustCode) {
                    interrelatedNms += interrelatedNms != "" ? ",":"";
                    interrelatedNms += allAffiliateList[j].interrelatedNm;
                }
            }
        }

        setAffiliateSelectData({
            ...affiliateSelectData,
            ['interrelatedCodes']: selectAffiliateList,
            ['interrelatedNms']: interrelatedNms,
            ['isChange']: true,
            ['show']: false
        });
    }

    const onChangeAffiliate = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.checked) {
            let check = true;

            for(let i = 0; i < selectAffiliateList.length; i++) {
                if(selectAffiliateList[i] == e.target.value) {
                    check = false;
                }
            }
    
            if(check) {
                setSelectAffiliateList([
                    ...selectAffiliateList,
                    e.target.value
                ]);
            }
        } else {
            setSelectAffiliateList(
                selectAffiliateList.filter(item => item !== e.target.value)
            );
        }
    }

    return (
        <Modal className="modalStyle" id="AffiliateSelect" show={affiliateSelectData.show} onHide={onCloseAffiliateSelectModal} keyboard={true} dialogClassName="modal-lg">
            <Modal.Body>
                <a onClick={onCloseAffiliateSelectModal} className="ModalClose" data-bs-dismiss="modal" title="닫기"><i className="fa-solid fa-xmark"></i></a>
                <h2 className="modalTitle">계열사 선택</h2>
                    <div className="modalTopBox">
                        <ul>
                        <li><div>공지 할 계열사를 선택해 주십시오.</div></li>
                        </ul>
                    </div>
                    <table className="tblSkin1 mt20">
                        <colgroup>
                            <col style={{width:'100px'}} />
                            <col />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>선택</th>
                                <th className="end">계열사</th>
                            </tr>
                        </thead>
                        <tbody>
                            { affiliateList?.map((affiliate: MapType, index: number) => (
                                <tr key={ index }>
                                    <td>
                                        <input onChange={ onChangeAffiliate } type="checkbox" id={ 'ck' + index } value={ affiliate.interrelatedCustCode } className="checkStyle" defaultChecked={ affiliate.checked } disabled={ loginInfo.custType == 'inter' && loginInfo.userAuth == '2' } />
                                        <label htmlFor={ 'ck' + index }></label>
                                    </td>
                                    <td className="text-left end">
                                        <label htmlFor={ 'ck' + index } className="fontweight-400">{ affiliate.interrelatedNm }</label>
                                    </td>
                                </tr>
                            )) }
                        </tbody>
                    </table>
						
                    <div className="modalFooter">
                        <a onClick={ onCloseAffiliateSelectModal } className="modalBtnClose" title="닫기">닫기</a>
                        <a onClick={ onSelectAffiliate } className="modalBtnCheck" title="선택" style={{cursor: 'pointer'}}>선택</a>
                    </div>
            </Modal.Body>
        </Modal>
    )
}

export default AffiliateSelectModal