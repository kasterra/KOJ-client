import { useState } from "react";
import Modal from "~/components/Modal";
import Tab from "~/components/Tab";
import styles from "./index.module.css";
import formStyles from "~/components/common/form.module.css";
import fileDownloadSVG from "~/assets/fileDownload.svg";
import SingleFileInput from "~/components/Input/SingleFileInput";
import TextInput from "~/components/Input/TextInput";
import { parseXlsx } from "~/util/xlsx";
import { addUserInLecture, addUsersInLecture } from "~/API/lecture";
import { useAuth } from "~/contexts/AuthContext";
import toast from "react-hot-toast";
import { useParams } from "@remix-run/react";
import RadioGroup from "~/components/Radio/RadioGroup";
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const UserAddModal = ({ isOpen, onClose }: Props) => {
  const auth = useAuth();
  const params = useParams();
  const lectureId = parseInt(params.lectureId!, 10);
  const [tabIndex, setTabIndex] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  return (
    <Modal
      title="학생 등록"
      subtitle="해당 수업에 학생들을 등록합니다"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        className={styles["modal-body"]}
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          if (tabIndex === 0) {
            const formFile = file ? file : (formData.get("file") as File);
            const response = await addUsersInLecture(
              lectureId,
              await parseXlsx(formFile),
              auth.token
            );
            if (response.status === 201) {
              toast.success("성공적으로 추가하였습니다");
              onClose();
            }
          } else {
            const name = formData.get("name") as string;
            const id = formData.get("id") as string;
            const role = formData.get("role") as string;

            const response = await addUserInLecture(
              lectureId,
              { userId: id, isTutor: role === "tutor", userName: name },
              auth.token
            );
            if (response.status === 201) {
              toast.success("성공적으로 추가하였습니다");
              onClose();
            }
          }
        }}
      >
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
              onFileUpload={(file) => setFile(file)}
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
            <RadioGroup
              title="권한"
              name="role"
              defaultValue="student"
              valueList={["student", "tutor"]}
              textList={["학생", "튜터"]}
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
