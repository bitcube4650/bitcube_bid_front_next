import React from 'react';
import { useParams } from 'react-router-dom';

const NoticeDetail = () => {
    const { bno } = useParams();

    return (
        <div className="conRight">
            NoticeDetail {bno}
        </div>
    );
};

export default NoticeDetail;