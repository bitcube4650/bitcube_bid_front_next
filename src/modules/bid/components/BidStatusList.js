import React from 'react';
import { useNavigate } from 'react-router-dom';
import ft from '../api/filters';

const BidStatusList = (props) => {

    const navigate = useNavigate();

    const clickBidDetail = (biNo) => {
        localStorage.setItem("biNo", biNo);
        navigate('/bid/status/detail');
    };

    function IsPastDate(dateString) {
        const currentDate = new Date();
        const targetDate = new Date(dateString);
        return targetDate < currentDate;
    }

    return (
         <tr>
            <td className="textUnderline">
                <a style={{cursor: "pointer"}} onClick={() => clickBidDetail(props.val.biNo)}>{ props.val.biNo }</a>
            </td>
            <td className="textUnderline text-left">
                <a style={{cursor: "pointer"}} onClick={() => clickBidDetail(props.val.biNo)} >{ props.val.biName }</a>
            </td>
            <td className={IsPastDate(props.val.estCloseDate) ? 'textHighlight' : ''}>
                <i className="fa-regular fa-timer"></i>{ props.val.estCloseDate }
            </td>
            <td>{ ft.ftBiMode(props.val.biMode) }</td>
            <td className={IsPastDate(props.val.estCloseDate) && props.val.ingTag != '개찰' ? 'textHighlight' : (props.val.ingTag == '개찰' ? 'blueHighlight' : '')}>{ props.val.ingTag }</td>
            <td>{ ft.ftInsMode(props.val.insMode) }</td>
            <td>
                <i className="fa-light fa-paper-plane-top"></i>
                <a href={'mailto:' + props.val.cuserEmail} className="textUnderline" title="담당자 메일" >{ props.val.cuser }</a>
            </td>
            <td className="end">
                <i className="fa-light fa-paper-plane-top"></i>
                <a href={'mailto:' + props.val.openerEmail} className="textUnderline" title="개찰자 메일">{ props.val.openerId }</a>
            </td>
        </tr>
    );

}

export default BidStatusList
