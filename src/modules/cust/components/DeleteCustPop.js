import axios from 'axios'
import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import Swal from 'sweetalert2'
import * as CommonUtils from 'components/CommonUtils';

/**
 * 업체 반려 및 삭제시 사유 작성 팝업
 * @returns 
 */
const DeleteCustPop = ({deletePop, setDeletePop, isApproval, custCode, onMoveList}) => {
	const [etc, setEtc] = useState("")
	const title = isApproval ? '반려' : '삭제'

	// 반려 사유 팝업 호출
	const onRefuse = () => {
		if(CommonUtils.isEmpty(etc)){
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
			etc : etc
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
		if(CommonUtils.isEmpty(etc)){
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
			etc : etc,
		})
		
		let result = response.data
		if(result.code == 'ERROR'){
			Swal.fire('', result.msg, 'success');
		} else {
			Swal.fire('', '삭제되었습니다.', 'success');
			onMoveList();
		}
	}

	return (
		<Modal className='fade modalStyle' id="deleteCustPop" show={deletePop} dialogClassName="modal-m">
			<Modal.Body>
			<button data-dismiss="modal" title="닫기" className="ModalClose" onClick={() => setDeletePop(false)}><i className="fa-solid fa-xmark"></i></button>
			<h2 className="modalTitle">업체{isApproval ? `등록 ${title}` : ` ${title}`}</h2>
			<div className="modalTopBox">
				<ul>
					<li>
						{isApproval
						?	<div>
								업체 등록을 반려합니다.<br />
								아래 반려 사유를 입력해 주십시오.<br />
								반려 처리 시 반려사유 내용으로 업체에게 발송 됩니다.
							</div>
						:
						<div>
							삭제사유를 작성되어야 삭제할 수 있습니다.<br />
							삭제 후 다시 정상으로 되 돌릴 수 없습니다.<br />
							삭제 하시겠습니까?
						</div>
}
					</li>
				</ul>
			</div>
			<textarea placeholder={isApproval ? '반려사유 필수 입력' : '삭제사유 필수 입력'} className="textareaStyle height150px mt20" onChange={(e) => setEtc(e.target.value)}></textarea>
			<div className="modalFooter">
				<button data-dismiss="modal" title="취소" className="modalBtnClose" onClick={() => setDeletePop(false)}>취소</button>
				<button data-toggle="modal" title={title} className="modalBtnCheck" onClick={isApproval? onRefuse : onDelete}>{title}</button>
			</div>
			</Modal.Body>
		</Modal>
	)
}

export default DeleteCustPop