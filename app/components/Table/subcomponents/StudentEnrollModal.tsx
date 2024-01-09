import { useState } from "react";
import { Link } from "@remix-run/react";
import Modal from "~/components/Modal";
import Tab from "~/components/Tab";
import fileDownloadSVG from "./icons/fileDownload.svg";
import styles from "./enrollModal.module.css";
import tableStyles from "~/components/Table/table.module.css";
import formStyles from "~/components/common/form.module.css";
import SingleFileInput from "~/components/Input/SingleFileInput";
import TextInput from "~/components/Input/TextInput";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const StudentEnrollModal = ({ isOpen, onClose }: Props) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="학생 등록"
      subtitle="해당 수업에 학생들을 등록합니다"
    >
      <div className={styles.container}>
        <Tab
          titleList={["엑셀로 등록하기", "직접 입력하기"]}
          selectedIdx={selectedIdx}
          setSelectedIdx={setSelectedIdx}
        />
        {selectedIdx == 0 ? (
          <>
            <Link
              className={tableStyles["white-button"]}
              to="/studentForm.xlsx"
            >
              <img
                src={fileDownloadSVG}
                alt="file download icon"
                className={tableStyles["button-icon"]}
              />
              <span>엑셀 서식 다운로드</span>
            </Link>
            <form className={styles.forms}>
              <SingleFileInput
                title="학생 명부 엑셀 파일"
                name="file"
                onFileUpload={(file) => setUploadedFile(file)}
                fileValidator={(file) => file.name.endsWith(".xlsx")}
              />
            </form>
            <div className={formStyles["primary-button"]}>명부로 학생 등록</div>
          </>
        ) : (
          <>
            <form className={styles.forms}>
              <TextInput title="학생 이름" name="name" placeholder="홍길동" />
              <TextInput title="학번" name="ID" placeholder="2020123456" />
            </form>
            <div className={formStyles["primary-button"]}>학생 추가</div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default StudentEnrollModal;
