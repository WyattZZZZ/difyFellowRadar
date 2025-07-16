import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./i18n";
import LanguagePage from "./pages/LanguagePage";
import ChatPage from "./pages/ChatPage";
import "./index.css";

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LanguagePage />} />
      <Route path="/chat" element={<ChatPage username="baga"/>} />
    </Routes>
  </BrowserRouter>
);

export default App;
