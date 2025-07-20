import { useState } from "react";
import LoginPage from "./LoginPage";
import SuccessPage from "./SuccessPage";

interface AuthWrapperProps {
  isSQLi1?: boolean;
}

export default function AuthWrapper({ isSQLi1 = false }: AuthWrapperProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const handleLoginSuccess = (username: string) => {
    setIsLoggedIn(true);
    setUsername(username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
  };

  return isLoggedIn ? (
    <SuccessPage username={username} onLogout={handleLogout} isSQLi1={isSQLi1} />
  ) : (
    <LoginPage onLoginSuccess={handleLoginSuccess} isSQLi1={isSQLi1} />
  );
}
