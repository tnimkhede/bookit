import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "professional" | "client";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  category?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const HARDCODED_USERS = {
  professional: {
    email: "doctor@app.com",
    password: "professional123",
    user: {
      id: "prof-1",
      email: "doctor@app.com",
      name: "Dr. Sarah Johnson",
      role: "professional" as UserRole,
      phone: "+1 (555) 123-4567",
      category: "Doctor",
      location: "New York, NY",
    },
  },
  client: {
    email: "client@app.com",
    password: "client123",
    user: {
      id: "client-1",
      email: "client@app.com",
      name: "John Smith",
      role: "client" as UserRole,
      phone: "+1 (555) 987-6543",
      location: "Brooklyn, NY",
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string, role: UserRole): boolean => {
    const userData = HARDCODED_USERS[role];
    if (userData.email === email && userData.password === password) {
      setUser(userData.user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
