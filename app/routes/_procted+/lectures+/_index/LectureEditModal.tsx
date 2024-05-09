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

          const response = await UpdateLecture(
            lectureId,
            code,
            language,
            semesterStringToNumber(lectureYear, lectureSemester),
            name,
            auth.token
          );

          switch (response.status) {
            case 200:
              toast.success("강의 업데이트 성공");
              onClose();
              break;
            case 401:
              toast.error("유효하지 않은 JWT 토큰. 다시 로그인 해주세요");
              onClose();
              break;
            case 403:
              toast.error("강의 소유 권한이 없습니다. 다시 확인해 주세요");
              break;
            case 404:
              toast.error("해당 강의 ID가 존재하지 않습니다");
              break;
            case 409:
              toast.error(
                "수정 하려는 정보 조합이 이미 존재합니다. 다시 확인해 주세요"
              );
              break;
            case 500:
              toast.error("서버 에러가 발생했습니다. 관리자에게 문의해 주세요");
              break;
          }
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
