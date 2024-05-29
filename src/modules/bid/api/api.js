import axios from "axios";
import Ft from './filters';

const api = {

    //파일 다운로드 파라미터 셋팅
    fnCustSpecFileDown(fileNm, filePath){
        if(!Ft.isEmpty(fileNm) && !Ft.isEmpty(filePath)){
            let fileInfo = {
                filePath : filePath
            ,   fileNm : fileNm
            }

            this.downloadFile(fileInfo);
        }
    },

    //파일 다운로드
    async downloadFile(fileInfo) {
        try {
            const response = await axios.post(
                "/api/v1/bidComplete/fileDown",
                { fileId: fileInfo.filePath }, // 서버에서 파일을 식별할 수 있는 고유한 ID 또는 다른 필요한 데이터
                { responseType: "blob" } // 응답 데이터를 Blob 형식으로 받기
            );

            // 파일 다운로드를 위한 처리
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileInfo.fileNm); // 다운로드될 파일명 설정
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    },

    fnMovePage(){

    },
}

export default api;