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

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ImportPracticeModal = ({ isOpen, onClose }: Props) => {
  const [data, setData] = useState<TreeViewNode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token, userId } = useAuth();

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
      <form className={styles["modal-body"]}>
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
