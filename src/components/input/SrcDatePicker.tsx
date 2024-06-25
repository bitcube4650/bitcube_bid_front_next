import React from 'react';
import { SrcDatePickerProps } from '../types'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { ko } from "date-fns/locale";

/**
 * props = {name, selected, srcData, setSrcData}
 * @param props 
 * @returns 
 */
const SrcDatePicker = (props: SrcDatePickerProps) => {
    const onFormEventSrcData = (date: Date) => {
        const selectedDate = new Date(date)
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');

        props.setSrcData({
            ...props.srcData,
            [props.name]: formattedDate
        });
    }

    return (
        <>
            <DatePicker className="datepicker inputStyle" locale={ko} selected={props.selected} shouldCloseOnSelect onChange={onFormEventSrcData} dateFormat="yyyy-MM-dd" minDate={props.minDate}/>
        </>
    )
}

export default SrcDatePicker;