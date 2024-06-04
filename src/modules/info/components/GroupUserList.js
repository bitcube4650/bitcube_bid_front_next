import {React} from 'react';

function GroupUserListJS(props) {
    function hpNumberAddDash(val) {
        if (!val) return '';
        val = val.toString();
        val = val.replace(/[^0-9]/g, '')
        
        let tmp = ''
        if( val.length < 4){
            return val;
        } else if(val.length <= 7) {
            tmp += val.substr(0, 3);
            tmp += '-';
            tmp += val.substr(3);
            return tmp;
        } else if(val.length == 8) {
            tmp += val.substr(0, 4);
            tmp += '-';
            tmp += val.substr(4);
            return tmp;
        } else if(val.length < 10) {
            tmp += val.substr(0, 2);
            tmp += '-';
            tmp += val.substr(2, 3);
            tmp += '-';
            tmp += val.substr(5);
            return tmp;
        } else if(val.length < 11) {
            if(val.substr(0, 2) =='02') { //02-1234-5678
            tmp += val.substr(0, 2);
            tmp += '-';
            tmp += val.substr(2, 4);
            tmp += '-';
            tmp += val.substr(6);
            return tmp;
            } else { //010-123-4567
            tmp += val.substr(0, 3);
            tmp += '-';
            tmp += val.substr(3, 3);
            tmp += '-';
            tmp += val.substr(6);
            return tmp;
            }
        } else { //010-1234-5678
            tmp += val.substr(0, 3);
            tmp += '-';
            tmp += val.substr(3, 4);
            tmp += '-';
            tmp += val.substr(7);
            return tmp;
        }
    }

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
            <td>{ hpNumberAddDash(props.groupUser.userTel) }</td>
            <td>{ hpNumberAddDash(props.groupUser.userHp) }</td>
            <td>{ props.groupUser.userAuth }</td>
            <td>{ props.groupUser.useYn }</td>
            <td className="end">{ props.groupUser.interrelatedNm }</td>
        </tr>
    );
};

export default GroupUserListJS;