import React, { Dispatch, SetStateAction } from 'react';
import { SrcInputProps } from 'components/types'

const SelectListSize = (props: SrcInputProps) => {
    const onChangeEventSrcData = (e: React.ChangeEvent<HTMLSelectElement>) => {
        props.setSrcData({
            ...props.srcData,
            [e.target.name]: e.target.value
        });
    }
    
    return (
        <select onChange={ e => onChangeEventSrcData(e) } name="size" className="selectStyle maxWidth140px ml20">
            <option value="10">10개씩 보기</option>
            <option value="20">20개씩 보기</option>
            <option value="30">30개씩 보기</option>
            <option value="50">50개씩 보기</option>
        </select>
    )
}

export default SelectListSize;