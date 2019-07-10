import React, { useState } from "react";

import GlobalContext from "./GlobalContext";
import useEffectAsync from "../util/useEffectAsync";

const GlobalProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffectAsync(async () => {
    setLoading(false);
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        loading
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
