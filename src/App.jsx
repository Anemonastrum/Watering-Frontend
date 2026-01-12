import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import Login from "./pages/Login";
import Stats from "./pages/Stats";
import DeviceSettings from "./pages/DeviceSettings";
import Control from "./pages/Control";
import Dashboard from "./pages/Dashboard";
import { Dock } from "./components/Dock";

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SocketProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/settings" element={<DeviceSettings />} />
            <Route path="/control" element={<Control />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
          <Dock />
        </SocketProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}
