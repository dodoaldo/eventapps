import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  role: string | null; // Menyimpan role pengguna
  login: (role: string) => void; // Menambahkan fungsi login
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    const loginTime = localStorage.getItem('loginTime');

    if (user && loginTime) {
      const currentTime = new Date().getTime();
      const timeElapsed = currentTime - parseInt(loginTime, 10);
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (timeElapsed < twentyFourHours) {
        setIsLoggedIn(true);
        const userData = JSON.parse(user);
        setRole(userData.role); // Mengatur role dari user yang login
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('loginTime');
      }
    }
  }, []);

  const login = (data: any) => {
    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("loginTime", new Date().getTime().toString());
    const { role, id } = data;
    localStorage.setItem("role", role);
    localStorage.setItem("userId", id);
  
    setIsLoggedIn(true);
    setRole(role);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    window.location.href = '/login';
    setIsLoggedIn(false);
    setRole(null);
  };
  

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
