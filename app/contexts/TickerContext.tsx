import React, { createContext, useContext, ReactNode, useReducer } from "react";

type TickerType = {
  ticker: number;
};

const TickerContext = createContext<TickerType | undefined>(undefined);

type TickerActionType = {
  type: "UPDATE_TICKER";
};

const TickerDispatchContext = createContext<
  React.Dispatch<TickerActionType> | undefined
>(undefined);

const TickerReducer = (state: TickerType, action: TickerActionType) => {
  switch (action.type) {
    case "UPDATE_TICKER":
      return { ticker: state.ticker + 1 };
    default:
      throw new Error(`Unhandled action type: ${action.type} in TickerReducer`);
  }
};

type TickerProviderProps = {
  children: ReactNode;
};

export const TickerProvider = ({ children }: TickerProviderProps) => {
  const [state, dispatch] = useReducer(TickerReducer, {
    ticker: 0,
  });
  return (
    <TickerContext.Provider value={state}>
      <TickerDispatchContext.Provider value={dispatch}>
        {children}
      </TickerDispatchContext.Provider>
    </TickerContext.Provider>
  );
};

export const useTicker = () => {
  const context = useContext(TickerContext);
  if (context === undefined) {
    throw new Error("useTicker must be used within a TickerProvider");
  }
  return context;
};

export const useTickerDispatch = () => {
  const context = useContext(TickerDispatchContext);
  if (context === undefined) {
    throw new Error("useTickerDispatch must be used within a TickerProvider");
  }
  return context;
};
