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
import { handle401, mapRoleToString } from "~/util";
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
          const response = await searchUser(searchStr, auth.token);
          switch (response.status) {
            case 200:
              toast.success("성공적으로 검색하였습니다");
              dispatch({ type: "UPDATE_DATA", payload: response.data });
              break;
            case 400:
              toast.error("인증 토큰이 누락되었습니다");
              break;
            case 401:
              toast.error("다시 로그인 하십시오");
              break;
            case 500:
              toast.error("서버 오류가 발생했습니다. 관리자에게 문의해 주세요");
              break;
            default:
              break;
          }
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
                    const response = await resetPassword(elem.id, auth.token);
                    switch (response.status) {
                      case 200:
                        toast.success("성공적으로 암호를 초기화 했습니다");
                        break;
                      case 400:
                        toast.error("형식이 올바르지 않습니다");
                        break;
                      case 401:
                        handle401();
                        break;
                      case 404:
                        toast.error(
                          "초기화 하려는 사용자의 ID가 존재하지 않습니다"
                        );
                        break;
                      case 409:
                      case 500:
                        toast.error(
                          "서버 오류가 발생했습니다. 관리자에게 문의해 주세요"
                        );
                        break;
                      default:
                        break;
                    }
                  }
                }}
              >
                암호 초기화
              </button>
              <button
                className={tableStyles["out-user"]}
                onClick={async () => {
                  if (confirm("정말로 해당 유저를 삭제하시겠습니까?")) {
                    const response = await deleteUser(elem.id, auth.token);
                    switch (response.status) {
                      case 204:
                        toast.success("성공적으로 삭제되었습니다");
                        break;
                      case 401:
                        toast.error("관리자 권한이 필요합니다");
                        break;
                      case 404:
                        toast.error(
                          "삭제하려는 사용자의 해당 ID가 존재하지 않습니다"
                        );
                        break;
                      case 500:
                        toast.error("500 : 관리자에게 문의해 주세요");
                      default:
                        break;
                    }
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
