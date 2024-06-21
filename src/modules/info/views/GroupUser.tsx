import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../../../components/Pagination';
import GroupUserListJs from '../components/GroupUserList'
import GroupUserDetailPop from './GroupUserDatail'
import GroupUserPasswordComfirm from '../../../components/modal/UserPasswordComfirm'
import Swal from 'sweetalert2'; // 공통 팝업창
import { MapType } from '../../../../src/components/types'
import SrcInput from '../../../../src/components/input/SrcInput'
import SelectListSize from '../../../../src/components/SelectListSize'
import SrcSelectBox from '../../../../src/components/input/SrcSelectBox'

const GroupUser = () => {
    // 사용자 등록 / 수정 여부
    const [CreateUser, setCreateUser] = useState<boolean>(false)
    // 모달창 오픈 여부
    const [groupUserDetailPopOpen, setGroupUserDetailPopOpen] = useState<boolean>(false);  // 사용자 등록/수정모달 오픈
    const [GroupUserPasswordComfirmOpen, setGroupUserPasswordComfirmOpen] = useState<boolean>(false);    // 비밀번호 확인
    const [useYnOptionList, setUseYnOptionList] = useState([{"value" : "Y", "name" : "사용"}, {"value" : "N", "name" : "미사용"}])
    // 사용자등록 팝업호출
    const onGroupUserPop = useCallback(() => {
        setSrcUserIdChange("")
        setGroupUserDetailPopOpen(true); 
        setCreateUser(true); 
    }, []);
    // 상세, 수정에 필요한 userId
    const [SrcUserIdChange, setSrcUserIdChange] = useState<string>("");
    // 비밀번호 확인 팝업 호출
    function onUserDetailPopUserIdChange(userId : string){
        setSrcUserIdChange(userId)
        setGroupUserPasswordComfirmOpen(true)   
    }
    // 사용자 상세, 수정 팝업 호출
    function onUserDetailPop(userId : string){
        setSrcUserIdChange(userId)
        setCreateUser(false)
        setGroupUserPasswordComfirmOpen(false)
        setGroupUserDetailPopOpen(true)   
    }
    
    //조회 결과
    const [GroupUserList, setGroupUserList] = useState({        
        totalElements   : 0,
        content         : [{}]
    })
    const [InterrelatedCustCodeList, setInterrelatedCustCodeList] = useState([{} as MapType])
    //조회조건
    const [srcData, setSrcData] = useState<MapType>({
        interrelatedCustCode    : "",
        useYn                   : "",
        userName                : "",
        userId                  : "",
        size                    : 10,
        page                    : 0
    });

    const onSearch = useCallback(async() => {
        try {
            const response = await axios.post("/api/v1/couser/userList", srcData);
            setGroupUserList(response.data.data);
        } catch (error) {
            Swal.fire('', '조회에 실패하였습니다.', 'error');
            console.log(error);
        }
    }, [srcData]);

    useEffect(() => {
        onSearch();
    }, [srcData.size, srcData.page]);

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
    }, []);
      
    return (
        <div className="conRight">
            <div className="conHeader">
                <ul className="conHeaderCate">
                    <li>정보관리</li>
                    <li>사용자관리</li>
                </ul>
            </div>
            <div className="contents">
                <div className="searchBox">
                    <div className="flex align-items-center">
				        <div className="sbTit width100px">그룹사</div>
				        <div className="flex align-items-center width250px">
                            <SrcSelectBox   name={"interrelatedCustCode"} optionList={InterrelatedCustCodeList} valueKey="interrelatedCustCode" nameKey="interrelatedNm"
                                            onSearch={ onSearch } srcData={ srcData } setSrcData={ setSrcData } />
                        </div>
                        <div className="sbTit width100px ml50">사용여부</div>
                        <div className="flex align-items-center width250px">
                            <SrcSelectBox   name={"useYn"} optionList={useYnOptionList} valueKey="value" nameKey="name" onSearch={ onSearch } srcData={ srcData } setSrcData={ setSrcData } />
                        </div>
                    </div>
                    <div className="flex align-items-center height50px mt10">
                        <div className="sbTit width100px">사용자명</div>
				        <div className="flex align-items-center width250px">
                            <SrcInput name="userName" onSearch={ onSearch } srcData={ srcData } setSrcData={ setSrcData } maxLength={ 300 } />
                        </div>
				        <div className="sbTit width100px ml50">아이디</div>
				        <div className="width250px">
                            <SrcInput name="userId" onSearch={ onSearch } srcData={ srcData } setSrcData={ setSrcData } maxLength={ 300 } />
                        </div>
                        <a onClick={onSearch} className="btnStyle btnSearch">검색</a>
                    </div>
                </div>
                <div className="flex align-items-center justify-space-between mt40">
                    <div className="width100">
                        전체 : <span className="textMainColor"><strong>{ GroupUserList?.totalElements ? GroupUserList.totalElements.toLocaleString() : 0 }</strong></span>건
                        <SelectListSize onSearch={ onSearch } srcData={ srcData } setSrcData={ setSrcData } />
                    </div>
                    <div>
                        <a onClick={ onGroupUserPop } className="btnStyle btnPrimary" title="사용자등록">사용자등록</a>
                    </div>
                </div>
                <table className="tblSkin1 mt10">
                    <colgroup>
                        <col style={{width:'10%'}} />
                        <col />
                        <col style={{width:'10%'}} />
                        <col style={{width:'10%'}} />
                        <col style={{width:'13%'}} />
                        <col style={{width:'13%'}} />
                        <col style={{width:'10%'}} />
                        <col style={{width:'5%'}} />
                        <col style={{width:'10%'}} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>사용자명</th>
                            <th>아이디</th>
                            <th>직급</th>
                            <th>부서</th>
                            <th>전화번호</th>
                            <th>휴대폰</th>
                            <th>사용권한</th>
                            <th>사용여부</th>
                            <th className="end">소속사</th>
                        </tr>
                    </thead>
                    <tbody>
                        { GroupUserList.content?.map((groupUser, index) => <GroupUserListJs key={index} groupUser={groupUser} onUserDetailPopUserIdChange={onUserDetailPopUserIdChange}/> ) }
                        { GroupUserList.content == null &&
                            <tr>
                                <td className="end" colSpan={9}>조회된 데이터가 없습니다.</td>
                            </tr> }
                    </tbody>
                </table>
                <div className="row mt40">
                    <div className="col-xs-12">
                        <Pagination srcData={ srcData } setSrcData={ setSrcData } list={GroupUserList} />
                    </div>
                </div>
            </div>
            {groupUserDetailPopOpen && (
                <GroupUserDetailPop 
                    srcUserId={SrcUserIdChange} 
                    CreateUser={CreateUser}
                    groupUserDetailPopOpen={groupUserDetailPopOpen} 
                    setGroupUserDetailPopOpen={setGroupUserDetailPopOpen} 
                    onSearch={onSearch}
                />
            )}
            {GroupUserPasswordComfirmOpen && (
                <GroupUserPasswordComfirm 
                    srcUserId={SrcUserIdChange} 
                    GroupUserPasswordComfirmOpen={GroupUserPasswordComfirmOpen}
                    setGroupUserPasswordComfirmOpen={setGroupUserPasswordComfirmOpen}
                    onUserDetailPop={onUserDetailPop} 
                />
            )}
        </div>
    );
};

export default GroupUser;
