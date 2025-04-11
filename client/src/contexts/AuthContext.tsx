import { createContext, ReactNode, useEffect, useState } from "react";
import * as apiClient from "../api-client";
import { useNavigate } from "react-router-dom";

// Define the types for authentication context
type AuthContextType = {
  isAuthenticated: boolean;
  role: string;
  username: string;
  setAuthenticated: (value: boolean) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<string>("");

  const [username, setUsername] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await apiClient.validateToken();
        setIsAuthenticated(true);
        setRole(response.role);
        setUsername(response.name);
      } catch (error) {
        console.error("Token validation failed:", error);
        setIsAuthenticated(false);
        navigate("/sign-in");
      }
    };
    validateToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role,
        username,
        setAuthenticated: setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
