import { ReactNode, useState } from "react";
import styles from "./table.module.css";
import { TableRow } from "~/types";

interface Props {
  TableHeader?: React.FC;
  dataHeaders: ReactNode[];
  dataRows: TableRow[];
  gridTemplateColumns: string;
  usesCheckbox?: boolean;
}

const TableBase = ({
  TableHeader,
  dataHeaders,
  dataRows,
  gridTemplateColumns,
  usesCheckbox = false,
}: Props) => {
  const [checkedList, setCheckedList] = useState(
    new Array(dataRows.length).fill(false)
  );

  return (
    <>
      <div className={styles.container}>
        {TableHeader ? (
          <div className={styles.header}>
            <TableHeader />
          </div>
        ) : null}
        <div
          className={styles["body-head"]}
          style={{ gridTemplateColumns, display: "grid" }}
        >
          {usesCheckbox ? <div /> : null}
          {dataHeaders.map((headerElement, idx) => (
            <div key={idx} className={styles["header-cell"]}>
              {headerElement}
            </div>
          ))}
        </div>

        {dataRows.map((dataRow, idx) => (
          <div
            key={idx}
            className={styles.row}
            style={{ gridTemplateColumns, display: "grid" }}
          >
            {usesCheckbox ? (
              <div className={styles.cell}>
                <input
                  type="checkbox"
                  value={checkedList[idx]}
                  onChange={() => {
                    setCheckedList(
                      checkedList.map((_, i) =>
                        i === idx ? !checkedList[idx] : _
                      )
                    );
                  }}
                />
              </div>
            ) : null}
            {[...dataRow.values()].map((item, idx) => (
              <div key={idx} className={styles.cell}>
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default TableBase;
