import { useState } from "react";
import SubmitModal from "../_procted+/lectures+/$lectureId+/$practiceId+/$labId/SubmitModal";

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
