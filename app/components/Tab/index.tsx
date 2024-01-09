import styles from "./tab.module.css";

interface Props {
  titleList: string[];
  selectedIdx: number;
  setSelectedIdx: (idx: number) => void;
}

const Tab = ({ titleList, selectedIdx, setSelectedIdx }: Props) => {
  return (
    <div className={styles.container}>
      {titleList.map((title, idx) => (
        <div
          className={selectedIdx === idx ? styles.active : styles.deactive}
          key={idx}
          onClick={() => setSelectedIdx(idx)}
        >
          {title}
        </div>
      ))}
    </div>
  );
};

export default Tab;
