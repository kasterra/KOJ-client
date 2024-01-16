import React, {
  createContext,
  useContext,
  ReactNode,
  useReducer,
  useEffect,
} from "react";

type AuthType = {
  userId: string;
  token: string;
};

const AuthContext = createContext<AuthType | undefined>(undefined);

type AuthActionType =
  | { type: "UPDATE_DATA"; payload: AuthType }
  | { type: "DELETE_DATA" };

const AuthDispatchContext = createContext<
  React.Dispatch<AuthActionType> | undefined
>(undefined);

const AuthReducer = (state: AuthType, action: AuthActionType): AuthType => {
  switch (action.type) {
    case "UPDATE_DATA":
      return {
        ...state,
        ...action.payload,
      };
    case "DELETE_DATA":
      sessionStorage.clear();
      return { userId: "", token: "" };
    default:
      throw new Error(
        `Unhandled action type: ${(action as AuthActionType).type}`
      );
  }
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(AuthReducer, {
    token: "",
    userId: "",
  });

  useEffect(() => {
    if (
      state.token.length === 0 &&
      sessionStorage.getItem("authToken") !== null &&
      sessionStorage.getItem("userId") !== null &&
      sessionStorage.getItem("authToken")!.length !== 0 &&
      sessionStorage.getItem("userId")!.length !== 0
    ) {
      dispatch({
        type: "UPDATE_DATA",
        payload: {
          token: sessionStorage.getItem("authToken")!,
          userId: sessionStorage.getItem("userId")!,
        },
      });
    }
    if (state.token && state.userId) {
      sessionStorage.setItem("authToken", state.token);
      sessionStorage.setItem("userId", state.userId);
    }
  }, [state.token, state.userId]);

  return (
    <AuthDispatchContext.Provider value={dispatch}>
      <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
    </AuthDispatchContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useAuthDispatch = () => {
  const context = useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error("useAuthDispatch must be used within an AuthProvider");
  }
  return context;
};
