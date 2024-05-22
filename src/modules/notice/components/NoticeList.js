import React from 'react';

function NoticeList(props) {
    return (
        <tr>
            <td>{ props.notice.rowNo }</td>
            <td className="text-left"><a click="clickNoticeDetail(val)" className="textUnderline notiTitle" title="공지사항 자세히 보기"><span v-if="val.bco == 'ALL'">[공통] </span>{ props.notice.btitle }</a></td>
            <td><i v-if="val.bfile" className="fa-regular fa-file-lines notiFile"></i></td>
            <td>{ props.notice.buserName }</td>
            <td>{ props.notice.bdate }</td>
            <td className="end">{ props.notice.bcount }</td>
        </tr>
    );
};

export default NoticeList;