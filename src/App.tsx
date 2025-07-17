import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "./i18n";
import AuthGate from "./pages/AuthGate";
import "./index.css";
import LanguagePage from "./pages/LanguagePage";
import ChatPage from "./pages/ChatPage";

const NoAuth: React.FC = () => (
  <div style={{ textAlign: "center", marginTop: "20vh", fontSize: "2rem" }}>
    <br> Access Restricted: Please enter via the authorized link </br>
    <br> 访问受限：请通过授权链接进入 </br>
    アクセス制限：認証リンクからご利用ください
  </div>
);

const AuthRedirect: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const authcode = params.get("authcode");
  if (!authcode) {
    return <NoAuth />;
  }
  // 只允许 /authgate、/chat、/language 路径，其他一律重定向
  if (
    location.pathname !== "/authgate" &&
    location.pathname !== "/chat" &&
    location.pathname !== "/language"
  ) {
    return (
      <Navigate
        to={`/authgate?authcode=${encodeURIComponent(authcode)}`}
        replace
      />
    );
  }
  return null;
};

const Blocked: React.FC = () => (
  <div style={{ textAlign: "center", marginTop: "20vh", fontSize: "2rem" }}>
    <h2>Access Denied / 访问受限 / アクセス拒否</h2>
    <p>
      Please enter via the authorized link.
      <br />
      请通过授权链接进入。
      <br />
      認証リンクからご利用ください。
    </p>
  </div>
);

const App: React.FC = () => {
  const [verified, setVerified] = useState(false);
  const [username, setUsername] = useState("");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/authgate"
          element={
            <AuthGate setVerified={setVerified} setUsername={setUsername} />
          }
        />
        <Route
          path="/chat"
          element={
            verified ? (
              <ChatPage username={username} />
            ) : (
              <Navigate to="/authgate" replace />
            )
          }
        />
        <Route
          path="/language"
          element={
            verified ? (
              <LanguagePage
                setVerified={setVerified}
                setUsername={setUsername}
              />
            ) : (
              <Navigate to="/authgate" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/authgate" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
