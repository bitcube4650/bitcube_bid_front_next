import React from 'react';
import { EditInputProps } from 'components/types'

const EditInput = (props: EditInputProps) => {
    const onFormEventSrcData = (e: React.FormEvent<HTMLInputElement>) => {
        props.setEditData({
            ...props.editData,
            [e.currentTarget.name]: e.currentTarget.value
        });
    }

    return (
        <input type="text" className="inputStyle" placeholder=""
        defaultValue={ props.defaultValue }
        name={ props.name } maxLength={ props.maxLength }
        onKeyUp={ onFormEventSrcData }
        />
    )
}

export default EditInput;