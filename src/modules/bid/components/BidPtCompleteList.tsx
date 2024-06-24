import React from 'react';
import { useNavigate } from 'react-router-dom';
import Ft from '../api/filters';
import { MapType } from 'components/types'

interface props {
    data: MapType;
}

const BidPtCompleteList:React.FC<props> = ({data}) => {

    const navigate = useNavigate();

    const onClickBidDetail = (biNo:string) => {
        localStorage.setItem("biNo", biNo);
        navigate('/bid/partnerComplete/detail');
    };

    function fnSuccYn(val:string){
        if(val === 'Y'){ return '선정(낙찰)'}
        else if(val === undefined || val === null || val === 'N'){ return '비선정'}
    }

    return (
        <tr>
            <td><a onClick={()=>onClickBidDetail(data.biNo)} className="textUnderline" title="입찰번호">{ data.biNo }</a></td>
            <td className="text-left"><a onClick={()=>onClickBidDetail(data.biNo)} className="textUnderline" title="입찰명">{ data.biName }</a></td>
            <td>{ data.bidOpenDate }</td>
            <td>{ Ft.ftBiMode(data.biMode) }</td>
            <td style={data.succYn === 'Y' ? {color:'red'} : {}}>{ fnSuccYn(data.succYn) }</td>
            <td>{ Ft.ftInsMode(data.insMode) }</td>
            <td className="end"><i className="fa-light fa-paper-plane-top"></i> <a href={'mailto:' + data.userEmail} className="textUnderline" title="담당자">{ data.userName }</a></td>
        </tr>
    )
}

export default BidPtCompleteList