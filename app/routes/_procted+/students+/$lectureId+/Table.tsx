import { ReactNode, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "@remix-run/react";
import TableBase from "~/components/Table/TableBase";
import styles from "./index.module.css";
import tableStyles from "~/components/Table/table.module.css";
import dropdownStyles from "~/components/common/dropdown.module.css";
import {
  useLectureData,
  useLectureDataDispatch,
} from "~/contexts/LectureDataContext";
import chevUpSVG from "~/assets/chevronUp.svg";
import chevDownSVG from "~/assets/chevronDown.svg";
import { Lecture } from "~/types";
import {
  getCurrentSemesterLectures,
  getFutureSemesterLectures,
  getPreviousSemesterLectures,
  getUsersInLecture,
  removeUserInLecture,
} from "~/API/lecture";
import { useAuth } from "~/contexts/AuthContext";
import plusW from "~/assets/plus-w.svg";
import UserAddModal from "./UserAddModal";
import {
  SuccessLecturesResponse,
  SuccessUserSearchResponse,
  UserEntity,
  isSuccessResponse,
} from "~/types/APIResponse";
import { resetPassword } from "~/API/user";
import { mapRoleToString } from "~/util";
import toast from "react-hot-toast";

const TableHeader = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const lectureData = useLectureData();
  const dispatchLectureData = useLectureDataDispatch();
  const [lectureListLoading, setLectureListLoading] = useState(true);
  const [lectureList, setLectureList] = useState<Lecture[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isUserAddModalOpen, setIsUserAddModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getLectureList = async () => {
      try {
        if (lectureData.semester === "present") {
          const response = await getCurrentSemesterLectures(
            auth.userId,
            auth.token
          );
          if (isSuccessResponse(response))
            setLectureList((response as SuccessLecturesResponse).data);
        } else if (lectureData.semester === "past") {
          const response = await getPreviousSemesterLectures(
            auth.userId,
            auth.token
          );
          if (isSuccessResponse(response))
            setLectureList((response as SuccessLecturesResponse).data);
        } else if (lectureData.semester === "future") {
          const response = await getFutureSemesterLectures(
            auth.userId,
            auth.token
          );
          if (isSuccessResponse(response))
            setLectureList((response as SuccessLecturesResponse).data);
        }
        setLectureListLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    getLectureList();
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef]);

  return (
    <div className={styles["header-container"]} ref={containerRef}>
      <button
        className={styles.dropdown}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {lectureData.lectureName}
        <img
          className={styles.icon}
          src={isOpen ? chevUpSVG : chevDownSVG}
          alt={isOpen ? "열림" : "닫힘"}
        />
      </button>

      <div className={styles["buttons-container"]}>
        <button
          className={styles["blue-button"]}
          onClick={() => setIsUserAddModalOpen(true)}
        >
          <img
            className={styles.icon}
            src={plusW}
            alt="사용자 추가 아이콘"
          />
          <span>사용자 추가하기</span>
        </button>
      </div>

      {isOpen ? (
        <div className={dropdownStyles["dropdown-item-container"]}>
          {lectureListLoading
            ? "강의목록 로딩중..."
            : lectureList.map((lecture) => (
                <div
                  className={dropdownStyles["dropdown-item"]}
                  key={lecture.id}
                  onClick={() => {
                    dispatchLectureData({
                      type: "UPDATE_DATA",
                      payload: {
                        lectureName: lecture.title,
                        semester: lectureData.semester,
                      },
                    });
                    navigate(`/students/${lecture.id}`);
                  }}
                >
                  {lecture.title}
                </div>
              ))}
        </div>
      ) : null}
      <UserAddModal
        isOpen={isUserAddModalOpen}
        onClose={() => {
          setIsUserAddModalOpen(false);
          window.location.reload();
        }}
      />
    </div>
  );
};

const Table = () => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<UserEntity[]>([]);
  const params = useParams();
  const lectureId = params.lectureId!;

  useEffect(() => {
    async function getData() {
      const response = await getUsersInLecture(lectureId, auth.token);
      if (isSuccessResponse(response)) {
        setUsers((response as SuccessUserSearchResponse).data);
      }
      setIsLoading(false);
    }
    getData();
  }, [isLoading, params.lectureId]);

  function responseDataToMap(res: UserEntity[]) {
    const ret: Map<string, ReactNode>[] = [];
    if (res.length === 0) return ret;
    res.forEach((elem) => {
      ret.push(
        new Map<string, ReactNode>([
          ["name", elem.name],
          ["id", elem.id],
          ["role", mapRoleToString((elem as any).lecture_role)],
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
                        toast.error(
                          "세션이 만료되었습니다. 다시 로그인 해주세요"
                        );
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
                  if (confirm("정말로 해당 유저를 내보내시겠습니까?")) {
                    const response = await removeUserInLecture(
                      lectureId,
                      elem.id,
                      auth.token
                    );
                    switch (response.status) {
                      case 204:
                        toast.success("성공적으로 유저를 내보냈습니다");
                        break;
                      case 401:
                        toast.error(
                          "유효하지 않은 JWT 토큰. 다시 로그인 해주세요"
                        );
                        break;
                      case 403:
                        toast.error(
                          "강의 소유 권한이 없습니다. 다시 확인해 주세요"
                        );
                        break;
                      case 404:
                        toast.error(
                          "해당 강의 ID 또는 유저 ID가 존재하지 않습니다"
                        );
                    }
                    setIsLoading(true);
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

  return isLoading ? (
    <h3>loading...</h3>
  ) : (
    <TableBase
      gridTemplateColumns="1fr 1fr 1fr 230px"
      TableHeader={TableHeader}
      dataHeaders={["사용자 이름", "학번", "역할", "기타 설정"]}
      dataRows={responseDataToMap(users)}
    />
  );
};

export default Table;
