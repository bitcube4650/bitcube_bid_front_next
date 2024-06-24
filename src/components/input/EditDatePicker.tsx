import React from 'react';
import { EditDatePickerProps } from '../types'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { ko } from "date-fns/locale";

/**
 * props = {name, selected, data, setData}
 * @param props 
 * @returns 
 */
const EditDatePicker = (props: EditDatePickerProps) => {
    const onFormEventSrcData = (date: Date) => {
        const selectedDate = new Date(date)
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');

        if(typeof props.data === "string"){
            props.setData(formattedDate);
        }else{
            props.setData({
                ...props.data,
                [props.name]: formattedDate
            });
        }
    }

    return (
        <>
            <DatePicker className="datepicker inputStyle" locale={ko} selected={props.selected} shouldCloseOnSelect onChange={onFormEventSrcData} dateFormat="yyyy-MM-dd"/>
        </>
    )
}

export default EditDatePicker;