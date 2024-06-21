import React from 'react';
import { EditInputRadioProps } from 'components/types'

/**
 * @param props 
    editData: MapType;
    setEditData: Dispatch<SetStateAction<MapType>>;
    id: string;
    name: string;
    value: string;
    label: string;
    checked?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
 * @returns 
 */
const EditInputRadio = (props: EditInputRadioProps) => {
    const onFormEventSrcData = (e: React.FormEvent<HTMLInputElement>) => {
        props.setEditData({
            ...props.editData,
            [e.currentTarget.name]: e.currentTarget.value
        });
    }

    return (
        <>
            <input type="radio" className={ "radioStyle " + (props.className?props.className:"") }
                id={ props.id }
                name={ props.name }
                value={ props.value }
                onChange={ onFormEventSrcData }
                checked={ props.checked }
                disabled={ props.disabled }
                readOnly={ props.readOnly }
                />
            <label htmlFor={ props.id }>{ props.label }</label>
        </>
    )
}

export default EditInputRadio;