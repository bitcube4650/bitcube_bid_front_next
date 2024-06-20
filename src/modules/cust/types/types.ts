import { MapType } from 'components/types'
import { Dispatch, SetStateAction } from 'react';

export interface CustListProps {
	custList: MapType;
	isApproval?: boolean;
	onUserListPop :Function;
}

export interface CustInfoProps {
	custInfo: MapType;
	setCustInfo : Dispatch<SetStateAction<MapType>>;
	isApproval?: boolean;
}


export interface SaveCustInfoProps {
	custInfo: MapType;
	isEdit? :boolean;
	setCustInfo : Dispatch<SetStateAction<MapType>>;
	setSelCustCode: Dispatch<SetStateAction<string>>;
	setUploadRegnumFile: Dispatch<SetStateAction<File|null|undefined>>;
	setUploadBFile: Dispatch<SetStateAction<File|null|undefined>>;
}

export interface SaveCustAdminProps {
	custInfo: MapType;
	isEdit? :boolean;
	setCustInfo : Dispatch<SetStateAction<MapType>>;
}

export interface OtherCustListProps {
	otherCustModal: boolean;
	setOtherCustModal: Dispatch<SetStateAction<boolean>>;
	setSelCustCode: Dispatch<SetStateAction<string>>;
}

export interface DeleteCustListProps {
	deletePop : boolean;
	setDeletePop : Dispatch<SetStateAction<boolean>>;
	deleteType : string,
	custCode : string,
	onMoveList : Function;
}