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
            {
                props.optionList?.map((data, index) => 
                <option value={data.value} key={index}>
                    {data.name}
                </option>)
            }
        </select>
    )
}

export default SrcSelectBox;