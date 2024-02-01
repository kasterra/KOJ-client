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

const LectureDetail = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [lectures, setLectures] = useState<LectureEntity[]>([]);
  const [currentLecture, setCurrentLecture] = useState<SimpleLectureDetail>();
  const [isNewPracticeModalOpen, setIsNewPracticeModalOpen] = useState(false);
  const [isImportPracticeModalOpen, setIsImportPracticeModalOpen] =
    useState(false);

  const {
    isContextLoading,
    context: { semester: isCurrentSemester, lectureName },
  } = useBlockingLectureData();
  const lectureDataDispatch = useLectureDataDispatch();
  const auth = useAuth();
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      if (isCurrentSemester) {
        const responses = await Promise.all([
          getCurrentSemesterLectures(auth.userId, auth.token),
          getLectureWithLectureId(params.lectureId!, auth.token),
        ]);
        if (isSuccessResponse(responses[0])) {
          setLectures((responses[0] as SuccessLecturesResponse).data);
        }
        setCurrentLecture(responses[1].data);
      } else {
        const responses = await Promise.all([
          getPreviousSemesterLectures(auth.userId, auth.token),
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
  }, [isContextLoading]);

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
                semester: isCurrentSemester,
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
      </aside>
      <NewPracticeModal
        isOpen={isNewPracticeModalOpen}
        onClose={() => setIsNewPracticeModalOpen(false)}
      />
      <ImportPracticeModal
        isOpen={isImportPracticeModalOpen}
        onClose={() => setIsImportPracticeModalOpen(false)}
      />
      <Outlet />
    </div>
  );
};

export default LectureDetail;

interface DetailProps {
  lectureName: string;
  id: number;
  title: string;
}

const PracticeDetail = ({ id, title, lectureName }: DetailProps) => {
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
  }, []);

  return loading ? (
    <h3>loading...</h3>
  ) : (
    <>
      <FoldableSuperButtonElement
        key={id}
        title={title}
        isEditable={auth.role === "professor"}
        onEditClick={() => {
          setIsPracticeEditModalOpen(true);
        }}
        onDeleteClick={async () => {
          if (confirm(`정말로 ${title} 실습을 삭제 하시겠습니까?`)) {
            const response = await deletePractice(id, auth.token);
            if (response.status === 204) {
              toast.success("성공적으로 삭제되었습니다");
            }
          }
        }}
      >
        {practiceDetail!.problems.map((problem) => (
          <ProblemDetail
            lectureName={lectureName}
            key={problem.id}
            id={problem.id}
            title={problem.title}
          />
        ))}
        <ButtonElement
          title="문제 추가하기"
          onButtonClick={() => setIsProblemAddModalOpen(true)}
          iconSrcList={[plusSVG]}
        />
      </FoldableSuperButtonElement>
      {isPracticeEditModalOpen ? (
        <PracticeEditModal
          isOpen={isPracticeEditModalOpen}
          onClose={() => setIsPracticeEditModalOpen(false)}
          practiceId={practiceDetail!.id}
        />
      ) : null}
      <ProblemAddModal
        isOpen={isProblemAddModalOpen}
        onClose={() => setIsProblemAddModalOpen(false)}
        lectureName={lectureName}
        practiceName={title}
        practiceId={practiceDetail!.id}
      />
    </>
  );
};

const ProblemDetail = ({ id, title }: DetailProps) => {
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
  }, []);

  return loading ? (
    <h3>loading...</h3>
  ) : (
    <>
      <FoldableSuperButtonElement
        key={id}
        onTextClick={() => navigate(`/lectures/${params.lectureId}/${id}`)}
        level={1}
        title={title}
        isEditable={auth.role === "professor"}
        onEditClick={() => {
          setIsProblemEditModalOpen(true);
        }}
        onDeleteClick={async () => {
          if (confirm(`정말로 ${title} 문제을 삭제 하시겠습니까?`)) {
            const response = await deleteProblem(id, auth.token);
            if (response.status === 204) {
              toast.success("성공적으로 삭제되었습니다");
            }
          }
        }}
        isFoldable={auth.role === "professor"}
      >
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
              () => {
                if (
                  confirm(
                    `정말로 ${testcase.title} 테스트 케이스를 삭제하시겠습니까?`
                  )
                ) {
                  console.log("삭제!!!");
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

        <TestCaseAddModal
          isOpen={isTestCaseAddModalOpen}
          onClose={() => setIsTestCaseAddModalOpen(false)}
        />
        {isTestCaseEditModalOpen ? (
          <TestCaseEditModal
            isOpen={isTestCaseEditModalOpen}
            onClose={() => setIsTestCaseEditModalOpen(false)}
            testCaseId={editingTestCaseId}
          />
        ) : null}
      </FoldableSuperButtonElement>
      <ProblemEditModal
        isOpen={isProblemEditModalOpen}
        onClose={() => setIsProblemEditModalOpen(false)}
        editingProblemId={id}
      />
    </>
  );
};
