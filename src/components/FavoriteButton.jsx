import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { FiBookmark } from "react-icons/fi";
import { HiBookmark } from "react-icons/hi2";
import { Link } from "react-router-dom";

const pop = keyframes`
  0% { transform: scale(1); }
  45% { transform: scale(1.22); }
  75% { transform: scale(0.92); }
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

const ButtonWrapper = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 20;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const FavoriteBtn = styled.button`
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ $active }) => ($active ? "#171717" : "#dedbd5")};
  border-radius: 50%;
  background: ${({ $active }) => ($active ? "#171717" : "#fff")};
  color: ${({ $active }) => ($active ? "#f5f0e8" : "#292929")};
  cursor: pointer;
  transition:
    background 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease,
    transform 0.25s ease,
    box-shadow 0.3s ease;

  svg {
    width: 19px;
    height: 19px;
    animation: ${({ $animate }) => ($animate ? pop : "none")} 0.4s ease;
  }

  &:hover {
    border-color: #171717;
    transform: translateY(-2px);
    box-shadow: 0 5px 14px rgba(0, 0, 0, 0.09);
  }

  &:active {
    transform: scale(0.94);
  }

  &:focus-visible {
    outline: 2px solid #a47c50;
    outline-offset: 3px;
  }

  @media (max-width: 480px) {
    width: 42px;
    height: 42px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: calc(100% + 11px);
  left: 50%;
  transform: translateX(-50%);
  background: #171717;
  color: #fff;
  padding: 8px 11px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.6px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: all 0.25s ease;

  ${ButtonWrapper}:hover & {
    opacity: 1;
    visibility: visible;
  }

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: #171717;
  }
`;

const Toast = styled.div`
  position: fixed;
  top: 25px;
  right: 25px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  background: #171717;
  color: #f5f0e8;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.18);
  animation: ${fadeIn} 0.3s ease;
  font-size: 12px;
  letter-spacing: 0.3px;

  svg {
    color: #c49a6c;
    font-size: 17px;
  }

  a {
    color: #c49a6c;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  @media (max-width: 480px) {
    top: 15px;
    right: 12px;
    left: 12px;
    justify-content: center;
    padding: 13px;
    font-size: 11px;
  }
`;

const FavoriteButtons = ({ active, onClick }) => {
  const [showToast, setShowToast] = useState(false);
  const [animate, setAnimate] = useState(false);

  const token = localStorage.getItem("token");

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 3500);

      return;
    }

    setAnimate(true);
    onClick?.(e);

    setTimeout(() => {
      setAnimate(false);
    }, 450);
  };

  return (
    <>
      <ButtonWrapper>
        <FavoriteBtn
          type="button"
          $active={active}
          $animate={animate}
          onClick={handleClick}
          aria-label={active ? "Retirer des favoris" : "Ajouter aux favoris"}
          aria-pressed={!!active}
          title={active ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          {active ? <HiBookmark /> : <FiBookmark />}
        </FavoriteBtn>

        <Tooltip>{active ? "ENREGISTRÉ" : "AJOUTER AUX FAVORIS"}</Tooltip>
      </ButtonWrapper>

      {showToast && (
        <Toast role="status">
          <FiBookmark />
          <span>
            Connectez-vous pour enregistrer vos favoris.{" "}
            <Link to="/login">Se connecter</Link>
          </span>
        </Toast>
      )}
    </>
  );
};

export default FavoriteButtons;
