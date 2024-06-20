import React, { useEffect, useState } from 'react'
import axios from 'axios'

const CustUserPop = ({custCode}) => {
	const [srcParams, setSrcParams] = useState({						// 조회조건
		srcUserName : '',			// 사용자명
		srcLoginId : ''				// 로그인 아이디
	})

	const [userList, setUserList] = useState(Array);					// 사용자 리스트

	useEffect(() => {
		fnSearchUser();
	}, [custCode, srcParams])

	// 업체 사용자 리스트 조회
	const fnSearchUser = async() => {
		const response = await axios.post('/api/v1/custuser/userListForCust', {
			custCode : custCode,
			userName : srcParams.srcUserName,
			userId : srcParams.srcLoginId
		})

		setUserList(response.data.content);
	}

	// 조회 조건 변경시 파라미터 셋팅
	const handleChange = (e) => {
		const { name, value } = e.target;
		setSrcParams({
			...srcParams,
			[name]: value
		})
	}

	const UserList = ({dataArr}) => {
		return(
			<tbody>
				{ dataArr?.map(data =>(
					<tr key={data.userId}>
						<td><input type="checkbox" name="userCheck" /></td>
						<td>{ data.userName }</td>
						<td>{ data.userId }</td>
						<td>{ data.userBuseo }</td>
						<td>{ data.userPosition }</td>
						<td>{ data.userEmail }</td>
						<td>{ data.userTel }</td>
						<td>{ data.userHp }</td>
						<td className="end">{ data.userType == '1' ? '업체관리자' : '사용자'}</td>
					</tr>
				))}
			</tbody>
		)
	}

	return (
		<div>
			{/* 협력사 사용자 */}
			<div className="modal fade modalStyle" id="custUserPop" tabIndex="-1" role="dialog" aria-hidden="true">
				<div className="modal-dialog" style={{ width : "100%", maxWidth: "1100px" }}>
					<div className="modal-content">
						<div className="modal-body">
							<a className="ModalClose" data-dismiss="modal" title="닫기"><i className="fa-solid fa-xmark"></i></a>
							<h2 className="modalTitle">협력사 사용자</h2>
							
							<div className="modalSearchBox mt20">
								<div className="flex align-items-center">
									<div className="sbTit mr30">사용자명</div>
									<div className="width150px">
										<input type="text" className="inputStyle" name="srcUserName" value={srcParams.srcUserName} onChange={handleChange} />
									</div>
									<div className="sbTit mr30 ml50">로그인 ID</div>
									<div className="width150px">
										<input type="text" className="inputStyle" name="srcLoginId" value={srcParams.srcLoginId} onChange={handleChange} />
									</div>
									<a className="btnStyle btnSearch" onClick={fnSearchUser}>검색</a>
								</div>
							</div>
							<table className="tblSkin1 mt30">
								<colgroup>
									<col />
									<col style={{width : "20%"}} />
									<col style={{width : "15%"}} />
									<col style={{width : "8%"}} />
									<col style={{width : "8%"}} />
									<col style={{width : "10%"}} />
									<col style={{width : "10%"}} />
									<col style={{width : "8%"}} />
								</colgroup>
								<thead>
									<tr>
										<th><input type="checkbox" /></th>
										<th>사용자명</th>
										<th>로그인ID</th>
										<th>부서</th>
										<th>직급</th>
										<th>이메일</th>
										<th>전화번호</th>
										<th>휴대폰</th>
										<th className="end">권한</th>
									</tr>
								</thead>
								<UserList dataArr={userList} />
							</table>
							{/* pagination */}
							{/* <div className="row mt30">
								<div className="col-xs-12">
									<pagination @searchFunc="search" :page="listPage"/>
								</div>
							</div> */}
							{/* // pagination */}
							<div className="modalFooter">
								<a className="modalBtnClose" data-dismiss="modal" title="닫기">닫기</a>
								<a className="btnStyle btnSecondary" title="저장">저장</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default CustUserPop