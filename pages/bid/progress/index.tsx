import React, { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../../../src/components/Pagination';
import Swal from 'sweetalert2';
import { BidContext } from '../../../src/modules/bid/context/BidContext';
import { MapType } from '../../../src/components/types';
import SrcInput from '../../../src/components/input/SrcInput';
import SelectListSize from '../../../src/components/SelectListSize';
import BidProgressList from '../../../src/modules/bid/components/BidProgressList';
import { useRouter } from 'next/router';

const Index = ({ initialProgressList }: { initialProgressList: MapType }) => {
  console.log('initialProgressList',initialProgressList)
  const [loginInfo, setLoginInfo] = useState(null);
  const [progressList, setProgressList] = useState<MapType>(initialProgressList);
  const [srcData, setSrcData] = useState<MapType>({
    biNo: "",
    biName: "",
    size: 10,
    page: 0
  });

  const { setViewType, bidContent, setBidContent, setCustContent, setCustUserName, setCustUserInfo, setTableContent, setInsFile, setInnerFiles, setOuterFiles } = useContext(BidContext);

  useEffect(() => {
    const loginInfoString = localStorage.getItem("loginInfo");
    const parsedLoginInfo = loginInfoString ? JSON.parse(loginInfoString) : null;
    setLoginInfo(parsedLoginInfo);
  }, []);

  const router = useRouter()
  
  const onMoveSave = (type: string) => {
    setViewType(type);
    localStorage.setItem("viewType", type);

    const currentDate = new Date();
    const currentHours = currentDate.getHours().toString().padStart(2, '0');
    const hours = `${currentHours}:00`;

    setBidContent({
      biName: '',
      itemCode: '',
      itemName: '',
      biModeCode: 'A',
      bidJoinSpec: '',
      specialCond: '',
      spotDay: '',
      spotTime: hours,
      spotArea: '',
      succDeciMethCode: '',
      amtBasis: '',
      payCond: '',
      bdAmt: '',
      lotteDeptList: [],
      lotteProcList: [],
      lotteClsList: [],
      matDept: '',
      matProc: '',
      matCls: '',
      matFactory: '',
      matFactoryLine: '',
      matFactoryCnt: '',
      minDate: new Date().toISOString().slice(0, 10),
      estStartDay: '',
      estStartTime: hours,
      estCloseDay: '',
      estCloseTime: hours,
      estOpener: '',
      estOpenerCode: '',
      estBidder: '',
      estBidderCode: '',
      openAtt1: '',
      openAtt1Code: '',
      openAtt2: '',
      openAtt2Code: '',
      insModeCode: '1',
      supplyCond: '',
    });

    setCustContent([]);
    setCustUserName([]);
    setCustUserInfo([]);
    setTableContent([]);
    setInsFile(null);
    setInnerFiles([]);
    setOuterFiles([]);

    router.push('/bid/progress/save');
  };

  const onSearch = useCallback(async () => {
    try {
      const response = await axios.post(`/api/v1/bid/progressList`, srcData);
      setProgressList(response.data.data);
    } catch (error) {
      Swal.fire('조회에 실패하였습니다.', '', 'error');
      console.error('Error fetching progress list:', error);
    }
  }, [srcData]);

  /*
  useEffect(() => {
    onSearch();
  }, [srcData.size, srcData.page, onSearch]);
  */

  return (
    <div className="conRight">
      <div className="conHeader">
        <ul className="conHeaderCate">
          <li>전자입찰</li>
          <li>입찰계획</li>
        </ul>
      </div>

      <div className="contents">
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

        <div className="searchBox mt20">
          <div className="flex align-items-center">
            <div className="sbTit mr30">입찰번호</div>
            <div className="width250px">
              <SrcInput
                name="biNo"
                onSearch={onSearch}
                srcData={srcData}
                setSrcData={setSrcData}
                maxLength={10}
              />
            </div>
            <div className="sbTit mr30 ml50">입찰명</div>
            <div className="width250px">
              <SrcInput
                name="biName"
                onSearch={onSearch}
                srcData={srcData}
                setSrcData={setSrcData}
                maxLength={50}
              />
            </div>
            <button
              className="btnStyle btnSearch"
              onClick={onSearch}
            >
              검색
            </button>
          </div>
        </div>

        <div className="flex align-items-center justify-space-between mt40">
          <div className="width100">
            전체 : <span className="textMainColor"><strong>{progressList?.totalElements ? progressList.totalElements.toLocaleString() : 0}</strong></span>건
            <SelectListSize onSearch={onSearch} srcData={srcData} setSrcData={setSrcData} />
          </div>
          <div>
            <button
              onClick={() => onMoveSave('등록')}
              className="btnStyle btnPrimary"
              title="입찰계획등록"
            >
              입찰계획등록
            </button>
          </div>
        </div>
        <table className="tblSkin1 mt10">
          <colgroup>
            <col style={{ width: '12%' }} />
            <col />
            <col style={{ width: '15%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '10%' }} span={4} />
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
            {progressList?.content && progressList.content.length > 0 ? (
              progressList.content.map((item: MapType) => (
                <BidProgressList key={item.biNo} progressList={item} />
              ))
            ) : (
              <tr>
                <td className="end" colSpan={8}>조회된 데이터가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="row mt40">
          <div className="col-xs-12">
            <Pagination srcData={srcData} setSrcData={setSrcData} list={progressList} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async(context) =>{
  let params = {
    biNo: "",
    biName: "",
    size: 10,
    page: 0
  }

  const cookies = context.req.headers.cookie || '';
  try {
    axios.defaults.headers.cookie = cookies;
    const response = await axios.post("http://localhost:3000/api/v1/bid/progressList", params);
    return {
      props: {
        initialProgressList: response.data.data
      }
    };
  } catch (error) {
    console.error('Error fetching initial progress list:', error);
    return {
      props: {
        initialProgressList: { content: [], totalElements: 0 }
      }
    };
  }
}

export default Index;
