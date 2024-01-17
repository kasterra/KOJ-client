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
  currentYear: number;
}

function createYearList(currentYear: number): string[] {
  const ret = [];
  for (let i = currentYear - 3; i <= currentYear + 3; i++) {
    ret.push(i + "");
  }
  return ret;
}

const LectureAddModal = ({ isOpen, onClose, currentYear }: Props) => {
  const currentSemester = "겨울";
  return (
    <Modal
      title="강의 추가"
      subtitle="KOJ에 강의 정보를 등록합니다"
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
          const language = formData.get("language");

          console.log({ name, code, year, semester, language });
        }}
      >
        <div className={styles.inputs}>
          <TextInput
            name="name"
            title="이름"
            placeholder="기초프로그래밍"
            required
          />
          <TextInput
            name="code"
            title="강의 코드"
            placeholder="COMP0000"
            required
          />
          <div className={styles["semester-block"]}>
            <span className={inputStyles.title}>강의 학기</span>
            <div className={styles["semeseter-row"]}>
              <div className={styles["semeseter-row"]}>
                <DropDown
                  name="year"
                  defaultVal={currentYear + ""}
                  submenus={createYearList(currentYear)}
                />
                <span>학년도</span>
              </div>
              <div className={styles["semeseter-row"]}>
                <DropDown
                  name="semester"
                  submenus={["1", "여름", "2", "겨울"]}
                  defaultVal={currentSemester}
                />
                <span>학기</span>
              </div>
            </div>
          </div>
          <RadioGroup
            title="프로그래밍 언어"
            name="language"
            valueList={["C", "java", "python"]}
            textList={["C", "Java", "Python"]}
          />
        </div>
        <button className={formStyles["primary-button"]} type="submit">
          강의 생성하기
        </button>
      </form>
    </Modal>
  );
};

export default LectureAddModal;
