import { MapType } from 'components/types'
import { Dispatch, SetStateAction } from 'react';

// 업체 정보 > 업체관리 및 업체 승인 리스트 props
export interface CustListProps {
	custList: MapType;
	isApproval?: boolean;
	onUserListPop :Function;
}

// 업체 정보 > 업체 상세 props
export interface CustInfoProps {
	custInfo: MapType;
	setCustInfo : Dispatch<SetStateAction<MapType>>;
	isApproval?: boolean;
}

// 업체 정보 > 업체 등록 및 수정 > 회사정보 props
export interface SaveCustInfoProps {
	custInfo: MapType;
	isEdit? :boolean;
	setCustInfo : Dispatch<SetStateAction<MapType>>;
	setSelCustCode: Dispatch<SetStateAction<string>>;
	setUploadRegnumFile: Dispatch<SetStateAction<File|null|undefined>>;
	setUploadBFile: Dispatch<SetStateAction<File|null|undefined>>;
}

// 업체 정보 > 업체 등록 및 수정 > 관리자정보 props
export interface SaveCustAdminProps {
	custInfo: MapType;
	isEdit? :boolean;
	setCustInfo : Dispatch<SetStateAction<MapType>>;
}

// 업체 정보 > 타사계열사 업체 props
export interface OtherCustListProps {
	otherCustModal: boolean;
	setOtherCustModal: Dispatch<SetStateAction<boolean>>;
	setSelCustCode: Dispatch<SetStateAction<string>>;
}

// 업체 정보 > 업체 반려 / 삭제 / 회원탈퇴 props
export interface DeleteCustListProps {
	deletePop : boolean;
	setDeletePop : Dispatch<SetStateAction<boolean>>;
	deleteType : string,
	custCode : string,
	onMoveList : Function;
}