import { TableRowDataProvider } from "~/contexts/TableRowDataContext";
import Table from "./Table";
import styles from "./index.module.css";

const Wrapper = () => {
  return (
    <TableRowDataProvider>
      <div className={styles.container}>
        <Table />
      </div>
    </TableRowDataProvider>
  );
};

export default Wrapper;
