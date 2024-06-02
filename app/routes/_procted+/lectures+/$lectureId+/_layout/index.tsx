import { useState, useEffect } from "react";
import { MetaFunction, Outlet, useNavigate, useParams } from "@remix-run/react";
import styles from "~/css/routes/lectureDetail.module.css";
import {
  LectureEntity,
  SimplePracticeDetail,
  SimpleProblemDetail,
} from "~/types/APIResponse";
import {
  useBlockingLectureData,
  useLectureDataDispatch,
} from "~/contexts/LectureDataContext";
import {
  getCurrentSemesterLectures,
  getFutureSemesterLectures,
  getLectureWithLectureId,
  getPreviousSemesterLectures,
  getProblemWithProblemId,
} from "~/API/lecture";
import { useAuth } from "~/contexts/AuthContext";
import { TitleWithSubmenus } from "~/components/Aside/TitleElement";
import {
  ButtonElement,
  FoldableSuperButtonElement,
} from "~/components/Aside/ButtonElement";
import plusSVG from "~/assets/plus-k.svg";
import downloadSVG from "~/assets/download.svg";
import pencilSVG from "~/assets/pencil.svg";
import trashSVG from "~/assets/trash.svg";
import NewPracticeModal from "./NewPracticeModal";
import ImportPracticeModal from "./ImportPracticeModal";
import PracticeEditModal from "./PracticeEditModal";
import {
  deletePractice,
  deleteQuiz,
  getAllQuizes,
  getPracticeWithPracticeId,
  getQuizWithUserId,
} from "~/API/practice";
import toast from "react-hot-toast";
import ProblemAddModal from "./ProblemAddModal";
import ProblemEditModal from "./ProblemEditModal";
import TestCaseAddModal from "./TestCaseAddModal";
import TestCaseEditModal from "./TestCaseEditModal";
import { deleteProblem } from "~/API/problem";
import { deleteTestcase } from "~/API/testCase";
import DownloadMyCodesModal from "./DownloadMyCodesModal";
import { LinkElement } from "~/components/Aside/LinkElement";
const LectureDetail = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [lectures, setLectures] = useState<LectureEntity[]>([]);
  const [currentLecture, setCurrentLecture] = useState<LectureEntity>();
  const [isNewPracticeModalOpen, setIsNewPracticeModalOpen] = useState(false);
  const [isImportPracticeModalOpen, setIsImportPracticeModalOpen] =
    useState(false);
  const [isDownloadMyCodesModalOpen, setIsDownloadMyCodesModalOpen] =
    useState(false);

  const {
    isContextLoading,
    context: { semester: semester, lectureName },
  } = useBlockingLectureData();
  const lectureDataDispatch = useLectureDataDispatch();
  const auth = useAuth();
  const params = useParams();

  useEffect(() => {
    async function getData() {
      try {
        if (semester === "present") {
          const responses = await Promise.all([
            getCurrentSemesterLectures(auth.userId, auth.token),
            getLectureWithLectureId(params.lectureId!, auth.token),
          ]);
          setLectures(responses[0].data);
          setCurrentLecture(responses[1].data);
        } else if (semester === "past") {
          const responses = await Promise.all([
            getPreviousSemesterLectures(auth.userId, auth.token),
            getLectureWithLectureId(params.lectureId!, auth.token),
          ]);
          setLectures(responses[0].data);
          setCurrentLecture(responses[1].data);
        } else if (semester === "future") {
          const responses = await Promise.all([
            getFutureSemesterLectures(auth.userId, auth.token),
            getLectureWithLectureId(params.lectureId!, auth.token),
          ]);
          setLectures(responses[0].data);
          setCurrentLecture(responses[1].data);
        }
        setIsLoading(false);
      } catch (error: any) {
        toast.error(`Error: ${error.message} - ${error.responseMessage}`);
      }
    }
    if (!isContextLoading) {
      getData();
    }
  }, [isContextLoading, isLoading, params.lectureId]);

  return isLoading ? null : (
    <div className={styles.container}>
      <aside className={styles.aside}>
        <TitleWithSubmenus
          title={lectureName}
          submenuTitles={lectures.map((lecture) => lecture.title)}
          submenuLinks={lectures.map((lecture) => `/lectures/${lecture.id}`)}
          submenuClickListenerList={lectures.map((lecture) => () => {
            lectureDataDispatch({
              type: "UPDATE_DATA",
              payload: {
                semester,
                lectureName: lecture.title,
              },
            });
          })}
        />
        <h4>완료된 실습</h4>
        {currentLecture!.practices
          .filter((practice) => new Date(practice.end_time) <= new Date())
          .map((practice) => (
            <PracticeDetail
              lectureName={currentLecture!.title}
              key={practice.id}
              id={practice.id}
              title={practice.title}
              setSuperIsLoading={setIsLoading}
            />
          ))}

        <hr />
        <h4>진행중인 실습</h4>

        {currentLecture!.practices
          .filter(
            (practice) =>
              new Date(practice.start_time) <= new Date() &&
              new Date(practice.end_time) >= new Date()
          )
          .map((practice) => (
            <PracticeDetail
              lectureName={currentLecture!.title}
              key={practice.id}
              id={practice.id}
              title={practice.title}
              setSuperIsLoading={setIsLoading}
            />
          ))}

        <hr />

        {auth.role === "professor" && (
          <>
            <h4>진행 예정 실습</h4>
            {currentLecture!.practices
              .filter((practice) => new Date(practice.start_time) > new Date())
              .map((practice) => (
                <PracticeDetail
                  lectureName={currentLecture!.title}
                  key={practice.id}
                  id={practice.id}
                  title={practice.title}
                  setSuperIsLoading={setIsLoading}
                />
              ))}
            <hr />
          </>
        )}

        <h4>관리 도구</h4>
        <ButtonElement
          title="내 제출물 다운받기"
          onButtonClick={() => setIsDownloadMyCodesModalOpen(true)}
          iconSrcList={[downloadSVG]}
        />
        {auth.role === "professor" ? (
          <>
            <ButtonElement
              title="실습 새로 추가하기"
              onButtonClick={() => setIsNewPracticeModalOpen(true)}
              iconSrcList={[plusSVG]}
            />
            <ButtonElement
              title="실습 가져오기"
              onButtonClick={() => setIsImportPracticeModalOpen(true)}
              iconSrcList={[downloadSVG]}
            />
          </>
        ) : null}
      </aside>

      {isDownloadMyCodesModalOpen ? (
        <DownloadMyCodesModal
          isOpen={isDownloadMyCodesModalOpen}
          onClose={() => {
            setIsDownloadMyCodesModalOpen(false);
          }}
        />
      ) : null}

      {isNewPracticeModalOpen ? (
        <NewPracticeModal
          isOpen={isNewPracticeModalOpen}
          onClose={() => {
            setIsNewPracticeModalOpen(false);
            setIsLoading(true);
          }}
        />
      ) : null}

      {isImportPracticeModalOpen ? (
        <ImportPracticeModal
          isOpen={isImportPracticeModalOpen}
          onClose={() => {
            setIsImportPracticeModalOpen(false);
            setIsLoading(true);
          }}
        />
      ) : null}
      <Outlet />
    </div>
  );
};

export default LectureDetail;

interface DetailProps {
  lectureName: string;
  superId?: number;
  setSuperIsLoading?: (isLoading: boolean) => void;
  id: number;
  title: string;
}

const PracticeDetail = ({
  id,
  setSuperIsLoading,
  lectureName,
}: DetailProps) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [practiceDetail, setPracticeDetail] = useState<SimplePracticeDetail>();
  const [isPracticeEditModalOpen, setIsPracticeEditModalOpen] = useState(false);
  const [isProblemAddModalOpen, setIsProblemAddModalOpen] = useState(false);
  const [isFoldableOpen, setIsFoldableOpen] = useState(false);
  const [hasQuiz, setHasQuiz] = useState(false);
  const { lectureId } = useParams();
  useEffect(() => {
    async function getData() {
      try {
        const response = await getPracticeWithPracticeId(id, auth.token);
        setPracticeDetail(response.data);
        setLoading(false);
      } catch (error: any) {
        toast.error(`Error: ${error.message} - ${error.responseMessage}`);
        navigate("/");
      }
    }
    getData();
  }, [isPracticeEditModalOpen, isProblemAddModalOpen, loading]);

  useEffect(() => {
    async function getData() {
      if (auth.role === "professor") {
        const response = await getAllQuizes(id + "", auth.token);
        setHasQuiz(response.data.length > 0);
      } else {
        const response = await getQuizWithUserId(
          id + "",
          auth.userId,
          auth.token
        );
        setHasQuiz(response.data.length > 0);
      }
    }

    getData();
  });

  return loading ? (
    <h3>loading...</h3>
  ) : (
    <>
      <FoldableSuperButtonElement
        key={id}
        isOpen={isFoldableOpen}
        setIsOpen={setIsFoldableOpen}
        title={practiceDetail!.title}
        isEditable={auth.role === "professor"}
        onEditClick={() => {
          setIsPracticeEditModalOpen(true);
        }}
        onDeleteClick={async () => {
          if (
            confirm(`정말로 ${practiceDetail!.title} 실습을 삭제 하시겠습니까?`)
          ) {
            await deletePractice(id, auth.token);
            toast.success("성공적으로 삭제되었습니다");
            setSuperIsLoading!(true);
          }
        }}
      >
        {practiceDetail!.problems.map((problem) => (
          <ProblemDetail
            lectureName={lectureName}
            key={problem.id}
            superId={id}
            setSuperIsLoading={setLoading}
            id={problem.id}
            title={problem.title}
          />
        ))}
        {auth.role === "professor" ? (
          <>
            <ButtonElement
              title="문제 추가하기"
              onButtonClick={() => {
                setIsProblemAddModalOpen(true);
              }}
              iconSrcList={[plusSVG]}
            />
            {hasQuiz ? (
              <>
                <LinkElement
                  title="퀴즈 수정하기"
                  iconSrcList={[pencilSVG]}
                  link={`/lectures/quiz/edit?lecture_id=${lectureId}&practice_id=${id}`}
                />
                <ButtonElement
                  title="퀴즈 삭제하기"
                  onButtonClick={async () => {
                    if (
                      confirm(
                        `정말로 ${
                          practiceDetail!.title
                        } 퀴즈을 삭제 하시겠습니까?`
                      )
                    ) {
                      await toast.promise(deleteQuiz(id + "", auth.token), {
                        loading: "퀴즈 삭제...",
                        success: () => {
                          setSuperIsLoading!(true);
                          return "성공적으로 삭제되었습니다";
                        },
                        error: (error) =>
                          `Error: ${error.message} - ${error.responseMessage}`,
                      });
                    }
                  }}
                  iconSrcList={[trashSVG]}
                />
              </>
            ) : (
              <LinkElement
                title="퀴즈 추가하기"
                iconSrcList={[plusSVG]}
                link={`/lectures/quiz/new?lecture_id=${lectureId}&practice_id=${id}`}
              />
            )}
          </>
        ) : null}
      </FoldableSuperButtonElement>
      {isPracticeEditModalOpen ? (
        <PracticeEditModal
          isOpen={isPracticeEditModalOpen}
          onClose={() => {
            setIsPracticeEditModalOpen(false);
            setLoading(true);
          }}
          practiceId={practiceDetail!.id}
        />
      ) : null}
      {isProblemAddModalOpen ? (
        <ProblemAddModal
          isOpen={isProblemAddModalOpen}
          onClose={() => {
            setIsProblemAddModalOpen(false);
            setLoading(true);
          }}
          lectureName={lectureName}
          practiceName={practiceDetail!.title}
          practiceId={practiceDetail!.id}
        />
      ) : null}
    </>
  );
};

const ProblemDetail = ({ superId, id, setSuperIsLoading }: DetailProps) => {
  const navigate = useNavigate();
  const auth = useAuth();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [problemDetail, setProblemDetail] = useState<SimpleProblemDetail>();
  const [isProblemEditModalOpen, setIsProblemEditModalOpen] = useState(false);
  const [isTestCaseAddModalOpen, setIsTestCaseAddModalOpen] = useState(false);
  const [isTestCaseEditModalOpen, setIsTestCaseEditModalOpen] = useState(false);
  const [editingTestCaseId, setEditingTestCaseId] = useState(-1);
  const [isFoldableOpen, setIsFoldableOpen] = useState(false);

  useEffect(() => {
    async function getData() {
      try {
        const response = await getProblemWithProblemId(id, auth.token);
        setProblemDetail(response.data);
        setLoading(false);
      } catch (error: any) {
        toast.error(`Error: ${error.message} - ${error.responseMessage}`);
      }
    }
    getData();
  }, [loading]);

  return loading ? (
    <h3>loading...</h3>
  ) : (
    <>
      <FoldableSuperButtonElement
        key={id}
        isOpen={isFoldableOpen}
        setIsOpen={setIsFoldableOpen}
        onTextClick={() =>
          navigate(`/lectures/${params.lectureId}/${superId}/${id}`)
        }
        level={1}
        title={problemDetail!.title}
        isEditable={auth.role === "professor"}
        onEditClick={() => {
          setIsProblemEditModalOpen(true);
        }}
        onDeleteClick={async () => {
          if (
            confirm(`정말로 ${problemDetail!.title} 문제을 삭제 하시겠습니까?`)
          ) {
            await toast.promise(deleteProblem(id, auth.token), {
              loading: "문제 삭제중...",
              success: () => {
                setSuperIsLoading!(true);
                return "성공적으로 삭제되었습니다";
              },
              error: (error) =>
                `Error: ${error.message} - ${error.responseMessage}`,
            });
          }
        }}
        isFoldable={auth.role === "professor"}
      >
        {auth.role === "professor" ? (
          <>
            {problemDetail!.testcases.map((testcase) => (
              <ButtonElement
                key={testcase.id}
                title={testcase.title}
                showIcons={auth.role === "professor"}
                iconSrcList={[pencilSVG, trashSVG]}
                onIconClickList={[
                  () => {
                    setEditingTestCaseId(testcase.id);
                    setIsTestCaseEditModalOpen(true);
                  },
                  async () => {
                    if (
                      confirm(
                        `정말로 ${testcase.title} 테스트 케이스를 삭제하시겠습니까?`
                      )
                    ) {
                      await toast.promise(
                        deleteTestcase(testcase.id, auth.token),
                        {
                          loading: "TC 삭제중...",
                          success: () => {
                            setSuperIsLoading!(true);
                            return "성공적으로 삭제되었습니다";
                          },
                          error: (error) =>
                            `Error: ${error.message} - ${error.responseMessage}`,
                        }
                      );
                    }
                  },
                ]}
                onButtonClick={() => {
                  setEditingTestCaseId(testcase.id);
                  setIsTestCaseEditModalOpen(true);
                }}
              />
            ))}
            <ButtonElement
              title="테스트 케이스 추가하기"
              onButtonClick={() => {
                setIsTestCaseAddModalOpen(true);
              }}
              iconSrcList={[plusSVG]}
            />
          </>
        ) : null}

        <TestCaseAddModal
          isOpen={isTestCaseAddModalOpen}
          onClose={() => {
            setIsTestCaseAddModalOpen(false);
            setLoading(true);
          }}
          problemId={id}
        />
        {isTestCaseEditModalOpen ? (
          <TestCaseEditModal
            isOpen={isTestCaseEditModalOpen}
            onClose={() => {
              setIsTestCaseEditModalOpen(false);
              setLoading(true);
            }}
            testCaseId={editingTestCaseId}
          />
        ) : null}
      </FoldableSuperButtonElement>
      {isProblemEditModalOpen && (
        <ProblemEditModal
          isOpen={isProblemEditModalOpen}
          onClose={() => {
            setIsProblemEditModalOpen(false);
            setLoading(true);
          }}
          editingProblemId={id}
        />
      )}
    </>
  );
};

export const meta: MetaFunction = () => {
  return [
    {
      title: "실습 풀어보기 | KOJ",
    },
    {
      name: "description",
      content: "실습을 풀어봅시다...",
    },
    {
      name: "og:site_name",
      content: "KOJ 실습 풀이",
    },
  ];
};
