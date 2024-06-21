import React from 'react';
import { SrcInputProps } from 'components/types'

/**
 * @param props 
    onSearch?: Function;
    srcData: MapType;
    setSrcData: Dispatch<SetStateAction<MapType>>;
    type?: string;
    className?: string;
    defaultValue?: string;
    placeholder?: string;
    name?: string;
    maxLength?: number;
    readOnly?: boolean;
    disabled?: boolean;
 * @returns 
 */
const SrcInput = (props: SrcInputProps) => {
    const onFormEventSrcData = (e: React.FormEvent<HTMLInputElement>) => {
        props.setSrcData({
            ...props.srcData,
            [e.currentTarget.name]: e.currentTarget.value
        });
    }

    return (
        <input type={ props.type?props.type:"text" } className={ "inputStyle " + (props.className?props.className:"") }
            value={ props.value } placeholder={ props.placeholder }
            name={ props.name } maxLength={ props.maxLength }
            readOnly={ props.readOnly } disabled={ props.disabled }
            onChange={ onFormEventSrcData }
            onKeyDown={ (e) => { if(e.key === 'Enter' && props.onSearch) props.onSearch()} }
            style={props.style}
        />
    )
}

export default SrcInput;