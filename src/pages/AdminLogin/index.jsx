import { useState } from "react";
import styled from "styled-components";
import {API_URL } from "../../render"

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f5f5f5;
`;

const Card = styled.div`
  background: #fff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const Error = styled.p`
  color: red;
  text-align: center;
  margin-bottom: 10px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 12px;
  margin: 8px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const Button = styled.button`
  margin-top: 15px;
  padding: 12px;
  background-color: #007bff;
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }
`;

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL }/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erreur de connexion");
        return;
      }

      localStorage.setItem("adminToken", data.token);
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError("Erreur serveur");
    }
  };

  return (
    <Container>
      <Card>
        <Title>Connexion Admin</Title>
        {error && <Error>{error}</Error>}
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit">Se connecter</Button>
        </Form>
      </Card>
    </Container>
  );
}

export default AdminLogin;
