import React from 'react';
import { useNavigate } from 'react-router-dom';
import Ft from '../api/filters';

const BidCompleteList = ({data}) => {

    const navigate = useNavigate();

    const clickBidDetail = (biNo) => {
        localStorage.setItem("biNo", biNo);
        navigate('/bid/complete/detail');
    };

    return (
        <tr>
            <td><a onClick={()=>clickBidDetail(data.biNo)} className="textUnderline" title="입찰번호">{ data.biNo }</a></td>
            <td className="text-left"><a onClick={()=>clickBidDetail(data.biNo)} className="textUnderline" title="입찰명">{ data.biName }</a></td>
            <td>{ data.updateDate }</td>
            <td>{ Ft.ftBiMode(data.biMode) }</td>
            <td style={data.ingTag == 'A7' ? {color:'red'} : {}}>{ Ft.ftIngTag(data.ingTag) }</td>
            <td>{ Ft.ftInsMode(data.insMode) }</td>
            <td className="end"><i className="fa-light fa-paper-plane-top"></i> <a href={'mailto:'+data.userEmail} className="textUnderline" title="담당자">{ data.userName }</a></td>
        </tr>
    )
}

export default BidCompleteList