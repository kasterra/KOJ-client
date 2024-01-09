import { useState } from "react";
import LinkDropdown from "~/components/common/LinkDropdown";
import StudentEnrollModal from "./subcomponents/StudentEnrollModal";
import styles from "./table.module.css";
import chevronDownSVG from "./icons/chevronDown.svg";
import chevronUpSVG from "./icons/chevronUp.svg";
import plusSVG from "./icons/plus.svg";
import userMinusSVG from "./icons/userMinus.svg";
import { Lecture, User } from "~/types";

interface Props {
  lectureTitle: string;
  lectures: Lecture[];
  users: User[];
}

function formatLectureURL(lecture: Lecture) {
  return `/students/${lecture.code}`;
}

const StudentTable = ({ lectureTitle, lectures, users }: Props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkedList, setCheckedList] = useState(
    new Array(users.length).fill(false)
  );
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };
  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };
  const onClickresetPassword = (id: string) => {
    if (confirm("정말로 초기화 하시겠습니까?"))
      console.log("reset password", id);
  };
  const onClickRemoveUser = (id: string) => {
    if (confirm("정말로 내보내시겠습니까?")) {
      console.log("remove user", id);
    }
  };
  const onSelectedUserRemove = () => {
    console.log(checkedList);
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles["title-section"]} onClick={toggleDropdown}>
            <h2 className={styles["title-span"]}>{lectureTitle}</h2>
            <img
              src={isDropdownOpen ? chevronUpSVG : chevronDownSVG}
              alt={isDropdownOpen ? "submenu close icon" : "submenu open icon"}
            />
            {isDropdownOpen ? (
              <LinkDropdown
                submenuTitles={lectures.map((lecture) => lecture.name)}
                submenuLinks={lectures.map((lecture) =>
                  formatLectureURL(lecture)
                )}
              />
            ) : null}
          </div>
          <div className={styles["buttons-section"]}>
            <div
              className={styles["white-button"]}
              onClick={onSelectedUserRemove}
            >
              <img src={userMinusSVG} alt="remove user icon" />
              <span>선택한 사용자 내보내기</span>
            </div>
            <div className={styles["add-button"]} onClick={toggleModal}>
              <img src={plusSVG} alt="add user icon" />
              <span>사용자 추가하기</span>
            </div>
          </div>
        </div>
        <div
          className={`${styles["body-head"]} ${styles["student-table-row"]}`}
        >
          <div className={styles.cell}></div>
          <div className={styles.cell}>사용자 이름</div>
          <div className={styles.cell}>학번</div>
          <div className={styles.cell}>역할</div>
          <div className={styles.cell} style={{ justifyContent: "center" }}>
            기타 설정
          </div>
        </div>
        {users.map((user, idx) => (
          <div
            key={user.ID}
            className={`${styles.row} ${styles["student-table-row"]}`}
          >
            <div className={styles.cell}>
              <input
                type="checkbox"
                value={checkedList[idx]}
                onChange={() => {
                  setCheckedList(
                    checkedList.map((_, i) =>
                      i === idx ? !checkedList[idx] : _
                    )
                  );
                }}
              />
            </div>
            <div className={styles.cell}>{user.name}</div>
            <div className={styles.cell}>{user.ID}</div>
            <div className={styles.cell}>{user.role}</div>
            <div className={styles.cell} style={{ gap: 8 }}>
              <button
                className={styles["reset-password"]}
                onClick={() => onClickresetPassword(user.ID)}
              >
                암호 초기화
              </button>
              <button
                className={styles["out-user"]}
                onClick={() => onClickRemoveUser(user.ID)}
              >
                내보내기
              </button>
            </div>
          </div>
        ))}
      </div>
      <StudentEnrollModal isOpen={isModalOpen} onClose={toggleModal} />
    </>
  );
};

export default StudentTable;
