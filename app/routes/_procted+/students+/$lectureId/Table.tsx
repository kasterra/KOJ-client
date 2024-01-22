import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "@remix-run/react";
import TableBase from "~/components/Table/TableBase";
import styles from "./index.module.css";
import dropdownStyles from "~/components/common/dropdown.module.css";
import { useLectureData } from "~/contexts/LectureDataContext";
import chevUpSVG from "~/assets/chevronUp.svg";
import chevDownSVG from "~/assets/chevronDown.svg";
import { Lecture } from "~/types";
import {
  getCurrentSemesterLectures,
  getPreviousSemesterLectures,
} from "~/API/lecture";
import { useAuth } from "~/contexts/AuthContext";
import userMinusSVG from "~/assets/userMinus.svg";
import plusW from "~/assets/plus-w.svg";
import UserAddModal from "./UserAddModal";
import { UserEntity } from "~/types/APIResponse";

const TableHeader = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const lectureData = useLectureData();
  const [lectureListLoading, setLectureListLoading] = useState(true);
  const [lectureList, setLectureList] = useState<Lecture[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isUserAddModalOpen, setIsUserAddModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getLectureList = async () => {
      try {
        if (lectureData.isCurrentSemester) {
          const response = await getCurrentSemesterLectures(auth.token);
          setLectureList(response.data);
        } else {
          const response = await getPreviousSemesterLectures(auth.token);
          setLectureList(response.data);
        }
        setLectureListLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    getLectureList();
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef]);

  return (
    <div className={styles["header-container"]} ref={containerRef}>
      <button
        className={styles.dropdown}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {lectureData.lectureName}
        <img
          className={styles.icon}
          src={isOpen ? chevUpSVG : chevDownSVG}
          alt={isOpen ? "열림" : "닫힘"}
        />
      </button>

      <div className={styles["buttons-container"]}>
        <button className={styles["white-button"]}>
          <img src={userMinusSVG} alt="user minus svg" />
          <span>선택한 사용자 내보내기</span>
        </button>
        <button
          className={styles["blue-button"]}
          onClick={() => setIsUserAddModalOpen(true)}
        >
          <img
            className={styles.icon}
            src={plusW}
            alt="사용자 추가 아이콘"
          />
          <span>사용자 추가하기</span>
        </button>
      </div>

      {isOpen ? (
        <div className={dropdownStyles["dropdown-item-container"]}>
          {lectureListLoading
            ? "강의목록 로딩중..."
            : lectureList.map((lecture) => (
                <div
                  className={dropdownStyles["dropdown-item"]}
                  key={lecture.id}
                  onClick={() => {
                    navigate(`/students/${lecture.id}`);
                  }}
                >
                  {lecture.title}
                </div>
              ))}
        </div>
      ) : null}
      <UserAddModal
        isOpen={isUserAddModalOpen}
        onClose={() => {
          setIsUserAddModalOpen(false);
        }}
      />
    </div>
  );
};

const Table = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<UserEntity[]>([]);
  const params = useParams();
  const lectureId = params.lectureId!;

  useEffect(() => {}, []);

  return (
    <TableBase
      gridTemplateColumns="1fr 1fr 1fr 170px"
      TableHeader={TableHeader}
      dataHeaders={["사용자 이름", "학번", "이름", "기타 설정"]}
      dataRows={[]}
    />
  );
};

export default Table;
