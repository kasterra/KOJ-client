import { useState, useEffect } from "react";
import { MetaFunction, Outlet, useNavigate, useParams } from "@remix-run/react";
import styles from "~/css/routes/lectureDetail.module.css";
import {
  LectureEntity,
  SimpleLectureDetail,
  SimplePracticeDetail,
  SimpleProblemDetail,
  SuccessLecturesResponse,
  SuccessPracticeDetailResponse,
  SuccessProblemDetailResponse,
  isSuccessResponse,
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
import { deletePractice, getPracticeWithPracticeId } from "~/API/practice";
import toast from "react-hot-toast";
import ProblemAddModal from "./ProblemAddModal";
import ProblemEditModal from "./ProblemEditModal";
import TestCaseAddModal from "./TestCaseAddModal";
import TestCaseEditModal from "./TestCaseEditModal";
import { deleteProblem } from "~/API/problem";
import { deleteTestcase } from "~/API/testCase";

const LectureDetail = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [lectures, setLectures] = useState<LectureEntity[]>([]);
  const [currentLecture, setCurrentLecture] = useState<SimpleLectureDetail>();
  const [isNewPracticeModalOpen, setIsNewPracticeModalOpen] = useState(false);
  const [isImportPracticeModalOpen, setIsImportPracticeModalOpen] =
    useState(false);

  const {
    isContextLoading,
    context: { semester: semester, lectureName },
  } = useBlockingLectureData();
  const lectureDataDispatch = useLectureDataDispatch();
  const auth = useAuth();
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      if (semester === "present") {
        const responses = await Promise.all([
          getCurrentSemesterLectures(auth.userId, auth.token),
          getLectureWithLectureId(params.lectureId!, auth.token),
        ]);
        if (isSuccessResponse(responses[0])) {
          setLectures((responses[0] as SuccessLecturesResponse).data);
        }
        setCurrentLecture(responses[1].data);
      } else if (semester === "past") {
        const responses = await Promise.all([
          getPreviousSemesterLectures(auth.userId, auth.token),
          getLectureWithLectureId(params.lectureId!, auth.token),
        ]);
        if (isSuccessResponse(responses[0]))
          setLectures((responses[0] as SuccessLecturesResponse).data);
        setCurrentLecture(responses[1].data);
      } else if (semester === "future") {
        const responses = await Promise.all([
          getFutureSemesterLectures(auth.userId, auth.token),
          getLectureWithLectureId(params.lectureId!, auth.token),
        ]);
        if (isSuccessResponse(responses[0]))
          setLectures((responses[0] as SuccessLecturesResponse).data);
        setCurrentLecture(responses[1].data);
      }
      setIsLoading(false);
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
        {currentLecture!.practices.map((practice) => (
          <PracticeDetail
            lectureName={currentLecture!.title}
            key={practice.id}
            id={practice.id}
            title={practice.title}
          />
        ))}
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
          onClose={() => setIsImportPracticeModalOpen(false)}
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
  id: number;
  title: string;
}

const PracticeDetail = ({ id, title }: DetailProps) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [practiceDetail, setPracticeDetail] = useState<SimplePracticeDetail>();
  const [isPracticeEditModalOpen, setIsPracticeEditModalOpen] = useState(false);
  const [isProblemAddModalOpen, setIsProblemAddModalOpen] = useState(false);
  useEffect(() => {
    async function getData() {
      const response = await getPracticeWithPracticeId(id, auth.token);
      if (isSuccessResponse(response)) {
        setPracticeDetail((response as SuccessPracticeDetailResponse).data);
        setLoading(false);
      } else {
        toast.error("잘못된 접근입니다");
        navigate("/");
      }
    }
    getData();
  }, [isPracticeEditModalOpen, isProblemAddModalOpen, loading]);

  return loading ? (
    <h3>loading...</h3>
  ) : (
    <>
      <FoldableSuperButtonElement
        key={id}
        title={practiceDetail!.title}
        isEditable={auth.role === "professor"}
        onEditClick={() => {
          setIsPracticeEditModalOpen(true);
        }}
        onDeleteClick={async () => {
          if (
            confirm(`정말로 ${practiceDetail!.title} 실습을 삭제 하시겠습니까?`)
          ) {
            const response = await deletePractice(id, auth.token);
            if (response.status === 204) {
              toast.success("성공적으로 삭제되었습니다");
              setLoading(true);
            }
          }
        }}
      >
        {practiceDetail!.problems.map((problem) => (
          <ProblemDetail
            lectureName={practiceDetail!.title}
            key={problem.id}
            superId={id}
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
          lectureName={practiceDetail!.title}
          practiceName={practiceDetail!.title}
          practiceId={practiceDetail!.id}
        />
      ) : null}
    </>
  );
};

const ProblemDetail = ({ superId, id, title }: DetailProps) => {
  const navigate = useNavigate();
  const auth = useAuth();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [problemDetail, setProblemDetail] = useState<SimpleProblemDetail>();
  const [isProblemEditModalOpen, setIsProblemEditModalOpen] = useState(false);
  const [isTestCaseAddModalOpen, setIsTestCaseAddModalOpen] = useState(false);
  const [isTestCaseEditModalOpen, setIsTestCaseEditModalOpen] = useState(false);
  const [editingTestCaseId, setEditingTestCaseId] = useState(-1);

  useEffect(() => {
    async function getData() {
      const response = await getProblemWithProblemId(id, auth.token);
      if (isSuccessResponse(response)) {
        setProblemDetail((response as SuccessProblemDetailResponse).data);
        setLoading(false);
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
            const response = await deleteProblem(id, auth.token);
            if (response.status === 204) {
              toast.success("성공적으로 삭제되었습니다");
              setLoading(true);
            }
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
                      const response = await deleteTestcase(
                        testcase.id,
                        auth.token
                      );
                      if (response.status === 204) {
                        toast.success("성공적으로 삭제되었습니다");
                        setLoading(true);
                      }
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
