import { useEffect, useState } from "react";
import styles from "./lectures.module.css";
import plusSVG from "~/assets/plus-k.svg";
import pencilSVG from "~/assets/pencil.svg";
import trashSVG from "~/assets/trash.svg";
import {
  deleteLecture,
  getCurrentSemesterLectures,
  getFutureSemesterLectures,
  getPreviousSemesterLectures,
} from "~/API/lecture";
import { useAuth } from "~/contexts/AuthContext";
import { Link } from "@remix-run/react";
import LectureAddModal from "./LectureAddModal";
import LectureEditModal from "./LectureEditModal";
import { formatLectureInfo, semesterToString } from "~/util";
import { useLectureDataDispatch } from "~/contexts/LectureDataContext";
import { LectureEntity, isSuccessResponse } from "~/types/APIResponse";

const Lectures = () => {
  const [currentSemeseterLectures, setCurrentSemeseterLectures] = useState<
    LectureEntity[]
  >([]);
  const [previousSemesterLectures, setPreviousSemesterLectures] = useState<
    LectureEntity[]
  >([]);
  const [futureSemesterLectures, setFutureSemesterLectures] = useState<
    LectureEntity[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isLectureAddModalOpen, setIsLectureAddModalOpen] = useState(false);
  const [isLectureEditModalOpen, setIsLectureEditModalOpen] = useState(false);
  const [editingLectureInfo, setEditingLectureInfo] = useState<LectureEntity>();

  const { token, role, userId } = useAuth();
  const lectureDataDispatch = useLectureDataDispatch();
  const isProfessor = role === "professor";
  useEffect(() => {
    const getLectures = async () => {
      const lectures = await Promise.all([
        getCurrentSemesterLectures(userId, token),
        getPreviousSemesterLectures(userId, token),
        getFutureSemesterLectures(userId, token),
      ]);
      if (isSuccessResponse(lectures[0]))
        setCurrentSemeseterLectures(lectures[0].data as LectureEntity[]);
      if (isSuccessResponse(lectures[1]))
        setPreviousSemesterLectures(lectures[1].data as LectureEntity[]);
      if (isSuccessResponse(lectures[2]))
        setFutureSemesterLectures(lectures[2].data as LectureEntity[]);
      setIsLoading(false);
    };
    getLectures();
  }, [isLoading]);
  return (
    <div className={styles.wrapper}>
      <main className={styles.content}>
        {isLoading ? (
          <h2>Loading</h2>
        ) : (
          <div className={styles["lectures-section"]}>
            {futureSemesterLectures.length > 0 ? (
              <>
                <h2 className={styles.title}>다가올 학기 실습 과목</h2>
                <div className={styles.cells}>
                  {futureSemesterLectures.map((lecture) => (
                    <Link
                      onClick={() => {
                        lectureDataDispatch({
                          type: "UPDATE_DATA",
                          payload: {
                            semester: "future",
                            lectureName: lecture.title,
                          },
                        });
                      }}
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
                            onClick={async (e) => {
                              if (confirm("정말로 강의를 삭제하시겠습니까")) {
                                const response = await deleteLecture(
                                  lecture.id,
                                  token
                                );
                                if (response.status === 204) {
                                  setIsLoading(true);
                                }
                              }
                            }}
                          />
                        </div>
                      ) : null}
                    </Link>
                  ))}
                </div>
              </>
            ) : null}
            <h2 className={styles.title}>이번 학기 실습 과목</h2>
            <div className={styles.cells}>
              {currentSemeseterLectures.map((lecture) => (
                <Link
                  onClick={() => {
                    lectureDataDispatch({
                      type: "UPDATE_DATA",
                      payload: {
                        semester: "present",
                        lectureName: lecture.title,
                      },
                    });
                  }}
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
                        onClick={async (e) => {
                          if (confirm("정말로 강의를 삭제하시겠습니까")) {
                            const response = await deleteLecture(
                              lecture.id,
                              token
                            );
                            if (response.status === 204) {
                              setIsLoading(true);
                            }
                          }
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
                  onClick={() => {
                    lectureDataDispatch({
                      type: "UPDATE_DATA",
                      payload: {
                        semester: "past",
                        lectureName: lecture.title,
                      },
                    });
                  }}
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
                          console.log(lecture);
                          setEditingLectureInfo(lecture);
                          console.log(editingLectureInfo);
                          setIsLectureEditModalOpen(true);
                        }}
                      />
                      <img
                        src={trashSVG}
                        alt="trash icon"
                        className={styles.icon}
                        onClick={async (e) => {
                          if (confirm("정말로 강의를 삭제하시겠습니까")) {
                            const response = await deleteLecture(
                              lecture.id,
                              token
                            );
                            if (response.status === 204) {
                              setIsLoading(true);
                            }
                          }
                        }}
                      />
                    </div>
                  ) : null}
                </Link>
              ))}
            </div>
            <LectureAddModal
              isOpen={isLectureAddModalOpen}
              onClose={() => {
                setIsLectureAddModalOpen(false);
                setIsLoading(true);
              }}
              currentYear={2024}
            />
            {isLectureEditModalOpen ? (
              <LectureEditModal
                isOpen={isLectureEditModalOpen}
                onClose={() => {
                  setIsLectureEditModalOpen(false);
                  setIsLoading(true);
                }}
                lectureId={editingLectureInfo!.id}
                lectureName={editingLectureInfo!.title}
                lectureCode={editingLectureInfo!.code}
                lectureLanguage={editingLectureInfo!.language}
                lectureYear={(editingLectureInfo!.semester / 10).toFixed(0)}
                lectureSemester={semesterToString(
                  editingLectureInfo!.semester % 10
                )}
              />
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
};

export default Lectures;
