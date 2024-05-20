import { ReactNode, useState } from "react";
import styles from "./users.module.css";
import tableStyles from "~/components/Table/table.module.css";
import TableBase from "~/components/Table/TableBase";
import { UserEntity } from "~/types/APIResponse";
import UserAddModal from "./UserAddModal";
import SearchInput from "~/components/Input/SearchInput";
import plusSVG from "~/assets/plus-w.svg";
import {
  useAdminTableRowData,
  useAdminTableRowDataDispatch,
} from "./AdminTableRowDataContext";
import { deleteUser, resetPassword, searchUser } from "~/API/user";
import { useAuth } from "~/contexts/AuthContext";
import { mapRoleToString } from "~/util";
import toast from "react-hot-toast";

const TableHeader = () => {
  const auth = useAuth();
  const dispatch = useAdminTableRowDataDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalOnClose = () => setIsModalOpen(false);
  return (
    <div className={styles["table-header"]}>
      <SearchInput
        title="사용자 검색"
        name="search"
        placeholder="이름 또는 학번으로 검색"
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const searchStr = formData.get("search") as string;
          await toast.promise(searchUser(searchStr, auth.token), {
            loading: "제목 검색시도...",
            success: (response) => {
              dispatch({ type: "UPDATE_DATA", payload: response.data });
              return "성공적으로 검색하였습니다";
            },
            error: (e) => `Error: ${e.message} - ${e.responseMessage}`,
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
  const { data } = useAdminTableRowData();
  function responseDataToMap(res: UserEntity[]) {
    const ret: Map<string, ReactNode>[] = [];
    if (res.length === 0) return ret;
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
                    await toast.promise(resetPassword(elem.id, auth.token), {
                      loading: "초기화 요청중...",
                      success: "성공적으로 암호를 초기화 했습니다",
                      error: (err) =>
                        `Error: ${err.message} - ${err.responseMessage}`,
                    });
                  }
                }}
              >
                암호 초기화
              </button>
              <button
                className={tableStyles["out-user"]}
                onClick={async () => {
                  if (confirm("정말로 해당 유저를 삭제하시겠습니까?")) {
                    await toast.promise(deleteUser(elem.id, auth.token), {
                      loading: "삭제 요청중...",
                      success: "성공적으로 삭제되었습니다",
                      error: (err) =>
                        `Error: ${err.message} - ${err.responseMessage}`,
                    });
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
    <TableBase
      TableHeader={TableHeader}
      dataHeaders={["사용자 이름", "학번", "역할", "기타 설정"]}
      dataRows={responseDataToMap(data)}
      gridTemplateColumns="70px 1fr 1fr 1fr 210px"
      usesCheckbox
    />
  );
};

export default Table;
