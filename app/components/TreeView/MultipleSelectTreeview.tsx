import { useState } from "react";
import styles from "./treeview.module.css";
import chevDownSVG from "./icons/chevDown.svg";
import chevRightSVG from "./icons/chevRight.svg";
import fileSVG from "./icons/file.svg";
import folderSVG from "./icons/folder.svg";
import openFolderSVG from "./icons/openFolder.svg";

export interface node {
  title: string;
  id: string;
  isTerminal?: true;
  children: node[] | null;
}

interface Props {
  nodes: node[];
  selectedList: { fullName: string; id: string }[];
  setSelectedList: React.Dispatch<
    React.SetStateAction<{ fullName: string; id: string }[]>
  >;
}

const TreeView = ({ nodes, selectedList, setSelectedList }: Props) => {
  return (
    <div className={styles.container}>
      {nodes.map((node, idx) => (
        <TreeNode
          key={idx}
          nodeElement={node}
          depth={0}
          selectedList={selectedList}
          setSelectedList={setSelectedList}
          supername={node.title}
        />
      ))}
    </div>
  );
};

const TreeNode = ({
  nodeElement: { title, children, id },
  depth,
  selectedList,
  setSelectedList,
  supername,
}: {
  nodeElement: node;
  depth: number;
  selectedList: { fullName: string; id: string }[];
  setSelectedList: React.Dispatch<
    React.SetStateAction<{ fullName: string; id: string }[]>
  >;
  supername: string;
}) => {
  const isTerminal = children === null;
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div
        className={`${styles.section}  ${
          selectedList.some((item) => isTerminal && item.id === id)
            ? styles["selected"]
            : ""
        }`}
      >
        <div style={{ width: `${depth * 8}px` }} />
        {isTerminal ? (
          <>
            <div style={{ width: 8 }} />
            <div
              className={styles["section-btn"]}
              onClick={() => {
                setSelectedList((prev) => {
                  return prev.some((item) => item.id === id)
                    ? prev.filter((item) => item.id !== id)
                    : [...prev, { fullName: `${supername} > ${title}`, id }];
                });
              }}
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
              selectedList={selectedList}
              setSelectedList={setSelectedList}
              supername={`${supername} > ${child.title}`}
            />
          ))
        : null}
    </>
  );
};

export default TreeView;
