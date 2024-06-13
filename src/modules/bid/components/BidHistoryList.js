import React from 'react'
import Ft from '../api/filters';

const BidHistoryList = ({data, lotteMat, onSetPopData}) => {
    return (
        <tr>
            <td>{ data.biNo }</td>
            {lotteMat && 
            <>
            <td>{ data.matDept }</td>
            <td>{ data.matProc }</td>
            <td>{ data.matCls }</td>
            <td>{ data.matFactory }</td>
            <td>{ data.matFactoryLine }</td>
            <td>{ data.matFactoryCnt }</td>
            </>
            }
            <td className="text-left">{ data.biName }</td>
            <td className="text-right">{ Ft.numberWithCommas(data.bdAmt) }</td>
            <td className="text-right">{ Ft.numberWithCommas(data.succAmt) }</td>
            <td className="text-left">{ data.custName }</td>
            <td>
                <a onClick={()=>onSetPopData(data.biNo)} className="textUnderline" title="투찰 정보 페이지가 열림" >{ data.joinCustCnt }</a>
            </td>
            <td>{ data.estStartDate }</td>
            <td>{ data.estCloseDate }</td>
            <td className="end">{ data.userName }</td>
        </tr>
    )
}

export default BidHistoryList