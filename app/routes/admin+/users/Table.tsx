import { ReactNode, useState } from "react";
import styles from "./users.module.css";
import tableStyles from "~/components/Table/table.module.css";
import TableBase from "~/components/Table/TableBase";
import { UserEntity } from "~/types/APIResponse";
import UserAddModal from "./UserAddModal";
import SearchInput from "~/components/Input/SearchInput";
import plusSVG from "~/components/Table/icons/plus.svg";
import {
  useTableRowData,
  useTableRowDataDispatch,
} from "./TableRowDataContext";
import { deleteUser, resetPassword } from "~/API/user";
import { useAuth } from "~/contexts/AuthContext";
import { mapRoleToString } from "~/util";

const TableHeader = () => {
  const dispatch = useTableRowDataDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalOnClose = () => setIsModalOpen(false);
  console.log(isModalOpen);
  return (
    <div className={styles["table-header"]}>
      <SearchInput
        title="사용자 검색"
        name="username"
        placeholder="이름 또는 학번으로 검색"
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const name = formData.get("username") as string;
          dispatch({
            type: "UPDATE_DATA",
            payload: [
              {
                id: "2020123456",
                is_admin: false,
                name: "김샘플",
                role: "student",
              },
            ],
          });
        }}
      />
      <div
        className={tableStyles["add-button"]}
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <img
          src={plusSVG}
          alt="plus icon"
          className={tableStyles["button-icon"]}
        />
        사용자 추가하기
      </div>
      <UserAddModal isOpen={isModalOpen} onClose={modalOnClose} />
    </div>
  );
};

const Table = () => {
  const auth = useAuth();
  const { data } = useTableRowData();
  function responseDataToMap(res: UserEntity[]) {
    const ret: Map<string, ReactNode>[] = [];
    res.forEach((elem) => {
      ret.push(
        new Map<string, ReactNode>([
          ["name", elem.name],
          ["id", elem.id],
          ["role", mapRoleToString(elem.role)],
          [
            "config",
            <>
              <button
                className={tableStyles["reset-password"]}
                onClick={async () => {
                  if (confirm("정말로 초기화 하시겠습니까?")) {
                    await resetPassword(elem.id, auth.token);
                  }
                }}
              >
                암호 초기화
              </button>
              <button
                className={tableStyles["out-user"]}
                onClick={async () => {
                  if (confirm("정말로 해당 유저를 삭제하시겠습니까?")) {
                    await deleteUser(elem.id, auth.token);
                  }
                }}
              >
                회원 삭제하기
              </button>
            </>,
          ],
        ])
      );
    });
    return ret;
  }

  return (
    <>
      <TableBase
        TableHeader={TableHeader}
        dataHeaders={["사용자 이름", "학번", "역할", "기타 설정"]}
        dataRows={responseDataToMap(data)}
        gridTemplateColumns="70px 1fr 1fr 1fr 210px"
        usesCheckbox
      />
    </>
  );
};

export default Table;
