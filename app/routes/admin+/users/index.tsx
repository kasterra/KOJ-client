import styles from "./users.module.css";
import Table from "./Table";
import { TableRowDataProvider } from "./TableRowDataContext";

const Users = () => {
  return (
    <div className={styles.container}>
      <TableRowDataProvider>
        <Table />
      </TableRowDataProvider>
    </div>
  );
};

export default Users;
