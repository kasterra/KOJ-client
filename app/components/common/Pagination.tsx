import styles from "./pagination.module.css";
import LeftBtnSVG from "./left-btn.svg?react";
import RightBtnSVG from "./right-btn.svg?react";

interface Props {
  currentPage: number;
  lastPage: number;
  onChangePage: (page: number) => void;
  style: React.CSSProperties;
}

const Pagination = ({ currentPage, lastPage, onChangePage, style }: Props) => {
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(lastPage, currentPage + 2);
  const pageNumbers = [];

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  return (
    <div className={styles.container} style={style}>
      <button type="button" className={styles.btn}>
        <LeftBtnSVG
          style={{ fill: currentPage === 1 ? "#C5C5C5" : "#161616" }}
        />
      </button>
      {startPage > 1 && (
        <>
          <button
            type="button"
            className={styles.btn}
            onClick={() => onChangePage(1)}
          >
            1
          </button>
          <div className={styles.btn}>...</div>
        </>
      )}

      {pageNumbers.map((pageNumber) => (
        <button
          type="button"
          className={`${styles.btn} ${
            pageNumber === currentPage && styles.enabled
          }`}
          onClick={() => onChangePage(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}

      {endPage < lastPage && (
        <>
          <div className={styles.btn}>...</div>
          <button
            type="button"
            className={styles.btn}
            onClick={() => onChangePage(lastPage)}
          >
            {lastPage}
          </button>
        </>
      )}

      <button type="button" className={styles.btn}>
        <RightBtnSVG
          style={{ fill: currentPage === lastPage ? "#C5C5C5" : "#161616" }}
        />
      </button>
    </div>
  );
};

export default Pagination;
