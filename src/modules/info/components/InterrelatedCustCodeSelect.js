import React from 'react';

const InterrelatedCustCodeSelect = ({ InterrelatedCustCodeList }) => {
    return (
        InterrelatedCustCodeList.length > 0 && (
            <select className="selectStyle">
                <option value="">전체</option>
                {InterrelatedCustCodeList.map((option, index) => (
                    <option key={index} value={option.interrelatedCustCode}>
                        {option.interrelatedNm}
                    </option>
                ))}
            </select>
        )
    );
};

export default InterrelatedCustCodeSelect;
