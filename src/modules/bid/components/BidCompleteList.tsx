import React from 'react';
import { useNavigate } from 'react-router-dom';
import Ft from '../api/filters';
import { MapType } from 'components/types'

const BidCompleteList = (props : MapType) => {

    const navigate = useNavigate();

    const clickBidDetail = (biNo:string) => {
        localStorage.setItem("biNo", biNo);
        navigate('/bid/complete/detail');
    };

    return (
        <tr>
            <td><a onClick={()=>clickBidDetail(props.data.biNo)} className="textUnderline" title="입찰번호">{ props.data.biNo }</a></td>
            <td className="text-left"><a onClick={()=>clickBidDetail(props.data.biNo)} className="textUnderline" title="입찰명">{ props.data.biName }</a></td>
            <td>{ props.data.updateDate }</td>
            <td>{ Ft.ftBiMode(props.data.biMode) }</td>
            <td style={props.data.ingTag == 'A7' ? {color:'red'} : {}}>{ Ft.ftIngTag(props.data.ingTag) }</td>
            <td>{ Ft.ftInsMode(props.data.insMode) }</td>
            <td className="end"><i className="fa-light fa-paper-plane-top"></i> <a href={'mailto:'+props.data.userEmail} className="textUnderline" title="담당자">{ props.data.userName }</a></td>
        </tr>
    )
}

export default BidCompleteList