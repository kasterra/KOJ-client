import { useState, useEffect } from "react";
import { Outlet, useNavigate, useParams } from "@remix-run/react";
import styles from "~/css/routes/lectureDetail.module.css";
import { LectureEntity, SimpleLectureDetail } from "~/types/APIResponse";
import {
  useBlockingLectureData,
  useLectureDataDispatch,
} from "~/contexts/LectureDataContext";
import {
  getCurrentSemesterLectures,
  getLectureWithLectureId,
  getPreviousSemesterLectures,
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

const LectureDetail = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [lectures, setLectures] = useState<LectureEntity[]>([]);
  const [currentLecture, setCurrentLecture] = useState<SimpleLectureDetail>();

  const [isProblemAddModalOpen, setIsProblemAddModalOpen] = useState(false);
  const [isProblemEditModalOpen, setIsProblemEditModalOpen] = useState(false);
  const [editingProblemId, setEditingProblemId] = useState(-1);
  const [isPracticeEditModalOpen, setIsPracticeEditModalOpen] = useState(false);
  const [isNewPracticeModalOpen, setIsNewPracticeModalOpen] = useState(false);
  const [isImportPracticeModalOpen, setIsImportPracticeModalOpen] =
    useState(false);
  const [isTestCaseEditModalOpen, setTestCaseEditModalOpen] = useState(false);
  const [editingTestCaseId, setEditingTestCaseId] = useState(-1);

  const {
    isContextLoading,
    context: { isCurrentSemester, lectureName },
  } = useBlockingLectureData();
  const lectureDataDispatch = useLectureDataDispatch();
  const auth = useAuth();
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      if (isCurrentSemester) {
        const responses = await Promise.all([
          getCurrentSemesterLectures(auth.token),
          getLectureWithLectureId(params.lectureId!, auth.token),
        ]);
        setLectures(responses[0].data);
        setCurrentLecture(responses[1].data);
      } else {
        const responses = await Promise.all([
          getPreviousSemesterLectures(auth.token),
          getLectureWithLectureId(params.lectureId!, auth.token),
        ]);
        setLectures(responses[0].data);
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
                isCurrentSemester: isCurrentSemester,
                lectureName: lecture.title,
              },
            });
          })}
        />
        {currentLecture!.practices.map((practice) => (
          <FoldableSuperButtonElement
            key={practice.id}
            title={practice.title}
            isEditable={auth.role === "professor"}
            onEditClick={() => {
              setIsPracticeEditModalOpen(true);
            }}
            onDeleteClick={() => {
              if (
                confirm(`정말로 ${practice.title} 실습을 삭제 하시겠습니까?`)
              ) {
                console.log("삭제!!!");
              }
            }}
          >
            {practice.problems.map((problem) => (
              <FoldableSuperButtonElement
                key={problem.id}
                onTextClick={() =>
                  navigate(`/lectures/${params.lectureId}/${problem.id}`)
                }
                level={1}
                title={problem.title}
                isEditable={auth.role === "professor"}
                onEditClick={() => {
                  setEditingProblemId(problem.id);
                  setIsProblemEditModalOpen(true);
                }}
                onDeleteClick={() => {
                  if (
                    confirm(`정말로 ${problem.title} 문제을 삭제 하시겠습니까?`)
                  ) {
                    console.log("삭제!!!");
                  }
                }}
              >
                {problem.testcases.map((testcase) => (
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
              </FoldableSuperButtonElement>
            ))}
          </FoldableSuperButtonElement>
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
      <Outlet />
    </div>
  );
};

export default LectureDetail;
