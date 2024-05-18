import { useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getLectureWithLectureId,
  getProblemWithProblemId,
} from "~/API/lecture";
import { getPracticeWithPracticeId } from "~/API/practice";
import Modal from "~/components/Modal";
import TreeView, {
  node as TreeViewNode,
} from "~/components/TreeView/MultipleSelectTreeview";
import { useAuth } from "~/contexts/AuthContext";
import styles from "./modal.module.css";
import formStyles from "~/components/common/form.module.css";
import { getCodesWithZipFile } from "~/util/getMyAllCodes";
import pkg from "file-saver";
const { saveAs } = pkg;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const DownloadMyCodesModal = ({ isOpen, onClose }: Props) => {
  const [nodesData, setNodesData] = useState<TreeViewNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<
    { fullName: string; id: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState("");
  const auth = useAuth();
  const params = useParams();

  useEffect(() => {
    async function getData() {
      const lectureResponse = await getLectureWithLectureId(
        params.lectureId!,
        auth.token
      );

      if (lectureResponse.status !== 200)
        throw new Error("Failed to get lecture");

      const practices = (lectureResponse as any).data.practices;
      const practicesResponseList = await Promise.all(
        practices.map(async (practice: any) =>
          getPracticeWithPracticeId(practice.id, auth.token)
        )
      );

      practicesResponseList.forEach((res) => {
        if (res.status !== 200) throw new Error("Failed to get practice");
      });

      const practiceNodes = await Promise.all(
        practicesResponseList.map(async (practiceResponse) => {
          const problemResponseList = await Promise.all(
            practiceResponse.data.problems.map(async (problem: any) =>
              getProblemWithProblemId(problem.id, auth.token)
            )
          );
          const problemDataList = problemResponseList.map((res) => {
            if (res.status !== 200) throw new Error("Failed to get problem");
            return {
              title: res.data.title as string,
              id: res.data.id as string,
              children: null,
            };
          });
          return {
            title: practiceResponse.data.title,
            id: practiceResponse.data.id,
            children: problemDataList,
          };
        })
      );
      setNodesData(practiceNodes);
      setIsLoading(false);
    }
    toast.promise(getData(), {
      loading: "이 강의에 대한 정보들을 불러오는중...",
      success: "불러오기 완료!",
      error: (err) => err.toString(),
    });
  }, [params.lectureId]);

  return isLoading ? null : (
    <Modal
      title="내 제출물 다운로드"
      subtitle="해당 수업에서 내가 제출한 코드를 압축해 다운로드 합니다"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        className={styles["modal-body"]}
        onSubmit={(e) => {
          e.preventDefault();
          toast
            .promise(
              getCodesWithZipFile(
                auth.token,
                params.lectureId!,
                selectedNode,
                setProgress
              ),
              {
                loading: progress,
                success: "불러오기 완료!",
                error: (err) => err.toString(),
              }
            )
            .then((res) => {
              onClose();
              saveAs(res);
            });
        }}
      >
        <TreeView
          nodes={nodesData}
          selectedList={selectedNode}
          setSelectedList={setSelectedNode}
        />
        <span>맞았습니다!를 받은 제일 최근 코드를 모아서 다운로드 합니다</span>
        <button role="submit" className={formStyles["primary-button"]}>
          선택 실습 다운로드 받기
        </button>
      </form>
    </Modal>
  );
};

export default DownloadMyCodesModal;
