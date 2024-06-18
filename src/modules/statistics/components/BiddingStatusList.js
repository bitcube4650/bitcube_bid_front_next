import {React} from 'react';

function BiddingStatusListJs(props) {
    return (
        <tr>
            <td className="text-left" >{props.biddingStatus.interrelatedNm }</td>
            <td className="text-right">{props.biddingStatus.planCnt.toLocaleString() }</td>
            <td className="text-right">{props.biddingStatus.planAmt.toLocaleString() }</td>
            <td className="text-right">{props.biddingStatus.ingCnt.toLocaleString() }</td>
            <td className="text-right">{props.biddingStatus.ingAmt.toLocaleString() }</td>
            <td className="text-right">{props.biddingStatus.succCnt.toLocaleString() }</td>
            <td className="text-right">{props.biddingStatus.succAmt.toLocaleString() }</td>
            <td className="text-right">{props.biddingStatus.custCnt.toLocaleString() }</td>
            <td className="text-right">{props.biddingStatus.regCustCnt.toLocaleString() }</td>
            <td className="end"></td>
        </tr>
    );
};

export default BiddingStatusListJs;