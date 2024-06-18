import React from 'react';
import { SrcInputProps } from 'components/types'

const SrcInput = (props: SrcInputProps) => {
    const onFormEventSrcData = (e: React.FormEvent<HTMLInputElement>) => {
        props.setSrcData({
            ...props.srcData,
            [e.currentTarget.name]: e.currentTarget.value
        });
    }

    return (
        <>
            <input type="text" className="inputStyle" placeholder="" name={ props.name } maxLength={ props.maxLength }
            onKeyUp={ onFormEventSrcData }
            onKeyDown={ (e) => { if(e.key === 'Enter') props.onSearch()} }
            />
        </>
    )
}

export default SrcInput;