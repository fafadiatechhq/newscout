import { ThemeProvider } from "@/hooks/use-theme";
import React from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

export default AppLayout;
