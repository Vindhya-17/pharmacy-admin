import { useState, useEffect } from "react";

// Custom Hook for getting user from localStorage
const useUser = () => {
  const [user, setUser] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) {
      setUser(JSON.parse(data));
    }
  }, []);

  return user;
};

export default useUser;
