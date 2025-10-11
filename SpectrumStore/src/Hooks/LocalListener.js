import { useState, useEffect } from "react";

export default function useLocalStorageListener(key) {
  const [value, setValue] = useState(() => {
    return JSON.parse(localStorage.getItem(key)) || [];
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedValue = JSON.parse(localStorage.getItem(key)) || [];
      setValue(updatedValue);
    };

    // Atualiza se outro componente salvar algo
    window.addEventListener("storage", handleStorageChange);

    // Atualiza se o mesmo componente salvar algo
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (k) {
      originalSetItem.apply(this, arguments);
      if (k === key) handleStorageChange();
    };

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      localStorage.setItem = originalSetItem;
    };
  }, [key]);

  return [value, setValue];
}
