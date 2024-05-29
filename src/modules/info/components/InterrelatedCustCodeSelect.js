import React from 'react';

const InterrelatedCustCodeSelect = ({ InterrelatedCustCodeList, onChangeSrcData  }) => {
    return (
        InterrelatedCustCodeList.length > 0 && (
            <select name="interrelatedCustCode" className="selectStyle" onChange={onChangeSrcData}>
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
