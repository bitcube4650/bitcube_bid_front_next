import React from 'react';
//import { useNavigate } from 'react-router-dom';
import { MapType } from '../../../components/types';
import { useRouter } from 'next/router';

const BidProgressList = (props : MapType) => {
    //const navigate = useNavigate();
    const router = useRouter();
    const data = props.progressList
    const onBidProgressDetail = () =>{

      router.push({
        pathname: '/bid/progress/detail',
        query: {  biNo : data.biNo }
    });

    }

    return (
        <tr>
            <td onClick={()=>{onBidProgressDetail()}}>
                <button className="textUnderline">{data.biNo}</button>
            </td>
            <td className="text-left" onClick={()=>{onBidProgressDetail()}}>
                <button className='textUnderline'>{data.biName}</button>
            </td >
            <td >
              <i className="fa-regular fa-timer"></i>{data.estStartDate}
              </td>
            <td>
              <i className="fa-regular fa-timer"></i>{data.estCloseDate}
            </td>
            <td>{data.biMode}</td>
            <td>{data.insMode}</td>
            <td>
              <i className="fa-light fa-paper-plane-top"></i>
              <a
                href={`mailto:${data.cuserEmail}`}
                className="textUnderline"
                title="담당자 메일">{data.cuser}</a>
            </td>
            <td className="end">
              <i className="fa-light fa-paper-plane-top"></i>
              <a
                href={`mailto:${data.gongoEmail}`}
                className="textUnderline"
                title="공고자 메일"
                >{data.gongoId}
                </a>
            </td>
        </tr>
    );
};

export default BidProgressList;