import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'

const CoInterSelect = ({srcData, setSrcData}) => {
	// 세션정보
	const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
	const [list, setList] = useState([])

	const onChangeInterCode = (e) => {
		let interCodeArr = new Array();
		interCodeArr.push(e.target.value)
		
		setSrcData({
			...srcData,
			['coInters']: interCodeArr
		});
	}

	const onSelectCustList = useCallback(async() => {
		let response = await axios.post('/api/v1/statistics/coInterList',{userAuth : loginInfo.userAuth})
		let result = response.data
		if(result.code === 'OK') {
			setList(result.data)

			let interCodeArr = new Array();
			for(let i = 0; i < result.data.length; i++) {
				interCodeArr.push(result.data[i].interrelatedCustCode)
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
		<select className="selectStyle" name='coInters' onChange={onChangeInterCode}>
			<option value="">전체</option>
			{list.map((map) => (
				<option key={map.interrelatedCustCode} value={map.interrelatedCustCode}>{map.interrelatedNm}</option>
			))}
		</select>
	)
}

export default CoInterSelect