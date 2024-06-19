import React from 'react';
import { SrcSelectBoxProps } from 'components/types'

const SrcSelectBox = (props: SrcSelectBoxProps) => {
    const onFormEventSrcData = (e: React.ChangeEvent<HTMLSelectElement>) => {
        props.setSrcData({
            ...props.srcData,
            [e.currentTarget.name]: e.currentTarget.value
        });
    }


    
    return (
        <select name={props.name} onChange={onFormEventSrcData} className="selectStyle">
            <option value={""}>전체</option>
            {
                props.optionList?.map((data, index) => 
                <option value={data[props.valueKey as string]} key={index}>
                    {data[props.nameKey as string]}
                </option>)
            }
        </select>
    )
}

export default SrcSelectBox;