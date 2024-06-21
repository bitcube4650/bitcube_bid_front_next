import React from 'react';
import * as CommonUtils from 'components/CommonUtils';
import { MapType } from 'components/types'

interface GroupUserListProps {
    groupUser: MapType;
    isMain?: boolean;
    onUserDetailPopUserIdChange : any
}

function GroupUserListJS(props : GroupUserListProps) {
    return (
        <tr>
            <td className="text-left">
                <a onClick={()=>{props.onUserDetailPopUserIdChange(props.groupUser.userId)}} className="textUnderline notiTitle" >
                    { props.groupUser.userName}
                </a>
            </td>
            <td className="text-left">
                <a onClick={()=>{props.onUserDetailPopUserIdChange(props.groupUser.userId)}} className="textUnderline notiTitle" >
                    { props.groupUser.userId}
                </a>
            </td>
            <td>{ props.groupUser.userPosition }</td>
            <td>{ props.groupUser.deptName }</td>
            <td>{ CommonUtils.onAddDashTel(props.groupUser.userTel) }</td>
            <td>{ CommonUtils.onAddDashTel(props.groupUser.userHp) }</td>
            <td>{ props.groupUser.userAuth }</td>
            <td>{ props.groupUser.useYn }</td>
            <td className="end">{ props.groupUser.interrelatedNm }</td>
        </tr>
    );
};

export default GroupUserListJS;