import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";

import {
  FaArrowRight,
  FaBoxOpen,
  FaCheck,
  FaCheckCircle,
  FaClock,
  FaCreditCard,
  FaExclamationCircle,
  FaLocationArrow,
  FaLock,
  FaMobileAlt,
  FaReceipt,
  FaShieldAlt,
  FaShoppingBag,
  FaTruck,
  FaWallet,
  FaWaveSquare,
} from "react-icons/fa";

// ⚠️ GARDE TON IMPORT ACTUEL DE ThemeContext SI LE CHEMIN EST DIFFÉRENT
import { ThemeContext } from "../context/ThemeContext";

/* =========================================================
   ANIMATIONS
========================================================= */

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(15px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
`;

/* =========================================================
   PAGE
========================================================= */

const Page = styled.div`
  min-height: 100vh;
  padding: 35px 20px 80px;

  background: ${({ $isdark }) => ($isdark ? "#090909" : "#f5f4f1")};

  color: ${({ $isdark }) => ($isdark ? "#ffffff" : "#111111")};
`;

const Container = styled.div`
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
`;

/* =========================================================
   HERO
========================================================= */

const Hero = styled.section`
  position: relative;
  overflow: hidden;

  padding: 42px;

  margin-bottom: 22px;

  border-radius: 30px;

  background: ${({ $isdark }) =>
    $isdark
      ? "linear-gradient(135deg, #1c1c1c, #101010)"
      : "linear-gradient(135deg, #ffffff, #efeee9)"};

  border: 1px solid
    ${({ $isdark }) =>
      $isdark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"};

  box-shadow: ${({ $isdark }) =>
    $isdark ? "0 30px 80px rgba(0,0,0,0.35)" : "0 30px 80px rgba(0,0,0,0.08)"};

  animation: ${fadeUp} 0.5s ease;

  &::after {
    content: "";

    position: absolute;

    width: 300px;
    height: 300px;

    border-radius: 50%;

    right: -150px;
    top: -160px;

    background: ${({ $isdark }) =>
      $isdark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.035)"};
  }

  @media (max-width: 700px) {
    padding: 28px 22px;
    border-radius: 24px;
  }
`;

const HeroTop = styled.div`
  position: relative;
  z-index: 2;

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 9px 13px;

  border-radius: 999px;

  font-size: 10px;
  font-weight: 800;

  letter-spacing: 0.1em;
  text-transform: uppercase;

  background: ${({ $isdark }) =>
    $isdark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)"};
`;

const HeroIcon = styled.div`
  width: 68px;
  height: 68px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 22px;

  background: ${({ $isdark }) => ($isdark ? "#ffffff" : "#111111")};

  color: ${({ $isdark }) => ($isdark ? "#111111" : "#ffffff")};

  font-size: 25px;

  animation: ${pulse} 3s ease-in-out infinite;

  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.18);

  @media (max-width: 600px) {
    width: 55px;
    height: 55px;
    border-radius: 17px;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;

  max-width: 720px;

  margin-top: 32px;
`;

const Eyebrow = styled.div`
  margin-bottom: 10px;

  font-size: 11px;
  font-weight: 800;

  letter-spacing: 0.18em;
  text-transform: uppercase;

  opacity: 0.45;
`;

const HeroTitle = styled.h1`
  margin: 0;

  font-size: clamp(38px, 6vw, 65px);

  line-height: 0.98;

  letter-spacing: -0.05em;

  font-weight: 850;
`;

const HeroText = styled.p`
  max-width: 650px;

  margin: 20px 0 0;

  font-size: 15px;

  line-height: 1.7;

  color: ${({ $isdark }) =>
    $isdark ? "rgba(255,255,255,0.58)" : "rgba(0,0,0,0.55)"};
`;

const OrderReference = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;

  margin-top: 24px;

  padding: 10px 14px;

  border-radius: 12px;

  background: ${({ $isdark }) =>
    $isdark ? "rgba(255,255,255,0.055)" : "rgba(0,0,0,0.045)"};

  font-size: 11px;
  font-weight: 700;
`;

/* =========================================================
   STATUS
========================================================= */

const StatusCard = styled.div`
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 20px;

  padding: 22px 25px;

  margin-bottom: 22px;

  border-radius: 22px;

  background: ${({ $isdark }) => ($isdark ? "#151515" : "#ffffff")};

  border: 1px solid
    ${({ $isdark }) =>
      $isdark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"};

  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.06);

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const StatusLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const StatusIcon = styled.div`
  width: 50px;
  height: 50px;

  flex: 0 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 16px;

  background: ${({ $type }) =>
    $type === "success" ? "rgba(34,197,94,0.12)" : "rgba(245,158,11,0.12)"};

  color: ${({ $type }) => ($type === "success" ? "#22c55e" : "#f59e0b")};

  font-size: 19px;
`;

const StatusTitle = styled.div`
  font-weight: 800;
  font-size: 15px;
`;

const StatusText = styled.div`
  margin-top: 5px;

  font-size: 12px;

  line-height: 1.5;

  color: ${({ $isdark }) =>
    $isdark ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.48)"};
`;

const StatusBadge = styled.div`
  padding: 9px 12px;

  border-radius: 999px;

  font-size: 9px;

  font-weight: 900;

  letter-spacing: 0.08em;

  color: ${({ $type }) => ($type === "success" ? "#22c55e" : "#f59e0b")};

  background: ${({ $type }) =>
    $type === "success" ? "rgba(34,197,94,0.11)" : "rgba(245,158,11,0.11)"};
`;

/* =========================================================
   STATS
========================================================= */

const Stats = styled.div`
  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 14px;

  margin-bottom: 22px;

  @media (max-width: 750px) {
    grid-template-columns: 1fr;
  }
`;

const Stat = styled.div`
  padding: 23px;

  border-radius: 20px;

  background: ${({ $isdark }) => ($isdark ? "#151515" : "#ffffff")};

  border: 1px solid
    ${({ $isdark }) =>
      $isdark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"};

  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.05);
`;

const StatHeader = styled.div`
  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 17px;
`;

const StatLabel = styled.span`
  font-size: 10px;

  font-weight: 800;

  letter-spacing: 0.1em;

  text-transform: uppercase;

  opacity: 0.45;
`;

const StatIcon = styled.div`
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 11px;

  background: ${({ $isdark }) =>
    $isdark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.045)"};

  font-size: 13px;
`;

const StatValue = styled.div`
  font-size: 25px;

  font-weight: 850;

  letter-spacing: -0.04em;
`;

const StatHint = styled.div`
  margin-top: 6px;

  font-size: 11px;

  opacity: 0.4;
`;

/* =========================================================
   GRID
========================================================= */

const Grid = styled.div`
  display: grid;

  grid-template-columns: minmax(0, 1.4fr) minmax(300px, 0.75fr);

  gap: 22px;

  @media (max-width: 950px) {
    grid-template-columns: 1fr;
  }
`;

const Column = styled.div`
  display: flex;

  flex-direction: column;

  gap: 22px;
`;

const Card = styled.section`
  padding: 27px;

  border-radius: 24px;

  background: ${({ $isdark }) => ($isdark ? "#151515" : "#ffffff")};

  border: 1px solid
    ${({ $isdark }) =>
      $isdark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"};

  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.05);

  animation: ${fadeUp} 0.55s ease;

  @media (max-width: 600px) {
    padding: 21px;
    border-radius: 21px;
  }
`;

const CardHeader = styled.div`
  display: flex;

  justify-content: space-between;

  gap: 15px;

  margin-bottom: 25px;
`;

const CardTitleBox = styled.div`
  display: flex;

  align-items: center;

  gap: 13px;
`;

const CardIcon = styled.div`
  width: 44px;
  height: 44px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 14px;

  background: ${({ $isdark }) =>
    $isdark ? "rgba(255,255,255,0.065)" : "rgba(0,0,0,0.045)"};
`;

const CardTitle = styled.h2`
  margin: 0 0 4px;

  font-size: 17px;

  letter-spacing: -0.02em;
`;

const CardSubtitle = styled.div`
  font-size: 11px;

  color: ${({ $isdark }) =>
    $isdark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.42)"};
`;

const Counter = styled.div`
  padding: 7px 10px;

  border-radius: 999px;

  font-size: 10px;

  font-weight: 800;

  background: ${({ $isdark }) =>
    $isdark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.045)"};
`;

/* =========================================================
   PAYMENT STEPS
========================================================= */

const Steps = styled.div`
  position: relative;
`;

const Step = styled.div`
  position: relative;

  display: grid;

  grid-template-columns: 44px 1fr auto;

  gap: 14px;

  min-height: 88px;

  &:not(:last-child)::after {
    content: "";

    position: absolute;

    left: 21px;

    top: 44px;

    bottom: 0;

    width: 1px;

    background: ${({ $isdark }) =>
      $isdark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.09)"};
  }

  @media (max-width: 600px) {
    grid-template-columns: 40px 1fr;
  }
`;

const StepCircle = styled.div`
  position: relative;

  z-index: 2;

  width: 42px;
  height: 42px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: ${({ $status, $isdark }) => {
    if ($status === "PAID") {
      return $isdark ? "#ffffff" : "#111111";
    }

    if ($status === "PENDING") {
      return "rgba(245,158,11,0.13)";
    }

    return $isdark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.045)";
  }};

  color: ${({ $status, $isdark }) => {
    if ($status === "PAID") {
      return $isdark ? "#111111" : "#ffffff";
    }

    if ($status === "PENDING") {
      return "#f59e0b";
    }

    return $isdark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";
  }};
`;

const StepInfo = styled.div`
  padding-top: 2px;
`;

const StepTitle = styled.div`
  font-size: 14px;

  font-weight: 800;
`;

const StepAmount = styled.div`
  margin-top: 5px;

  font-size: 12px;

  opacity: 0.48;
`;

const StepDescription = styled.div`
  margin-top: 7px;

  font-size: 10px;

  line-height: 1.5;

  opacity: 0.4;
`;

const StepBadge = styled.div`
  align-self: start;

  padding: 7px 9px;

  border-radius: 999px;

  font-size: 8px;

  font-weight: 900;

  letter-spacing: 0.07em;

  color: ${({ $status }) =>
    $status === "PAID"
      ? "#22c55e"
      : $status === "PENDING"
        ? "#f59e0b"
        : "#888888"};

  background: ${({ $status }) =>
    $status === "PAID"
      ? "rgba(34,197,94,0.11)"
      : $status === "PENDING"
        ? "rgba(245,158,11,0.11)"
        : "rgba(128,128,128,0.1)"};

  @media (max-width: 600px) {
    display: none;
  }
`;

/* =========================================================
   PROGRESS
========================================================= */

const ProgressBox = styled.div`
  margin-top: 20px;

  padding-top: 20px;

  border-top: 1px solid
    ${({ $isdark }) =>
      $isdark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"};
`;

const ProgressTop = styled.div`
  display: flex;

  justify-content: space-between;

  margin-bottom: 10px;

  font-size: 11px;

  font-weight: 700;
`;

const ProgressTrack = styled.div`
  height: 7px;

  overflow: hidden;

  border-radius: 999px;

  background: ${({ $isdark }) =>
    $isdark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"};
`;

const ProgressFill = styled.div`
  width: ${({ $percent }) => `${$percent}%`};

  height: 100%;

  border-radius: inherit;

  background: ${({ $isdark }) => ($isdark ? "#ffffff" : "#111111")};

  transition: width 0.7s ease;
`;

/* =========================================================
   LAST PAYMENT
========================================================= */

const PaymentBox = styled.div`
  padding: 20px;

  border-radius: 18px;

  background: ${({ $isdark }) =>
    $isdark ? "rgba(255,255,255,0.045)" : "rgba(0,0,0,0.035)"};
`;

const PaymentTop = styled.div`
  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 15px;
`;

const ServiceName = styled.div`
  display: flex;

  align-items: center;

  gap: 10px;

  font-size: 13px;

  font-weight: 800;
`;

const ServiceIcon = styled.div`
  width: 38px;
  height: 38px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 12px;

  background: ${({ $isdark }) =>
    $isdark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"};
`;

const PaymentStatus = styled.div`
  padding: 7px 10px;

  border-radius: 999px;

  font-size: 8px;

  font-weight: 900;

  color: ${({ $status }) =>
    $status === "CONFIRMED"
      ? "#22c55e"
      : $status === "REJECTED"
        ? "#ef4444"
        : "#f59e0b"};

  background: ${({ $status }) =>
    $status === "CONFIRMED"
      ? "rgba(34,197,94,0.11)"
      : $status === "REJECTED"
        ? "rgba(239,68,68,0.11)"
        : "rgba(245,158,11,0.11)"};
`;

const PaymentDetails = styled.div`
  display: grid;

  grid-template-columns: repeat(2, 1fr);

  gap: 10px;

  margin-top: 17px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const Detail = styled.div`
  padding: 12px;

  border-radius: 12px;

  background: ${({ $isdark }) =>
    $isdark ? "rgba(0,0,0,0.13)" : "rgba(255,255,255,0.6)"};
`;

const DetailLabel = styled.div`
  margin-bottom: 5px;

  font-size: 9px;

  text-transform: uppercase;

  letter-spacing: 0.08em;

  opacity: 0.4;
`;

const DetailValue = styled.div`
  font-size: 12px;

  font-weight: 750;

  word-break: break-word;
`;

/* =========================================================
   ORDER ITEMS
========================================================= */

const Item = styled.div`
  display: flex;

  justify-content: space-between;

  gap: 15px;

  padding: 16px 0;

  border-bottom: 1px solid
    ${({ $isdark }) =>
      $isdark ? "rgba(255,255,255,0.055)" : "rgba(0,0,0,0.055)"};

  &:last-child {
    border-bottom: none;
  }
`;

const ItemName = styled.div`
  font-size: 13px;

  font-weight: 750;
`;

const ItemMeta = styled.div`
  margin-top: 5px;

  font-size: 10px;

  opacity: 0.42;
`;

const ItemPrice = styled.div`
  flex-shrink: 0;

  font-size: 12px;

  font-weight: 800;
`;

const Totals = styled.div`
  margin-top: 8px;

  padding-top: 17px;

  border-top: 1px solid
    ${({ $isdark }) =>
      $isdark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"};
`;

const TotalLine = styled.div`
  display: flex;

  justify-content: space-between;

  gap: 15px;

  margin-bottom: 9px;

  font-size: 12px;

  opacity: 0.55;
`;

const GrandTotal = styled.div`
  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 15px;

  margin-top: 16px;
`;

const GrandLabel = styled.div`
  font-size: 13px;

  font-weight: 750;
`;

const GrandValue = styled.div`
  font-size: 24px;

  font-weight: 850;

  letter-spacing: -0.04em;
`;

/* =========================================================
   DELIVERY
========================================================= */

const DeliveryBox = styled.div`
  padding: 23px;

  border-radius: 20px;

  background: ${({ $isdark }) =>
    $isdark
      ? "linear-gradient(145deg,#191919,#111111)"
      : "linear-gradient(145deg,#f7f6f2,#ffffff)"};

  border: 1px solid
    ${({ $isdark }) =>
      $isdark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"};
`;

const DeliveryHeader = styled.div`
  display: flex;

  align-items: center;

  gap: 13px;
`;

const DeliveryIcon = styled.div`
  width: 47px;
  height: 47px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 15px;

  background: ${({ $isdark }) => ($isdark ? "#ffffff" : "#111111")};

  color: ${({ $isdark }) => ($isdark ? "#111111" : "#ffffff")};
`;

const DeliveryTitle = styled.div`
  font-size: 14px;

  font-weight: 800;
`;

const DeliveryText = styled.div`
  margin-top: 4px;

  font-size: 11px;

  line-height: 1.55;

  color: ${({ $isdark }) =>
    $isdark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.48)"};
`;

const DeliveryButton = styled.button`
  width: 100%;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 9px;

  margin-top: 19px;

  padding: 14px 16px;

  border: none;

  border-radius: 13px;

  cursor: pointer;

  background: ${({ $isdark }) => ($isdark ? "#ffffff" : "#111111")};

  color: ${({ $isdark }) => ($isdark ? "#111111" : "#ffffff")};

  font-size: 12px;

  font-weight: 800;

  transition: 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: wait;
    transform: none;
  }
`;

const AccountButton = styled.button`
  width: 100%;

  display: flex;

  justify-content: center;

  align-items: center;

  gap: 9px;

  padding: 14px 16px;

  border-radius: 13px;

  border: 1px solid
    ${({ $isdark }) => ($isdark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.09)")};

  background: transparent;

  color: inherit;

  cursor: pointer;

  font-size: 12px;

  font-weight: 800;

  transition: 0.2s ease;

  &:hover {
    transform: translateY(-1px);

    background: ${({ $isdark }) =>
      $isdark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"};
  }
`;

/* =========================================================
   SECURITY
========================================================= */

const Security = styled.div`
  display: flex;

  align-items: flex-start;

  gap: 10px;

  margin-top: 18px;

  padding: 13px;

  border-radius: 13px;

  background: ${({ $isdark }) =>
    $isdark ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.035)"};

  font-size: 10px;

  line-height: 1.6;

  opacity: 0.65;
`;

/* =========================================================
   MODAL
========================================================= */

const ModalOverlay = styled.div`
  position: fixed;

  inset: 0;

  z-index: 9999;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 20px;

  background: rgba(0, 0, 0, 0.7);

  backdrop-filter: blur(12px);

  -webkit-backdrop-filter: blur(12px);
`;

const Modal = styled.div`
  width: 100%;

  max-width: 470px;

  padding: 32px;

  border-radius: 27px;

  background: ${({ $isdark }) => ($isdark ? "#181818" : "#ffffff")};

  border: 1px solid
    ${({ $isdark }) =>
      $isdark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.08)"};

  box-shadow: 0 35px 100px rgba(0, 0, 0, 0.35);

  animation: ${fadeUp} 0.3s ease;

  @media (max-width: 550px) {
    padding: 25px 21px;
  }
`;

const ModalIcon = styled.div`
  width: 60px;
  height: 60px;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-bottom: 20px;

  border-radius: 19px;

  background: rgba(245, 158, 11, 0.12);

  color: #f59e0b;

  font-size: 23px;
`;

const ModalSmall = styled.div`
  margin-bottom: 8px;

  font-size: 10px;

  font-weight: 900;

  letter-spacing: 0.13em;

  text-transform: uppercase;

  color: #f59e0b;
`;

const ModalTitle = styled.h3`
  margin: 0;

  font-size: 27px;

  line-height: 1.1;

  letter-spacing: -0.035em;
`;

const ModalText = styled.p`
  margin: 14px 0 0;

  font-size: 13px;

  line-height: 1.7;

  color: ${({ $isdark }) =>
    $isdark ? "rgba(255,255,255,0.52)" : "rgba(0,0,0,0.53)"};
`;

const ModalButtons = styled.div`
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 10px;

  margin-top: 25px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const ModalPrimary = styled.button`
  padding: 14px;

  border: none;

  border-radius: 13px;

  cursor: pointer;

  background: ${({ $isdark }) => ($isdark ? "#ffffff" : "#111111")};

  color: ${({ $isdark }) => ($isdark ? "#111111" : "#ffffff")};

  font-size: 12px;

  font-weight: 800;
`;

const ModalSecondary = styled.button`
  padding: 14px;

  border: 1px solid
    ${({ $isdark }) => ($isdark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)")};

  border-radius: 13px;

  cursor: pointer;

  background: transparent;

  color: inherit;

  font-size: 12px;

  font-weight: 800;
`;

/* =========================================================
   HELPERS
========================================================= */

const money = (value) => {
  return Number(value || 0).toLocaleString("fr-FR");
};

const getPaymentStatus = (payment) => {
  if (payment.status === "PAID") {
    return "PAID";
  }

  if (payment.status === "PENDING") {
    return "PENDING";
  }

  return "UNPAID";
};

const getStatusData = (status) => {
  if (
    status === "PAID" ||
    status === "CONFIRMED" ||
    status === "SHIPPED" ||
    status === "DELIVERED"
  ) {
    return {
      type: "success",
      icon: <FaCheckCircle />,
    };
  }

  return {
    type: "warning",
    icon: <FaClock />,
  };
};

/* =========================================================
   COMPONENT
========================================================= */

export default function Merci() {
  const navigate = useNavigate();

  const { id } = useParams();

  const { theme } = useContext(ThemeContext);

  const $isdark = theme !== "light";

  const API_URL = import.meta.env.VITE_API_URL;

  const [token, setToken] = useState(null);

  const [commande, setCommande] = useState(null);

  const [loading, setLoading] = useState(true);

  const [rechercheLivreur, setRechercheLivreur] = useState(false);

  const [showValidationModal, setShowValidationModal] = useState(false);

  /* =======================================================
     AUTH
  ======================================================= */

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (!savedToken) {
      navigate("/login");
      return;
    }

    setToken(savedToken);
  }, [navigate]);

  /* =======================================================
     GET COMMANDE
  ======================================================= */

  useEffect(() => {
    if (!token || !id) {
      return;
    }

    const fetchCommande = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/api/commandes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Impossible de récupérer la commande.",
          );
        }

        setCommande(data.commande || data);
      } catch (error) {
        console.error(error);

        alert(error.message || "Impossible de récupérer la commande.");

        navigate("/compte");
      } finally {
        setLoading(false);
      }
    };

    fetchCommande();
  }, [API_URL, id, navigate, token]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <Page $isdark={$isdark}>
        <Container>
          <div
            style={{
              minHeight: "70vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                textAlign: "center",
                padding: "40px",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  border: "3px solid rgba(128,128,128,.2)",
                  borderTopColor: "currentColor",
                  animation: `${spin} .8s linear infinite`,
                  margin: "0 auto 18px",
                }}
              />

              <strong>Ouverture de votre coffre...</strong>

              <div
                style={{
                  marginTop: "8px",
                  fontSize: "12px",
                  opacity: 0.5,
                }}
              >
                Récupération de votre commande
              </div>
            </div>
          </div>
        </Container>
      </Page>
    );
  }

  if (!commande) {
    return null;
  }

  /* =======================================================
     DATA
  ======================================================= */

  const paiements = commande.paiements || [];

  const panier = commande.panier || [];

  const paiementsRecus = commande.paiementsRecus || [];

  const totalSteps = paiements.length;

  const paidSteps = paiements.filter((p) => p.status === "PAID").length;

  const totalCommande = Number(commande.total || 0);

  const totalPaid = paiements
    .filter((p) => p.status === "PAID")
    .reduce((total, p) => total + Number(p.amountExpected || 0), 0);

  const remaining = Math.max(0, totalCommande - totalPaid);

  const progress =
    totalSteps > 0
      ? Math.round((paidSteps / totalSteps) * 100)
      : commande.statusCommande === "PAID"
        ? 100
        : 0;

  const lastPayment =
    paiementsRecus.length > 0
      ? paiementsRecus[paiementsRecus.length - 1]
      : null;

  const driverAllowed = ["PAID", "CONFIRMED", "SHIPPED"].includes(
    commande.statusCommande,
  );

  const statusData = getStatusData(commande.statusCommande);

  /* =======================================================
     SEARCH DRIVER
  ======================================================= */

  const chercherLivreur = async () => {
    /*
      Si l'admin n'a pas encore confirmé,
      on affiche simplement le modal.
    */

    if (!driverAllowed) {
      setShowValidationModal(true);
      return;
    }

    if (!token || !id) {
      navigate("/login");
      return;
    }

    setRechercheLivreur(true);

    try {
      const response = await fetch(
        `${API_URL}/api/livreurs/commande/${id}/rechercher-livreur`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Impossible de rechercher un livreur.");

        return;
      }

      setCommande(data.commande || commande);

      navigate(`/suivi-commande/${id}`);
    } catch (error) {
      console.error("RECHERCHE LIVREUR:", error);

      alert("Impossible de contacter le serveur.");
    } finally {
      setRechercheLivreur(false);
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <Page $isdark={$isdark}>
      <Container>
        {/* ================= HERO ================= */}

        <Hero $isdark={$isdark}>
          <HeroTop>
            <HeroBadge $isdark={$isdark}>
              <FaShieldAlt />
              Coffre de commande
            </HeroBadge>

            <HeroIcon $isdark={$isdark}>
              <FaCheck />
            </HeroIcon>
          </HeroTop>

          <HeroContent>
            <Eyebrow>Commande enregistrée</Eyebrow>

            <HeroTitle>Merci pour votre confiance.</HeroTitle>

            <HeroText $isdark={$isdark}>
              Votre commande est bien enregistrée. Retrouvez ici toutes les
              informations importantes concernant votre paiement, votre commande
              et sa prochaine étape.
            </HeroText>

            <OrderReference $isdark={$isdark}>
              <FaReceipt />
              COMMANDE #{String(id).slice(-8).toUpperCase()}
            </OrderReference>
          </HeroContent>
        </Hero>

        {/* ================= STATUS ================= */}

        <StatusCard $isdark={$isdark}>
          <StatusLeft>
            <StatusIcon $type={statusData.type}>{statusData.icon}</StatusIcon>

            <div>
              <StatusTitle>
                {commande.statusCommande === "PAID"
                  ? "Paiement confirmé"
                  : commande.statusCommande === "PARTIALLY_PAID"
                    ? "Commande partiellement payée"
                    : commande.statusCommande === "CONFIRMED"
                      ? "Commande confirmée"
                      : "Commande en cours de validation"}
              </StatusTitle>

              <StatusText $isdark={$isdark}>
                {commande.statusCommande === "PAID"
                  ? "Votre paiement a été confirmé par notre équipe."
                  : commande.statusCommande === "PARTIALLY_PAID"
                    ? "Certaines étapes sont confirmées et d'autres restent à effectuer."
                    : "Votre commande est enregistrée. La validation de votre paiement est en cours."}
              </StatusText>
            </div>
          </StatusLeft>

          <StatusBadge $type={statusData.type}>
            {commande.statusCommande === "PAID"
              ? "PAYÉ"
              : commande.statusCommande === "PARTIALLY_PAID"
                ? "PARTIEL"
                : commande.statusCommande === "CONFIRMED"
                  ? "CONFIRMÉ"
                  : "EN VALIDATION"}
          </StatusBadge>
        </StatusCard>

        {/* ================= STATS ================= */}

        <Stats>
          <Stat $isdark={$isdark}>
            <StatHeader>
              <StatLabel>Total commande</StatLabel>

              <StatIcon $isdark={$isdark}>
                <FaShoppingBag />
              </StatIcon>
            </StatHeader>

            <StatValue>{money(totalCommande)} FCFA</StatValue>

            <StatHint>Montant total</StatHint>
          </Stat>

          <Stat $isdark={$isdark}>
            <StatHeader>
              <StatLabel>Déjà payé</StatLabel>

              <StatIcon $isdark={$isdark}>
                <FaCheckCircle />
              </StatIcon>
            </StatHeader>

            <StatValue>{money(totalPaid)} FCFA</StatValue>

            <StatHint>Paiements confirmés</StatHint>
          </Stat>

          <Stat $isdark={$isdark}>
            <StatHeader>
              <StatLabel>Solde restant</StatLabel>

              <StatIcon $isdark={$isdark}>
                <FaWallet />
              </StatIcon>
            </StatHeader>

            <StatValue>{money(remaining)} FCFA</StatValue>

            <StatHint>À régler</StatHint>
          </Stat>
        </Stats>

        {/* ================= MAIN GRID ================= */}

        <Grid>
          {/* ================= LEFT ================= */}

          <Column>
            {/* PAYMENT STEPS */}

            <Card $isdark={$isdark}>
              <CardHeader>
                <CardTitleBox>
                  <CardIcon $isdark={$isdark}>
                    <FaCreditCard />
                  </CardIcon>

                  <div>
                    <CardTitle>Parcours de paiement</CardTitle>

                    <CardSubtitle $isdark={$isdark}>
                      Suivez chaque étape de votre paiement
                    </CardSubtitle>
                  </div>
                </CardTitleBox>

                <Counter $isdark={$isdark}>
                  {paidSteps}/{totalSteps || 1}
                </Counter>
              </CardHeader>

              {totalSteps > 0 ? (
                <>
                  <Steps>
                    {paiements.map((payment, index) => {
                      const status = getPaymentStatus(payment);

                      return (
                        <Step
                          key={payment._id || `step-${index}`}
                          $isdark={$isdark}
                        >
                          <StepCircle $status={status} $isdark={$isdark}>
                            {status === "PAID" ? (
                              <FaCheck />
                            ) : status === "PENDING" ? (
                              <FaClock />
                            ) : (
                              payment.step
                            )}
                          </StepCircle>

                          <StepInfo>
                            <StepTitle>Étape {payment.step}</StepTitle>

                            <StepAmount>
                              {money(payment.amountExpected)} FCFA
                            </StepAmount>

                            <StepDescription>
                              {status === "PAID"
                                ? "Paiement confirmé par notre équipe."
                                : status === "PENDING"
                                  ? "Paiement envoyé — vérification en cours."
                                  : "Cette étape est encore en attente."}
                            </StepDescription>
                          </StepInfo>

                          <StepBadge $status={status}>
                            {status === "PAID"
                              ? "PAYÉ"
                              : status === "PENDING"
                                ? "EN VÉRIFICATION"
                                : "EN ATTENTE"}
                          </StepBadge>
                        </Step>
                      );
                    })}
                  </Steps>

                  <ProgressBox $isdark={$isdark}>
                    <ProgressTop>
                      <span>Progression</span>

                      <strong>{progress}%</strong>
                    </ProgressTop>

                    <ProgressTrack $isdark={$isdark}>
                      <ProgressFill $percent={progress} $isdark={$isdark} />
                    </ProgressTrack>
                  </ProgressBox>
                </>
              ) : (
                <Security $isdark={$isdark}>
                  <FaMoneyBillWave />

                  <span>
                    Cette commande est traitée selon son mode de paiement et ne
                    possède pas d'étapes de paiement en ligne.
                  </span>
                </Security>
              )}
            </Card>

            {/* LAST PAYMENT */}

            {lastPayment && (
              <Card $isdark={$isdark}>
                <CardHeader>
                  <CardTitleBox>
                    <CardIcon $isdark={$isdark}>
                      <FaReceipt />
                    </CardIcon>

                    <div>
                      <CardTitle>Dernier paiement</CardTitle>

                      <CardSubtitle $isdark={$isdark}>
                        Votre dernière opération enregistrée
                      </CardSubtitle>
                    </div>
                  </CardTitleBox>
                </CardHeader>

                <PaymentBox $isdark={$isdark}>
                  <PaymentTop>
                    <ServiceName>
                      <ServiceIcon $isdark={$isdark}>
                        {lastPayment.service === "wave" ? (
                          <FaWaveSquare />
                        ) : (
                          <FaMobileAlt />
                        )}
                      </ServiceIcon>

                      {lastPayment.service === "wave" ? "Wave" : "Orange Money"}
                    </ServiceName>

                    <PaymentStatus $status={lastPayment.status}>
                      {lastPayment.status === "CONFIRMED"
                        ? "CONFIRMÉ"
                        : lastPayment.status === "REJECTED"
                          ? "REJETÉ"
                          : "EN VÉRIFICATION"}
                    </PaymentStatus>
                  </PaymentTop>

                  <PaymentDetails>
                    <Detail $isdark={$isdark}>
                      <DetailLabel>Montant envoyé</DetailLabel>

                      <DetailValue>
                        {money(lastPayment.montantEnvoye)} FCFA
                      </DetailValue>
                    </Detail>

                    <Detail $isdark={$isdark}>
                      <DetailLabel>Numéro</DetailLabel>

                      <DetailValue>
                        {lastPayment.numeroClient || "—"}
                      </DetailValue>
                    </Detail>

                    <Detail $isdark={$isdark}>
                      <DetailLabel>Référence</DetailLabel>

                      <DetailValue>{lastPayment.reference || "—"}</DetailValue>
                    </Detail>

                    <Detail $isdark={$isdark}>
                      <DetailLabel>Étape</DetailLabel>

                      <DetailValue>Étape {lastPayment.step}</DetailValue>
                    </Detail>
                  </PaymentDetails>

                  {lastPayment.status === "REJECTED" &&
                    lastPayment.adminComment && (
                      <Security $isdark={$isdark}>
                        <FaExclamationCircle />

                        <span>
                          <strong>Motif du rejet :</strong>{" "}
                          {lastPayment.adminComment}
                        </span>
                      </Security>
                    )}
                </PaymentBox>
              </Card>
            )}

            {/* ORDER */}

            <Card $isdark={$isdark}>
              <CardHeader>
                <CardTitleBox>
                  <CardIcon $isdark={$isdark}>
                    <FaBoxOpen />
                  </CardIcon>

                  <div>
                    <CardTitle>Votre commande</CardTitle>

                    <CardSubtitle $isdark={$isdark}>
                      Articles commandés
                    </CardSubtitle>
                  </div>
                </CardTitleBox>
              </CardHeader>

              {panier.map((item, index) => (
                <Item
                  key={item.produitId || item._id || index}
                  $isdark={$isdark}
                >
                  <div>
                    <ItemName>{item.nom}</ItemName>

                    <ItemMeta>
                      Quantité : {item.quantite}
                      {item.couleur ? ` • ${item.couleur}` : ""}
                      {item.taille ? ` • ${item.taille}` : ""}
                    </ItemMeta>
                  </div>

                  <ItemPrice>
                    {money(Number(item.prix || 0) * Number(item.quantite || 0))}{" "}
                    FCFA
                  </ItemPrice>
                </Item>
              ))}

              <Totals $isdark={$isdark}>
                <TotalLine>
                  <span>Sous-total</span>

                  <strong>
                    {money(commande.totalProduits || commande.total)} FCFA
                  </strong>
                </TotalLine>

                <TotalLine>
                  <span>Livraison</span>

                  <strong>
                    {Number(commande.fraisLivraison || 0) === 0
                      ? "Gratuite"
                      : `${money(commande.fraisLivraison)} FCFA`}
                  </strong>
                </TotalLine>

                <GrandTotal>
                  <GrandLabel>Total</GrandLabel>

                  <GrandValue>{money(totalCommande)} FCFA</GrandValue>
                </GrandTotal>
              </Totals>
            </Card>
          </Column>

          {/* ================= RIGHT ================= */}

          <Column>
            {/* DELIVERY */}

            <DeliveryBox $isdark={$isdark}>
              <DeliveryHeader>
                <DeliveryIcon $isdark={$isdark}>
                  <FaTruck />
                </DeliveryIcon>

                <div>
                  <DeliveryTitle>Livraison</DeliveryTitle>

                  <DeliveryText $isdark={$isdark}>
                    {driverAllowed
                      ? "Votre commande peut maintenant passer à la recherche d'un livreur."
                      : "La recherche du livreur sera disponible après validation de votre commande."}
                  </DeliveryText>
                </div>
              </DeliveryHeader>

              <DeliveryButton
                $isdark={$isdark}
                onClick={chercherLivreur}
                disabled={rechercheLivreur}
              >
                {rechercheLivreur ? (
                  <>Recherche...</>
                ) : (
                  <>
                    <FaLocationArrow />
                    Chercher un livreur
                    <FaArrowRight />
                  </>
                )}
              </DeliveryButton>
            </DeliveryBox>

            {/* ACCOUNT */}

            <Card $isdark={$isdark}>
              <CardHeader>
                <CardTitleBox>
                  <CardIcon $isdark={$isdark}>
                    <FaWallet />
                  </CardIcon>

                  <div>
                    <CardTitle>Votre espace</CardTitle>

                    <CardSubtitle $isdark={$isdark}>
                      Gérez toutes vos commandes
                    </CardSubtitle>
                  </div>
                </CardTitleBox>
              </CardHeader>

              <AccountButton
                $isdark={$isdark}
                onClick={() => navigate("/compte")}
              >
                Accéder à mon espace
                <FaArrowRight />
              </AccountButton>
            </Card>

            {/* DELIVERY INFO */}

            <Card $isdark={$isdark}>
              <CardHeader>
                <CardTitleBox>
                  <CardIcon $isdark={$isdark}>
                    <FaShoppingBag />
                  </CardIcon>

                  <div>
                    <CardTitle>Livraison</CardTitle>

                    <CardSubtitle $isdark={$isdark}>
                      Informations client
                    </CardSubtitle>
                  </div>
                </CardTitleBox>
              </CardHeader>

              <Detail $isdark={$isdark}>
                <DetailLabel>Client</DetailLabel>

                <DetailValue>
                  {commande.client?.prenom} {commande.client?.nom}
                </DetailValue>
              </Detail>

              <div style={{ height: "9px" }} />

              <Detail $isdark={$isdark}>
                <DetailLabel>Adresse</DetailLabel>

                <DetailValue>{commande.client?.adresse || "—"}</DetailValue>
              </Detail>

              <div style={{ height: "9px" }} />

              <Detail $isdark={$isdark}>
                <DetailLabel>Ville</DetailLabel>

                <DetailValue>{commande.client?.ville || "—"}</DetailValue>
              </Detail>

              <div style={{ height: "9px" }} />

              <Detail $isdark={$isdark}>
                <DetailLabel>Téléphone</DetailLabel>

                <DetailValue>{commande.client?.numero || "—"}</DetailValue>
              </Detail>

              <Security $isdark={$isdark}>
                <FaLock />

                <span>
                  Vos informations sont protégées et accessibles depuis votre
                  espace personnel.
                </span>
              </Security>
            </Card>
          </Column>
        </Grid>

        {/* =================================================
            MODAL VALIDATION
        ================================================= */}

        {showValidationModal && (
          <ModalOverlay>
            <Modal $isdark={$isdark}>
              <ModalIcon>
                <FaClock />
              </ModalIcon>

              <ModalSmall>Validation en cours</ModalSmall>

              <ModalTitle>Encore un petit instant</ModalTitle>

              <ModalText $isdark={$isdark}>
                Votre commande est bien enregistrée, mais notre équipe doit
                encore confirmer votre paiement avant de pouvoir lancer la
                recherche d'un livreur.
              </ModalText>

              <ModalText $isdark={$isdark}>
                Vous pouvez retrouver l'évolution de votre commande à tout
                moment depuis votre espace personnel.
              </ModalText>

              <ModalButtons>
                <ModalPrimary
                  $isdark={$isdark}
                  onClick={() => {
                    setShowValidationModal(false);

                    navigate("/compte");
                  }}
                >
                  Aller à mon espace
                  <FaArrowRight
                    style={{
                      marginLeft: 6,
                    }}
                  />
                </ModalPrimary>

                <ModalSecondary
                  $isdark={$isdark}
                  onClick={() => setShowValidationModal(false)}
                >
                  Rester sur la page
                </ModalSecondary>
              </ModalButtons>
            </Modal>
          </ModalOverlay>
        )}
      </Container>
    </Page>
  );
}
