import React from 'react';
import { SrcCheckProps } from '../types'

/**
 * props : {id, name, text, defaultChecked, srcData, setSrcData}
 * @param props 
 * @returns 
 */
const SrcCheckBox = (props: SrcCheckProps) => {
    const onFormEventSrcData = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setSrcData({
            ...props.srcData,
            [e.currentTarget.name]: e.currentTarget.checked
        });
    }

    return (
        <>
            <input type="checkbox" id={props.id} className="checkStyle" onChange={onFormEventSrcData} name={props.name} checked={props.defaultChecked} />
            <label htmlFor={props.id} className="mr30">{props.text}</label>
        </>
    )
}

export default SrcCheckBox;