import React, {
  createContext,
  useContext,
  ReactNode,
  useReducer,
  useEffect,
  useState,
} from "react";

type LectureDataType = {
  semester: "past" | "present" | "future" | undefined;
  lectureName: string;
};

const LectureDataContext = createContext<LectureDataType | undefined>(
  undefined
);

type LectureDataActionType = {
  type: "UPDATE_DATA";
  payload: LectureDataType;
};
const LectureDataDispatchContext = createContext<
  React.Dispatch<LectureDataActionType> | undefined
>(undefined);

const LectureDataReducer = (
  state: LectureDataType,
  action: LectureDataActionType
): LectureDataType => {
  switch (action.type) {
    case "UPDATE_DATA":
      return { ...state, ...action.payload };
    default:
      throw new Error(
        `Unhandled action type: ${action.type} in LectureDataReducer`
      );
  }
};

type LectureDataProviderProps = {
  children: ReactNode;
};

export const LectureDataProvider = ({ children }: LectureDataProviderProps) => {
  const [state, dispatch] = useReducer(LectureDataReducer, {
    semester: undefined,
    lectureName: "",
  });

  useEffect(() => {
    if (
      state.semester === undefined &&
      sessionStorage.getItem("isCurrentSemester") !== null &&
      state.lectureName === "" &&
      sessionStorage.getItem("lectureName") !== null
    ) {
      dispatch({
        type: "UPDATE_DATA",
        payload: {
          semester: JSON.parse(sessionStorage.getItem("isCurrentSemester")!),
          lectureName: sessionStorage.getItem("lectureName")!,
        },
      });
    }

    if (state.semester !== undefined && state.lectureName !== "") {
      sessionStorage.setItem(
        "isCurrentSemester",
        JSON.stringify(state.semester)
      );
      sessionStorage.setItem("lectureName", state.lectureName);
    }
  });

  return (
    <LectureDataDispatchContext.Provider value={dispatch}>
      <LectureDataContext.Provider value={state}>
        {children}
      </LectureDataContext.Provider>
    </LectureDataDispatchContext.Provider>
  );
};

export const useLectureData = () => {
  const context = useContext(LectureDataContext);
  if (!context) {
    throw new Error("useLectureData must be used within a LectureDataProvider");
  }
  return context;
};

export const useLectureDataDispatch = () => {
  const context = useContext(LectureDataDispatchContext);
  if (!context) {
    throw new Error(
      "useLectureDataDispatch must be used within a LectureDataProvider"
    );
  }
  return context;
};

export const useBlockingLectureData = () => {
  const context = useContext(LectureDataContext);
  const [isContextLoading, setIsContextLoading] = useState(true);
  if (!context) {
    throw new Error("useLectureData must be used within a LectureDataProvider");
  }
  useEffect(() => {
    if (isContextLoading) setIsContextLoading(context.semester === undefined);
  });
  return { isContextLoading, context };
};
