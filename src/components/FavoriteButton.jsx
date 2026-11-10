import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { FiHeart, FiCheck } from "react-icons/fi";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";

/* =============================
   ANIMATION
============================= */

const heartPop = keyframes`
  0% { transform: scale(1); }
  35% { transform: scale(1.35); }
  65% { transform: scale(0.9); }
  100% { transform: scale(1); }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/* =============================
   WRAPPER
============================= */

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
`;

/* =============================
   BUTTON
============================= */

const Button = styled.button`
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ $active }) => ($active ? "#b99a72" : "#e5e0d8")};
  border-radius: 50%;
  background: ${({ $active }) => ($active ? "#f5eee5" : "#fff")};
  color: ${({ $active }) => ($active ? "#a66b58" : "#77716a")};
  cursor: pointer;
  transition: all 0.3s ease;

  svg {
    font-size: 1.15rem;
    animation: ${({ $animate }) => ($animate ? heartPop : "none")} 0.45s ease;
  }

  &:hover {
    border-color: #b99a72;
    background: #f8f4ee;
    color: #a66b58;
    transform: scale(1.06);
  }

  &:focus-visible {
    outline: 2px solid #b99a72;
    outline-offset: 3px;
  }
`;

/* =============================
   NOTIFICATION
============================= */

const AlertMessage = styled.div`
  position: absolute;
  z-index: 20;
  top: calc(100% + 12px);
  right: 0;
  width: max-content;
  max-width: 270px;
  padding: 13px 15px;
  background: #191815;
  color: #f5f1e9;
  border: 1px solid #514738;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  font-size: 0.76rem;
  line-height: 1.7;
  animation: ${fadeIn} 0.25s ease;

  &::before {
    content: "";
    position: absolute;
    top: -6px;
    right: 16px;
    width: 10px;
    height: 10px;
    background: #191815;
    border-top: 1px solid #514738;
    border-left: 1px solid #514738;
    transform: rotate(45deg);
  }

  a {
    color: #c8a77c;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

/* =============================
   COMPONENT
============================= */

export default function FavoriteButton({ active, onClick }) {
  const [alert, setAlert] = useState("");
  const [animate, setAnimate] = useState(false);

  const handleClick = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAlert("login");
      return;
    }

    if (typeof onClick !== "function") return;

    onClick();
    setAlert("");

    if (!active) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 450);
    }
  };

  return (
    <Wrapper>
      <Button
        type="button"
        $active={active}
        $animate={animate}
        onClick={handleClick}
        aria-label={active ? "Retirer des favoris" : "Ajouter aux favoris"}
        aria-pressed={Boolean(active)}
      >
        {active ? <FaHeart /> : <FiHeart />}
      </Button>

      {alert === "login" && (
        <AlertMessage>
          Connectez-vous pour ajouter cet article à vos favoris.
          <br />
          <Link to="/login">Se connecter</Link>
          {" ou "}
          <Link to="/signup">Créer un compte</Link>.
        </AlertMessage>
      )}
    </Wrapper>
  );
}
