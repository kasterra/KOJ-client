import styles from "./lectures.module.css";
import formStyles from "~/components/common/form.module.css";
import inputStyles from "~/components/Input/input.module.css";
import DropDown from "~/components/Input/Dropdown";
import Modal from "~/components/Modal";
import TextInput from "~/components/Input/TextInput";
import RadioGroup from "~/components/Radio/RadioGroup";
import { UpdateLecture } from "~/API/lecture";
import { semesterStringToNumber } from "~/util";
import { useAuth } from "~/contexts/AuthContext";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lectureId: number;
  lectureName: string;
  lectureCode: string;
  lectureLanguage: string;
  lectureYear: string;
  lectureSemester: string;
}

const LectureEditModal = ({
  isOpen,
  onClose,
  lectureId,
  lectureName,
  lectureCode,
  lectureLanguage,
  lectureYear,
  lectureSemester,
}: Props) => {
  const auth = useAuth();
  return (
    <Modal
      title="강의 수정"
      subtitle="KOJ에 등록된 강의를 수정합니다"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        className={styles["modal-body"]}
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const name = formData.get("name") as string;
          const code = formData.get("code") as string;
          const language = formData.get("language") as string;

          await toast.promise(
            UpdateLecture(
              lectureId,
              code,
              language,
              semesterStringToNumber(lectureYear, lectureSemester),
              name,
              auth.token
            ),
            {
              loading: "Loading",
              success: "강의 업데이트 성공",
              error: (err) => `Error: ${err.message} - ${err.responseMessage}`,
            }
          );
          onClose();
        }}
      >
        <div className={styles.inputs}>
          <TextInput
            name="name"
            title="이름"
            placeholder="기초프로그래밍"
            required
            defaultValue={lectureName}
          />
          <TextInput
            name="code"
            title="강의 코드"
            placeholder="COMP0000-000"
            description="강의 코드는 COMP0000-000 형식이어야 합니다"
            required
            defaultValue={lectureCode}
          />
          <div className={styles["semester-block"]}>
            <span className={inputStyles.title}>강의 학기</span>
            <div className={styles["semeseter-row"]}>
              <div className={styles["semeseter-row"]}>
                <span>{lectureYear}</span>
                <span>학년도</span>
              </div>
              <div className={styles["semeseter-row"]}>
                <span>{lectureSemester}</span>
                <span>학기</span>
              </div>
            </div>
          </div>
          <RadioGroup
            title="프로그래밍 언어"
            name="language"
            valueList={["c", "java", "python"]}
            textList={["C", "Java", "Python"]}
            defaultValue={lectureLanguage}
          />
        </div>
        <button className={formStyles["primary-button"]} type="submit">
          강의 수정하기
        </button>
      </form>
    </Modal>
  );
};

export default LectureEditModal;
