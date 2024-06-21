import React, { useContext } from 'react'
import { BidContext } from '../context/BidContext';
import Swal from 'sweetalert2';

const BidSaveExtraFile = () => {

  const {innerFiles, setInnerFiles, outerFiles, setOuterFiles} = useContext(BidContext);

  // innerFiles
  const innerFilesClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = Array.from(event.target.files || []);
  
    if (innerFiles.length + fileList.length > 20) {
      Swal.fire({ icon: 'warning', text: '대내용 파일은 최대 20개까지 추가 가능합니다.' });
      return;
    }
  
    for (let file of fileList) {
      if (file.size > 10485760) {
        Swal.fire({ icon: 'warning', text: '파일 크기는 최대 10MB까지입니다.\n파일 크기를 확인해 주세요.' });
        return;
      }
    }
  
    setInnerFiles([...innerFiles, ...fileList]);
    event.target.value = '';
  };

  const innerFilesHandleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const fileList = Array.from(event.dataTransfer.files);

    if (innerFiles.length + fileList.length > 20) {
      Swal.fire({ icon: 'warning', text: '대내용 파일은 최대 20개까지 추가 가능합니다.' });
      return;
    }

    for (let file of fileList) {
      if (file.size > 10485760) {
        Swal.fire({ icon: 'warning', text: '파일 크기는 최대 10MB까지입니다.\n파일 크기를 확인해 주세요.' });
        return;
      }
    }

    setInnerFiles([...innerFiles, ...fileList]);
  };

  const innerFilesPop = () => {
    const innerFilesInput = document.getElementById('innerFilesInput')
    if(innerFilesInput){
      innerFilesInput.click()
    }
  };

  const removeInnerFiles = (idx : 'ALL' | number) => {
    if (idx === 'ALL') {
      setInnerFiles([]);
    } else {
      setInnerFiles(innerFiles.filter((_, index) => index !== idx));
    }
  };


  //outerFiles
  const outerFilesClick = (event : React.ChangeEvent<HTMLInputElement>) => {
    const fileList = Array.from(event.target.files || []);

    if (outerFiles.length + fileList.length > 20) {
      Swal.fire({ icon: 'warning', text: '대외용 파일은 최대 20개까지 추가 가능합니다.' });
      return;
    }

    for (let file of fileList) {
      if (file.size > 10485760) {
        Swal.fire({ icon: 'warning', text: '파일 크기는 최대 10MB까지입니다.\n파일 크기를 확인해 주세요.' });
        return;
      }
    }

    setOuterFiles([...outerFiles, ...fileList]);
    event.target.value = ''
  };

  const outerFilesHandleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const fileList = Array.from(event.dataTransfer.files);

    if (outerFiles.length + fileList.length > 20) {
      Swal.fire({ icon: 'warning', text: '대외용 파일은 최대 20개까지 추가 가능합니다.' });
      return;
    }

    for (let file of fileList) {
      if (file.size > 10485760) {
        Swal.fire({ icon: 'warning', text: '파일 크기는 최대 10MB까지입니다.\n파일 크기를 확인해 주세요.' });
        return;
      }
    }

    setOuterFiles([...outerFiles, ...fileList]);
  };

  const outerFilesPop = () => {
    const outerFilesInput = document.getElementById('outerFilesInput');
    if (outerFilesInput) {
      outerFilesInput.click();
    }
  };

  const removeOuterFiles = (idx : 'ALL' | number) => {
    if (idx === 'ALL') {
      setOuterFiles([]);
    } else {     
      setOuterFiles(outerFiles.filter((_, index) => index !== idx));
    }
  }

  return (
    <div>
      <div className="flex mt10">
        <div className="formTit flex-shrink0 width170px">
                  첨부파일(대내용)
              <i className="fas fa-question-circle toolTipSt ml5">
                  <div className="toolTipText" style={{width: '320px'}}>
                      <ul className="dList">
                          <li>
                          <div>
                              그룹사 내부 입찰관계자가 확인하는 첨부파일 입니다.
                          </div>
                          </li>
                          <li>
                          <div>파일이 암호화 되어 있는지 확인해 주십시오</div>
                          </li>
                      </ul>
                  </div>
              </i>
              <button
              className="modalBtnCheck"
              title="파일 추가(대내용)"
              style={{marginLeft: '0',marginRight:'0',marginTop:'5px'}}
              onClick={innerFilesPop}
              >파일 추가(대내용)
              </button>
          </div>

        <input type="file" id="innerFilesInput" onInput={innerFilesClick} style={{ display: 'none' }} multiple />
        {
        innerFiles.length === 0
        ?
        <div
          className="width100"
          onDragOver={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
          onDragEnter={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
          onDragLeave={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
          onDrop={innerFilesHandleDrop}
          onClick={innerFilesPop}
          style={{ cursor: innerFiles && 'pointer'}}
        >
          <div className="upload-boxWrap" style={{ minHeight: '80px', maxHeight: '150px', overflow: 'auto' }}>
            <div className="upload-box">
              <div className="uploadTxt">
                <i className="fa-regular fa-upload"></i>
                <div>
                  클릭 혹은 파일을 이곳에 드롭하세요.(암호화 해제)<br />파일 최대 10MB (등록 파일 개수 최대 20개)
                </div>
              </div>
            </div>
          </div>
        </div>
        :  
        <div
          className="width100"
          onDragOver={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
          onDragEnter={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
          onDragLeave={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
          onDrop={innerFilesHandleDrop}
        >
          <div className="upload-boxWrap" style={{ minHeight: '80px', maxHeight: '190px', overflow: 'auto' }}>
            {innerFiles.map((data, idx) => (
              <div className="uploadPreview" id={`preview${idx}`} key={idx}>
                {idx === 0 && (
                  <p style={{ lineHeight: '20px' }}>
                    {' '}
                    파일 개수 : {innerFiles.length}개
                    <button
                      onClick={() => removeInnerFiles('ALL')}
                      className="file-remove"
                      style={{ paddingLeft: '10px', paddingRight: '10px' }}
                    >
                      전체 삭제
                    </button>
                  </p>
                )}
                <p style={{ lineHeight: '40px' }}>
                  {data.name ? data.name : data.fileNm}
                  <button onClick={() => removeInnerFiles(idx)} className="file-remove">
                    삭제
                  </button>
                </p>
              </div>
            ))}
          </div>
        </div>
        }
      </div>   


      <div className="flex mt10">
        <div className="formTit flex-shrink0 width170px">
                  첨부파일(대외용)
              <i className="fas fa-question-circle toolTipSt ml5">
                  <div className="toolTipText" style={{width: '320px'}}>
                      <ul className="dList">
                          <li>
                          <div>
                              그룹사 내부 입찰관계자가 확인하는 첨부파일 입니다.
                          </div>
                          </li>
                          <li>
                          <div>파일이 암호화 되어 있는지 확인해 주십시오</div>
                          </li>
                      </ul>
                  </div>
              </i>
              <button
              className="modalBtnCheck"
              title="파일 추가(대외용)"
              style={{marginLeft: '0',marginRight:'0',marginTop:'5px'}}
              onClick={outerFilesPop}
              >파일 추가(대외용)
              </button>
          </div>

        <input type="file" id="outerFilesInput" onInput={outerFilesClick} style={{ display: 'none' }} multiple />
        {
        outerFiles.length === 0
        ?
        <div
          className="width100"
          onDragOver={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
          onDragEnter={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
          onDragLeave={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
          onDrop={outerFilesHandleDrop}
          onClick={outerFilesPop}
          style={{ cursor: outerFiles && 'pointer'}}
        >
          <div className="upload-boxWrap" style={{ minHeight: '80px', maxHeight: '150px', overflow: 'auto' }}>
            <div className="upload-box">
              <div className="uploadTxt">
                <i className="fa-regular fa-upload"></i>
                <div>
                  클릭 혹은 파일을 이곳에 드롭하세요.(암호화 해제)<br />파일 최대 10MB (등록 파일 개수 최대 20개)
                </div>
              </div>
            </div>
          </div>
        </div>
        :  
        <div
          className="width100"
          onDragOver={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
          onDragEnter={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
          onDragLeave={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
          onDrop={outerFilesHandleDrop}
        >
          <div className="upload-boxWrap" style={{ minHeight: '80px', maxHeight: '190px', overflow: 'auto' }}>
            {outerFiles.map((data, idx) => (
              <div className="uploadPreview" id={`preview${idx}`} key={idx}>
                {idx === 0 && (
                  <p style={{ lineHeight: '20px' }}>
                    {' '}
                    파일 개수 : {outerFiles.length}개
                    <button
                       onClick={() => removeOuterFiles('ALL')}
                      className="file-remove"
                      style={{ paddingLeft: '10px', paddingRight: '10px' }}
                    >
                      전체 삭제
                    </button>
                  </p>
                )}
                <p style={{ lineHeight: '40px' }}>
                  {data.name ? data.name : data.fileNm}
                  <button onClick={() => removeOuterFiles(idx)} className="file-remove">
                    삭제
                  </button>
                </p>
              </div>
            ))}
          </div>
        </div>
        }
      </div>   
    </div>
  )
}


export default BidSaveExtraFile;
