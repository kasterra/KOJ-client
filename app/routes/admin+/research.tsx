import { useState } from "react";
import SubmitModal from "../_procted+/lectures+/$lectureId+/$practiceId+/$labId/SubmitModal";
import { MetaFunction } from "@remix-run/react";

const Research = () => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ height: 700 }}>
      <SubmitModal isOpen={open} onClose={() => setOpen(false)} />
      <button
        onClick={() => {
          setOpen(true);
        }}
      >
        open
      </button>
    </div>
  );
};

export default Research;

export const meta: MetaFunction = () => {
  return [
    { title: "연구 기능 | KOJ Admin" },
    {
      property: "description",
      content: "연구 기능 화면입니다. 뭐가 들어갈진 모르겠네요",
    },
    {
      property: "og:site_name",
      content: "KOJ - 제출 이력",
    },
  ];
};
