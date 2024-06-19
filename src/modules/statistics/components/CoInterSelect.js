import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'

const CoInterSelect = ({srcData, setSrcData}) => {
	// 세션정보
	const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
	const [list, setList] = useState([])

	const onChangeInterCode = (e) => {
		let interCodeArr = new Array();
		let value = e.target.value;

		if(value === ''){
			// 감사관리자의 경우 관리 계열사 리스트로 조회
			if(loginInfo.userAuth === '4'){
				list.map((obj) => {
					interCodeArr.push(obj.interrelatedCustCode)
				})
			} else {
				// 전체 클릭시 array 초기화
				interCodeArr = []
			}
		} else {
			interCodeArr.push(value)
		}
		
		setSrcData({
			...srcData,
			['coInters']: interCodeArr,
			['selInterCode'] : value
		});
	}

	const onSelectCustList = useCallback(async() => {
		let response = await axios.post('/api/v1/statistics/coInterList',{userAuth : loginInfo.userAuth})
		let result = response.data
		if(result.code === 'OK') {
			setList(result.data)

			let interCodeArr = new Array();
			if(srcData.selInterCode !== ''){
				interCodeArr.push(srcData.selInterCode)
			} else {
				result.data.map((obj) => {
					interCodeArr.push(obj.interrelatedCustCode)
				}) 
			}
			
			setSrcData({
				...srcData,
				['coInters']: interCodeArr
			});
		}
	})

	useEffect(() => {
		onSelectCustList()
	},[])

	return (
		<select className="selectStyle" name='coInters' value={srcData.selInterCode} onChange={onChangeInterCode}>
			<option value="">전체</option>
			{list.map((map) => (
				<option key={map.interrelatedCustCode} value={map.interrelatedCustCode}>{map.interrelatedNm}</option>
			))}
		</select>
	)
}

export default CoInterSelect