import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as CommonUtils from 'components/CommonUtils';

function NoticeList(props) {
    const navigate = useNavigate();

    function onNoticeDetail() {
        axios.post("/api/v1/notice/updateClickNum", {'bno': props.notice.bno}); //클릭 시 조회수 +1
        navigate('/noticeDetail/' + props.notice.bno);
    }

    if(!props.isMain) {
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
                <td className="end">{ CommonUtils.onComma(props.notice.bcount) }</td>
            </tr>
        );
    } else {
        return (
            <a onClick={ onNoticeDetail } >
                <span>
                    { props.notice.bco == 'ALL' && <span>[공통] </span> }
                    { props.notice.btitle }
                </span>
                <span>
                    { props.notice.bdate }
                </span>
            </a>
        )
    }
};

export default NoticeList;