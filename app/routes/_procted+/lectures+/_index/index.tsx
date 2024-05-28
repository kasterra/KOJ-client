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
import { Link, MetaFunction } from "@remix-run/react";
import LectureAddModal from "./LectureAddModal";
import LectureEditModal from "./LectureEditModal";
import { formatLectureInfo, semesterToString } from "~/util";
import { useLectureDataDispatch } from "~/contexts/LectureDataContext";
import { LectureEntity, LecturesResponse } from "~/types/APIResponse";
import toast from "react-hot-toast";

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
      try {
        const lectures = await Promise.all([
          getCurrentSemesterLectures(userId, token),
          getPreviousSemesterLectures(userId, token),
          getFutureSemesterLectures(userId, token),
        ]);
        setCurrentSemeseterLectures(lectures[0].data);
        setPreviousSemesterLectures(lectures[1].data);
        setFutureSemesterLectures(lectures[2].data);
        setIsLoading(false);
      } catch (error: any) {
        toast.error(`Error: ${error.message} - ${error.responseMessage}`);
      }
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
                                await toast.promise(
                                  deleteLecture(lecture.id, token),
                                  {
                                    loading:
                                      "강의를 삭제중입니다...",
                                    success: () => {
                                      setIsLoading(true);
                                      return "강의를 성공적으로 삭제하였습니다";
                                    },
                                    error: (err) =>
                                      `Error: ${err.message} - ${err.responseMessage}`,
                                  }
                                );
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
                            await toast.promise(
                              deleteLecture(lecture.id, token),
                              {
                                loading: "강의를 삭제중입니다...",
                                success: () => {
                                  setIsLoading(true);
                                  return "강의를 성공적으로 삭제하였습니다";
                                },
                                error: (err) =>
                                  `Error: ${err.message} - ${err.responseMessage}`,
                              }
                            );
                          }
                        }}
                      />
                    </div>
                  ) : null}
                </Link>
              ))}
              {isProfessor ? (
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
              ) : null}
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
                          setEditingLectureInfo(lecture);
                          setIsLectureEditModalOpen(true);
                        }}
                      />
                      <img
                        src={trashSVG}
                        alt="trash icon"
                        className={styles.icon}
                        onClick={async (e) => {
                          if (
                            confirm(
                              "정말로 강의를 삭제하시겠습니까? 강의에 소속된 실습 등도 모두 삭제됩니다!"
                            )
                          ) {
                            await toast.promise(
                              deleteLecture(lecture.id, token),
                              {
                                loading: "강의를 삭제중입니다...",
                                success: () => {
                                  setIsLoading(true);
                                  return "강의를 성공적으로 삭제하였습니다";
                                },
                                error: (err) =>
                                  `Error: ${err.message} - ${err.responseMessage}`,
                              }
                            );
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

export const meta: MetaFunction = () => {
  return [
    {
      title: "강의 목록 | KOJ",
    },
    {
      property: "description",
      content: "강의 목록 조회 화면입니다",
    },
    {
      property: "og:site_name",
      content: "KOJ - 강의 목록",
    },
  ];
};
