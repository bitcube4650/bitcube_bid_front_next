import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate  } from "react-router-dom";
import axios from 'axios';
import Pagination from '../../../components/Pagination';
import Swal from 'sweetalert2'; // 공통 팝업창
import BidProgressList from '../components/BidProgressList';
import { BidContext } from '../context/BidContext';

const BidProgress = () => {

  //세션 로그인 정보
  const loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));

  const navigate = useNavigate();
  const {viewType, setViewType, bidContent, setBidContent} = useContext(BidContext);
  const moveSave = ()=>{
    setViewType('등록')
    navigate('/bid/progress/save');
    
    if(viewType === '등록'){

      //등록할 때는 loginInfo에서 정보를 가져 옴
      setBidContent({
        ...bidContent,
        createUserName : loginInfo.userName,
        createUser : loginInfo.userId, 
        gongoId : loginInfo.userName, 
        gongoIdCode : loginInfo.userId,
      })
    }else{

    }
  }


     //조회 결과
     const [progressList, setProgressList] = useState({});
     //조회조건
     const [srcData, setSrcData] = useState({
         biNo   : "",
         biName : "",
         size    : 10,
         page    : 0
     });
 
     const onChangeSrcData = (e) => {
         setSrcData({
             ...srcData,
             [e.target.name]: e.target.value
         });
     }
 
     const onSearch = useCallback(async() => {
         try {
             const response = await axios.post("/api/v1/bid/progressList", srcData);
             setProgressList(response.data)
         } catch (error) {
             Swal.fire('조회에 실패하였습니다.', '', 'error');
             console.log(error);
         }
     });
 
     useEffect(() => {
         onSearch();
     },[srcData.size, srcData.page]);



  return (
    <div className="conRight">
      {/* header */}
      <div className="conHeader">
        <ul className="conHeaderCate">
          <li>전자입찰</li>
          <li>입찰계획</li>
        </ul>
      </div>

    {/* contents */}
      <div className="contents">
        {/* headerContents */}
        <div className="conTopBox">
          <ul className="dList">
            <li>
              <div>입찰담당자가 생성한 입찰목록입니다. 입찰 공고자는 입찰계획 내용을 상세히 확인하시고 공고 하십시오.(입찰번호 또는 입찰명을 클릭하시면 상세내용을 확인할 수 있습니다)</div>
            </li>
            <li className="textHighlight">
              <div>입찰공고자는 제출마감일시 전에 입찰공고 하지 않으면 해당 입찰은 자동으로 삭제됩니다.</div>
            </li>
            <li>
              <div>담당자 또는 공고자를 클릭하면 해당인에게 메일을 보낼 수 있습니다.</div>
            </li>
          </ul>
        </div>
        
      {/* searchBox */}
        <div className="searchBox mt20">
          <div className="flex align-items-center">
            <div className="sbTit mr30">입찰번호</div>
            <div className="width250px">
              <input
                type="text"
                name="biNo"
                onChange={onChangeSrcData}
                onKeyDown={ (e) => { 
                    if(e.key === 'Enter') onSearch()
                  }
                }
                className="inputStyle"
                maxLength="10"
                autoComplete="off"
              />
            </div>
            <div className="sbTit mr30 ml50">입찰명</div>
            <div className="width250px">
              <input
                type="text"
                name="biName"
                onChange={onChangeSrcData}
                onKeyDown={ (e) => { 
                  if(e.key === 'Enter') onSearch()
                }
              }
                className="inputStyle"        
                maxLength="50"
                autoComplete="off"
              />
            </div>
            <button 
            className="btnStyle btnSearch" 
            onClick={ ()=>{
                onSearch()
              }
            }
              >검색
            </button>
          </div>
        </div>

      {/* 건수 */}
        <div className="flex align-items-center justify-space-between mt40">
        <div className="width100">
          전체 : <span className="textMainColor"><strong>{progressList?.data?.totalElements ? progressList.data.totalElements.toLocaleString() : 0 }</strong>
          </span>건
          <select onChange={onChangeSrcData} name="size" className="selectStyle maxWidth140px ml20">
            <option value="10">10개씩 보기</option>
            <option value="20">20개씩 보기</option>
            <option value="30">30개씩 보기</option>
            <option value="50">50개씩 보기</option>
          </select>
        </div>
        <div>
           <button
              onClick={moveSave}
              className="btnStyle btnPrimary"
              title="입찰계획등록"
              >입찰계획등록
            </button> 
        </div>
      </div>
      <table className="tblSkin1 mt10">
        <colgroup>
            <col style={{width:'12%'}} />
            <col />
            <col style={{width:'15%'}} />
            <col style={{width:'15%'}} />
            <col style={{width:'10%'}} span={4}/>
        </colgroup>
        <thead>
            <tr>
              <th>입찰번호</th>
              <th>입찰명</th>
              <th>제출시작일시</th>
              <th>제출마감일시</th>
              <th>입찰방식</th>
              <th>내역</th>
              <th>담당자</th>
              <th className="end">공고자</th>
            </tr>
        </thead>
        <tbody>
          {progressList?.data?.content?.length > 0 ? (
            progressList.data.content.map((item) => (
              <BidProgressList key={item.biNo} progressList={item} />
            ))
          ) : (
            <tr>
              <td className="end" colSpan="8">조회된 데이터가 없습니다.</td>
            </tr>
          )}
        </tbody>
    </table>
    <div className="row mt40">
          <div className="col-xs-12">
              <Pagination onChangeSrcData={onChangeSrcData} list={progressList} />
          </div>
    </div>        
      </div>
    </div>
  )
}

export default BidProgress;