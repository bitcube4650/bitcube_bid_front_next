import React from 'react';
import { EditInputFileProps } from 'components/types'

const EditInputFileBox = (props: EditInputFileProps) => {
    const onFormEventSrcData = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files.length > 0) {
            props.setUploadFile(
                e.target.files[0]
            );

            props.setEditData({
                ...props.editData,
                ['fileName']: e.target.files[0].name
            });
        }
    }

    function onRemoveAttachFile() {
        props.setEditData({
            ...props.editData,
            ['fileName']: null
        });
        props.setUploadFile(null);
    }

    return (
        <div className="upload-boxWrap">
            { !props.fileName &&
            <div className="upload-box">
                <input type="file" onChange={ onFormEventSrcData } />
                <div className="uploadTxt">
                    <i className="fa-regular fa-upload"></i>
                    <div>클릭 혹은 파일을 이곳에 드롭하세요.(암호화 해제)<br />파일 최대 10MB (등록 파일 개수 최대 1개)</div>
                </div>
            </div> }
            { props.fileName &&
            <div className="uploadPreview">
                <p>
                    { props.fileName }
                    <button className='file-remove' onClick={ onRemoveAttachFile }>삭제</button>
                </p>
            </div> }
        </div>
    )
}

export default EditInputFileBox;