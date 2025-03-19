import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import authService from "../api/AuthService";

import Layout from "../components/Layout";
import Text from "../components/Text";
import Input from "../components/Input";

const Container = styled.form`
  max-width: 320px;
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FakeButton = styled(Text)`
  ${({ theme: { colors } }) => `
    background: ${colors.black};
  `}

  cursor: pointer;
  margin-top: 16px;
  padding: 12px 24px;
  border-radius: 8px;
`;

const AuthenticationPage = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState<boolean>(true);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (event: any) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async () => {
    if (showLogin) {
      const isLoggedIn = await authService.login(form.username, form.password);

      if (!isLoggedIn) return;

      return navigate(0);
    }

    const isRegistered = await authService.register(
      form.username,
      form.password
    );

    if (!isRegistered.success) return;

    setShowLogin(true);
  };

  return (
    <Layout>
      <Container>
        <Text
          as="h1"
          fontFamily="Space Grotesk"
          fontSize="from34to24"
          textAlign="center"
        >
          {showLogin ? "Connexion" : "Inscription"}
        </Text>

        <Input
          name="username"
          label="Pseudo"
          value={form.username}
          onChange={handleChange}
        />

        <Input
          name="password"
          label="Mot de passe"
          type="password"
          value={form.password}
          onChange={handleChange}
        />

        <FakeButton textAlign="center" onClick={handleSubmit}>
          {showLogin ? "Se connecter" : "S'inscrire"}
        </FakeButton>

        <Text
          textAlign="center"
          style={{
            cursor: "pointer",
            width: "max-content",
            margin: "0 auto 0",
          }}
          onClick={() => setShowLogin((showLogin) => !showLogin)}
        >
          {showLogin
            ? "Pas encore inscrit ? Cliquez-ici !"
            : "Déjà inscrit ? Cliquez-ici !"}
        </Text>
      </Container>
    </Layout>
  );
};

export default AuthenticationPage;
