import { FC } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import Theme from "./utils/Theme";
import { UserProvider } from "./context/UserContext";

import HomePage from "./pages/HomePage";
import AuthenticationPage from "./pages/AuthenticationPage";
import ConversationPage from "./pages/ConversationPage";

const App: FC = () => {
  return (
    <ThemeProvider theme={Theme}>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthenticationPage />} />
            <Route
              path="/conversation/:conversationId"
              element={<ConversationPage />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
