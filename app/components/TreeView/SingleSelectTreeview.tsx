import { useState } from "react";
import styles from "./treeview.module.css";
import chevDownSVG from "./icons/chevDown.svg";
import chevRightSVG from "./icons/chevRight.svg";
import fileSVG from "./icons/file.svg";
import folderSVG from "./icons/folder.svg";
import openFolderSVG from "./icons/openFolder.svg";

export interface node {
  title: string;
  id?: string;
  isTerminal?: true;
  children: node[] | null;
}

interface Props {
  nodes: node[];
  name: string;
}

const TreeView = ({ nodes, name }: Props) => {
  const [value, setValue] = useState("");
  return (
    <div className={styles.container}>
      {nodes.map((node, idx) => (
        <TreeNode
          key={idx}
          nodeElement={node}
          depth={0}
          value={value}
          setValue={setValue}
        />
      ))}
      <input
        type="text"
        style={{ display: "none" }}
        name={name}
        value={value}
        readOnly
      />
    </div>
  );
};

const TreeNode = ({
  nodeElement: { title, children, id },
  depth,
  value,
  setValue,
}: {
  nodeElement: node;
  depth: number;
  value: string;
  setValue: React.Dispatch<string>;
}) => {
  const isTerminal = children === null;
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div
        className={`${styles.section}  ${
          id === value ? styles["selected"] : ""
        }`}
      >
        <div style={{ width: `${depth * 8}px` }} />
        {isTerminal ? (
          <>
            <div style={{ width: 8 }} />
            <div
              className={styles["section-btn"]}
              onClick={() => setValue(id!)}
            >
              <img
                className={styles["leading-img"]}
                src={fileSVG}
                alt="file icon"
              />
              {title}
            </div>
          </>
        ) : (
          <div
            className={styles["section-btn"]}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <img
              src={isOpen ? chevDownSVG : chevRightSVG}
              alt={isOpen ? "down arrow" : "right arrow"}
              className={styles["chevron-img"]}
            />
            <img
              src={isOpen ? openFolderSVG : folderSVG}
              alt={isOpen ? "open folder" : "closed folder"}
              className={styles["leading-img"]}
            />
            <span>{title}</span>
          </div>
        )}
      </div>
      {isOpen && children
        ? children.map((child, idx) => (
            <TreeNode
              key={idx}
              nodeElement={child}
              depth={depth + 1}
              value={value}
              setValue={setValue}
            />
          ))
        : null}
    </>
  );
};

export default TreeView;
