import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../../../components/Pagination';
import GroupUserListJs from '../components/GroupUserList'
import GroupUserDetailPop from './GroupUserDatail'
import InterrelatedCustCodeSelect from '../components/InterrelatedCustCodeSelect'
import Swal from 'sweetalert2'; // 공통 팝업창

const GroupUser = () => {
    // 사용자 등록 / 수정 여부
    const [CreateUser, setCreateUser] = useState(false)
    // 모달창 오픈 여부
    const [groupUserDetailPopOpen, setGroupUserDetailPopOpen] = useState(false);  // 모달 오픈
    // 사용자등록 모달창 오픈 시 상태값
    const onGroupUserPop = useCallback(() => {
        setSrcUserIdChange("")
        setGroupUserDetailPopOpen(true); 
        setCreateUser(true); 
    }, []);
    
    // 상세, 수정
    const [SrcUserIdChange, setSrcUserIdChange] = useState("");
    function onUserDetailPopUserIdChange(userId){
        setSrcUserIdChange(userId)
        setCreateUser(false)
        setGroupUserDetailPopOpen(true); 
    }
    
    
    //세션 로그인 정보
    const loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
    //조회 결과
    const [GroupUserList, setGroupUserList] = useState({})
    const [InterrelatedCustCodeList, setInterrelatedCustCodeList] = useState({})
    //조회조건
    const [srcData, setSrcData] = useState({
        interrelatedCustCode    : "",
        title                   : "",
        useYn                   : "",
        userName                : "",
        userId                  : "",
        size                    : 10,
        page                    : 0
    });

    const onChangeSrcData = (e) => {
        setSrcData({
            ...srcData,
            [e.target.name]: e.target.value
        });
    }

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
                <div>
                    <a onClick={ onGroupUserPop } className="btnStyle btnPrimary" title="사용자등록">사용자등록</a>
                </div>
            </div>
            <div className="contents">
                <div className="searchBox">
                    <div className="flex align-items-center">
				        <div className="sbTit width100px">그룹사</div>
				        <div className="flex align-items-center width250px">
                            <InterrelatedCustCodeSelect 
                                InterrelatedCustCodeList={InterrelatedCustCodeList} 
                                onChangeSrcData={onChangeSrcData}
                            />
                        </div>
                        <div className="sbTit width100px ml50">사용여부</div>
                        <div className="flex align-items-center width250px">
                            <select name='useYn' onChange={onChangeSrcData} className="selectStyle">
                                <option value="">전체</option>
                                <option value="Y">사용</option>
                                <option value="N">미사용</option>
                            </select>

                        </div>
                    </div>
                    <div className="flex align-items-center height50px mt10">
                        <div className="sbTit width100px">사용자명</div>
				        <div className="flex align-items-center width250px">
                            <input type="text" onChange={onChangeSrcData} name="userName" className="inputStyle" placeholder="" maxLength="300" onKeyDown={(e) => { if(e.key === 'Enter') onSearch()}} autoComplete="new-password"/>
                        </div>
				        <div className="sbTit width100px ml50">아이디</div>
				        <div className="width250px">
                            <input type="text" onChange={onChangeSrcData} name="userId" className="inputStyle" placeholder="" maxLength="50" onKeyDown={(e) => { if(e.key === 'Enter') onSearch()}} autoComplete="new-password"/>
                        </div>
                        <a onClick={onSearch} className="btnStyle btnSearch">검색</a>
                    </div>
                </div>
                <div className="flex align-items-center justify-space-between mt40">
                    <div className="width100">
                        전체 : <span className="textMainColor"><strong>{ GroupUserList.totalElements ? GroupUserList.totalElements.toLocaleString() : 0 }</strong></span>건
                        <select onChange={onChangeSrcData} name="size" className="selectStyle maxWidth140px ml20">
                            <option value="10">10개씩 보기</option>
                            <option value="20">20개씩 보기</option>
                            <option value="30">30개씩 보기</option>
                            <option value="50">50개씩 보기</option>
                        </select>
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
                                <td className="end" colSpan="9">조회된 데이터가 없습니다.</td>
                            </tr> }
                    </tbody>
                </table>
                <div className="row mt40">
                    <div className="col-xs-12">
                        <Pagination onChangeSrcData={onChangeSrcData} list={GroupUserList} />
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
        </div>
    );
};

export default GroupUser;
