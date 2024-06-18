import React from 'react'
import { ko } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';


const Datepicker = ({srcData, setSrcData}) => {
	const onChgStartDate = (day) => {
		const selectedDate = new Date(day)
		const formattedDate = format(selectedDate, 'yyyy-MM-dd');
		setSrcData({
			...srcData,
			startDay: formattedDate
		});
	}
	const onChgEndDate = (day) => {
		const selectedDate = new Date(day)
		const formattedDate = format(selectedDate, 'yyyy-MM-dd');
		setSrcData({
			...srcData,
			endDay: formattedDate
		});
	}

	return (
		<>
			<DatePicker className="datepicker inputStyle" locale={ko} shouldCloseOnSelect dateFormat="yyyy-MM-dd" selected={srcData.startDay} onChange={(date) => onChgStartDate(date)} />
			<span style={{ margin : "0px 10px" }}>~</span>
			<DatePicker className="datepicker inputStyle" locale={ko} shouldCloseOnSelect dateFormat="yyyy-MM-dd" selected={srcData.endDay}  onChange={(date) => onChgEndDate(date)} />
		</>
	)
}

export default Datepicker
