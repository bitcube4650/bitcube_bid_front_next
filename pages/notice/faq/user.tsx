import React, { useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // 공통 팝업창
import { MapType } from '../../../src/components/types';

const User = () => {

  const [activeTab, setActiveTab] = useState('faq1');
  const [activeFaq, setActiveFaq] = useState('');
  const [faqList, setFaqList] = useState<MapType[]>([]);

  const onTabClick = (tab: string) => {
    setActiveTab(tab);
    setActiveFaq(''); // 탭을 변경할 때 활성화된 FAQ를 초기화
  };

  const onFaqClick = (faqId: string) => {
    setActiveFaq(prevFaqId => (prevFaqId === faqId ? '' : faqId)); // FAQ를 토글
  }

  //faq 조회
  const onSearch = useCallback(async() => {
    try {
        const response = await axios.post("/api/v1/faq/faqList", {});

        if (response.data.code === 'OK') {
          console.log('result!!!',response);
            console.log(response.data.data.content);
            setFaqList(response.data.data.content);
        }else{
            Swal.fire('', '조회에 실패하였습니다.', 'error');
            console.log(response.data.data);
        }
    } catch (error) {
        Swal.fire('', '조회에 실패하였습니다.', 'error');
        console.log(error);
    }
  }, []);

  useEffect(() => {
    onSearch();
  }, [onSearch]);

  return (
    <div className="conRight">
      <div className="conHeader">
        <ul className="conHeaderCate">
          <li>공지</li>
          <li>FAQ</li>
        </ul>
      </div>
      <div className="contents">
        <div className="tabStyle tab3 faqList">
          <a id="faq1" className={activeTab === 'faq1' ? 'active' : ''} onClick={() => onTabClick('faq1')} href="#">가입관련</a>
          <a id="faq2" className={activeTab === 'faq2' ? 'active' : ''} onClick={() => onTabClick('faq2')} href="#">입찰관련</a>
          <a id="faq3" className={activeTab === 'faq3' ? 'active' : ''} onClick={() => onTabClick('faq3')} href="#">인증서관련</a>
        </div>
        <div className="faq_item_wrap">
          {faqList?.filter((val) => `faq${val.faqType}` === activeTab)
          .map((val) => (
            <div style={{width:'100%',boxSizing:'border-box'}}
              key={val.faqId}
              className={`faq_item show ${val.faqId === activeFaq ? 'active' : ''} ${val.faqType === '1' ? 'faq1' : ''} ${val.faqType === '2' ? 'faq2' : ''} ${val.faqType === '3' ? 'faq3' : ''}`}
            >
              <div onClick={() => onFaqClick(val.faqId)} className="faqTitle">
                <div>
                  <span className="faqQ">Q</span>
                  <p className="faqTit">{val.title}</p>
                </div>
                <i className="fal fa-chevron-down faqIcon"></i>
              </div>
              <div style={{width:'100%',boxSizing:'border-box'}} className={`faqAn ${val.faqId === activeFaq ? 'show' : ''}`}>
                <span className="faqA">A.</span>
                <div className="faqTxt" style={{width:'100%'}}>
                  <pre style={{ width:'100%', overflowWrap: 'break-word',boxSizing:'border-box' , whiteSpace: 'pre-wrap'}} dangerouslySetInnerHTML={{ __html: val.answer }}></pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default User;