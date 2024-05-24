import React from 'react';

const ListSizeSelect = ({ onSearch }) => {
	const onChangeSize = (e) => {
        onSearch(0, e.target.value);
    }

    return (
		<select onChange={onChangeSize} className="selectStyle maxWidth140px ml20">
			<option value="10">10개씩 보기</option>
			<option value="20">20개씩 보기</option>
			<option value="30">30개씩 보기</option>
			<option value="50">50개씩 보기</option>
		</select>
    );
};

export default ListSizeSelect;