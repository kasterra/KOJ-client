import { useState, useEffect } from "react";
import { Outlet, useNavigate, useParams } from "@remix-run/react";
import styles from "~/css/routes/lectureDetail.module.css";
import {
  LectureEntity,
  SimpleLectureDetail,
  SimplePracticeDetail,
  SimpleProblemDetail,
  isSuccessResponse,
} from "~/types/APIResponse";
import {
  useBlockingLectureData,
  useLectureDataDispatch,
} from "~/contexts/LectureDataContext";
import {
  getCurrentSemesterLectures,
  getLectureWithLectureId,
  getPracticeWithPracticeId,
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
          setLectures(responses[0].data as LectureEntity[]);
        }
        setCurrentLecture(responses[1].data);
      } else {
        const responses = await Promise.all([
          getPreviousSemesterLectures(auth.userId, auth.token),
          getLectureWithLectureId(params.lectureId!, auth.token),
        ]);
        if (isSuccessResponse(responses[0]))
          setLectures(responses[0].data as LectureEntity[]);
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
  id: number;
  title: string;
}

const PracticeDetail = ({ id, title }: DetailProps) => {
  const auth = useAuth();
  const [loading, setLoading] = useState(true);
  const [practiceDetail, setPracticeDetail] = useState<SimplePracticeDetail>();
  const [isPracticeEditModalOpen, setIsPracticeEditModalOpen] = useState(false);
  const [editingPracticeId, setEditingPracticeId] = useState(-1);
  useEffect(() => {
    async function getData() {
      const response = await getPracticeWithPracticeId(id + "", auth.token);
      setPracticeDetail(response.data);
      setLoading(false);
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
          setEditingPracticeId(id);
          setIsPracticeEditModalOpen(true);
        }}
        onDeleteClick={() => {
          if (confirm(`정말로 ${title} 실습을 삭제 하시겠습니까?`)) {
            console.log("삭제!!!");
          }
        }}
      >
        {practiceDetail!.problems.map((problem) => (
          <ProblemDetail
            key={problem.id}
            id={problem.id}
            title={problem.title}
          />
        ))}
      </FoldableSuperButtonElement>
    </>
  );
};

const ProblemDetail = ({ id, title }: DetailProps) => {
  const navigate = useNavigate();
  const auth = useAuth();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [problemDetail, setProblemDetail] = useState<SimpleProblemDetail>();
  const [isProblemAddModalOpen, setIsProblemAddModalOpen] = useState(false);
  const [isProblemEditModalOpen, setIsProblemEditModalOpen] = useState(false);
  const [editingProblemId, setEditingProblemId] = useState(-1);
  const [isTestCaseAddModalOpen, setTestCaseAddModalOpen] = useState(false);
  const [isTestCaseEditModalOpen, setTestCaseEditModalOpen] = useState(false);
  const [editingTestCaseId, setEditingTestCaseId] = useState(-1);

  useEffect(() => {
    async function getData() {
      const response = await getProblemWithProblemId(id + "", auth.token);
      setProblemDetail(response.data);
      setLoading(false);
    }
    getData();
  }, []);

  return loading ? (
    <h3>loading...</h3>
  ) : (
    <FoldableSuperButtonElement
      key={id}
      onTextClick={() => navigate(`/lectures/${params.lectureId}/${id}`)}
      level={1}
      title={title}
      isEditable={auth.role === "professor"}
      onEditClick={() => {
        setEditingProblemId(id);
        setIsProblemEditModalOpen(true);
      }}
      onDeleteClick={() => {
        if (confirm(`정말로 ${title} 문제을 삭제 하시겠습니까?`)) {
          console.log("삭제!!!");
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
              setTestCaseEditModalOpen(true);
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
            setTestCaseEditModalOpen(true);
          }}
        />
      ))}
      <ButtonElement
        title="테스트 케이스 추가하기"
        onButtonClick={() => {
          setTestCaseAddModalOpen(true);
        }}
        iconSrcList={[plusSVG]}
      />
    </FoldableSuperButtonElement>
  );
};
