import axios from 'axios'
import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import Swal from 'sweetalert2'
import * as CommonUtils from 'components/CommonUtils';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { DeleteCustListProps } from '../types/types';
import EditTextArea from 'components/input/EditTextArea';
import { MapType } from 'components/types'

/**
 * 업체 반려 및 삭제, 탈퇴시 사유 작성 팝업
 * @returns 
 */
const DeleteCustPop = ({deletePop, setDeletePop, deleteType, custCode, onMoveList} : DeleteCustListProps) => {
	// const [etc, setEtc] = useState("")
	const [etcInfo, setEtcInfo]	= useState<MapType>({
		etc : ''
	})
	const navigate = useNavigate();
	const [cookies, setCookie, removeCookie] = useCookies<string>(['username']);
	const title = deleteType === "refuse" ? '반려' : (deleteType === "delete" ? "삭제" : "회원탈퇴")

	// 반려 사유 팝업 호출
	const onRefuse = () => {
		if(CommonUtils.isEmpty(etcInfo.etc)){
			Swal.fire('', '반려 사유를 입력해주세요.', 'warning')
			return;
		}

		Swal.fire({
			title: "",
			text : '반려처리하시겠습니까?',
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#004B9E",
			confirmButtonText: "반려",
			cancelButtonColor: "#b70b2e",
			cancelButtonText : '취소',
		}).then((result) => {
			if (result.isConfirmed) {
				onRefuseCallback()
			}
		})
	}

	// 업체 반려 처리
	const onRefuseCallback = async() => {
		const response = await axios.post('/api/v1/cust/back', {
			custCode : custCode,
			etc : etcInfo.etc
		})
		
		let result = response.data
		if(result.code == 'ERROR'){
			Swal.fire('', result.msg, 'success');
		} else {
			Swal.fire('', '반려되었습니다.', 'success');
			onMoveList();
		}
	}

	// 삭제 사유 팝업 호출
	const onDelete = () => {
		if(CommonUtils.isEmpty(etcInfo.etc)){
			Swal.fire('', '삭제 사유를 입력해주세요.', 'warning')
			return;
		}

		Swal.fire({
			title: "",
			text : '삭제처리하시겠습니까?',
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#004B9E",
			confirmButtonText: "삭제",
			cancelButtonColor: "#b70b2e",
			cancelButtonText : '취소',
		}).then((result) => {
			if (result.isConfirmed) {
				onDeleteCallback()
			}
		})
	}

	// 업체 삭제 처리
	const onDeleteCallback = async() => {
		const response = await axios.post('/api/v1/cust/del', {
			custCode : custCode,
			etc : etcInfo.etc,
		})
		
		let result = response.data
		if(result.code == 'ERROR'){
			Swal.fire('', result.msg, 'success');
		} else {
			Swal.fire('', '삭제되었습니다.', 'success');
			onMoveList();
		}
	}
	
	// 업체 탈퇴 처리
	const onLeave = async() => {
		if(CommonUtils.isEmpty(etcInfo.etc)){
			Swal.fire('', '탈퇴 사유를 입력해주세요.', 'warning')
			return;
		}

		Swal.fire({
			title: "",
			text : '탈퇴 하시겠습니까?',
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#004B9E",
			confirmButtonText: "회원탈퇴",
			cancelButtonColor: "#b70b2e",
			cancelButtonText : '취소',
		}).then((result) => {
			if (result.isConfirmed) {
				onLeaveCallback()
			}
		})
	}

	const onLeaveCallback = async() => {
		const response = await axios.post('/api/v1/cust/leave', {
			custCode : custCode,
			etc : etcInfo.etc,
		})
		
		let result = response.data
		if(result.code == 'ERROR'){
			Swal.fire('', result.msg, 'success');
		} else {
			// 로그아웃
			axios.post("/logout", {}).then((response) => {
				const status = response.status;
				if(status == 200) {
					removeCookie("loginInfo");
					localStorage.clear();
					navigate('/');
				} else {
					Swal.fire('', '로그아웃 처리에 실패하였습니다.', 'error');
				}
			});
		}
	}

	return (
		<Modal className='fade modalStyle' id="deleteCustPop" show={deletePop} dialogClassName="modal-m">
			<Modal.Body>
			<button data-dismiss="modal" title="닫기" className="ModalClose" onClick={() => setDeletePop(false)}><i className="fa-solid fa-xmark"></i></button>
			<h2 className="modalTitle">
				{
					deleteType === "refuse" ? '업체등록 반려' :(deleteType === "delete" ? '업체 삭제' : '회원 탈퇴')
				}
			</h2>
			<div className="modalTopBox">
				<ul>
					<li>
						{deleteType === "refuse"
						?	<div>
								업체 등록을 반려합니다.<br />
								아래 반려 사유를 입력해 주십시오.<br />
								반려 처리 시 반려사유 내용으로 업체에게 발송 됩니다.
							</div>
						:
							(deleteType === "delete"
							?	<div>
									삭제사유를 작성되어야 삭제할 수 있습니다.<br />
									삭제 후 다시 정상으로 되 돌릴 수 없습니다.
								</div>
							:	<div>
									탈퇴사유를 입력해 주십시오.<br/>
									탈퇴처리 시 로그아웃 처리 되고 다시 로그인 할 수 없습니다	
								</div>
							)
						}
					</li>
				</ul>
			</div>

			<EditTextArea editData={ etcInfo } setEditData={ setEtcInfo } name="etc" value={ etcInfo.etc } placeholder={deleteType === "refuse" ? '반려사유 필수 입력' :(deleteType === "delete" ? '삭제사유 필수 입력' : '탈퇴사유 필수 입력')} />
			<div className="modalFooter">
				<button data-dismiss="modal" title="취소" className="modalBtnClose" onClick={() => setDeletePop(false)}>취소</button>
				<button data-toggle="modal" title={title} className="modalBtnCheck" onClick={deleteType === "refuse" ? onRefuse :(deleteType === "delete" ? onDelete : onLeave)}>{title}</button>
			</div>
			</Modal.Body>
		</Modal>
	)
}

export default DeleteCustPop