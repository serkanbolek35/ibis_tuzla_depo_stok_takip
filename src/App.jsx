// src/App.jsx
import { AppProvider, useApp } from "./contexts/AppContext.jsx";
import LoginPage from "./components/LoginPage.jsx";
import MainLayout from "./components/MainLayout.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import Toast from "./components/Toast.jsx";
import "./styles/global.css";

function AppInner() {
  const { user, authLoading } = useApp();
  if (authLoading) return <LoadingScreen />;
  return (
    <>
      <Toast />
      {user ? <MainLayout /> : <LoginPage />}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
