import React, { createContext, useContext, ReactNode, useReducer } from "react";
import { SuccessUserSearchResponse, UserEntity } from "~/types/APIResponse";

type AdminTableRowDataType = {
  data: UserEntity[];
};

const AdminTableRowDataContext = createContext<
  AdminTableRowDataType | undefined
>(undefined);

type AdminTableRowDataActionType = {
  type: "UPDATE_DATA";
  payload: UserEntity[];
};
const AdminTableRowDataDispatchContext = createContext<
  React.Dispatch<AdminTableRowDataActionType> | undefined
>(undefined);

const AdminTableRowDataReducer = (
  state: AdminTableRowDataType,
  action: AdminTableRowDataActionType
): AdminTableRowDataType => {
  switch (action.type) {
    case "UPDATE_DATA":
      return { ...state, data: action.payload };
    default:
      throw new Error(
        `Unhandled action type: ${action.type} in TableRowDataReducer`
      );
  }
};

type AdminTableRowDataProviderProps = {
  children: ReactNode;
};

export const AdminTableRowDataProvider = ({
  children,
}: AdminTableRowDataProviderProps) => {
  const [state, dispatch] = useReducer(AdminTableRowDataReducer, {
    data: [],
  });

  return (
    <AdminTableRowDataDispatchContext.Provider value={dispatch}>
      <AdminTableRowDataContext.Provider value={state}>
        {children}
      </AdminTableRowDataContext.Provider>
    </AdminTableRowDataDispatchContext.Provider>
  );
};

export const useAdminTableRowData = () => {
  const context = useContext(AdminTableRowDataContext);
  if (!context) {
    throw new Error(
      "useAdminTableRowData must be used within a TableRowProvider"
    );
  }
  return context;
};

export const useAdminTableRowDataDispatch = () => {
  const context = useContext(AdminTableRowDataDispatchContext);
  if (!context) {
    throw new Error(
      "useAdminTableRowDataDispatch must be used within a TableRowProvider"
    );
  }
  return context;
};
