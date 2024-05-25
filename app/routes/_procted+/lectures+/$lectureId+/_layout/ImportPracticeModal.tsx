import { useState, useEffect } from "react";
import Modal from "~/components/Modal";
import { useAuth } from "~/contexts/AuthContext";
import { getAllPractices } from "~/API/lecture";
import { node as TreeViewNode } from "~/components/TreeView/SingleSelectTreeview";
import TreeView from "~/components/TreeView/SingleSelectTreeview";
import { semesterNumberToString } from "~/util";
import styles from "./modal.module.css";
import inputStyles from "~/components/Input/input.module.css";
import formStyles from "~/components/common/form.module.css";
import TextInput from "~/components/Input/TextInput";
import DateInput from "~/components/Input/DateInput";
import { useParams } from "@remix-run/react";
import toast from "react-hot-toast";
import { createNewPractice } from "~/API/practice";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ImportPracticeModal = ({ isOpen, onClose }: Props) => {
  const [data, setData] = useState<TreeViewNode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token, userId } = useAuth();
  const params = useParams();

  useEffect(() => {
    async function getData() {
      try {
        const response = await getAllPractices(token, userId);
        const res: TreeViewNode[] = [];
        response.data.forEach((data, idx) => {
          res[idx] = {} as TreeViewNode;
          res[idx].title = semesterNumberToString(data.semester);
          res[idx].id = data.semester + "";
          res[idx].children = data.lectures.map((lecture) => {
            return {
              title: lecture.title,
              id: lecture.id + "",
              children: lecture.practices.map((practice) => {
                return {
                  title: practice.title,
                  id: practice.id + "",
                  children: null,
                };
              }) as TreeViewNode[],
            };
          });
        });
        setData(res);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    }
    getData();
  }, []);

  return isLoading ? null : (
    <Modal
      title="실습 가져오기"
      subtitle="이전 수업에서 사용했던 실습을 불러옵니다"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        className={styles["modal-body"]}
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const lecture_id = parseInt(params.lectureId!, 10);
          const startTime = formData.get("startTime") as string;
          const endTime = formData.get("endTime") as string;
          const targetId = formData.get("import-target") as string;
          const title = formData.get("title") as string;
          const start = new Date(startTime);
          const end = new Date(endTime);
          if (start > end) {
            toast.error("종료 시간은 시작 시간보다 이후여야 합니다");
            return;
          }

          const start_time = start.toISOString();
          const end_time = end.toISOString();

          await toast.promise(
            createNewPractice(
              lecture_id,
              start_time,
              end_time,
              title,
              token,
              parseInt(targetId)
            ),
            {
              loading: "실습 생성중...",
              success: "성공적으로 실습을 생성하였습니다",
              error: (error) =>
                `Error: ${error.message} - ${error.responseMessage}`,
            }
          );
          onClose();
        }}
      >
        <div className={inputStyles.wrapper}>
          <span className={inputStyles.title}>가져올 실습</span>
          <TreeView nodes={data} name="import-target" />
        </div>
        <TextInput
          title="실습명"
          name="title"
          placeholder="예 : 실습 1"
          required
        />
        <DateInput name="startTime" title="시작 시간" required />
        <DateInput name="endTime" title="종료 시간" required />
        <button className={formStyles["primary-button"]} type="submit">
          실습 가져오기
        </button>
      </form>
    </Modal>
  );
};

export default ImportPracticeModal;
