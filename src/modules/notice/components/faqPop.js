import React, {useImperativeHandle, forwardRef, useState} from 'react'
import axios from 'axios';
import Swal from 'sweetalert2'; // 공통 팝업창
import Modal from 'react-bootstrap/Modal';

const faqPop = forwardRef(({ isOpen, onClose, onSearch }, ref) => {

	//세션 로그인 정보
    const [loginInfo, setLoginInfo] = useState(JSON.parse(localStorage.getItem("loginInfo")));
	const [faqId, setFaqId] = useState('');
    const [detail, setDetail] = useState({ title: '', faqType: '', admin: 'Y', useYn: 'Y', updateInsert: '' });

	

	//faq 조회
    const onSelectDetail = async (id) => {
        const searchParams = { id: id };
        try {
            const response = await axios.post("/api/v1/faq/faqList", searchParams);
            if (response.data.code == 'OK') {

				var result = response.data.data.content[0];
				result.updateInsert ='update';
                setDetail(result);

            }else{
                Swal.fire('', '조회에 실패하였습니다.', 'error');
                console.log(response.data.data);
            }
            
        } catch (error) {
            Swal.fire('', '조회에 실패하였습니다.', 'error');
            console.log(error);
        }
    };

	//팝업창 열었을때 데이터 조회 및 초기화
    const onOpenPop = (props) => {

		setFaqId(props);
        setDetail({ faqId: '', title: '', answer: '', faqType: '1', updateInsert: 'insert' });

        if (props) {
            onSelectDetail(props);

        }
    };

	//등록 및 수정시 작성한 내용 detail에 담기
    const onChangeDetail = (e) => {

        setDetail(prevDetail => ({
            ...prevDetail,
            [e.target.name]: e.target.value
        }));

    };

	const valueCheck = ()=>{//값 체크
		
		if(detail.title == '' || detail.title == null){

			Swal.fire('', '제목을 입력해주세요.', 'warning');

			return true;
		}

		if(detail.answer == '' || detail.answer == null){

			Swal.fire('', '내용을 입력해주세요.', 'warning');

			return true;
		}

		return false;
	}

	const save = (word)=>{

		if(word == 'delete'){
			Swal.fire({
				title: '',              // 타이틀
				text: "삭제 하시겠습니까?",  // 내용
				icon: 'question',                        // success / error / warning / info / question
				confirmButtonColor: '#3085d6',  // 기본옵션
				confirmButtonText: '삭제',      // 기본옵션
				showCancelButton: true,         // conrifm 으로 하고싶을떄
				cancelButtonColor: '#d33',      // conrifm 에 나오는 닫기버튼 옵션
				cancelButtonText: '취소',       // conrifm 에 나오는 닫기버튼 옵션
			}).then(async(result) => {
				if(result.value){

					const response =  await axios.post("/api/v1/faq/delete", detail);

					if (response.data.code == 'OK') {

						Swal.fire('', '삭제 되었습니다.', 'success');
						
		
					}else{
						Swal.fire('', '삭제에 실패하였습니다.', 'error');
						console.log(response.data.data);
					}

					onClose();
					onSearch();

				}
			});
		}else{

			if(valueCheck()){
				return false;
			}

			Swal.fire({
				title: '',              // 타이틀
				text: "저장 하시겠습니까?",  // 내용
				icon: 'question',                        // success / error / warning / info / question
				confirmButtonColor: '#3085d6',  // 기본옵션
				confirmButtonText: '저장',      // 기본옵션
				showCancelButton: true,         // conrifm 으로 하고싶을떄
				cancelButtonColor: '#d33',      // conrifm 에 나오는 닫기버튼 옵션
				cancelButtonText: '취소',       // conrifm 에 나오는 닫기버튼 옵션
			}).then(async(result) => {
				if(result.value){
					
					const response =  await axios.post("/api/v1/faq/save", detail);

					if (response.data.code == 'OK') {

						Swal.fire('', '저장 되었습니다.', 'success');
						
					}else{
						Swal.fire('', '저장에 실패하였습니다.', 'error');
						console.log(response.data.data);
					}

					onClose();
					onSearch();

				}
			});
		}
		
	}

	//부포 컴포넌트가 onOpenPop을 사용할 수 있도록
    useImperativeHandle(ref, () => ({
        onOpenPop
    }), [isOpen]);
  return (
	<Modal className="modalStyle" id="faqReg" show={isOpen} onHide={onClose} keyboard={true} >
		<Modal.Body className="modal-body">
			<a onClick={onClose} className="ModalClose" data-dismiss="modal" title="닫기"><i className="fa-solid fa-xmark"></i></a>
			<h2 className="modalTitle">FAQ 상세</h2>
			<div className="flex align-items-center mt20">
				<div className="formTit flex-shrink0 width150px">FAQ 제목 <span className="star">*</span></div>
				<div className="width100">
					<input type="text" value={detail.title}  onChange={onChangeDetail} name="title" className="inputStyle" placeholder=""  maxLength="2000" />
				</div>
			</div>
			<div className="flex align-items-center mt20">
				<div className="formTit flex-shrink0 width150px">FAQ 구분 <span className="star">*</span></div>
				<div className="flex align-items-center width100">
					<input type="radio" value="1" id="bm2_1" className="radioStyle" onChange={onChangeDetail} name="faqType" checked={detail.faqType === '1'} /><label htmlFor="bm2_1">가입관련</label>
					<input type="radio" value="2" id="bm2_2" className="radioStyle" onChange={onChangeDetail} name="faqType" checked={detail.faqType === '2'} /><label htmlFor="bm2_2">입찰관련</label>
					<input type="radio" value="3" id="bm2_3" className="radioStyle" onChange={onChangeDetail} name="faqType" checked={detail.faqType === '3'} /><label htmlFor="bm2_3">인증서관련</label>
				</div>
			</div>
			<div className="flex mt20">
				<div className="formTit flex-shrink0 width150px">FAQ 내용 <span className="star">*</span></div>
				<div className="width100">
					<textarea value={detail.answer} onChange={onChangeDetail} name="answer" className="textareaStyle overflow-y-scroll height150px" placeholder=""></textarea>
				</div>
			</div>
			<div className="modalFooter">
				<a onClick={onClose} className="modalBtnClose" data-dismiss="modal" title="닫기">닫기</a>
				{loginInfo.custType == 'inter' && loginInfo.userAuth == '1' && detail.updateInsert == 'update' && (
					<a onClick={() => {save('delete')}} className="modalBtnDelete" data-toggle="modal" title="삭제">삭제</a>
				)}
				{loginInfo.custType == 'inter' && loginInfo.userAuth == '1' && (
					<a onClick={() => {save('save')}} className="modalBtnCheck" data-toggle="modal" title="저장">저장</a>
				)}
				
			</div>
		</Modal.Body>
	</Modal>
  )
});


export default faqPop
