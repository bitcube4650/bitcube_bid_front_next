import React from 'react';
import { EditInputRadioProps } from 'components/types'

const EditInputRadio = (props: EditInputRadioProps) => {
    const onFormEventSrcData = (e: React.FormEvent<HTMLInputElement>) => {
        props.setEditData({
            ...props.editData,
            [e.currentTarget.name]: e.currentTarget.value
        });
    }

    return (
        <>
            <input type="radio" className="radioStyle" 
                id={ props.id }
                name={ props.name }
                value={ props.value }
                onChange={ onFormEventSrcData }
                checked={ props.checked }
                disabled={ props.disabled }
                />
            <label htmlFor={ props.id }>{ props.label }</label>
        </>
    )
}

export default EditInputRadio;