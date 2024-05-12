import Modal from "~/components/Modal";
import CodeBlank from "~/components/CodeBlank";
import { codeHole, parsedCodeElement } from "~/util/codeHole";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  codeString: string;
  language: string;
}

const BlankPreviewModal = ({
  isOpen,
  onClose,
  codeString,
  language,
}: Props) => {
  let parsedCode: parsedCodeElement[][];
  try {
    parsedCode = codeHole(codeString, language);
  } catch (error: any) {
    toast.error(error.message);
    onClose();
    return null;
  }
  return (
    <Modal
      title="빈칸 미리보기"
      subtitle="빈칸이 의도한대로 나오는지 미리보기"
      isOpen={isOpen}
      onClose={onClose}
    >
      <CodeBlank parsedCode={parsedCode} language={language} />
    </Modal>
  );
};

export default BlankPreviewModal;
