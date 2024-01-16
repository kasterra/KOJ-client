import React, { createContext, useContext, ReactNode, useReducer } from "react";
import { SuccessUserSearchResponse, UserEntity } from "~/types/APIResponse";

type TableRowDataType = {
  data: UserEntity[];
};

const TableRowDataContext = createContext<TableRowDataType | undefined>(
  undefined
);

type TableRowDataActionType = {
  type: "UPDATE_DATA";
  payload: UserEntity[];
};
const TableRowDataDispatchContext = createContext<
  React.Dispatch<TableRowDataActionType> | undefined
>(undefined);

const TableRowDataReducer = (
  state: TableRowDataType,
  action: TableRowDataActionType
): TableRowDataType => {
  switch (action.type) {
    case "UPDATE_DATA":
      return { ...state, data: action.payload };
    default:
      throw new Error(
        `Unhandled action type: ${action.type} in TableRowDataReducer`
      );
  }
};

type TableRowDataProviderProps = {
  children: ReactNode;
};

export const TableRowDataProvider = ({
  children,
}: TableRowDataProviderProps) => {
  const [state, dispatch] = useReducer(TableRowDataReducer, {
    data: [],
  });

  return (
    <TableRowDataDispatchContext.Provider value={dispatch}>
      <TableRowDataContext.Provider value={state}>
        {children}
      </TableRowDataContext.Provider>
    </TableRowDataDispatchContext.Provider>
  );
};

export const useTableRowData = () => {
  const context = useContext(TableRowDataContext);
  if (!context) {
    throw new Error("useTableRow must be used within a TableRowProvider");
  }
  return context;
};

export const useTableRowDataDispatch = () => {
  const context = useContext(TableRowDataDispatchContext);
  if (!context) {
    throw new Error(
      "useTableRowDispatch must be used within a TableRowProvider"
    );
  }
  return context;
};
