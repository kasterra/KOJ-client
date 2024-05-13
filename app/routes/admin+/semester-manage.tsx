import { useEffect, useState } from "react";
import { semesterStringToNumber } from "~/util";
import RadioGroup from "~/components/Radio/RadioGroup";
import TextInput from "~/components/Input/TextInput";
import styles from "~/components/common/form.module.css";
import { getSemester, setSemester } from "~/API/admin";
import { useAuth } from "~/contexts/AuthContext";
import toast from "react-hot-toast";
import { MetaFunction } from "@remix-run/react";

const Manage = () => {
  const auth = useAuth();
  const [semesterString, setSemesterString] = useState("1");
  const [currentSemester, setCurrentSemester] = useState(-1);

  useEffect(() => {
    async function getSemesterFromServer() {
      const { status, data } = await getSemester(auth.token);
      if (status === 200) {
        setCurrentSemester(data.semester);
      } else {
        toast(data.message, { icon: "⚠️" });
      }
    }

    getSemesterFromServer();
  }, []);

  return currentSemester === -1 ? null : (
    <form
      style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const year = formData.get("year") as string;

        const { status, message } = await setSemester(
          semesterStringToNumber(year, semesterString),
          auth.token
        );

        if (status === 200) {
          toast.success("성공적으로 변경되었습니다!");
        } else {
          toast(message, { icon: "⚠️" });
        }
      }}
    >
      <TextInput
        title="현재 학년도 지정"
        name="year"
        required
        defaultValue={new Date().getFullYear().toString()}
      />
      <RadioGroup
        title="현재 학기 지정"
        name="problemType"
        valueList={["1", "여름", "2", "겨울"]}
        textList={["1학기", "여름학기", "2학기", "겨울학기"]}
        onChange={setSemesterString as (value: string) => void}
        defaultValue={["1", "여름", "2", "겨울"][currentSemester % 10]}
      />
      <button type="submit" className={styles["primary-button"]}>
        제출
      </button>
    </form>
  );
};

export default Manage;

export const meta: MetaFunction = () => {
  return [
    {
      title: "학기 지정 | KOJ Admin",
    },
    {
      property: "description",
      content: "학기 지정 화면입니다",
    },
    {
      property: "og:site_name",
      content: "기술적 문제로 학기는 직접 설정합니다",
    },
  ];
};
