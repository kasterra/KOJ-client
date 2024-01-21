import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./input.module.css";
import fileSVG from "./icons/file.svg";
import toast from "react-hot-toast";

interface Props {
  title: string;
  name: string;
  description?: string;
  onFileUpload: (file: File) => void;
  fileValidator?: (file: File) => boolean;
  placeholder?: string;
}

const SingleFileInput = ({
  name,
  title,
  description,
  onFileUpload,
  fileValidator,
  placeholder = "단일 파일 업로드",
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLLabelElement>(null);

  const [fileUploaded, setFileUploaded] = useState<File | null>(null);

  const validateFileExtension =
    fileValidator ||
    function (file: File) {
      return true;
    };
  const processFileFromEvent = useCallback(
    (dataTransfer: DataTransfer | null, inputFiles: FileList | null): void => {
      let file: File;
      if (dataTransfer) {
        file = dataTransfer.files[0];
      } else if (inputFiles) {
        file = inputFiles[0];
      } else {
        throw new Error("Invalid Argument in processFileFromEvent");
      }
      if (!validateFileExtension(file)) {
        toast.error("지원하지 않는 파일 형식을 업로드 하였습니다");
        return;
      }
      onFileUpload(file);
      setFileUploaded(file);
    },
    [onFileUpload]
  );
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    processFileFromEvent(null, e.target.files);
  };

  const handleDropReact = (e: React.DragEvent<HTMLLabelElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    processFileFromEvent(e.dataTransfer, null);
  };

  const nativeHandleDragIn = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const nativeHandleDragOut = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const nativeHandleDragOver = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const nativeHandleDrop = useCallback(
    (e: DragEvent): void => {
      e.preventDefault();
      e.stopPropagation();

      processFileFromEvent(e.dataTransfer, null);
    },
    [processFileFromEvent]
  );

  const initDragEvents = useCallback(() => {
    if (dragRef.current) {
      dragRef.current.addEventListener("dragenter", nativeHandleDragIn);
      dragRef.current.addEventListener("dragleave", nativeHandleDragOut);
      dragRef.current.addEventListener("dragover", nativeHandleDragOver);
      dragRef.current.addEventListener("drop", nativeHandleDrop);
    }
  }, [
    nativeHandleDragIn,
    nativeHandleDragOut,
    nativeHandleDragOver,
    nativeHandleDrop,
  ]);
  const resetDragEvents = useCallback(() => {
    if (dragRef.current) {
      dragRef.current.removeEventListener("dragenter", nativeHandleDragIn);
      dragRef.current.removeEventListener("dragleave", nativeHandleDragOut);
      dragRef.current.removeEventListener("dragover", nativeHandleDragOver);
      dragRef.current.removeEventListener("drop", nativeHandleDrop);
    }
  }, [
    nativeHandleDragIn,
    nativeHandleDragOut,
    nativeHandleDragOver,
    nativeHandleDrop,
  ]);

  useEffect(() => {
    initDragEvents();
    return () => resetDragEvents();
  }, [initDragEvents, resetDragEvents]);
  return (
    <label
      className={styles.wrapper}
      htmlFor={name}
      ref={dragRef}
      onDrop={handleDropReact}
    >
      <span className={styles.title}>{title}</span>
      <div className={styles.input} style={{ height: 150, cursor: "pointer" }}>
        <input
          className={styles.hide}
          type="file"
          name={name}
          id={name}
          multiple={false}
          ref={fileInputRef}
          onChange={handleInputChange}
        />
        <p className={styles["file-input-text"]}>
          {fileUploaded ? fileUploaded.name : placeholder}
        </p>
        <div className={styles["file-input-icon"]}>
          <img src={fileSVG} alt="file icon" className={styles.icon} />
        </div>
      </div>
      {description?.length && (
        <span className={styles.description}>{description}</span>
      )}
    </label>
  );
};

export default SingleFileInput;
