import React, {useState, useEffect, useCallback} from 'react'
import { Button } from 'react-bootstrap';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { ko } from "date-fns/locale";
import Ft from '../../src/modules/bid/api/filters';
import { MapType } from '../../src/components/types';
import Swal from 'sweetalert2';
import SrcDatePicker from '../../src/components/input/SrcDatePicker';
import InterrelatedCustCodeSelect from '../../src/modules/info/components/InterrelatedCustCodeSelect';
import BiddingStatusListJs from '../../src/modules/statistics/components/BiddingStatusList';

const Status = ({ initInterrelatedList, initBiddingStatusList }: { initInterrelatedList: MapType, initBiddingStatusList : MapType }) => {
    
  const [InterrelatedCustCodeList, setInterrelatedCustCodeList] = useState(initInterrelatedList)
  const [BiddingStatusList, setBiddingStatusList] = useState(initBiddingStatusList)
  //조회조건
  const [srcData, setSrcData] = useState<MapType>({
    startDay    : Ft.strDateAddDay(Ft.getCurretDate(), -30),
    endDay      : Ft.getCurretDate(),
    interrelatedCustCode : "",
    coInters    : [],
  });

  /*
  useEffect(() => {
    const fetchData = async () => {
      try {
        const interrelatedListResponse = await axios.post("/api/v1/couser/interrelatedList", null);
        setInterrelatedCustCodeList(interrelatedListResponse.data.data)
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
    onSearch();
  }, []);

  */

  const onChangeSrcData = (e : React.ChangeEvent<HTMLInputElement>) => {
    let coInters = ["" as String]
    if( e.target.name === 'interrelatedCustCode' && e.target.value === '' ){
      coInters = InterrelatedCustCodeList.map(item => item.interrelatedCustCode as string);
    } else {
      console.log(e.target.value)
      coInters.push(e.target.value)
    }
    setSrcData({
        ...srcData,
        [e.target.name]: e.target.value,
        coInters : coInters
    });
  }
  const onSearch = useCallback(async() => {
    try {
        const response = await axios.post("/api/v1/statistics/bidPresentList", srcData);
        setBiddingStatusList(response.data.data);
    } catch (error) {
        Swal.fire('', '조회에 실패하였습니다.', 'error');
        console.log(error);
    }
  }, [srcData]);

  // 엑셀다운
  function onExcelDown(){
    let params = Object.assign({} as MapType, srcData);
    params.fileName = "입찰현황_" + Ft.formatDate(new Date(), "yyyy_mm_dd");
    params.mergeColumns = ['회사명', ['입찰계획',['건수','예산금액']],['입찰진행',['건수','예산금액']],['입찰완료(유찰제외)',['건수','낙찰금액','업체수/건수']],'등록 업체수','기타']
    params.mappingColumnNames = ['interrelatedNm','planCnt','planAmt','ingCnt','ingAmt','succCnt','succAmt','custCnt','custCnt','regCustCnt','temp']
    params.excelUrl = 'bidPresentList'
    params.coInters = []
    if( srcData.interrelatedCustCode === '' ){
      params.coInters = InterrelatedCustCodeList.map(item => item.interrelatedCustCode);
    } else {
      params.coInters.push(srcData.interrelatedCustCode)
    }
      
    params.coInters = InterrelatedCustCodeList.map(item => item.interrelatedCustCode);

    axios.post("/api/v1/statistics/excel", params, {responseType: "blob"})
    .then((response) => {
        if (response.status === 200) {
            // 응답이 성공적으로 도착한 경우
            const url = window.URL.createObjectURL(new Blob([response.data])); // 응답 데이터를 Blob 형식으로 변환하여 URL을 생성합니다.
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", params.fileName + ".xlsx"); // 다운로드할 파일명을 설정합니다.
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url); // 임시 URL을 해제합니다.
        } else {
            Swal.fire('', '엑셀 다운로드 중 오류가 발생했습니다.', 'error');
        }
    }).catch((error) => {
        // 오류 처리
        console.error("Error:", error);
        Swal.fire('', '엑셀 다운로드 중 오류가 발생했습니다.', 'error');
    })
  }

  return (
    <div className="conRight">
      <div className="conHeader">
        <ul className="conHeaderCate">
          <li>통계</li>
          <li>입찰현황</li>
        </ul>
      </div>
      <div className="contents">
        <div className="conTopBox">
          <ul className="dList">
            <li><div>조회결과의 등록업체 수는 조회기간과 관계없이 각사 별 등록업체 수를 나타냅니다.</div></li>
          </ul>
        </div>
        <div className="searchBox mt20">
          <div className="flex align-items-center">
            <div className="sbTit width100px">조회기간</div>
            <div className="flex align-items-center width280px">
              <SrcDatePicker name={"startDay"} selected={srcData.startDay} srcData={srcData} setSrcData={setSrcData} />
              <span style={{margin:"0 10px"}}>~</span>
              <SrcDatePicker name={"endDay"} selected={srcData.endDay} srcData={srcData} setSrcData={setSrcData} />
            </div>
            <div className="sbTit width80px ml50">계열사</div>
            <div className="flex align-items-center width280px">
                {/* <SrcSelectBox   name={"interrelatedCustCode"} optionList={InterrelatedCustCodeList} valueKey="interrelatedCustCode" nameKey="interrelatedNm"
                                onSearch={ onSearch } srcData={ srcData } setSrcData={ setSrcData } /> */}
                <InterrelatedCustCodeSelect 
                InterrelatedCustCodeList={InterrelatedCustCodeList} 
                onChangeSrcData={onChangeSrcData}
                />
            </div>
            <Button onClick={onSearch} className="btnStyle btnSearch">검색</Button>
          </div>
        </div>
        <div className="flex align-items-center justify-space-between mt40">
          <div className="width100">
            
          </div>
          <div className="flex flex-shrink0">
            <p className="align-self-end mr20"></p>
            <Button onClick={onExcelDown} className="btnStyle btnPrimary" title="엑셀 다운로드">엑셀 다운로드 <i className="fa-light fa-arrow-down-to-line ml10"></i></Button>
          </div>
        </div>
        <table className="tblSkin1 mt10">
          <colgroup>
            <col style={{width:'7%'}} />
            <col style={{width:'7%'}} />
            <col style={{width:'10%'}} />
            <col style={{width:'7%'}} />
            <col style={{width:'10%'}} />
            <col style={{width:'7%'}} />
            <col style={{width:'7%'}} />
            <col style={{width:'10%'}} />
          </colgroup>
          <thead>
            <tr>
              <th rowSpan={2}>회사명</th>
              <th colSpan={2}>입찰계획</th>
              <th colSpan={2}>입찰진행</th>
              <th colSpan={3}>입찰완료(유찰제외)</th>
              <th rowSpan={2}>등록 업체수</th>
              <th rowSpan={2} className="end">기타</th>
            </tr>
            <tr>
              <th>건수</th>
              <th>예산금액</th>
              <th>건수</th>
              <th>예산금액</th>
              <th>건수</th>
              <th>낙찰금액</th>
              <th>업체수/건수</th>
            </tr>
          </thead>
          <tbody>
            { BiddingStatusList?.map((biddingStatus, index) => <BiddingStatusListJs key={index} biddingStatus={biddingStatus} /> ) }
            { (BiddingStatusList == null || BiddingStatusList.length === 0) &&
                <tr>
                    <td className="end" colSpan={10}>조회된 데이터가 없습니다.</td>
                </tr> }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export const getServerSideProps = async(context) =>{
    const cookies = context.req.headers.cookie || '';

    const fetchInterrelatedList = async()  =>{
        axios.defaults.headers.cookie = cookies;
        try {
            const response = await axios.post("http://localhost:3000/api/v1/couser/interrelatedList", null);
            const interrelatedList = response.data.data
            return interrelatedList
          } catch (error) {
            console.log(error);
          }
          return { content: [], totalElements: 0 }
    }

    const fetchBiddingStatusList = async()  =>{
        axios.defaults.headers.cookie = cookies;
        const params = {
            startDay    : Ft.strDateAddDay(Ft.getCurretDate(), -30),
            endDay      : Ft.getCurretDate(),
            interrelatedCustCode : "",
            coInters    : [],
        }
        try {
            const response = await axios.post("http://localhost:3000/api/v1/statistics/bidPresentList", params);
            return response.data.data
          } catch (error) {
            console.log(error);
          }
          return { content: [], totalElements: 0 }
    }
    
    const initInterrelatedList = await fetchInterrelatedList();
    const initBiddingStatusList = await fetchBiddingStatusList()
    return {
      props: {
        initInterrelatedList,
        initBiddingStatusList
      }
    };
  }

export default Status
