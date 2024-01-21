import { useState } from "react";
import Modal from "~/components/Modal";
import Tab from "~/components/Tab";
import styles from "./index.module.css";
import formStyles from "~/components/common/form.module.css";
import fileDownloadSVG from "~/assets/fileDownload.svg";
import SingleFileInput from "~/components/Input/SingleFileInput";
import TextInput from "~/components/Input/TextInput";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const UserAddModal = ({ isOpen, onClose }: Props) => {
  const [tabIndex, setTabIndex] = useState(0);
  return (
    <Modal
      title="학생 등록"
      subtitle="해당 수업에 학생들을 등록합니다"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form className={styles["modal-body"]}>
        <Tab
          titleList={["엑셀로 등록하기", "직접 입력하기"]}
          selectedIdx={tabIndex}
          setSelectedIdx={setTabIndex}
        />
        {tabIndex === 0 ? (
          <>
            <a className={styles["white-button"]} href="/StudentForm.xlsx">
              <img src={fileDownloadSVG} alt="파일 다운로드" />
              <span>엑셀 서식 다운로드</span>
            </a>
            <SingleFileInput
              title="학생 명부 엑셀 파일"
              name="file"
              onFileUpload={(file) => console.log(file.name)}
              fileValidator={(file) => file.name.endsWith(".xlsx")}
              placeholder="xlsx 파일 업로드"
            />
          </>
        ) : (
          <>
            <TextInput
              name="name"
              title="학생 이름"
              placeholder="홍길동"
              required
            />
            <TextInput
              name="id"
              title="학번"
              placeholder="2020123456"
              required
            />
          </>
        )}
        <button className={formStyles["primary-button"]} type="submit">
          등록
        </button>
      </form>
    </Modal>
  );
};

export default UserAddModal;
