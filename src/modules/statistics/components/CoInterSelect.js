import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'

const CoInterSelect = ({onChangeSrcData}) => {
	// 세션정보
	const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
	const [list, setList] = useState([])

	const onSelectCustList = useCallback(async() => {
		let response = await axios.post('/api/v1/statistics/coInterList',{userAuth : loginInfo.userAuth})
		let result = response.data
		if(result.code === 'OK') setList(result.data)
	})

	useEffect(() => {
		onSelectCustList()
	},[])

	return (
		<select className="selectStyle" name='coInter' onChange={onChangeSrcData}>
			<option value="">전체</option>
			{list.map((map) => (
				<option key={map.interrelatedCustCode} value={map.interrelatedCustCode}>{map.interrelatedNm}</option>
			))}
		</select>
	)
}

export default CoInterSelect