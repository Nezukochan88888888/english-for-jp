import React, { createContext, useState, useContext } from 'react';

const KidModeContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useKidMode = () => useContext(KidModeContext);

export const KidModeProvider = ({ children }) => {
  const [isKidMode, setIsKidMode] = useState(false);

  return (
    <KidModeContext.Provider value={{ isKidMode, setIsKidMode }}>
      {children}
    </KidModeContext.Provider>
  );
};
