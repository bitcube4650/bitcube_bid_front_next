import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as CommonUtils from 'components/CommonUtils';
import { ListProps } from 'components/types'
import { useRouter } from 'next/router';

function NoticeList(props: ListProps) {
    //const navigate = useNavigate();
    const router = useRouter();

    function onNoticeDetail() {
        axios.post("/api/v1/notice/updateClickNum", {'bno': props.content.bno}); //클릭 시 조회수 +1
        router.push('/noticeDetail/' + props.content.bno);
    }

    if(!props.isMain) {
        return (
            <tr>
                <td>{ props.content.rowNo }</td>
                <td className="text-left">
                    <a onClick={ onNoticeDetail } className="textUnderline notiTitle" title="공지사항 자세히 보기">
                        { props.content.bco == 'ALL' && <span>[공통] </span> }
                        { props.content.btitle }
                    </a>
                </td>
                <td>
                    { props.content.bfile && <i className="fa-regular fa-file-lines notiFile"></i> }
                </td>
                <td>{ props.content.buserName }</td>
                <td>{ props.content.bdate }</td>
                <td className="end">{ CommonUtils.onComma(props.content.bcount) }</td>
            </tr>
        );
    } else {
        return (
            <a onClick={ onNoticeDetail } >
                <span>
                    { props.content.bco == 'ALL' && <span>[공통] </span> }
                    { props.content.btitle }
                </span>
                <span>
                    { props.content.bdate }
                </span>
            </a>
        )
    }
};

export default NoticeList;