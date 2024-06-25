import React from 'react';
import * as CommonUtils from 'components/CommonUtils';
import { MapType } from 'components/types'

interface CustUserListProps {
    CustUser: MapType;
    isMain?: boolean;
    onUserDetailPop : any
}

function CustUserListJs(props : CustUserListProps) {

    return (
        <tr>
            <td className="text-left">
                <a onClick={()=>{props.onUserDetailPop(props.CustUser.userId)}} className="textUnderline notiTitle" >
                    { props.CustUser.userName}
                </a>
            </td>
            <td className="text-left">
                <a onClick={()=>{props.onUserDetailPop(props.CustUser.userId)}} className="textUnderline notiTitle" >
                    { props.CustUser.userId}
                </a>
            </td>
            <td>{ props.CustUser.userPosition }</td>
            <td>{ props.CustUser.userBuseo }</td>
            <td>{ CommonUtils.onAddDashTel(props.CustUser.userTel) }</td>
            <td>{ CommonUtils.onAddDashTel(props.CustUser.userHp) }</td>
            <td>{ props.CustUser.userAuth === '1' ? '업체관리자' : '일반사용자' }</td>
            <td className="end">{ props.CustUser.useYn === 'Y'? '정상' : '삭제' }</td>
        </tr>
    );
};

export default CustUserListJs;