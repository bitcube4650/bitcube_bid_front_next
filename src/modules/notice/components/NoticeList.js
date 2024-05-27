import React from 'react';
import { useNavigate } from 'react-router-dom';

function NoticeList(props) {
    const navigate = useNavigate();

    function onNoticeDetail() {
        //todo: 클릭 시 조회수 +1
        navigate('/noticeDetail/' + props.notice.bno);
    }

    return (
        <tr>
            <td>{ props.notice.rowNo }</td>
            <td className="text-left">
                <a onClick={ onNoticeDetail } className="textUnderline notiTitle" title="공지사항 자세히 보기">
                    { props.notice.bco == 'ALL' && <span>[공통] </span> }
                    { props.notice.btitle }
                </a>
            </td>
            <td>
                { props.notice.bfile && <i className="fa-regular fa-file-lines notiFile"></i> }
            </td>
            <td>{ props.notice.buserName }</td>
            <td>{ props.notice.bdate }</td>
            <td className="end">{ props.notice.bcount }</td>
        </tr>
    );
};

export default NoticeList;