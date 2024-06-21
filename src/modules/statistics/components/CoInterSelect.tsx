import axios from 'axios'
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { MapType } from 'components/types'
import SrcSelectBox from 'components/input/SrcSelectBox';

interface CompanyStatisticProps {
	srcData : MapType;
	setSrcData: Dispatch<SetStateAction<MapType>>;
	onSearch : Function
}

const CoInterSelect = ({srcData, setSrcData, onSearch}:CompanyStatisticProps) => {
	// 세션정보
	const loginInfo = JSON.parse(localStorage.getItem("loginInfo") as string);
	const [list, setList] = useState<Array<MapType>>([])

	const onSelectCustList = async() => {
		let response = await axios.post('/api/v1/statistics/coInterList',{userAuth : loginInfo.userAuth})
		let result = response.data
		if(result.code === 'OK') {
			setList(result.data)
		}
	}

	useEffect(() => {
		onSelectCustList()
	},[])

	return (
		<SrcSelectBox name="srcCoInter" optionList={list} onSearch={onSearch} srcData={srcData} setSrcData={setSrcData} valueKey="interrelatedCustCode" nameKey="interrelatedNm" value={srcData.srcCoInter} />
	)
}

export default CoInterSelect