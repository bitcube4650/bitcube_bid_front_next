import React from 'react'
import { useNavigate } from 'react-router-dom';
import Ft from '../api/filters';

const PartnerBidStatusList = ({data}) => {

    const navigate = useNavigate();

    const clickBidDetail = (biNo) => {
        localStorage.setItem("biNo", biNo);
        navigate('/bid/partnerStatus/detail');
    };

    function fnIsPastDate(dateString) {
        const currentDate = new Date();
        const targetDate = new Date(dateString);
        return targetDate < currentDate;
    }

    function fnIngTag(data) {
        let ingTag = data.ingTag;
        let esmtYn = data.esmtYn;

        if(ingTag === 'A3' && (esmtYn === '0' || esmtYn === '1')){
            return '미투찰(재입찰)'
        }else if(esmtYn === undefined || esmtYn === null || esmtYn === '' || esmtYn === '0' || esmtYn === '1'){
            return '미투찰'
        }else if(esmtYn === '2'){
            return '투찰'
        }
        return '';
    }

    return (
        <tr>
            <td className="textUnderline">
                <a href={()=>false} style={{cursor: "pointer"}} className={!(data.ingTag === 'A3' && data.rebidAtt === 'N') && fnIsPastDate(data.estStartDate) && !fnIsPastDate(data.estCloseDate) && data.esmtYn !== '2' ? 'blueHighlight' : ''} onClick={() => clickBidDetail(data.biNo)}>{ data.biNo }</a>
            </td>
            <td className="textUnderline text-left">
                <a href={()=>false} style={{cursor: "pointer"}} className={!(data.ingTag === 'A3' && data.rebidAtt === 'N') && fnIsPastDate(data.estStartDate) && !fnIsPastDate(data.estCloseDate) && data.esmtYn !== '2' ? 'blueHighlight' : ''} onClick={() => clickBidDetail(data.biNo)} >{ data.biName }</a>
            </td>
            <td className={!(data.ingTag === 'A3' && data.rebidAtt === 'N') && fnIsPastDate(data.estStartDate) && !fnIsPastDate(data.estCloseDate) && data.esmtYn !== '2' ? 'blueHighlight' : ''}>
                <i className="fa-regular fa-timer"></i>{ data.estStartDate }
            </td>
            <td className={!(data.ingTag === 'A3' && data.rebidAtt === 'N') && fnIsPastDate(data.estStartDate) && !fnIsPastDate(data.estCloseDate) && data.esmtYn !== '2' ? 'blueHighlight' : ''}>
                 <i className="fa-regular fa-timer"></i>{ data.estCloseDate }
             </td>
            <td>{ Ft.ftBiMode(data.biMode) }</td>
            <td><span className={data.esmtYn === '2' ? 'blueHighlight' : ''} style={!(data.ingTag === 'A3' && data.rebidAtt === 'N') && data.esmtYn !== '2' && fnIsPastDate(data.estStartDate) && !fnIsPastDate(data.estCloseDate) ? {color:'red'} : {} }>{fnIngTag(data)}</span></td>
            <td>{ Ft.ftInsMode(data.insMode) }</td>
            <td className="end">
                <i className="fa-light fa-paper-plane-top"></i>
                <a href={'mailto:' + data.damdangEmail} className="textUnderline" title="담당자 메일" >{ data.damdangName }</a>
            </td>
        </tr>
    )
}

export default PartnerBidStatusList