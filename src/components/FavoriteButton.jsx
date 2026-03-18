// src/components/FavoriteButton.jsx
import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Button = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${({ $active }) => ($active ? "#ef4444" : "#9ca3af")};
  font-size: 1.6rem;
  transition: transform 0.2s ease, color 0.2s;

  &:hover {
    transform: scale(1.15);
  }
`;

const AlertMessage = styled.div`
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #856404;
  background: #fff3cd;
  border: 1px solid #ffeeba;
  padding: 0.5rem 1rem;
  border-radius: 5px;
`;

export default function FavoriteButton({ active, onClick }) {
  const [alert, setAlert] = useState("");

  const handleClick = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAlert(
        <>
          Vous devez être connecté pour aimer ce produit.{" "}
          <Link to="/login" style={{ fontWeight: "bold", textDecoration: "underline" }}>
            Se connecter
          </Link>{" "}
          ou{" "}
          <Link to="/signup" style={{ fontWeight: "bold", textDecoration: "underline" }}>
            créer un compte
          </Link>.
        </>
      );
      return;
    }

    // Si connecté, on exécute la fonction onClick fournie
    onClick();
    setAlert(""); // réinitialise le message
  };

  return (
    <div>
      <Button $active={active} onClick={handleClick}>
        <FaHeart />
      </Button>
      {alert && <AlertMessage>{alert}</AlertMessage>}
    </div>
  );
}
