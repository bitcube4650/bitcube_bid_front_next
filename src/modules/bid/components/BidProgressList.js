import React from 'react';
import { useNavigate } from 'react-router-dom';

function BidProgressList(props) {
    const navigate = useNavigate();
    const data = props.progressList
    const onBidProgressDetail = () =>{
        navigate(`/bid/progress/detail/${data.biNo}`, {state: {viewType: '상세'}});
    }

    return (
        <tr>

            {/* <td>{ props.progresslist.biNo }</td>
            <td className="text-left">
                <a onClick={ onNoticeDetail } className="textUnderline notiTitle" title="입찰계획 상세">
                    { props.progresslist.bco == 'ALL'?<span>[공통] </span>:"" }
                    { props.progresslist.btitle }
                </a>
            </td>
            <td>
                { props.progresslist.bfile?<i className="fa-regular fa-file-lines notiFile"></i>:"" }
            </td>
            <td>{ props.progresslist.buserName }</td>
            <td>{ props.progresslist.bdate }</td>
            <td className="end">{ props.progresslist.bcount }</td> */}

            <td className="textUnderline" onClick={onBidProgressDetail}>
                <a style={{cursor: 'pointer'}}>{data.biNo}</a>
            </td>
            <td className="textUnderline text-left" onClick={onBidProgressDetail}>
                <a style={{cursor: 'pointer'}}>{data.biName}</a>
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