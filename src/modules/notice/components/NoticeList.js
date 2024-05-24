import React from 'react';
import { Link } from "react-router-dom";

function NoticeList(props) {
    //todo: 클릭 시 조회수 +1

    return (
        <tr>
            <td>{ props.notice.rowNo }</td>
            <td className="text-left">
                <Link to={'/noticeDetail/' + props.notice.bno} className="textUnderline notiTitle" title="공지사항 자세히 보기">
                    { props.notice.bco == 'ALL'?<span>[공통] </span>:"" }
                    { props.notice.btitle }
                </Link>
            </td>
            <td>
                { props.notice.bfile?<i className="fa-regular fa-file-lines notiFile"></i>:"" }
            </td>
            <td>{ props.notice.buserName }</td>
            <td>{ props.notice.bdate }</td>
            <td className="end">{ props.notice.bcount }</td>
        </tr>
    );
};

export default NoticeList;