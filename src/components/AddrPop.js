import React, { useEffect, useRef } from 'react';
import { Modal } from 'react-bootstrap';

const AddrPop = ({ addrPop, setAddrPop, addrPopClick }) => {
    const daumAddrLayerRef = useRef(null);

    useEffect(() => {
        if(addrPop) {
            const script = document.createElement('script');
            script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
            script.async = true;
            script.onload = () => initModal();
            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            };
        }
    }, [addrPop]);

    const callbackAddr = (zipcode, addr, addrDetail) => {
        const data = { zipcode, addr, addrDetail };
        addrPopClick(data);
    };

    const initModal = () => {
        const elementLayer = document.getElementById("daumAddrLayer");

        new window.daum.Postcode({
        oncomplete: (data) => {
            let addr = '';
            let extraAddr = '';

            if (data.userSelectedType === 'R') {
            addr = data.roadAddress;
            } else {
            addr = data.jibunAddress;
            }

            if (data.userSelectedType === 'R') {
            if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                extraAddr += data.bname;
            }
            if (data.buildingName !== '' && data.apartment === 'Y') {
                extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            if (extraAddr !== '') {
                extraAddr = ` (${extraAddr})`;
            }
            }

            callbackAddr(data.zonecode, addr, extraAddr);
            closeAddr();
        },
        width: '100%',
        height: '100%',
        maxSuggestItems: 5,
        }).embed(elementLayer);

        elementLayer.style.display = 'block';
        const width = 750;
        const height = 500;
        const borderWidth = 5;
        elementLayer.style.width = `${width}px`;
        elementLayer.style.height = `${height}px`;
        elementLayer.style.border = `${borderWidth}px solid`;
        elementLayer.style.top = `${((window.innerHeight || document.documentElement.clientHeight) - height) / 2 - borderWidth}px`;
    };

    const closeAddr = () => {
        setAddrPop(false);
    };

    return (
        <div>
            <Modal show={addrPop} onHide={() => {setAddrPop(false)}} className="modalStyle" size="lg">
                    <div id="daumAddrLayer" style={{ display: 'none', position: 'fixed', overflow: 'hidden', zIndex: 1, WebkitOverflowScrolling: 'touch' }}>
                        <img src="//t1.daumcdn.net/postcode/resource/images/close.png" id="btnCloseLayer" style={{ cursor: 'pointer', position: 'absolute', right: '-3px', top: '-3px', zIndex: 1 }} onClick={closeAddr} alt="닫기 버튼" />
                    </div>
            </Modal>
        </div>
    );
}

export default AddrPop;
