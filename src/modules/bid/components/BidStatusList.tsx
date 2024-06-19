import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapType } from '../../../components/types';
import ft from '../api/filters';

const BidStatusList = (props:MapType) => {

    const navigate = useNavigate();

    const onClickBidDetail = (biNo:string) => {
        localStorage.setItem("biNo", biNo);
        navigate('/bid/status/detail');
    };

    function fnIsPastDate(dateString:Date) {
        const currentDate = new Date();
        const targetDate = new Date(dateString);
        return targetDate < currentDate;
    }

    return (
         <tr>
            <td className="textUnderline">
                <a href="#" style={{cursor: "pointer"}} onClick={() => onClickBidDetail(props.val.biNo)}>{ props.val.biNo }</a>
            </td>
            <td className="textUnderline text-left">
                <a href="#" style={{cursor: "pointer"}} onClick={() => onClickBidDetail(props.val.biNo)} >{ props.val.biName }</a>
            </td>
            <td className={fnIsPastDate(props.val.estCloseDate) ? 'textHighlight' : ''}>
                <i className="fa-regular fa-timer"></i>{ props.val.estCloseDate }
            </td>
            <td>{ ft.ftBiMode(props.val.biMode) }</td>
            <td className={fnIsPastDate(props.val.estCloseDate) && props.val.ingTag !== '개찰' ? 'textHighlight' : (props.val.ingTag === '개찰' ? 'blueHighlight' : '')}>{ props.val.ingTag }</td>
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
