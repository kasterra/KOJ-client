import styles from "./users.module.css";
import Table from "./Table";
import { AdminTableRowDataProvider } from "./AdminTableRowDataContext";

const Users = () => {
  return (
    <div className={styles.container}>
      <AdminTableRowDataProvider>
        <Table />
      </AdminTableRowDataProvider>
    </div>
  );
};

export default Users;
