import React from 'react';
import { EditInputProps } from 'components/types'

/**
 * @param props 
    editData: MapType;
    setEditData: Dispatch<SetStateAction<MapType>>;
    type?: string; 사용X
    className?: string;
    defaultValue?: string;
    placeholder?: string;
    name?: string;
    maxLength?: number; 사용X
    readOnly?: boolean;
    disabled?: boolean;
 * @returns 
 */
const EditTextArea = (props: EditInputProps) => {
    const onFormEventSrcData = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        props.setEditData({
            ...props.editData,
            [e.target.name]: e.target.value
        });
    }

    return (
        <textarea className={ "textareaStyle notiBox overflow-y-auto " + (props.className?props.className:"") } style={{height:'400px'}} 
            name={ props.name } value={ props.value } placeholder={ props.placeholder } 
            readOnly={ props.readOnly } disabled={ props.disabled }
            onChange={ onFormEventSrcData }
            />
    )
}

export default EditTextArea;