import React from 'react';
import { EditInputProps } from 'components/types'

const EditTextArea = (props: EditInputProps) => {
    const onFormEventSrcData = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        props.setEditData({
            ...props.editData,
            [e.target.name]: e.target.value
        });
    }

    return (
        <textarea className="textareaStyle notiBox overflow-y-auto" style={{height:'400px'}} 
            onChange={ onFormEventSrcData } name={ props.name } defaultValue={ props.defaultValue } />
    )
}

export default EditTextArea;