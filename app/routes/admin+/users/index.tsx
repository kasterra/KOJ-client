import styles from "./users.module.css";
import Table from "./Table";
import { AdminTableRowDataProvider } from "./AdminTableRowDataContext";
import { MetaFunction } from "@remix-run/react";

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

export const meta: MetaFunction = () => {
  return [
    { title: "사용자 관리 | KOJ Admin" },
    {
      property: "description",
      content: "사용자 관리 화면입니다",
    },
    {
      property: "og:site_name",
      content: "KOJ - 사용자 관리",
    },
  ];
};
