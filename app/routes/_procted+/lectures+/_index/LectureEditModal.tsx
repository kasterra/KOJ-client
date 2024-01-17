import styles from "./lectures.module.css";
import formStyles from "~/components/common/form.module.css";
import inputStyles from "~/components/Input/input.module.css";
import DropDown from "~/components/Input/Dropdown";
import Modal from "~/components/Modal";
import TextInput from "~/components/Input/TextInput";
import RadioGroup from "~/components/Radio/RadioGroup";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lectureName: string;
  lectureCode: string;
  lectureLanguage: string;
  lectureYear: string;
  lectureSemester: string;
}

const LectureEditModal = ({
  isOpen,
  onClose,
  lectureName,
  lectureCode,
  lectureLanguage,
  lectureYear,
  lectureSemester,
}: Props) => {
  return (
    <Modal
      title="강의 수정"
      subtitle="KOJ에 등록된 강의를 수정합니다"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        className={styles["modal-body"]}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const name = formData.get("name");
          const code = formData.get("code");
          const year = formData.get("year");
          const semester = formData.get("semester");

          console.log({ name, code, year, semester });
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
            placeholder="COMP0000"
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
            valueList={["C", "Java", "Python"]}
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
