import React, { useEffect, useState } from "react";
import ChatPage from "./ChatPage";
import LanguagePage from "./LanguagePage";
import { sha256 } from "js-sha256";
import { useNavigate } from "react-router-dom";
import { exists } from "i18next";

// 校验token函数
async function validateToken(
  token: string
): Promise<{ valid: boolean; username: string; exists: boolean }> {
  // try {
  //   const res = await fetch(`/api/validate-token?token=${token}`);
  //   if (res.status === 200) {
  //     const data = await res.json();
  //     return { valid: true, username: data.username };
  //   }
  //   return { valid: false };
  // } catch {
  //   return { valid: false };
  // }
  if (token === "pass") {
    return { valid: true, username: "ziye", exists: true };
  } else if (token === "new") {
    return { valid: true, username: "ziye", exists: false };
  } else {
    return { valid: false, username: "ziye", exists: false };
  }
}

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

// 页面组件
const AuthGate: React.FC<{
  setVerified: (v: boolean) => void;
  setUsername: (u: string) => void;
}> = ({ setVerified, setUsername }) => {
  const [block, setBlock] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const authcode = params.get("authcode");
  useEffect(() => {
    async function run() {
      let token = authcode;
      if (!token) {
        token = localStorage.getItem("userToken") || "";
      }
      if (!token) {
        setBlock(true);
        setLoading(false);
        return;
      }
      const result = await validateToken(token);
      if (result.valid) {
        localStorage.setItem("userToken", token);
        setVerified(true);
        setUsername(result.username || "");
        setLoading(false);
        if (result.exists) {
          navigate("/chat", { replace: true });
        } else {
          navigate("/language", { replace: true });
        }
      } else {
        setBlock(true);
        setLoading(false);
        localStorage.removeItem("userToken");
      }
    }
    run();
  }, [setVerified, setUsername, authcode, navigate]);
  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "20vh", fontSize: "2rem" }}>
        验证中...
      </div>
    );
  if (block) return <Blocked />;
  return <div></div>;
};

export default AuthGate;
