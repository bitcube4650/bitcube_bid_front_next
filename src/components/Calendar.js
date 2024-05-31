import React, { useEffect, useRef } from 'react';
import $ from 'jquery';
import 'jquery-ui-dist/jquery-ui.css';  // jQuery UI CSS 추가
import 'jquery-ui/ui/widgets/datepicker';

const Calendar = ({
  calendarId = 'datepicker',
  className = 'datepicker',
  styleProps = {},
  initDate = '',
  customOption = {},
  params = {},
  maxDate,
  minDate,
  onUpdateDate
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const defaultOption = {
      dateFormat: "yy-mm-dd",
      monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      dayNames: ['일', '월', '화', '수', '목', '금', '토'],
      dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
      dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
      changeMonth: true,
      changeYear: true,
      showMonthAfterYear: true,
      showOtherMonths: true,
      selectOtherMonths: true,
      onSelect: (date) => onUpdateDate && onUpdateDate(date, params),
      maxDate,
      minDate
    };

    $(inputRef.current).datepicker({ ...customOption, ...defaultOption });

    return () => {
      $(inputRef.current).datepicker('hide').datepicker('destroy');
    };
  }, [customOption, maxDate, minDate, onUpdateDate, params]);

  return (
    <input
      ref={inputRef}
      type="text"
      id={calendarId}
      className={className}
      style={styleProps}
      defaultValue={initDate}
      autoComplete="off"
      readOnly
    />
  );
};

export default Calendar;
