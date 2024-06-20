import { MapType } from 'components/types'
import { Dispatch, SetStateAction } from 'react';

export interface CustListProps {
	custList: MapType;
	isApproval?: boolean;
	onUserListPop :Function;
}

export interface CustInfoProps {
	custInfo: MapType;
	isApproval?: boolean;
}


export interface SaveCustInfoProps {
	custInfo: MapType;
	isEdit? :boolean;
	setCustInfo : Dispatch<SetStateAction<MapType>>;
    setSelCustCode: Dispatch<SetStateAction<string>>;
}
