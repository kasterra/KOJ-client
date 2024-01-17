import { useEffect, useState } from "react";
import styles from "./lectures.module.css";
import plusSVG from "~/assets/plus-k.svg";
import pencilSVG from "~/assets/pencil.svg";
import trashSVG from "~/assets/trash.svg";
import {
  getCurrentSemesterLectures,
  getPreviousSemesterLectures,
} from "~/API/lecture";
import { useAuth } from "~/contexts/AuthContext";
import { Link } from "@remix-run/react";
import LectureAddModal from "./LectureAddModal";

function semesterToString(semester: number) {
  switch (semester) {
    case 0:
      return 1;
    case 1:
      return "S";
    case 2:
      return 2;
    case 3:
      return "W";
    default:
      throw new Error("Invalid semester");
  }
}

function formatLectureInfo(title: string, semester: number) {
  return `${title} (${(semester / 10).toFixed(0)}-${semesterToString(
    semester % 10
  )})`;
}

const Lectures = () => {
  const [currentSemeseterLectures, setCurrentSemeseterLectures] = useState<
    Awaited<ReturnType<typeof getCurrentSemesterLectures>>["data"]
  >([]);
  const [previousSemesterLectures, setPreviousSemesterLectures] = useState<
    Awaited<ReturnType<typeof getPreviousSemesterLectures>>["data"]
  >([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isLectureAddModalOpen, setIsLectureAddModalOpen] = useState(false);
  const [isLectureEditModalOpen, setIsLectureEditModalOpen] = useState(false);
  const [editingLectureInfo, setEditingLectureInfo] =
    useState<
      Awaited<ReturnType<typeof getPreviousSemesterLectures>>["data"][0]
    >();

  const { token, role } = useAuth();
  const isProfessor = role === "professor";
  useEffect(() => {
    const getLectures = async () => {
      const lectures = await Promise.all([
        getCurrentSemesterLectures(token),
        getPreviousSemesterLectures(token),
      ]);
      setCurrentSemeseterLectures(lectures[0].data);
      setPreviousSemesterLectures(lectures[1].data);
      setIsLoading(false);
    };
    getLectures();
  }, []);
  return (
    <div className={styles.wrapper}>
      <main className={styles.content}>
        {isLoading ? (
          <h2>Loading</h2>
        ) : (
          <div className={styles["lectures-section"]}>
            <h2 className={styles.title}>이번 학기 실습 과목</h2>
            <div className={styles.cells}>
              {currentSemeseterLectures.map((lecture) => (
                <Link
                  to={lecture.id + ""}
                  key={lecture.id}
                  className={styles.cell}
                >
                  <div className={styles["title-section"]}>
                    <div className={styles["cell-title"]}>
                      {formatLectureInfo(lecture.title, lecture.semester)}
                    </div>
                    <div
                      className={styles["cell-subtitle"]}
                    >{`${lecture.professor_name} 교수님`}</div>
                  </div>
                  {isProfessor ? (
                    <div
                      className={styles["icons-section"]}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                    >
                      <img
                        src={pencilSVG}
                        alt="edit icon"
                        className={styles.icon}
                        onClick={(e) => {
                          setEditingLectureInfo(lecture);
                          setIsLectureEditModalOpen(true);
                        }}
                      />
                      <img
                        src={trashSVG}
                        alt="trash icon"
                        className={styles.icon}
                        onClick={(e) => {
                          confirm("정말로 강의를 삭제하시겠습니까") &&
                            console.log("강의 삭제");
                        }}
                      />
                    </div>
                  ) : null}
                </Link>
              ))}
              <div
                className={styles.cell}
                onClick={() => setIsLectureAddModalOpen(true)}
              >
                <div className={styles["title-section"]}>
                  <div className={styles["cell-title"]}>
                    <img src={plusSVG} className={styles.icon} />
                    <span>강의 추가하기</span>
                  </div>
                </div>
              </div>
            </div>
            <h2 className={styles.title}>지난 학기 실습 과목</h2>
            <div className={styles.cells}>
              {previousSemesterLectures.map((lecture) => (
                <Link
                  to={lecture.id + ""}
                  key={lecture.id}
                  className={styles.cell}
                >
                  <div className={styles["title-section"]}>
                    <div className={styles["cell-title"]}>
                      {formatLectureInfo(lecture.title, lecture.semester)}
                    </div>
                    <div
                      className={styles["cell-subtitle"]}
                    >{`${lecture.professor_name} 교수님`}</div>
                  </div>
                  {isProfessor ? (
                    <div
                      className={styles["icons-section"]}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                    >
                      <img
                        src={pencilSVG}
                        alt="edit icon"
                        className={styles.icon}
                        onClick={(e) => {
                          setEditingLectureInfo(lecture);
                          setIsLectureEditModalOpen(true);
                        }}
                      />
                      <img
                        src={trashSVG}
                        alt="trash icon"
                        className={styles.icon}
                        onClick={(e) => {
                          confirm("정말로 강의를 삭제하시겠습니까") &&
                            console.log("강의 삭제");
                        }}
                      />
                    </div>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <LectureAddModal
        isOpen={isLectureAddModalOpen}
        onClose={() => setIsLectureAddModalOpen(false)}
      />
    </div>
  );
};

export default Lectures;
