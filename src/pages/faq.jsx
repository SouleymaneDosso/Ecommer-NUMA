// src/pages/FAQ.jsx
import React, { useState, useContext } from "react";
import styled from "styled-components";
import { ThemeContext } from "../Utils/Context";
import { useTranslation } from "react-i18next";

/* ===== STYLED COMPONENTS ===== */
const PageWrapper = styled.div`
  font-family: Arial, sans-serif;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  background: ${({ $isdark }) => ($isdark ? "#111" : "#fff")};
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#000")};
`;

const QuestionWrapper = styled.div`
  margin-bottom: 1rem;
  border-bottom: 1px solid
    ${({ $isdark }) => ($isdark ? "rgba(255,255,255,0.1)" : "#ddd")};
  padding-bottom: 0.5rem;
`;

const QuestionButton = styled.button`
  width: 100%;
  text-align: left;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: bold;
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  color: ${({ $isdark }) => ($isdark ? "#fff" : "#000")};
`;

const Answer = styled.p`
  padding: 0 1rem 1rem 1rem;
  color: ${({ $isdark }) => ($isdark ? "#ccc" : "#555")};
`;

/* ===== COMPONENT ===== */
const FAQ = () => {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const $isdark = theme === "light";
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleIndex = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: t("faq.q1"),
      answer: t("faq.a1"),
    },
    {
      question: t("faq.q2"),
      answer: t("faq.a2"),
    },
    {
      question: t("faq.q3"),
      answer: t("faq.a3"),
    },
    {
      question: t("faq.q4"),
      answer: t("faq.a4"),
    },
    {
      question: t("faq.q5"),
      answer: t("faq.a5"),
    },
  ];

  return (
    <PageWrapper $isdark={$isdark}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
        {t("faq.title")}
      </h1>

      {faqData.map((item, index) => (
        <QuestionWrapper key={index} $isdark={$isdark}>
          <QuestionButton
            onClick={() => toggleIndex(index)}
            $isdark={$isdark}
          >
            {item.question}
          </QuestionButton>
          {activeIndex === index && (
            <Answer $isdark={$isdark}>{item.answer}</Answer>
          )}
        </QuestionWrapper>
      ))}
    </PageWrapper>
  );
};

export default FAQ;
